from rest_framework import viewsets
from .models import Empleado
from .serializer import EmpleadoSerializer

class EmpleadoViewSet(viewsets.ModelViewSet):
    queryset = Empleado.objects.all()
    serializer_class = EmpleadoSerializer


# Create your views here.
