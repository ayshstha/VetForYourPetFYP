# Generated by Django 5.1.5 on 2025-03-31 05:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0049_remove_appointment_unique_time_slot_per_date_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('pending', 'Pending'), ('confirmed', 'Confirmed'), ('cancelled', 'Cancelled'), ('completed', 'Completed'), ('incomplete', 'Incomplete')], default='pending', max_length=20),
        ),
    ]
