# Generated by Django 2.0.7 on 2018-08-13 09:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('user', '0001_initial'),
        ('item', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('o_id', models.AutoField(primary_key=True, serialize=False)),
                ('checkin', models.DateField()),
                ('checkout', models.DateField()),
                ('guest_num', models.PositiveIntegerField(default=1)),
                ('price_per_day', models.PositiveIntegerField()),
                ('comment', models.TextField(max_length=200)),
                ('c_time', models.DateTimeField(auto_now_add=True)),
                ('item_time', models.DateTimeField()),
                ('item', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='item.Item')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='user.User')),
            ],
        ),
    ]
