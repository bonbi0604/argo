from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Answer, Category, Result
from django.db.models import Max
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
from collections import Counter
from django.conf import settings

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
@require_http_methods(["POST"])
def score(request):
    data = json.loads(request.body)
    user_no = data.get('user_no', 0)
    accuracy_rates = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 모든 사용자 유형별 문제 정답률
    accuracy_rates_user = {'시사/상식': 0, '직무이해': 0, '도구': 0, '윤리': 0} # 사용자 유형별 문제 정답률
    
    #커뮤니케이션 추가해야함
    
    #모든 사용자가 푼 문제 유형별 개수
    question_nos = Result.objects.all().values_list('question_no', flat=True)
    categories = Question.objects.filter(question_no__in=question_nos).values('category_no')
    classifications = Category.objects.filter(category_no__in=[c['category_no'] for c in categories]).values_list('classification', flat=True)
    classification_counts = Counter(list(classifications))
    total_classification = dict(classification_counts)
    
    #모든 사용자가 맞춘 문제 유형별 개수
    question_nos_good = Result.objects.filter(is_correct=1).values_list('question_no', flat=True)
    categories_good = Question.objects.filter(question_no__in=question_nos_good).values('category_no')
    classifications_good = Category.objects.filter(category_no__in=[c['category_no'] for c in categories_good]).values_list('classification', flat=True)
    classification_counts_good = Counter(list(classifications_good))
    total_classification_good = dict(classification_counts_good)
    
    #모든 사용자 유형별 문제 정답률
    for classification, total_attempts in total_classification.items():
        correct_attempts = total_classification_good.get(classification, 0)
        accuracy_rate = (correct_attempts / total_attempts * 100) if total_attempts else 0
        accuracy_rates[classification] = round(accuracy_rate, 2)
    
    #유저가 푼 문제 유형별 개수
    question_nos_user = Result.objects.filter(user_no=user_no).values_list('question_no', flat=True)
    categories_user = Question.objects.filter(question_no__in=question_nos_user).values('category_no')
    classifications_user = Category.objects.filter(category_no__in=[c['category_no'] for c in categories_user]).values_list('classification', flat=True)
    classification_counts_user = Counter(list(classifications_user))
    user_classification = dict(classification_counts_user)
    
    #유저가 맞춘 문제 유형별 개수
    question_nos_user_good = Result.objects.filter(user_no=user_no,is_correct=1).values_list('question_no', flat=True)
    categories_user_good = Question.objects.filter(question_no__in=question_nos_user_good).values('category_no')
    classifications_user_good = Category.objects.filter(category_no__in=[c['category_no'] for c in categories_user_good]).values_list('classification', flat=True)
    classification_counts_user_good = Counter(list(classifications_user_good))
    user_classification_good = dict(classification_counts_user_good)
    
    #유저가 맞춘 유형별 문제 정답률
    for classification_user, total_attempts_user in user_classification.items():
        correct_attempts_user = user_classification_good.get(classification_user, 0)
        accuracy_rate_user = (correct_attempts_user/ total_attempts_user * 100) if total_attempts_user else 0
        accuracy_rates_user[classification_user] = round(accuracy_rate_user, 2)
    
    #json 형태로 변환
    result = {
        '직무이해': {'avg': accuracy_rates['직무이해'], 'score': accuracy_rates_user['직무이해']},
        '시사/상식': {'avg': accuracy_rates['시사/상식'], 'score': accuracy_rates_user['시사/상식']},
        '도구': {'avg': accuracy_rates['도구'], 'score': accuracy_rates_user['도구']},
        '윤리': {'avg': accuracy_rates['윤리'], 'score': accuracy_rates_user['윤리']},
        '커뮤니케이션': {'avg': 0, 'score': 0}
    }
    categories = {
        '직무이해': 'occupation',
        '시사/상식': 'commonsense',
        '도구': 'tools',
        '윤리': 'ethic',
        '커뮤니케이션': 'communication',
    }
    result_eng = {categories[key]: value for key, value in result.items()}
    print(result_eng)
    
    return JsonResponse({"result": result_eng})

# def search_list(str):
#     search = Result.objects.filter(is_correct = 0)
#     search = [{i+1 : result.question_no.content} for i, result in enumerate(search)]
#     return search