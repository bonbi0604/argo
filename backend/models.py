# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Answer(models.Model):
    content = models.TextField(blank=True, null=True)
    question_no = models.ForeignKey('Question', models.DO_NOTHING, db_column='question_no', blank=True, null=True)
    answer_no = models.IntegerField(primary_key=True)
    is_correct = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Answer'


class Board(models.Model):
    board_no = models.IntegerField(primary_key=True)
    user_no = models.ForeignKey('User', models.DO_NOTHING, db_column='user_no', blank=True, null=True)
    title = models.CharField(max_length=50, blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Board'


class Category(models.Model):
    category_no = models.IntegerField(primary_key=True)
    classification = models.TextField(blank=True, null=True)
    category_name = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Category'


class Comment(models.Model):
    comment_no = models.IntegerField(primary_key=True)
    board_no = models.ForeignKey(Board, models.DO_NOTHING, db_column='board_no', blank=True, null=True)
    user_no = models.ForeignKey('User', models.DO_NOTHING, db_column='user_no', blank=True, null=True)
    content = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Comment'


class Dept(models.Model):
    dept = models.IntegerField(primary_key=True)
    dept_name = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'Dept'


class Question(models.Model):
    content = models.TextField(blank=True, null=True)
    question_no = models.IntegerField(primary_key=True)
    category_no = models.ForeignKey(Category, models.DO_NOTHING, db_column='category_no', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Question'


class Result(models.Model):
    result_no = models.AutoField(primary_key=True)
    user_no = models.ForeignKey('User', models.DO_NOTHING, db_column='user_no')
    answer_no = models.ForeignKey(Answer, models.DO_NOTHING, db_column='answer_no')
    timestamp = models.DateTimeField()
    is_correct = models.IntegerField()
    content = models.TextField()

    class Meta:
        managed = False
        db_table = 'Result'


class User(models.Model):
    user_no = models.IntegerField(primary_key=True)
    dept = models.ForeignKey(Dept, models.DO_NOTHING, db_column='dept')
    id = models.CharField(max_length=20)
    name = models.CharField(max_length=20)
    password = models.CharField(max_length=128)
    email = models.CharField(max_length=30)
    phone = models.CharField(max_length=20)
    is_admin = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'User'


class AccountUser(models.Model):
    last_login = models.DateTimeField(blank=True, null=True)
    user_no = models.AutoField(primary_key=True)
    id = models.CharField(unique=True, max_length=128)
    password = models.CharField(max_length=128)
    is_admin = models.IntegerField()
    email = models.CharField(unique=True, max_length=255)
    dept = models.IntegerField()
    name = models.CharField(max_length=255)
    phone = models.IntegerField()

    class Meta:
        managed = False
        db_table = 'account_user'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class ConversationClassification(models.Model):
    title_no = models.IntegerField(primary_key=True)
    title = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'conversation_classification'


class ConversationTalk(models.Model):
    title_no = models.IntegerField(primary_key=True)
    conversation_no = models.IntegerField()
    speaker = models.TextField(blank=True, null=True)
    sentence = models.TextField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'conversation_talk'
        unique_together = (('title_no', 'conversation_no'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AccountUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'
