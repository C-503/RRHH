# Generated by Django 5.0.13 on 2025-03-22 01:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='empleado',
            name='id_departamento',
        ),
        migrations.RemoveField(
            model_name='empleado',
            name='id_puesto',
        ),
        migrations.DeleteModel(
            name='Departamento',
        ),
        migrations.DeleteModel(
            name='Puesto',
        ),
    ]
