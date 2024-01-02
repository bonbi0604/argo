from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Question, Answer, Category, Result, Comm_History, Comm_History_Sentence
from django.utils import timezone
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.db import models
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
import random, json
from django.http import JsonResponse, HttpResponse
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.core.serializers import serialize
from account.models import User

### learn-communication
from rest_framework.response import Response
from django.db.models import Count
from datetime import datetime
from django.utils import timezone

########################################################################
#                      learn/communication/study/                      #
########################################################################
# 쿼리 날려서 DB에서 가져오기
user_name = "wendy"
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
template = """
User_name: {user_name}
Subject: {subject}
Example: {example}
History: {history}
Message: {message}

Variables:
1. History is the complete actual conversation between you and the user. It should include all the responses generated by me and the messages received from the user, starting from "<START>".
2. Message is the content you received from the user.
3. Code should be one of 0, 1, or 3, as explained in the rules below.

Rules:
1. Refer to the provided example and base the ongoing business conversation on the accumulated history data.
1-1. The provided example is for reference only; do not follow it exactly.
2. You are the first speaker "A," and the user is the second speaker "B."
2-1. The name of B is user_name. Call user by user_name.
3. Communicate only in Korean.
4. Do not respond until you receive the "<START>" message. Start the conversation after receiving it.
5. When you receive "<START>", initiate a business conversation related to the subject.
5-1. Send an initial message to the user and wait for their response.
5-2. Upon receiving a message from the user, respond with one line.
6. The conversation should follow the subject and example, and be based on the accumulated history.
6-1. The conversation should alternate, with both you and the user taking one turn each.
6-2. You should generate only A's content, and B's content should be generated by the user.
7. While the conversation is ongoing, the code variable should be set to 0.
7-1. Set the code to 1 or 3 only when you are ending the conversation, as explained below.
7-2. If the user's input goes beyond the subject slightly, send "<END>" and set the code to 1.
7-3. If the conversation ends without going off-topic from subject, send "<END>" and set the code to 3.
8. As soon as you send "<END>", the conversation must immediately be terminated.

IMPORTANT RULE:
1. The conversation subject must be "BUSINESS".
2. ONLY USER KOREAN.
"""
os.environ["OPENAI_API_KEY"] = "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"
persist_directory = settings.BASE_DIR
embedding = OpenAIEmbeddings()

prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(temperature=0.1,
                    max_tokens=2048,
                    model_name='gpt-3.5-turbo-1106',)
output_parser = StrOutputParser()

chain = (
    {"user_name": itemgetter("user_name"),
     "subject": itemgetter("subject"),
     "example": itemgetter("example"),
     "history": itemgetter("history"),
     "message": itemgetter("message"),
     }
    | prompt
    | model
    | output_parser
)

def generate_response(message, session_history, dialog_example, dialog_subject, user_name):
    # return chain.invoke({
    #     "user_name": user_name,
    #     "subject": dialog_subject,
    #     "example": dialog_example, 
    #     "history": session_history, 
    #     "message": message,
    # })
    # 모델 써야함 밑은 예시
    # return random.choices(['랜덤1', '랜덤2', '랜덤3', '<END>', '<errEND>'])[0]
    return random.choices(['랜덤1', '랜덤2', '랜덤3'])[0]

def chatbot_code(chatbot_response):
    if chatbot_response == '<END>':
        return int(3)
    elif chatbot_response == '<errEND>':
        return int(1)
    else:
        return int(0)
    
def user_code(user_message):
    if user_message == '<END>':
        return int(2)
    else:
        return int(0)
    
@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':     
        # user 응답 message 가져오기
        data = json.loads(request.body)

        # 현재 세션에 저장된 대화 내역을 가져오기
        session_history = request.session.get('chat_history', [])

        # 현재 사용자의 메시지를 대화 내역에 추가
        user_message = data['message']
        code_user = user_code(user_message)
        if code_user == 0:
            session_history.append({"speaker": "user", "message": user_message})

            # chatbot 응답 메시지를 대화 내역에 추가
            chatbot_response = generate_response(user_message, session_history, dialog_example, dialog_subject, user_name)
            code_chatbot = chatbot_code(chatbot_response)

            if code_chatbot == 0:
                session_history.append({"speaker": "chatbot", "message": chatbot_response})
                code = code_chatbot

            else:
                code = code_chatbot
            
            # 대화 내역을 세션에 저장
            request.session['chat_history'] = session_history
        else:
            chatbot_response = [""]
            code = code_user
        
        print(user_message, session_history, code)
        
        return JsonResponse({'title':dialog_subject, 'reply': chatbot_response, 'code': code})
    


