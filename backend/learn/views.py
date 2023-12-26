from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

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
        
        # 현재 세션에 저장된 대화 내역을 가져오기
        session_history = request.session.get('chat_history', [])

        # 현재 사용자의 메시지를 대화 내역에 추가
        session_history.append({"speaker": "user", "message": user_message})

        chatbot_response = generate_response(user_message, session_history)
        
        
        # chatbot 응답 메시지를 대화 내역에 추가
        session_history.append({"speaker": "chat", "message": chatbot_response})
        
        # 대화 내역을 세션에 저장
        request.session['chat_history'] = session_history
        # request.session.save()
        print(user_message, session_history)
        
        return JsonResponse({'reply': chatbot_response, 'title':dialog_subject})

def generate_response(message, session_history):
    # return chain.invoke({"example":dialog_example, "history":session_history, "message":message, "subject":dialog_subject})
    return "hello"