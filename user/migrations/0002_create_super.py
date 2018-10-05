# Generated by Django 2.1.1 on 2018-10-03 12:25

from django.db import migrations
from user.models import User, Host


def create_admin(apps, schema_editor):
    admin = User(
        username='admin',
        password='123',
        email='admin@miniairbnb.com',
        status=User.ADMIN)
    admin.save()


def create_host(apps, schema_editor):
    host = User(
        username='host',
        password='123',
        email='host@miniairbnb.com',
        status=User.HOST)
    host.save()
    host = Host(user=host, phone='0000000000')
    host.save()


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(create_admin),
        migrations.RunPython(create_host),
    ]