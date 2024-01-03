"""
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# 예시 데이터셋. 추후 우리 DB 쪽에 연결해서 데이터 받아 오기.
data = {
    'user_id': ['User1', 'User2', 'User1', 'User3'],
    'problem_id': ['Prob1', 'Prob1', 'Prob2', 'Prob2'],
    'solved': [1, 0, 0, 1],
    'attempts': [3, 1, 2, 1]
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

# 사용자별 문제 해결 확률 예측
X = df.drop('solved', axis=1)
y = df['solved']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
model = RandomForestClassifier()
model.fit(X_train, y_train)
predictions = model.predict_proba(X_test)

# 추천 시스템 구현
# 이 부분은 사용자별로 문제를 추천하는 로직을 추가합니다.


surprise 사용 구현.

"""
import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import PCA
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from surprise import Dataset, Reader
from surprise import KNNWithMeans
from surprise.model_selection import train_test_split
from surprise import accuracy

# 예시 데이터셋
data = {
    'user_id': ['User1', 'User2', 'User1', 'User3'],
    'problem_id': ['Prob1', 'Prob1', 'Prob2', 'Prob2'],
    'solved': [1, 0, 0, 1]
}
df = pd.DataFrame(data)

# surprise 라이브러리에 맞게 데이터 형식을 변환
reader = Reader(rating_scale=(0, 1))
data = Dataset.load_from_df(df[['user_id', 'problem_id', 'solved']], reader)

# 데이터를 학습 세트와 테스트 세트로 분할
trainset, testset = train_test_split(data, test_size=0.25)

# KNN 알고리즘을 사용하여 아이템 기반 협업 필터링 모델 생성
algo = KNNWithMeans(sim_options={'name': 'cosine', 'user_based': False})
algo.fit(trainset)

# 테스트 세트에 대해 예측 수행
predictions = algo.test(testset)

# 예측 결과 평가
accuracy.rmse(predictions)
