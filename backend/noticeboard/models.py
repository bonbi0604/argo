from django.db import models

from django.contrib.auth import get_user_model

User = get_user_model()

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Comment(models.Model):
    comm_no = models.AutoField(primary_key=True)
    board_no = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user_no = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.CharField(max_length=45)
    timestamp = models.DateTimeField(auto_now_add=True)    