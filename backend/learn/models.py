# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from account.models import User


class Question(models.Model):
    content = models.TextField(blank=True, null=True)
    question_no = models.IntegerField(primary_key=True)
    category_no = models.ForeignKey('Category', models.DO_NOTHING, db_column='category_no', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Question'


class Answer(models.Model):
    content = models.TextField(blank=True, null=True)
    question_no = models.ForeignKey(Question, models.DO_NOTHING, db_column='question_no', blank=True, null=True)
    answer_no = models.IntegerField(primary_key=True)
    is_correct = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Answer'


class Category(models.Model):
    category_no = models.IntegerField(primary_key=True)
    classification = models.TextField(blank=True, null=True)
    category_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Category'

class Result(models.Model):
    result_no = models.IntegerField(primary_key=True)
    user_no = models.ForeignKey(User, models.DO_NOTHING, db_column='user_no')
    answer_no = models.ForeignKey(Answer, models.DO_NOTHING, db_column='answer_no')
    timestamp = models.DateTimeField()
    is_correct = models.IntegerField()
    content = models.TextField()
    question_no = models.ForeignKey(Question, models.DO_NOTHING, db_column='question_no')

    class Meta:
        managed = False
        db_table = 'Result'
