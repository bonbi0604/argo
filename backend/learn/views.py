from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Answer, Category, Result
from django.db.models import Max
import random, json
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_protect
from django.core.serializers import serialize
 
# 틀린문제 뽑기.
def get_question_list(filter_no, count):
    value = Result.objects.filter(is_correct=0)
    content_list = random.sample(list(value.filter(question_no__category_no=filter_no)), min(count, len(value.filter(question_no__category_no=filter_no))))
    content_list = [content.question_no.content for content in content_list]
    return content_list

@csrf_protect
def question_list(request):
    data = json.loads(request.body)
    cat = data.get('cat')
    if cat == 'occupation':
        filter_no = 4
        question = get_question_list(filter_no, 20)
    elif cat=='commonsense':
        english = get_question_list(1, 7)
        korean  = get_question_list(2, 6)
        sisa = get_question_list(3,6)
        question = english + korean + sisa 
    elif cat =='tools':
        filter_no =5
        question = get_question_list(filter_no, 20)
    elif cat =='ethic':
        pass
    return JsonResponse({'wrong_question' : question })
    
          
@csrf_protect
def search_list(request):
    data = json.loads(request.body)
    keyword = data.get('search')
    if keyword:
        value = Result.objects.filter(is_correct=0)
        content_list = value.filter(question_no__content__icontains=keyword).values('question_no__content')
        content_list = [{'content': item['question_no__content']} for item in content_list]
    else:
        pass
    return Response(content_list)    
    
