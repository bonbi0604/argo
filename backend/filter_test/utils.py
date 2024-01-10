#데이터 전처리 및 행렬 생성
import pandas as pd

def create_interaction_matrix(results):
    interaction_matrix = pd.pivot_table(
        data=results,
        index='user_no',  # 사용자 ID
        columns='question_no',  # 문제 ID
        values='is_correct'  # 정답 여부 (1: 정답, 0: 오답)
    ).fillna(0)
    return interaction_matrix

#유사도 행렬 계산
from sklearn.metrics.pairwise import cosine_similarity
from scipy.sparse import csr_matrix

def calculate_similarity(interaction_matrix):
    # Sparse matrix로 변환
    sparse_matrix = csr_matrix(interaction_matrix)
    # 코사인 유사도 계산
    cosine_sim_matrix = cosine_similarity(sparse_matrix)
    return cosine_sim_matrix

#TruncatedSVD를 이용한 문제 임베딩 생성
from sklearn.decomposition import TruncatedSVD

def create_problem_embeddings(interaction_matrix, n_components=12):
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    problem_embeddings = svd.fit_transform(interaction_matrix.T)  # Transpose matrix to get problem features
    return problem_embeddings

#RandomForestClassifier를 사용한 문제 해결 확률 예측
from sklearn.ensemble import RandomForestClassifier

def predict_problem_solving(user_no, problem_embeddings, interaction_matrix):
    user_interactions = interaction_matrix.loc[user_no, :]
    unsolved_problems = user_interactions[user_interactions == 0].index  # Filter unsolved problems
    
    # Prepare features for RandomForest
    features = problem_embeddings[unsolved_problems]
    
    # Train RandomForest
    rf = RandomForestClassifier(n_estimators=100, random_state=42)
    rf.fit(features, user_interactions.loc[unsolved_problems])
    
    # Predict solving probabilities
    solving_probabilities = rf.predict_proba(features)[:, 1]  # Get probability of class 1
    return solving_probabilities

# KNNWithMeans 모델을 사용한 사용자별 추천을 수행하는 함수
from surprise import KNNWithMeans, Dataset, Reader
from surprise.model_selection import cross_validate

def train_knn(data):
    reader = Reader(rating_scale=(0, 1))
    dataset = Dataset.load_from_df(data[['user_id', 'problem_id', 'solved']], reader)
    trainset = dataset.build_full_trainset()
    
    algo = KNNWithMeans(sim_options={'name': 'cosine', 'user_based': True})
    cross_validate(algo, dataset, measures=['RMSE'], cv=3, verbose=True)
    
    return algo

# KNN 모델을 사용하여 특정 사용자에 대한 추천을 생성하는 함수
def get_knn_recommendations(algo, user_no, interaction_matrix, k=3):
    # 사용자가 풀지 않은 문제 식별
    user_interactions = interaction_matrix.loc[user_no]
    unsolved_problems = user_interactions.index[user_interactions == 0]
    
    # 각 미해결 문제에 대해 예측 수행
    predictions = [algo.predict(user_no, pid) for pid in unsolved_problems]
    
    # 상위 k개의 추천된 문제를 가져옵니다.
    top_predictions = sorted(predictions, key=lambda x: x.est, reverse=True)[:k]
    return [pred.iid for pred in top_predictions]