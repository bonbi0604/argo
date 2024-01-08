# Generated by Django 3.2.23 on 2024-01-08 08:20

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('content', models.TextField(blank=True, null=True)),
                ('answer_no', models.AutoField(primary_key=True, serialize=False)),
                ('is_correct', models.IntegerField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Answer',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('category_no', models.AutoField(primary_key=True, serialize=False)),
                ('classification', models.TextField(blank=True, null=True)),
                ('category_name', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'Category',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Comm_History',
            fields=[
                ('history_no', models.AutoField(db_column='history_no', primary_key=True, serialize=False)),
                ('title', models.CharField(blank=True, db_column='title', max_length=255, null=True)),
                ('code', models.PositiveSmallIntegerField(blank=True, db_column='code', null=True)),
                ('timestamp', models.DateTimeField(auto_now_add=True, db_column='timestamp')),
            ],
            options={
                'db_table': 'Comm_History',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Comm_History_Sentence',
            fields=[
                ('sentence_no', models.AutoField(db_column='sentence_no', primary_key=True, serialize=False)),
                ('speaker', models.CharField(blank=True, db_column='speaker', max_length=32, null=True)),
                ('sentence', models.TextField(blank=True, db_column='sentence', null=True)),
                ('label_clear', models.PositiveSmallIntegerField(blank=True, db_column='label_clear', default=None, null=True)),
                ('label_concise', models.PositiveSmallIntegerField(blank=True, db_column='label_concise', default=None, null=True)),
                ('label_concrete', models.PositiveSmallIntegerField(blank=True, db_column='label_concrete', default=None, null=True)),
                ('label_correct', models.PositiveSmallIntegerField(blank=True, db_column='label_correct', default=None, null=True)),
                ('label_coherent', models.PositiveSmallIntegerField(blank=True, db_column='label_coherent', default=None, null=True)),
                ('label_complete', models.PositiveSmallIntegerField(blank=True, db_column='label_complete', default=None, null=True)),
                ('label_courteous', models.PositiveSmallIntegerField(blank=True, db_column='label_courteous', default=None, null=True)),
                ('timestamp', models.DateTimeField(blank=True, db_column='timestamp', null=True)),
                ('label_check', models.PositiveSmallIntegerField(blank=True, db_column='label_check', default=2, null=True)),
            ],
            options={
                'db_table': 'Comm_History_Sentence',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('content', models.CharField(blank=True, db_collation='utf8mb4_unicode_ci', max_length=500, null=True)),
                ('question_no', models.IntegerField(primary_key=True, serialize=False)),
                ('korean', models.CharField(blank=True, db_collation='utf8mb4_unicode_ci', max_length=255, null=True)),
            ],
            options={
                'db_table': 'Question',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='Result',
            fields=[
                ('result_no', models.AutoField(db_column='result_no', primary_key=True, serialize=False)),
                ('timestamp', models.DateTimeField()),
                ('is_correct', models.IntegerField()),
                ('content', models.TextField()),
            ],
            options={
                'db_table': 'Result',
                'managed': False,
            },
        ),
    ]
