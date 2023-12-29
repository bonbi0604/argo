from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Answer, Category, Result
from django.db.models import Max
import random, json
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from account.models import User
 
# 틀린문제 뽑기. question에 있는 모든 내용 가져오기
def get_wrong_question_list(filter_no, count, user_no=None):
    specific_user = Result.objects.filter(user_no = user_no)
    value = specific_user.filter(is_correct=0)
    value = value.order_by('-timestamp')
    content_list = list(value.filter(question_no__category_no=filter_no))[:min(count, len(value.filter(question_no__category_no=filter_no)))]
    question = []
    for content in content_list:
        dic = {
                'question_no' : content.question_no.question_no,
                'category_no' : content.question_no.category_no_id,
                'content' : content.question_no.content,
                'result_no' : content.result_no,
                'timestamp' : content.timestamp,
                }
        question.append(dic)
    return question

@csrf_exempt
def wrong_question_list(request):
    data = json.loads(request.body)
    cat = data.get('cat')
    user_no = data.get('user_no')
    if cat == 'occupation':
        question = get_wrong_question_list(4, 20, user_no)
    elif cat=='commonsense':
        english = get_wrong_question_list(1, 7, user_no)
        korean  = get_wrong_question_list(2, 6, user_no)
        sisa = get_wrong_question_list(3,6, user_no)
        
        question = english + korean + sisa 
    elif cat =='tools':
        question = get_wrong_question_list(5, 20, user_no)
    elif cat =='ethic':
        pass
    return JsonResponse({'wrong_question' : question })
    
          
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

# def result_save(request):

@csrf_exempt
def insertResult(request):
    data = json.loads(request.body)
    user = data.get('user_no')
    user = User.objects.get(user_no = user)
    answer = data.get('answer_no')
    answer = Answer.objects.get(answer_no = answer)
    question = data.get('question_no')
    question = Question.objects.get(question_no = question)
    content = data.get('user_content')
    is_correct = None
    
    value = Answer.objects.get(answer_no=answer)
    # 객관식 일때
    if content == '':
        if value.is_correct == 1:
            is_correct =1
        else:
            is_correct= 0
    # 주관식 일때
    else:
        if content != value.answer_no.content:
            is_correct = 0
        else:
            is_correct = 1   
    save = {
            'user_no' : user,
            'answer_no' : answer,
            'question_no' : question,
            'is_correct' : is_correct,
            'content' : content
    }
    new_user = Result.objects.create(**save)
    new_user.save()
# objects.create()를 사용하여 새로운 User 레코드 생성 및 저장