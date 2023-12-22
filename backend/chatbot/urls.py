from django.urls import path
from . import views
from .views import chatbot_response 

urlpatterns = [
    path('', chatbot_response, name='chatbot_response'),
]