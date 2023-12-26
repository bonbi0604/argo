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

from django.conf import settings


os.environ["OPENAI_API_KEY"] = "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"
persist_directory = settings.BASE_DIR
embedding = OpenAIEmbeddings()
template = """
You are an assistant who helps new employees learn business conversations.
You must speak in Korean. 
If you decide that the conversation is over regarding the topic, you should say "end."
Please refer to the following conversation context example and your history.

Context: {context}
History: {history}
"""
prompt = ChatPromptTemplate.from_template(template)
model = ChatOpenAI(temperature=0.1,
                    max_tokens=2048,
                    model_name='gpt-3.5-turbo-1106',)
output_parser = StrOutputParser()
setup_and_retrieval = RunnableParallel(
    {
     "history": RunnablePassthrough(),
     "context": RunnablePassthrough(),
     }
)
chain = prompt | model | output_parser

@csrf_exempt
def chatbot_response(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        user_message = data['message']
        chatbot_response = generate_response(user_message)
        return JsonResponse({'reply': chatbot_response})

def generate_response(message):
    return chain.invoke(message)