from django.db import models

class ChatSession(models.Model):
    id = models.IntegerField(primary_key=True)
    sesseion_title = models.CharField(max_length=255)
    chat_content = models.TextField()
    user_no = models.ForeignKey('account.User', models.DO_NOTHING, db_column='user_no')

    class Meta:
        managed = False
        db_table = 'chat_session'

