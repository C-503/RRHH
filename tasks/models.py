from django.db import models

class Empleado(models.Model):
    id_empleado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    departamento = models.CharField(max_length=50)
    pueesto = models.CharField(max_length=50)
    salario_base = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_contratacion = models.DateField()
    estatus = models.CharField(max_length=20, default='Activo')
    def __str__(self):
        return self.nombre
