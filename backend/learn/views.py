from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Answer, Category, Result
from django.db.models import Max, Count, F
import random
import json
import os
# from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from operator import itemgetter

from django.conf import settings
from collections import Counter
import random, json
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from account.models import User

### learn-communication

# 쿼리 날려서 DB에서 가져오기
dialog_subject = "전언에 대한 전화 협의 일정 조정"
dialog_example = """
주제: 전언에 대한 전화 협의 일정 조정
대화: 
A: 여보세요, 이나다입니다.
B: H사의 다카이치입니다. 신세 많이 졌습니다.
A: 신세 많이 졌습니다.
B: 아까 전화 주셔서 감사했습니다. 외출해서 죄송합니다.
A: 아닙니다, 저야말로 바쁘신 와중에 죄송합니다. A사에 가는게 다음주 월요일이었죠? 그 미팅 한번 하는게 좋을 것 같아서요.
B: 그래요, 합시다. 자료 준비도 있으니까 빠른게 좋겠죠.
A: 다카이치(高市) 씨는 언제든지 좋다고 말씀하셨었나요?
B: 네, 이나다(田)씨는 언제가 좋습니까?
A: 음, 가장 최근이라면... 내일 오전 10시 반쯤부터가 어떠신가요? 저 그쪽으로 방문할 수 있어요.
B: 정말요? 일부러 죄송합니다. 제가 그쪽으로 가도 되는 줄 알았는데요.
A: 괜찮아요 가깝고요. 그럼 내일 10시 반쯤 찾아뵐게요.
B: 예 알겠습니다。 감사합니다。 그럼 내일 기다리고 있겠습니다. 잘 부탁드립니다.
A: 잘 부탁드립니다
"""


os.environ["OPENAI_API_KEY"] = "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"
persist_directory = settings.BASE_DIR
embedding = OpenAIEmbeddings()
template = """
Please refer to the following conversation example and your history.
You are the first speaker in the following example conversation.
You will be 'A' and the user will be 'B'

You must speak in Korean. 

Start the conversation when you receive the "<START>" message. You cannot respond to "<START>" messages, you can only receive them.
If you decide that the conversation is over regarding the topic, you should say "<END>"

Please proceed one by one as shown in the example. Each step in the example is one line.
History is the real data about your actual interactions with the user.
Message is the message you received this time.
Subject is the subject of conversation.
Example is the example of conversation.

Subject: {subject}
Example: {example}
History: {history}
Message: {message}
"""
prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(temperature=0.1,
                    max_tokens=2048,
                    model_name='gpt-3.5-turbo-1106',)
output_parser = StrOutputParser()

chain = (
    {"example": itemgetter("example"), "history": itemgetter("history"), "message": itemgetter("message"),  "subject": itemgetter("subject")}
    | prompt
    | model
    | output_parser
)



@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':     
        # user 응답 message 가져오기
        data = json.loads(request.body)
        user_message = data['message']
        

        chatbot_response = generate_response(user_message, data['history'])
        

        print(data['history'], user_message)
        
        return JsonResponse({'reply': chatbot_response, 'title':dialog_subject})

def generate_response(message, history):
    return chain.invoke({"example":dialog_example, "history":history, "message":message, "subject":dialog_subject})
    # return "hello"

# fk로 참조해서 테이블 들어간 후 틀린 문제 뽑아냄
def wrong_list():
    wrong = Result.objects.filter(is_correct = 0)
    wrong = [{i+1 : result.question_no.content} for i,result in enumerate(wrong)]
    return wrong

@csrf_exempt
def recommendation(request):
    data = json.loads(request.body)
    user_no = data.get('user_no', 0)
    result = Result.objects.filter(user_no=user_no, is_correct=0).order_by('timestamp').first()
    if result:
        question = result.question_no
        category_no = question.category_no
        class_name = category_no.classification
        if class_name == '시사/상식':
            class_name_eng = 'commonsense'
        elif class_name == '직무이해':
            class_name_eng = 'occupation'
        elif class_name == '도구':
            class_name_eng = 'tools'
        elif class_name == '윤리':
            class_name_eng = 'ethic'
        return JsonResponse({'result': class_name_eng})
    else:
        return JsonResponse({'error': 'No incorrect problems found'}, status=404)
    
