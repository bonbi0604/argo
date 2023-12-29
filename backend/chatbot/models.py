# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models
from account.models import User

class ChatSession(models.Model):
    session_title = models.CharField(max_length=255, blank=True, null=True)
    chat_content = models.TextField(blank=True, null=True)
    user_no = models.ForeignKey(User, on_delete=models.CASCADE, db_column='user_no', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'chat_session'
