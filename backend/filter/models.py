from django.db import models
from account.models import User
from django.conf import settings


class Answer(models.Model):
    # `content`, `question_no`, `answer_no`, `is_correct`
    answer_no = models.AutoField(primary_key=True)
    question_no
    is_correct
    content
    def __str__(self):
        return self.text

class Question(models.Model):
    # `question_no`, `korean`, `content`, `category_no`
    text = models.TextField()

    def __str__(self):
        return self.text

class Result(models.Model):
    # `result_no`, `user_no`, `answer_no`, `timestamp`, `is_correct`, `content`, `question_no`
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    score = models.IntegerField()

    def __str__(self):
        return f"{self.user} - {self.question} - {self.score}"
