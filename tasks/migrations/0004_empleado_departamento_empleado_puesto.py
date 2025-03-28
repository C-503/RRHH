# Generated by Django 5.0.13 on 2025-03-26 23:02

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0003_departamento_puesto'),
    ]

    operations = [
        migrations.AddField(
            model_name='empleado',
            name='departamento',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.departamento'),
        ),
        migrations.AddField(
            model_name='empleado',
            name='puesto',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='tasks.puesto'),
        ),
    ]
