# Generated by Django 3.2.13 on 2022-09-21 21:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('splManager', '0009_task_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='priority',
            field=models.CharField(max_length=20),
        ),
    ]
