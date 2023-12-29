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
def get_wrong_question_list(filter_no, count):
    value = Result.objects.filter(is_correct=0)
    content_list = random.sample(list(value.filter(question_no__category_no=filter_no)), min(count, len(value.filter(question_no__category_no=filter_no))))
    question = []
    for content in content_list:
        dic = {'question_no' : content.question_no.question_no,
                'category_no' : content.question_no.category_no_id,
                'content' : content.question_no.content}
        question.append(dic)
    return question

@csrf_exempt
def wrong_question_list(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        cat = data.get('cat')
        # user_no = data.get('user_no')
        if cat == 'occupation':
            filter_no = 4
            question = get_wrong_question_list(filter_no, 20)
        elif cat=='commonsense':
            english = get_wrong_question_list(1, 7)
            korean  = get_wrong_question_list(2, 6)
            sisa = get_wrong_question_list(3,6)
            question = english + korean + sisa 
        elif cat =='tools':
            filter_no =5
            question = get_wrong_question_list(filter_no, 20)
        elif cat =='ethic':
            pass
        return JsonResponse({'wrong_question_list' : question }, status=200)
    else:
        return JsonResponse({'error': 'Only POST requests are allowed'}, status=405)
    
          
@csrf_exempt
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

@csrf_exempt
def give_question(request):
    # 랜덤으로 한문제씩 출제
    data = json.loads(request.body)
    cat = data.get('cat')
    if cat == 'occupation':
        number = 4
    elif cat=='commonsense':
        number = random.randint(1,3)
    elif cat =='tools':
        number = 5
    elif cat =='ethic':
        pass
   
    question = Question.objects.filter(category_no = number).order_by('?').first()
    choice = Answer.objects.filter(question_no = question.question_no)
    choice_list = []
   
    answer = None
    # 주관식이면 0
    # 객관식이면 1
    is_many_choice = None
    for item in choice:
        tmp_dic = {
            'answer_content' : item.content,
            'answer_no': item.answer_no
        }
        choice_list.append(tmp_dic)
       
        if item.is_correct ==1:
            answer = item.content
    if len(choice_list) ==1:
        is_many_choice = 0
    else:
        is_many_choice = 1
   
    data = {
        'question_no': question.question_no,
        'question_content': question.content,
        'choices': choice_list,
        'correct_answer': answer,
        'is_many_choice' : is_many_choice
    }
    return JsonResponse({'wrong_question' : data })    