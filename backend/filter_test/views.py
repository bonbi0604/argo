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