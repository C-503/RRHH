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
    

class Nomina(models.Model):
    nomina_id = models.AutoField(primary_key=True)
    empleado = models.ForeignKey('Empleado', on_delete=models.CASCADE)
    nomina_sueldo = models.DecimalField(max_digits=10, decimal_places=2)
    nomina_horasextra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nomina_bono = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nomina_incentivos = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nomina_isr = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nomina_iggs = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    nomina_tipo = models.CharField(max_length=10, choices=[
        ('Mensual', 'Mensual'),
        ('Semanal', 'Semanal'),
        ('Quincenal', 'Quincenal'),
    ])
    nom_fecha = models.DateField()

    def __str__(self):
        return f"{self.nomina_tipo} - {self.empleado.nombre}"


class Prestaciones(models.Model):
    prestacion_id = models.AutoField(primary_key=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    prestacion_tipo = models.CharField(max_length=50)
    prestacion_monto = models.DecimalField(max_digits=10, decimal_places=2)
    def __str__(self):
        return f"{self.prestacion_tipo} - {self.empleado.nombre}"

class Asistencias(models.Model):
    asistencia_id = models.AutoField(primary_key=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    asistencia_fecha = models.DateField()
    asistencia_h_entrada = models.TimeField()
    asistencia_h_salida = models.TimeField(null=True, blank=True)
    def __str__(self):
        return f"{self.asistencia_fecha} - {self.empleado.nombre}"

class Reporte(models.Model):
    reporte_id = models.AutoField(primary_key=True)
    empleado = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    reporte_tipo = models.CharField(max_length=50, null=True, blank=True)
    reporte_desc = models.TextField()
    reporte_fecha = models.DateField()
    def __str__(self):
        return f"{self.reporte_tipo} - {self.empleado.nombre}"

class Productividad(models.Model):
    Productivo_id = models.AutoField(primary_key=True)
    emplaod = models.ForeignKey(Empleado, on_delete=models.CASCADE)
    inpro_TC = models.IntegerField()
    inpro_horasT = models.IntegerField()
    inpro_ev = models.DecimalField(max_digits=5, decimal_places=2)
    def __str__(self):
        return f"{self.inpro_TC} - {self.emplaod.nombre}"

class ModuloA(models.Model):
    modulo_id = models.AutoField(primary_key=True)
    modulo_nombre = models.CharField(max_length=50)
    modulo_desc = models.TextField(null=True, blank=True)
    def __str__(self):
        return self.modulo_nombre
    

