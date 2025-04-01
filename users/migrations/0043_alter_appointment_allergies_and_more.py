# Generated by Django 5.1.5 on 2025-03-29 12:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0042_alter_appointment_options_alter_appointment_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='allergies',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='current_medications',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='medical_history',
            field=models.TextField(blank=True, default=''),
        ),
        migrations.AlterField(
            model_name='appointment',
            name='special_notes',
            field=models.TextField(blank=True, default=''),
        ),
    ]
