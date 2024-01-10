from django.shortcuts import render
from learn.models import Question, Result
from django.http import JsonResponse
from sklearn.decomposition import TruncatedSVD
import json
import numpy as np
from .utils import (create_interaction_matrix, calculate_similarity, create_problem_embeddings,
                    predict_problem_solving, train_knn, get_knn_recommendations)
#데이터 쿼리 및 전처리
def get_user_interaction_data(user_no):
    # 특정 사용자의 문제 풀이 데이터 쿼리
    results = Result.objects.filter(user_no=user_no).values('user_no', 'question_no', 'is_correct')
    return create_interaction_matrix(results)

#유사도 행렬 계산
def get_similarity_matrix(interaction_matrix):
    return calculate_similarity(interaction_matrix)

#Truncated SVD를 사용하여 Embedding 구현
def create_embeddings(interaction_matrix, n_components=20):
    svd = TruncatedSVD(n_components=n_components)
    problem_embeddings = svd.fit_transform(interaction_matrix)
    return problem_embeddings

# 사용자별 문제 추천을 반환하는 뷰
def recommend_problems_view(request):
    try:
        data = json.loads(request.body)  # JSON 데이터를 파싱합니다.
        user_no = data['user_no']
        # 사용자-문제 상호작용 행렬 생성
        interaction_matrix = get_user_interaction_data(user_no)
        
        # 문제 임베딩 생성
        problem_embeddings = create_problem_embeddings(interaction_matrix)
        
        # 문제 해결 확률 예측
        solving_probabilities = predict_problem_solving(user_no, problem_embeddings, interaction_matrix)
        
        # KNN 모델 훈련
        knn_algo = train_knn(interaction_matrix.reset_index().melt(id_vars='user_no', var_name='problem_id', value_name='solved'))
        
        # KNN 모델을 사용하여 추천 생성
        knn_recommendations = get_knn_recommendations(knn_algo, user_no, interaction_matrix)
        
        # 결과 반환
        return JsonResponse({
            'solving_probabilities': solving_probabilities.tolist(),
            'knn_recommendations': knn_recommendations
        })
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except KeyError:
        return JsonResponse({'error': 'user_no is required'}, status=400)