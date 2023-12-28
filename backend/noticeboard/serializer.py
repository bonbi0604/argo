# from django.contrib.auth.models import User
from account.models import User
# from django.conf import settings
from rest_framework import serializers
from .models import Comment
from noticeboard.models import Post


class PostSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_id', 'timestamp', 'file_url']

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return None

class CommentSerializer(serializers.ModelSerializer):
    user_no = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ['comm_no', 'board_no', 'user_no', 'content', 'timestamp']