from django.urls import path, include
from . import views
from .views import checkId, checkEmail, mailSend

urlpatterns = [
    path('', views.list, name='list'),
]