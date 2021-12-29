# Generated by Django 3.2.9 on 2021-11-23 13:01

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='FileUpload',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.TextField(max_length=40, null=True)),
                ('explain', models.TextField(max_length=40, null=True)),
                ('language', models.TextField(max_length=40, null=True)),
                ('code', models.FileField(upload_to='')),
            ],
        ),
    ]
