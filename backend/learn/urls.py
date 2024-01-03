# from .views import post_list_create
from django.urls import path, include
from . import views
# from .views import checkId, checkEmail, mailSend

# urlpatterns = [
#     path('', views.list, name='list'),
# ]

from .views import *


app_name = "learn"
from .views import wrong_list

app_name = 'learn'
urlpatterns = [
    path('communication/study/', chatbot_response, name='communication_study'),
    path('wronglist/', wrong_question_list, name='wrong_question_list'),
    path('getQuestion/', give_question, name='give_question'),
    path('insertResult/', insertResult, name='insertResult'),
    path('recommendation/', recommendation, name='recommendation'),
    path('score/', score, name='score'),
]