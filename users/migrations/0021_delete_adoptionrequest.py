# Generated by Django 5.1.5 on 2025-02-16 16:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0020_adoptionrequest'),
    ]

    operations = [
        migrations.DeleteModel(
            name='AdoptionRequest',
        ),
    ]