########################################################################
#                      learn/communication/label/                      #
########################################################################
def scoring_7cs(message):
    # 모델 써야함 밑은 예시
    score_clear = random.choices([0, 1, 2, 3])[0]
    score_concise = random.choices([0, 1, 2, 3])[0]
    score_concrete = random.choices([0, 1, 2, 3])[0]
    score_correct = random.choices([0, 1, 2, 3])[0]
    score_coherent = random.choices([0, 1, 2, 3])[0]
    score_complete = random.choices([0, 1, 2, 3])[0]
    score_courteous = random.choices([0, 1, 2, 3])[0]
    return score_clear, score_concise, score_concrete, score_correct, score_coherent, score_complete, score_courteous

@csrf_exempt
def labeling_7cs(request):
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        message = data.get("message", "")    # "message" 필드 추출
        # history = data.get("history", [])    # "history" 필드 추출
        score_clear, score_concise, score_concrete, score_correct, score_coherent, score_complete, score_courteous = scoring_7cs(message)
        print("labeling complete")
    return JsonResponse({'labels': {
        'Clear': score_clear,
        'Concise': score_concise,
        'Concrete': score_concrete,
        'Correct': score_correct,
        'Coherent': score_coherent,
        'Complete': score_complete,
        'Courteous': score_courteous
    }})



########################################################################
#                      learn/communication/save/                       #
########################################################################
@csrf_exempt
def comm_save(request):
    if request.method == 'POST':
        
        try:
            data = json.loads(request.body.decode('utf-8'))

            # 사용자 식별 번호를 이용하여 사용자 인스턴스 가져오기
            user_no = data.get("user_no")
            user = User.objects.get(pk=user_no)
            
            print(datetime.utcfromtimestamp(data.get("timestamp")/ 1000).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3])  

            # Comm_History 모델에 데이터 추가
            comm_history = Comm_History.objects.create(
                user_no=user,
                code=data.get("code"),
                title=data.get("title"),
                timestamp=datetime.utcfromtimestamp(data.get("timestamp")/ 1000).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
            )
            
            history_items = data.get("history", [])
            comm_history_sentence_list = []

            for item in history_items:
                labels = item.get("labels")
                # print(item.get("timestamp"), end = " ")
                comm_history_sentence_list.append(Comm_History_Sentence(
                    history_no=comm_history,
                    speaker=item.get("speaker"),
                    sentence=item.get("sentence"),
                    label_clear=labels.get("Clear", None),
                    label_concise=labels.get("Concise", None),
                    label_concrete=labels.get("Concrete", None),
                    label_correct=labels.get("Correct", None),
                    label_coherent=labels.get("Coherent", None),
                    label_complete=labels.get("Complete", None),
                    label_courteous=labels.get("Courteous", None),
                    timestamp=datetime.utcfromtimestamp(item.get("timestamp")/ 1000).strftime('%Y-%m-%d %H:%M:%S.%f')[:-3]
                ))


            # Comm_History_Sentence 모델에 데이터 일괄 추가
            Comm_History_Sentence.objects.bulk_create(comm_history_sentence_list)

            # 성공적으로 데이터를 저장한 경우
            return JsonResponse({"message": "Data saved successfully"}, status=200)
        except User.DoesNotExist:
            # 사용자가 존재하지 않는 경우
            return JsonResponse({"error": "User not found"}, status=400)
        except Exception as e:
            # 데이터 저장 중 오류 발생한 경우
            return JsonResponse({"error": str(e)}, status=400)

    # POST 요청이 아닌 경우
    return JsonResponse({"error": "Method not allowed"}, status=405)



