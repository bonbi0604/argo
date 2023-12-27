from .views import post_list_create, post_detail, delete_post  # post_detail 뷰 함수를 임포트합니다.
from django.urls import path, include
from . import views

urlpatterns = [
    path('posts/', post_list_create, name='post_list_create'),
    path('posts/<int:id>/', post_detail, name='post_detail'),
    path('posts/<int:id>/delete/', views.delete_post, name='delete_post'),
    path('', views.getRoutes),
    path('password_reset/', include('django.contrib.auth.urls'))  # 패스워드 재설정
]