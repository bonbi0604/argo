from django.urls import path
from .views import *


app_name = "learn"

urlpatterns = [
    path('communication/study/', chatbot_response, name='communication_study'),
]