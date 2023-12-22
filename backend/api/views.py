from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from api.serializer import MyTokenObtainPairSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics
# from django.contrib.auth.models import User
from account.models import User
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.views.decorators.csrf import csrf_exempt;

# Create your views here.

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/api/token/',
        '/api/register/',
        '/api/token/refresh/'
    ]
    return Response(routes)



from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from django.db import IntegrityError
import json

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def testEndPoint(request):
    if request.method == 'GET':
        data = f"Congratulation {request.user}, your API just responded to GET request"
        return Response({'response': data}, status=status.HTTP_200_OK)
    elif request.method == 'POST':
        try:
            text = request.POST.get('text')
            data = f'Congratulation your API just responded to POST request with text: {text}'
            return Response({'response': data}, status=status.HTTP_200_OK)
        except IntegrityError:
            # 중복된 이메일이 발생한 경우
            return JsonResponse({'error': 'Email is already taken'}, status=400)
    return Response({}, status.HTTP_400_BAD_REQUEST)

@csrf_exempt
def checkId(request):
    try:
        # 아이디 가져오기
        data = json.loads(request.body)
        user_id = data.get('id')
        
        # 아이디 중복 체크 로직을 수정
        is_duplicate = User.objects.filter(id=user_id).exists()

        return JsonResponse({'isDuplicate': is_duplicate})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
def checkEmail(request):
    try:
        # 이메일 가져오기
        data = json.loads(request.body)
        user_email = data.get('email')
        
        # 이메일 중복 체크 로직을 수정
        is_duplicate = User.objects.filter(email=user_email).exists()

        return JsonResponse({'isDuplicate': is_duplicate})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
