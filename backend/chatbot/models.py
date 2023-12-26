from django.db import models

class ChatSession(models.Model):
    session_id = models.CharField(max_length=100)
    chat_content = models.TextField()

    def __str__(self):
        return self.session_id