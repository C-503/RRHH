from rest_framework import viewsets
from .models import Empleado, Nomina, Prestaciones, Asistencias, Reporte, Productividad, ModuloA, indemnizacion, prestacion_dias
from .serializer import EmpleadoSerializer, NominaSerializer, PrestacionesSerializer, AsistenciasSerializer, ReporteSerializer, ProductividadSerializer, ModuloASerializer, IndemnizacionSerializer, PrestacionDiasSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import timedelta
from django.utils import timezone
from django.db.models import Sum, Count, F, FloatField, ExpressionWrapper


class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer


class NominaViewSet(viewsets.ModelViewSet):
    queryset = Nomina.objects.all()
    serializer_class = NominaSerializer

    @action(detail=False, methods=['get'], url_path='salario-promedio/(?P<empleado_id>[^/.]+)')
    def salario_promedio(self, request, empleado_id=None):
        hoy = timezone.now().date()
        hace_seis_meses = hoy - timedelta(days=180)

        # Filtra nóminas del empleado en los últimos 6 meses
        nominas = Nomina.objects.filter(
            empleado_id=empleado_id,
            nom_fecha__gte=hace_seis_meses
        )

        # Calcula el total de ingresos (sueldo + horas extra + bono + incentivos)
        nominas = nominas.annotate(
            total=ExpressionWrapper(
                F('nomina_sueldo') + F('nomina_horasextra') + F('nomina_bono') + F('nomina_incentivos'),
                output_field=FloatField()
            )
        )

        total_ingresos = nominas.aggregate(suma=Sum('total'))['suma'] or 0
        cantidad_nominas = nominas.aggregate(conteo=Count('id'))['conteo'] or 1

        salario_promedio = total_ingresos / cantidad_nominas

        return Response({
            'empleado_id': empleado_id,
            'salario_promedio': round(salario_promedio, 2),
            'total_ingresos': round(total_ingresos, 2),
            'numero_nominas': cantidad_nominas
        })

    @action(detail=False, methods=['get'], url_path='empleado/(?P<empleado_id>[^/.]+)')
    def nominas_por_empleado(self, request, empleado_id=None):
        nominas = self.queryset.filter(empleado_id=empleado_id)
        serializer = self.get_serializer(nominas, many=True)
        return Response(serializer.data)
    
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


class IndemnizacionViewSet(viewsets.ModelViewSet):
    queryset = indemnizacion.objects.all()
    serializer_class = IndemnizacionSerializer

class PrestacionDiasViewSet(viewsets.ModelViewSet):
    queryset = prestacion_dias.objects.all()
    serializer_class = PrestacionDiasSerializer


# Create your views here.
