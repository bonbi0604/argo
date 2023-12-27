from django.db import models

class ChatSession(models.Model):
    session_title = models.CharField(max_length=255, null = True)
    chat_content = models.TextField()

    def __str__(self):
        return self.session_title