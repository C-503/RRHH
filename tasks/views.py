from rest_framework import viewsets
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA
from .serializer import EmpleadoSerializer, NominaSerializer, PrestacionesSerializer, AsistenciasSerializer, ReporteSerializer, ProductividadSerializer, ModuloASerializer
from rest_framework.decorators import action
from rest_framework.response import Response


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

    @action(detail=False, methods=['get'], url_path='empleado/(?P<empleado_id>[^/.]+)')
    def por_empleado(self, request, empleado_id=None):
        reportes = Reporte.objects.filter(empleado_id=empleado_id)
        serializer = self.get_serializer(reportes, many=True)
        return Response(serializer.data)

    # Los métodos retrieve, update y destroy ya están incluidos en ModelViewSet
    # No es necesario volver a definirlos a menos que necesites una lógica personalizada
    # def retrieve(self, request, pk=None):
    #     """Obtiene un reporte específico por su ID."""
    #     reporte = self.get_object()  # Esto obtiene el objeto basado en pk
    #     serializer = self.get_serializer(reporte)
    #     return Response(serializer.data)

    # def update(self, request, pk=None):
    #     """Actualiza un reporte específico por su ID."""
    #     reporte = self.get_object()
    #     serializer = self.get_serializer(reporte, data=request.data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data)
    #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def destroy(self, request, pk=None):
    #     """Elimina un reporte específico por su ID."""
    #     reporte = self.get_object()
    #     reporte.delete()
    #     return Response(status=status.HTTP_204_NO_CONTENT)


class ProductividadViewSet(viewsets.ModelViewSet):
    queryset = Productividad.objects.all()
    serializer_class = ProductividadSerializer


class ModuloAViewSet(viewsets.ModelViewSet):
    queryset = ModuloA.objects.all()
    serializer_class = ModuloASerializer


# Create your views here.
