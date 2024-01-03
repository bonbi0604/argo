from rest_framework import serializers
from .models import NoticeComment, Post, Comment, FileModel, Notice, NoticeFile
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
        
class NoticeFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = NoticeFile
        fields = ['src', 'name', 'notice_no']

class NoticeSerializer(serializers.ModelSerializer):
    files = NoticeFileSerializer(many=True, read_only=True)

    class Meta:
        model = Notice
        fields = ['id', 'title', 'content', 'author', 'timestamp', 'files']

    def create(self, validated_data):
        # 게시글 생성 로직
        notice = Notice.objects.create(**validated_data)
        files_data = self.context['request'].FILES
        files_name = self.context['request'].data.getlist('file_name')
        for file_data, file_name in zip(files_data.getlist('file_field_name'), files_name):
            NoticeFile.objects.create(notice_no=notice, src=file_data, name=file_name)
        return notice

    def validate(self, data):
        """
        공지사항 데이터의 유효성 검증 로직입니다.
        예를 들어, 제목과 내용이 비어 있지 않은지, 파일 이름이 올바른 형식인지 등을 검증할 수 있습니다.
        """

        # 제목 필드 검증
        if not data.get('title'):
            raise serializers.ValidationError({"title": "제목은 비어 있을 수 없습니다."})

        # 내용 필드 검증
        if not data.get('content'):
            raise serializers.ValidationError({"content": "내용은 비어 있을 수 없습니다."})

        # 파일 이름 검증
        files_name = self.context['request'].data.getlist('file_name')
        for file_name in files_name:
            if not file_name.endswith('.hwp'):
                raise serializers.ValidationError({"file_name": "모든 파일은 '.hwp' 확장자를 가져야 합니다."})

        return data
class NoticeCommentSerializer(serializers.ModelSerializer):
    user_no = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), required=False)

    class Meta:
        model = NoticeComment
        fields = ['comm_no', 'notice_no', 'user_no', 'content', 'timestamp']
