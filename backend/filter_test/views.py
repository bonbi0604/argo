# from django.shortcuts import render
# from learn.models import Result, Question
# from django.http import JsonResponse
# from .utils import (
#     create_interaction_matrix, create_problem_embeddings,
#     generate_recommendations
# )
# from django.views.decorators.http import require_http_methods
# from django.views.decorators.csrf import csrf_exempt
# import json
# import pandas as pd

# @csrf_exempt
# @require_http_methods(["POST"])
# def recommend_problems_view(request):
#     try:
#         data = json.loads(request.body)
#         user_no = data['user_no']
        
#         # 모든 사용자의 상호작용 데이터와 문제 데이터를 불러옵니다.
#         results_data = Result.objects.all().values()
#         questions_data = Question.objects.filter(category_no__in=[1, 2, 3]).values()
    
#         # 상호작용 데이터프레임과 문제 데이터프레임을 생성합니다.
#         interaction_matrix, filtered_questions = create_interaction_matrix(
#             pd.DataFrame(list(results_data)),
#             pd.DataFrame(list(questions_data)),
#             category_ids=[1, 2, 3]
#         )
#         # 문제 임베딩과 추천을 생성합니다.
#         problem_embeddings = create_problem_embeddings(interaction_matrix)
        
#         recommendations = generate_recommendations(user_no, interaction_matrix, problem_embeddings)
        
#         return JsonResponse({'recommended_problems': recommendations})
#     except json.JSONDecodeError:
#         return JsonResponse({'error': 'Invalid JSON'}, status=400)
#     except KeyError:
#         return JsonResponse({'error': 'user_no is required'}, status=400)


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

# @csrf_exempt
# @require_http_methods(["POST"])
# def recommend_problems_view(request):
#     try:
#         data = json.loads(request.body)
#         user_no = data['user_no']

#         # 데이터 불러오기 및 상호작용 매트릭스 생성
#         results_data = Result.objects.all().values()
#         questions_data = Question.objects.filter(category_no__in=[1, 2, 3]).values()
#         interaction_matrix, _ = create_interaction_matrix(
#             pd.DataFrame(list(results_data)),
#             pd.DataFrame(list(questions_data)),
#             category_ids=[1, 2, 3]
#         )

#         # 코사인 유사도 계산 및 유사 문제 그룹화
#         similarity_matrix = calculate_similarity(interaction_matrix)
#         similar_problems = group_similar_problems(similarity_matrix)

#         # 문제 임베딩 생성
#         problem_embeddings = create_problem_embeddings(interaction_matrix)

#         # 오답률이 높을 것으로 예상되는 문제 추천
#         recommendations = recommend_difficult_problems(user_no, interaction_matrix, similar_problems, problem_embeddings)

#         return JsonResponse({'recommended_problems': recommendations})
#     except json.JSONDecodeError:
#         return JsonResponse({'error': 'Invalid JSON'}, status=400)
#     except KeyError:
#         return JsonResponse({'error': 'user_no is required'}, status=400)
    
    
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