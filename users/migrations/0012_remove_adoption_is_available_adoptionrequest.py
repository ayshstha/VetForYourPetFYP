# Generated by Django 5.1.5 on 2025-02-15 08:30

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0011_delete_adoptionrequest'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adoption',
            name='is_available',
        ),
        migrations.CreateModel(
            name='AdoptionRequest',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
                ('status', models.CharField(choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending', max_length=10)),
                ('terms_accepted', models.BooleanField(default=False)),
                ('preferred_date', models.DateField()),
                ('preferred_time', models.TimeField()),
                ('dog', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='adoption_requests', to='users.adoption')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='adoption_requests', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
