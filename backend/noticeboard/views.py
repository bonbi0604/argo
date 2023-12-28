from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Comment
from .serializer import CommentSerializer
from django.http import JsonResponse
from account.models import User
from django.shortcuts import get_object_or_404
from .models import Post  # Post 모델을 임포트합니다.
from noticeboard.serializer import PostSerializer
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import get_user_model


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

@api_view(['GET', 'POST'])
def comments_list_create(request, id):
    post = get_object_or_404(Post, pk=id)

    if request.method == 'GET':
        comments = Comment.objects.filter(board_no=post)
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if not request.user.is_authenticated:
            return Response({'detail': '로그인이 필요합니다.'}, status=status.HTTP_401_UNAUTHORIZED)

        serializer = CommentSerializer(data=request.data)
        print(request.data)
        if serializer.is_valid():
            # save() 호출 시 user_no에 request.user를 전달합니다.
            serializer.save(board_no=post, user_no=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET'])
def user_detail(request):
    # 인증된 사용자의 정보를 반환합니다.
    if request.user.is_authenticated:
        user = request.user
        # 사용자의 상세 정보를 담은 데이터, 필요한 정보만 선택하여 반환해야 합니다.
        user_data = {
            'id': user.id,  # 사용자의 아이디
            'user_no': user.user_no,  # 사용자의 고유 번호
            # 필요에 따라 추가 정보를 여기에 포함시킬 수 있습니다.
        }
        return Response(user_data)
    else:
        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)        
    

# 댓글 삭제
@api_view(['DELETE'])
def delete_comment(request, id):
    comment = get_object_or_404(Comment, pk=id)
    comment.delete()
    return Response({'message': '댓글이 성공적으로 삭제되었습니다.'})

# 댓글 수정
@api_view(['PUT'])
def update_comment(request, id):
    comment = get_object_or_404(Comment, pk=id)
    serializer = CommentSerializer(comment, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    