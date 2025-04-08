from rest_framework import viewsets
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA
from .serializer import EmpleadoSerializer, NominaSerializer, PrestacionesSerializer, AsistenciasSerializer, ReporteSerializer, ProductividadSerializer, ModuloASerializer

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer


class NominaViewSet(viewsets.ModelViewSet):
    queryset = Nomina.objects.all()
    serializer_class = NominaSerializer


class PrestacionesViewSet(viewsets.ModelViewSet):
    queryset = Prestaciones.objects.all()
    serializer_class = PrestacionesSerializer


class AsistenciasViewSet(viewsets.ModelViewSet):
    queryset = Asistencias.objects.all()
    serializer_class = AsistenciasSerializer


class ReporteViewSet(viewsets.ModelViewSet):
    queryset = Reporte.objects.all()
    serializer_class = ReporteSerializer


class ProductividadViewSet(viewsets.ModelViewSet):
    queryset = Productividad.objects.all()
    serializer_class = ProductividadSerializer


class ModuloAViewSet(viewsets.ModelViewSet):
    queryset = ModuloA.objects.all()
    serializer_class = ModuloASerializer


# Create your views here.
