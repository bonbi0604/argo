"""
_summary_
협업 필터 구현

    1. 아이템 협업 필터 구현
    - 문제간 유사도 계산
    - 문제 embedding 생성
    - 해당 아이템에 대한 사용자별 문제 해결 확률 예측

    2. 사용자 협업 필터 구현
    - 문제의 정/오답률을 기반으로 각 사용자가
    어떤 문제 유형을 맞출 확률이 높은지 예측
"""
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from surprise import Dataset, Reader
from surprise import KNNWithMeans
from surprise import accuracy
from surprise.model_selection import train_test_split as surprise_train_test_split

# 예시 데이터셋
data = {
    'user_id': ['User1', 'User2', 'User1', 'User3', 'User1'],
    'problem_id': ['Prob1', 'Prob1', 'Prob2', 'Prob2', 'Prob3'],
    'problem_type': ['occupation', 'occupation', 'commonsense', 'commonsense', 'ethic'],
    'solved': [1, 0, 0, 1, 1]
}
df = pd.DataFrame(data)

# 문제 간 유사도 계산
problem_features = df.pivot_table(index='problem_id', columns='user_id', values='solved').fillna(0)
similarity_matrix = cosine_similarity(problem_features)
similarity_df = pd.DataFrame(similarity_matrix, index=problem_features.index, columns=problem_features.index)

# 문제 Embedding 생성
pca = PCA(n_components=2)
problem_embedding = pca.fit_transform(problem_features.T)
embedding_df = pd.DataFrame(problem_embedding, index=problem_features.columns)

# 사용자별 문제 해결 확률 예측을 위한 데이터 준비
X = pd.get_dummies(df.drop('solved', axis=1), columns=['user_id', 'problem_id', 'problem_type'])
y = df['solved']

# 데이터 분할 및 RandomForest 모델 트레이닝
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)
model = RandomForestClassifier(n_estimators=100, random_state=42)  # 하이퍼파라미터 조정 가능
model.fit(X_train, y_train)
predictions = model.predict_proba(X_test)

# Surprise 라이브러리를 사용한 아이템 기반 협업 필터링
reader = Reader(rating_scale=(0, 1))
data2 = Dataset.load_from_df(df[['user_id', 'problem_id', 'solved']], reader)
trainset, testset = surprise_train_test_split(data2, test_size=0.25, random_state=42)

algo = KNNWithMeans(sim_options={'name': 'cosine', 'user_based': False, 'min_support': 1})
algo.fit(trainset)

# 테스트 세트에 대한 예측 및 평가
predictions2 = algo.test(testset)
accuracy.rmse(predictions2)
