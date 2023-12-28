from django.db import models
from django.conf import settings

class ChatSession(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    session_title = models.CharField(max_length=255)
    chat_content = models.TextField()

    def __str__(self):
        return self.session_title