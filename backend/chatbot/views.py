from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework import viewsets
from .models import ChatSession
from .serializers import ChatSessionSerializer
from rest_framework.response import Response
from rest_framework import status
# from django.contrib.auth import get_user_model
from account.models import User
from .models import ChatSession

import json
import os
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough
from account.models import User

# ChatSessionViewSet 정의
class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
        
    def perform_create(self, serializer):
        user_id_str = self.request.data.get('user_no')
        session_title = self.request.data.get('session_title')
        chat_content = self.request.data.get('chat_content')
        try:
            user = User.objects.get(pk=user_id_str)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer.save(session_title=session_title, chat_content=chat_content)
    
    def get_queryset(self):
        user_no = self.request.query_params.get('user_no')
        if user_no is not None:
            return ChatSession.objects.filter(user_no_id=user_no)
        return ChatSession.objects.all()

    def update(self, request, pk=None):
        try:
            session = ChatSession.objects.get(pk=pk)
        except ChatSession.DoesNotExist:
            return Response({'error': 'Session not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = self.get_serializer(session, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)
    
os.environ["OPENAI_API_KEY"] = "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"
persist_directory = str(settings.BASE_DIR)

embedding = OpenAIEmbeddings()
vectordb = Chroma(
    persist_directory=persist_directory,
    embedding_function=embedding)
retriever = vectordb.as_retriever(search_type="similarity")
template = """You are an assitant for new employee. If you don't know, just say you don't know.You must speak in Korean. Answer the question based only on the following context:
{context}

Question: {question}
"""
prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(temperature=0.1,
                    max_tokens=4000,
                    model_name='gpt-3.5-turbo-1106',)
output_parser = StrOutputParser()
setup_and_retrieval = RunnableParallel(
    {"context": retriever,
     "question": RunnablePassthrough()
     }
)
chain = setup_and_retrieval | prompt | model | output_parser

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

