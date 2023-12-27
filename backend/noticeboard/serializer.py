# from django.contrib.auth.models import User
from account.models import User
# from django.conf import settings
from rest_framework import serializers

from noticeboard.models import Post


class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.id')

    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'content', 'timestamp']


