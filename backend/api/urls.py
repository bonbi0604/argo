from noticeboard.views import post_list_create
from django.urls import path, include
from . import views
from .views import checkId, checkEmail, mailSend

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterView.as_view(), name='auth_register'),
    path('checkId/', checkId, name='checkId'),
    path('checkEmail/', checkEmail, name='checkEmail'),
    path('mailSend/', mailSend, name='mailSend'),
    path('', views.getRoutes),
    path('password_reset/', include('django.contrib.auth.urls'))  # 패스워드 재설정
]