from .views import post_list_create
from django.urls import path, include
from . import views

urlpatterns = [
    path('posts/', post_list_create, name='post_list_create'),
    path('', views.getRoutes),
    path('password_reset/', include('django.contrib.auth.urls'))  # 패스워드 재설정
]