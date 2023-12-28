from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import viewsets
from .models import ChatSession
from .serializers import ChatSessionSerializer
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model


import json
import os
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

User = get_user_model()

# ChatSessionViewSet 정의
class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def perform_create(self, serializer):
        serializer.save()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()

# 챗봇의 답변을 반환하는 뷰
@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data['message']
        chatbot_response = generate_response(user_message)
        return JsonResponse({'reply': chatbot_response})

def generate_response(message):
    # return chain.invoke(message)
    return "안녕 수리중이야~"

# 채팅 세션을 저장하는 뷰
@csrf_exempt
def save_chat_session(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_id = data.get('user_id')  # 사용자의 사이트 아이디
        session_title = data.get('session_title')
        chat_content = data.get('chat_content')

        # 사용자 모델에서 user_id로 사용자 찾기
        try:
            # 예시: user_id가 email이라고 가정
            user = User.objects.get(email=user_id)
        except User.DoesNotExist:
            return JsonResponse({'error': 'User not found'}, status=404)

        ChatSession.objects.create(
            user=user,
            session_title=session_title,
            chat_content=chat_content
        )
        return JsonResponse({'status': 'success'})
    else:
        return JsonResponse({'error': 'Invalid request'}, status=400)

# os.environ["OPENAI_API_KEY"] = "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"
# persist_directory = str(settings.BASE_DIR)

# embedding = OpenAIEmbeddings()
# vectordb = Chroma(
#     persist_directory=persist_directory,
#     embedding_function=embedding)
# retriever = vectordb.as_retriever(search_type="similarity")
# template = """You are an assitant for new employee. If you don't know, just say you don't know.You must speak in Korean. Answer the question based only on the following context:
# {context}

# Question: {question}
# """
# prompt = ChatPromptTemplate.from_template(template)
# model = ChatOpenAI(temperature=0.3,
#                     max_tokens=4000,
#                     model_name='gpt-3.5-turbo-1106',)
# output_parser = StrOutputParser()
# setup_and_retrieval = RunnableParallel(
#     {"context": retriever,
#      "question": RunnablePassthrough()
#      }
# )
# chain = setup_and_retrieval | prompt | model | output_parser