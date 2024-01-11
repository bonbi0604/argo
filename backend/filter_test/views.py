from django.shortcuts import render
from learn.models import Result, Question
from django.http import JsonResponse
from .utils import (
    create_interaction_matrix, calculate_similarity, create_problem_embeddings,
    generate_recommendations,group_similar_problems,recommend_difficult_problems,recommend_problems_by_category
)
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import json
import pandas as pd
import mlflow.pyfunc
from django.db.models import Avg,Q
import os
from dotenv import load_dotenv
load_dotenv()

@csrf_exempt
@require_http_methods(["POST"])
def recommend_problems_view(request):
    try:
        data = json.loads(request.body)
        user_no = data['user_no']

        # 데이터 불러오기
        results_data = pd.DataFrame(list(Result.objects.all().values()))
        questions_data = pd.DataFrame(list(Question.objects.all().values()))

        # 카테고리별 문제 추천
        category_ids = [1, 2, 3]
        category_recommendations = recommend_problems_by_category(user_no, category_ids, results_data, questions_data)

        return JsonResponse({'recommended_problems': category_recommendations})
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except KeyError:
        return JsonResponse({'error': 'user_no is required'}, status=400)



# MLflow 추적 서버 설정
mlflow.set_tracking_uri(os.getenv('MLFLOW_URL'))
# 모델 로드
model_name = "grouping_model"
model_group = mlflow.pyfunc.load_model(f"models:/{model_name}/Production")

def get_user_category_scores(user_no):
    # 카테고리 1, 2, 3에 해당하는 데이터만 집계
    category_scores = Result.objects.filter(
        user_no=user_no,
        question_no__category_no__in=[1, 2, 3]  # 1, 2, 3번 카테고리에 해당하는 결과만 필터링
    ).values(
        'question_no__category_no'  # 'question' 대신 'question_no' 사용
    ).annotate(
        average_score=Avg('is_correct')
    ).order_by(
        'question_no__category_no'
    )
    # 카테고리별 평균 점수를 리스트로 변환
    scores = {'category_no1': 0, 'category_no2': 0, 'category_no3': 0}
    for item in category_scores:
        category = item['question_no__category_no']
        scores[f'category_no{category}'] = item['average_score']
    return scores

@csrf_exempt
@require_http_methods(["POST"])
def feedback(request):
    data = json.loads(request.body)
    user_no = data['user_no']
    
    # 특정 사용자의 카테고리별 평균 점수 계산
    user_category_scores = get_user_category_scores(user_no)
    
    # 사용자와 같은 그룹의 평균
    # 모든 사용자에 대한 그룹 예측
    all_users_data = predict_groups_for_all_users()

    # 특정 사용자의 그룹 찾기
    target_user_group = all_users_data[all_users_data['user_no'] == user_no]['predicted_group'].iloc[0]

    # 동일 그룹 사용자의 평균 점수 계산
    same_group_users = all_users_data[all_users_data['predicted_group'] == target_user_group]
    average_scores = same_group_users[['category_no1', 'category_no2', 'category_no3']].mean().to_dict()

    # JSON 파일에서 그룹 설명 로드
    group_descriptions = load_group_descriptions()
    group_description = group_descriptions.get(target_user_group, "No description available.")
    
    # 사용자 카테고리별 피드백
    # JSON 파일에서 피드백 스크립트 로드
    feedback_scripts = load_feedback_scripts()

    # 사용자 피드백 생성
    feedback = {}
    for category in ['english', 'korean', 'current_affairs']:
        user_score = user_category_scores.get(f'category_no{category[-1]}', 0)
        group_avg = average_scores.get(f'category_no{category[-1]}', 0)
        score_diff = user_score - group_avg

        # 스크립트 id 결정
        if score_diff >= 5:
            script_id = 0
        elif 0 < score_diff < 5:
            script_id = 1
        elif -5 <= score_diff < 0:
            script_id = 3
        else:  # score_diff < -5
            script_id = 2
        # 해당 스크립트 id에 맞는 피드백 찾기
        for script in feedback_scripts[category]:
            if script['id'] == script_id:
                feedback[category] = script['feedback']
                break
        
    return JsonResponse({
        'user_acg': user_category_scores,
        'pred_group': int(target_user_group),
        'group_avg': average_scores,
        'script': group_description,
        'user_feedback':feedback
    })
    

def calculate_all_users_scores():
    # 모든 사용자의 카테고리별 평균 점수 계산
    users_scores = Result.objects.filter(
        question_no__category_no__in=[1, 2, 3]
    ).values(
        'user_no'
    ).annotate(
        category_no1=Avg('is_correct', filter=Q(question_no__category_no=1)),
        category_no2=Avg('is_correct', filter=Q(question_no__category_no=2)),
        category_no3=Avg('is_correct', filter=Q(question_no__category_no=3))
    )
    return users_scores

def predict_groups_for_all_users():
    users_scores = calculate_all_users_scores()
    # DataFrame으로 변환
    data = pd.DataFrame(list(users_scores))
    #결측치 0 대체 or user 삭제
    # data = data.fillna(0)
    data = data.dropna()
    # 모델에 데이터 입력 및 그룹 예측
    predictions = model_group.predict(data[['category_no1', 'category_no2', 'category_no3']])
    data['predicted_group'] = predictions
    return data

# JSON 파일 로드 함수
def load_group_descriptions():
    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, 'description.json')
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        return {item['id']: item['description'] for item in data['items']}
    
def load_feedback_scripts():
    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, 'description.json')
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)