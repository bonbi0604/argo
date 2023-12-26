from django.urls import path
from .views import *


app_name = "learn"

urlpatterns = [
    path('learn/communication/study', chatbot_response, name='communication_study'),
]