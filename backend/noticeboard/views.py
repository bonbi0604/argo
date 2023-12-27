from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from account.models import User
from django.shortcuts import get_object_or_404
from .models import Post  # Post 모델을 임포트합니다.
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
    
    
@api_view(['GET', 'PUT'])
def post_detail(request, id):
    post = get_object_or_404(Post, pk=id)

    if request.method == 'GET':
        post_data = {
            "id": post.id,
            "title": post.title,
            "content": post.content,
            "author_id": post.author.id,
            "timestamp": post.timestamp.strftime("%Y-%m-%d %H:%M:%S")
        }
        return JsonResponse(post_data)    
    elif request.method == 'PUT':
        serializer = PostSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    
@api_view(['DELETE'])
def delete_post(request, id):
    # ID에 해당하는 게시물을 데이터베이스에서 찾습니다.
    post = get_object_or_404(Post, pk=id)

    # 게시물을 삭제합니다.
    post.delete()

    # 삭제가 성공적으로 이루어졌음을 응답으로 반환합니다.
    return JsonResponse({'message': '게시물이 성공적으로 삭제되었습니다.'})