from django.views.decorators.http import require_http_methods


@csrf_exempt
def score(request):
    data = json.loads(request.body)
    user_no = data.get('user_no', 0)
   
    total_result = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 모든 사용자 푼 문제
    total_result_correct = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 모든 사용자가 맞춘 문제
    user_result = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 사용자가 푼 문제
    user_result_correct = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 사용자가 맞춘 문제
    accuracy_rates = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 모든 사용자 유형별 문제 정답률
    accuracy_rates_user = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 사용자 유형별 문제 정답률
   
    #커뮤니케이션 추가해야함
   
    #모든 사용자가 푼 문제 유형별 개수
    result_counts = (Result.objects.filter()
                 .values('question_no__category_no__classification')
                 .annotate(total=Count('question_no__category_no__classification'))
                 .order_by())
    for item in result_counts:
        classification = item['question_no__category_no__classification']
        total = item['total']
        total_result[classification] = total
 
    #모든 사용자가 맞춘 문제 유형별 개수
    result_counts = (Result.objects.filter(is_correct = 1)
                 .values('question_no__category_no__classification')
                 .annotate(total=Count('question_no__category_no__classification'))
                 .order_by())
    for item in result_counts:
        classification = item['question_no__category_no__classification']
        total = item['total']
        total_result_correct[classification] = total
   
    #모든 사용자 유형별 문제 정답률
    for classification, total_attempts in total_result.items():
        correct_attempts = total_result_correct.get(classification, 0)
        accuracy_rate = (correct_attempts/ total_attempts * 100) if total_attempts else 0
        accuracy_rates[classification] = round(accuracy_rate, 2)
   
    #유저가 푼 문제 유형별 개수
    result_counts = (Result.objects.filter(user_no=user_no)
                 .values('question_no__category_no__classification')
                 .annotate(total=Count('question_no__category_no__classification'))
                 .order_by())
    for item in result_counts:
        classification = item['question_no__category_no__classification']
        total = item['total']
        user_result[classification] = total
 
    #유저가 맞춘 문제 유형별 개수
    result_counts = (Result.objects.filter(user_no=user_no,is_correct=1)
                 .values('question_no__category_no__classification')
                 .annotate(total=Count('question_no__category_no__classification'))
                 .order_by())
    for item in result_counts:
        classification = item['question_no__category_no__classification']
        total = item['total']
        user_result_correct[classification] = total
       
    #유저가 맞춘 유형별 문제 정답률
    for classification_user, total_attempts_user in user_result.items():
        correct_attempts_user = user_result_correct.get(classification_user, 0)
        accuracy_rate_user = (correct_attempts_user/ total_attempts_user * 100) if total_attempts_user else 0
        accuracy_rates_user[classification_user] = round(accuracy_rate_user, 2)
 
    #json 형태로 변환
    result = {
        '직무이해': {'avg': accuracy_rates['직무이해'], 'score': accuracy_rates_user['직무이해']},
        '커뮤니케이션': {'avg': 0, 'score': 0},
        '시사/상식': {'avg': accuracy_rates['시사/상식'], 'score': accuracy_rates_user['시사/상식']},
        '도구': {'avg': accuracy_rates['도구'], 'score': accuracy_rates_user['도구']},
        '윤리': {'avg': accuracy_rates['윤리'], 'score': accuracy_rates_user['윤리']},
    }
    categories = {
        '직무이해': 'occupation',
        '커뮤니케이션': 'communication',
        '시사/상식': 'commonsense',
        '도구': 'tools',
        '윤리': 'ethic',
    }
   
    # 영어로 컴럼명 변경
    result_eng = {categories[key]: value for key, value in result.items()}
 
    return JsonResponse({"result": result_eng})



### learn-others

