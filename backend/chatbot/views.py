from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

import json
import os
from langchain.vectorstores import Chroma
from langchain.embeddings import OpenAIEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough

from rest_framework import viewsets
from .models import ChatSession
from .serializers import ChatSessionSerializer

class ChatSessionViewSet(viewsets.ModelViewSet):
    queryset = ChatSession.objects.all()
    serializer_class = ChatSessionSerializer
    
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

