# Generated by Django 4.2.5 on 2024-06-02 11:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0002_alter_user_managers_user_date_joined_user_first_name_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='dashboard_state',
            field=models.JSONField(default=dict),
        ),
    ]
