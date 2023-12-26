from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
# from django.contrib.auth.models import User
from account.models import User
from noticeboard.models import Post
from noticeboard.serializer import PostSerializer
from django.views.decorators.csrf import csrf_exempt


@api_view(['GET'])
def getRoutes(request):
    routes = [
        '/noticeboard/posts/',
    ]
    return Response(routes)

@api_view(['GET', 'POST'])
# @csrf_exempt
def post_list_create(request):
    if request.method == 'GET':
        posts = Post.objects.all()
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = PostSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            serializer.save(author=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    