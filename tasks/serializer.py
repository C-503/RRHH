from rest_framework import serializers
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA

class EmpleadoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Empleado
        fields = '__all__' 


class NominaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Nomina
        fields = '__all__'


class PrestacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prestaciones
        fields = '__all__'


class AsistenciasSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asistencias
        fields = '__all__'


class ReporteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reporte
        fields = '__all__'


class ProductividadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Productividad
        fields = '__all__'


class ModuloASerializer(serializers.ModelSerializer):
    class Meta:
        model = ModuloA
        fields = '__all__'


