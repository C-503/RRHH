from django.contrib import admin
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA

admin.site.register(Empleado)
admin.site.register(Nomina)
admin.site.register(Prestaciones)
admin.site.register(Asistencias)
admin.site.register(Reporte)
admin.site.register(Productividad)
admin.site.register(ModuloA)

# Register your models here.
