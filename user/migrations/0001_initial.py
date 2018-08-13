# Generated by Django 2.0.7 on 2018-08-13 09:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Host',
            fields=[
                ('h_id', models.AutoField(primary_key=True, serialize=False)),
                ('phone', models.CharField(max_length=20, unique=True)),
                ('rating', models.PositiveIntegerField(default=0)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='User',
            fields=[
                ('u_id', models.AutoField(primary_key=True, serialize=False)),
                ('username', models.CharField(max_length=20, unique=True)),
                ('password', models.CharField(default='123456', max_length=20)),
                ('firstname', models.CharField(default='John', max_length=20)),
                ('lastname', models.CharField(default='Doe', max_length=20)),
                ('birthday', models.DateField()),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.AddField(
            model_name='host',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User'),
        ),
    ]