# 틀린문제 뽑기. question에 있는 모든 내용 가져오기
def get_wrong_question_list(filter_no, count, user_no=None):
    specific_user = Result.objects.filter(user_no = user_no)
    # 사용자가 틀린 문제 필터링
    value = specific_user.filter(is_correct=0)
    value = value.order_by('-timestamp')
    #틀린 문제 종류별 n개씩 추출
    content_list = list(value.filter(question_no__category_no=filter_no))[:min(count, len(value.filter(question_no__category_no=filter_no)))]
    question = []
   
    for content in content_list:
        # 틀린 문제에 대한 정답률 고르기
        question_number = content.question_no.question_no
        question_query = Result.objects.filter(question_no = question_number)
        question_total = question_query.count()
        question_correct_num =question_query.filter(is_correct = 1).count()
        answer_ration = round((question_correct_num / question_total) * 100,2)
       
        dic = {
                'question_no' : content.question_no.question_no,
                'category_no' : content.question_no.category_no_id,
                'content' : content.question_no.content[:18],
                'result_no' : content.result_no,
                'timestamp' : content.timestamp,
                'answer_ratio' : answer_ration
                }
        question.append(dic)
    return question

@csrf_exempt
def wrong_question_list(request):
    data = json.loads(request.body)
    cat = data.get('cat')
    user_no = data.get('user_no')
    question = []
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
        question = get_wrong_question_list(6, 20, user_no)
    return JsonResponse({'wrong_question_list' : question })
    
          
@csrf_exempt
def search_list(request):
    data = json.loads(request.body)
    keyword = data.get('search')
    if keyword:
        search = []
        value = Result.objects.filter(is_correct=0)
        content_list = value.filter(question_no__content__icontains=keyword).values('question_no__content', 'question_no')
        for content in content_list:
            dic = {
                'question_no' : content['question_no'],
                'content' : content['question_no__content'][:18]
            }
            search.append(dic)  
    else:
        pass
    return JsonResponse({'wrong_question_list' : search })

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
        number = 6
    
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
    answer = data.get('answer_no')
    question = data.get('question_no')
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
        if content != value.content:
            is_correct = 0
        else:
            is_correct = 1  
    save = {
            'user_no' : User.objects.get(user_no = user),
            'answer_no' : Answer.objects.get(answer_no = answer),
            'question_no' : Question.objects.get(question_no = question),
            'is_correct' : is_correct,
            'content' : content
    }
    new_user = Result.objects.create(**save)
    return JsonResponse({'response' : True })

@csrf_exempt
def get_wrong_question(request):
    data = json.loads(request.body)
    user_number = data.get('user_no')
    question_number = data.get('question_no')
    instance =Result.objects.get(user_no = user_number, question_no = question_number)
    if instance.content != '':
        user = instance.content
    else:
        user =instance.answer_no.content
    question = Question.objects.get(question_no = question_number).content
    answer = Answer.objects.get(question_no = question_number, is_correct = 1).content
   
    question_number = instance.question_no.question_no
    question_query = Result.objects.filter(question_no = question_number)
    question_total = question_query.count()
    question_correct_num =question_query.filter(is_correct = 1).count()
    answer_ration = round((question_correct_num / question_total) * 100,2)
   
   
    result = {
        'user_content' : user,
        'question_content' : question,
        'answer_content' : answer,
        'answer_ratio' : answer_ration
    }
    return JsonResponse({'content':result})

@csrf_exempt
def get_avg_score(request):
    data = json.loads(request.body)
    user_no = data.get('user_no')
    cat = data.get('cat')
    if cat == 'occupation':
        number = 4
    elif cat=='commonsense':
        total, other_user, user =0,0,0
        for i in range(1,4):
            total += Result.objects.filter(question_no__category_no=i).count()
            other_user += Result.objects.filter(question_no__category_no=i, is_correct=1).count()
            user += Result.objects.filter(question_no__category_no=i, user_no=user_no, is_correct =1).count()
        dic = {
        'total_avg' : round(other_user/total*100,2),
        'user_avg' : round(user/total*100,2)
        }
        return JsonResponse({'score': dic})
    elif cat =='tools':
        number = 5
    elif cat =='ethic':
        number = 6
    total = Result.objects.filter(question_no__category_no=number).count()
    other_user = Result.objects.filter(question_no__category_no=number, is_correct=1).count()
    user = Result.objects.filter(question_no__category_no=number, user_no=user_no, is_correct =1).count()
    dic = {
        'total_avg' : round(other_user/total*100,2),
        'user_avg' : round(user/total*100,2)
    }  
    print(dic)        
    return JsonResponse({'score': dic})