########################################################################
#                     learn/communication/history/                     #
########################################################################
@csrf_exempt
def comm_view_history(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_no = data.get("user_no")
            
            # user_no에 해당하는 모든 Comm_History 레코드를 가져옵니다.
            histories = Comm_History.objects.filter(user_no=user_no)
            
            # 결과를 JSON 형식으로 구성합니다.
            result = []
            for history in histories:
                result.append({
                    "history_no": history.history_no,
                    "title": history.title,
                    "code": history.code,
                })
            
            return JsonResponse(result, safe=False)
        
        except Exception as e:
            # 예외 처리
            return JsonResponse({"error": str(e)}, status=400)
    
    return JsonResponse({"error": "Invalid request method"}, status=405)



########################################################################
#                  learn/communication/history/<int:no>/               #
########################################################################
@csrf_exempt
def comm_history_detail(request, no):
    if request.method == 'POST':
        # 요청에서 JSON 데이터를 파싱합니다.
        data = json.loads(request.body)

        # 요청 데이터에서 user_id를 추출합니다.
        user_no = data.get("user_no")

        # URL에서 history_no 추출합니다.
        history_no = no

        # 데이터베이스에서 지정된 history_no 대한 대화 내역을 조회합니다.
        history = get_object_or_404(Comm_History, history_no=history_no, user_no=user_no)

        # 이 history에 관련된 문장들을 조회합니다.
        sentences = Comm_History_Sentence.objects.filter(history_no=history)

        # 문장 데이터를 저장할 리스트를 생성합니다.
        history_data = []

        # 문장을 순회하면서 각 문장에 대한 딕셔너리를 만듭니다.
        for sentence in sentences:
            sentence_dict = {
                "speaker": sentence.speaker,
                "sentence": sentence.sentence,
                "labels": {
                    "Clear": sentence.label_clear,
                    "Concise": sentence.label_concise,
                    "Concrete": sentence.label_concrete,
                    "Correct": sentence.label_correct,
                    "Coherent": sentence.label_coherent,
                    "Complete": sentence.label_complete,
                    "Courteous": sentence.label_courteous,
                },
                "timestamp": sentence.timestamp
            }
            history_data.append(sentence_dict)

        # 최종 응답 JSON을 생성합니다.
        response_data = {
            "history_no": history_no,
            "code": history.code,
            "title": history.title,
            "history": history_data
        }

        # JSON 응답을 반환합니다.
        return JsonResponse(response_data)

    return JsonResponse({"error": "Invalid request method"}, status=405)



########################################################################
#                       learn/communication/score                      #
########################################################################
@csrf_exempt
def comm_score(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            user_no = data.get("user_no")

            # 각 품질에 대한 점수 계산
            label_scores = {}
            labels = ["clear", "concise", "concrete", "correct", "coherent", "complete", "courteous"]

            for label in labels:
                # 모든 레코드에서 해당 레이블의 점수를 평균 계산
                avg_score = Comm_History_Sentence.objects.filter(
                    speaker="user",
                    **{f"label_{label}__isnull": False}  # 해당 레이블의 null 값 제외
                ).aggregate(avg_score=models.Avg(f"label_{label}"))["avg_score"]

                # 특정 사용자의 점수 계산
                user_score = Comm_History_Sentence.objects.filter(
                    speaker="user",
                    history_no__user_no=user_no,
                    **{f"label_{label}__isnull": False}  # 해당 레이블의 null 값 제외
                ).aggregate(user_score=models.Avg(f"label_{label}"))["user_score"]

                # null 값이 아닐 경우에만 연산 수행
                if avg_score is not None:
                    avg_score = int(avg_score * 100 / 3)
                if user_score is not None:
                    user_score = int(user_score * 100 / 3)

                label_scores[label] = {
                    "avg": avg_score,
                    "score": user_score
                }

            return JsonResponse(label_scores)

        except Exception as e:
            return JsonResponse({"error": str(e)})

    return JsonResponse({"error": "Invalid request method"})



########################################################################
#                      ?????????????????????????                       #
########################################################################
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
    # 각 품질에 대한 점수 계산
    label_scores = {}
    labels = ["clear", "concise", "concrete", "correct", "coherent", "complete", "courteous"]
 
    for label in labels:
        # 모든 레코드에서 해당 레이블의 점수를 평균 계산
        avg_score = Comm_History_Sentence.objects.filter(
            speaker="user",
            **{f"label_{label}__isnull": False}  # 해당 레이블의 null 값 제외
        ).aggregate(avg_score=models.Avg(f"label_{label}"))["avg_score"]
 
        # 특정 사용자의 점수 계산
        user_score = Comm_History_Sentence.objects.filter(
            speaker="user",
            history_no__user_no=user_no,
            **{f"label_{label}__isnull": False}  # 해당 레이블의 null 값 제외
        ).aggregate(user_score=models.Avg(f"label_{label}"))["user_score"]
 
        # null 값이 아닐 경우에만 연산 수행
        if avg_score is not None:
            avg_score = int(avg_score * 100 / 3)
        if user_score is not None:
            user_score = int(user_score * 100 / 3)
 
        label_scores[label] = {
            "avg": avg_score,
            "score": user_score
        }
    total_avg = sum(item['avg'] for item in label_scores.values())
    total_score = sum(item['score'] for item in label_scores.values())
    num_items = len(label_scores)
 
    avg_communication = total_avg / num_items
    score_communication = total_score / num_items
 
    all_comm_score = {'communication': avg_communication}
    user_comm_score = {'communication': score_communication}
   
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
    result_eng['communication']['avg'] = all_comm_score['communication']
    result_eng['communication']['score'] = user_comm_score['communication']
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
            'user_no' : User.objects.get(user_no = User.objects.get(user_no = user)),
            'answer_no' : Answer.objects.get(answer_no = Answer.objects.get(answer_no = answer)),
            'question_no' : Question.objects.get(question_no = Question.objects.get(question_no = question)),
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
    user = instance.content
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
        'answer_ration' : answer_ration
    }
    return JsonResponse({'content':result})

