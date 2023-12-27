from rest_framework import serializers
from .models import ChatSession

class ChatSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatSession
        fields = ['id', 'session_id', 'chat_content']