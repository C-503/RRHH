from django.contrib import admin
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA, indemnizacion, prestacion_dias

admin.site.register(Empleado)
admin.site.register(Nomina)
admin.site.register(Prestaciones)
admin.site.register(Asistencias)
admin.site.register(Reporte)
admin.site.register(Productividad)
admin.site.register(ModuloA)
admin.site.register(indemnizacion)
admin.site.register(prestacion_dias)

# Register your models here.
