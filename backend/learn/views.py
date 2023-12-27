from django.shortcuts import render
from .models import Question, Answer, Category, Result
from django.db.models import Max
import random
from django.http import JsonResponse


# fk로 참조해서 테이블 들어간 후 틀린 문제 뽑아냄
def wrong_list():
    wrong = Result.objects.filter(is_correct = 0)
    wrong = [{i+1 : result.question_no.content} for i,result in enumerate(wrong)]
    return wrong

# def search_list(str):
#     search = Result.objects.filter(is_correct = 0)
#     search = [{i+1 : result.question_no.content} for i, result in enumerate(search)]
#     return search
