# from django.contrib.auth.models import User
from account.models import User
# from django.conf import settings
from rest_framework import serializers
from .models import Comment
from noticeboard.models import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'timestamp']

class CommentSerializer(serializers.ModelSerializer):
    # 필요한 경우 user_no 필드를 User 모델을 참조하도록 변경합니다.
    user_no = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Comment
        fields = ['comm_no', 'board_no', 'user_no', 'content', 'timestamp']
