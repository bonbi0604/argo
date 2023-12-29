from rest_framework import serializers
from .models import Comment, Post, FileModel
from account.models import User

class FileModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FileModel
        fields = ['src', 'name', 'board_no']

class PostSerializer(serializers.ModelSerializer):
    files = FileModelSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author_id', 'timestamp', 'files']

    # 게시글 생성 시 파일 데이터와 파일 이름을 저장합니다.
    def create(self, validated_data):
        files_data = self.context['request'].FILES
        files_name = self.context['request'].data.getlist('file_name')  # 파일 이름을 위한 입력 필드 이름
        post = Post.objects.create(**validated_data)
        for file_data, file_name in zip(files_data.getlist('file_field_name'), files_name):  # 필드 이름에 맞게 조정하세요
            FileModel.objects.create(board_no=post, src=file_data, name=file_name)
        return post

class CommentSerializer(serializers.ModelSerializer):
    user_no = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = Comment
        fields = ['comm_no', 'board_no', 'user_no', 'content', 'timestamp']
