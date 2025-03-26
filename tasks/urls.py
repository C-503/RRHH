from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from .views import EmpleadoViewSet
from django.http import HttpResponse

#api versioning
router = routers.DefaultRouter()
router.register(r'empleados', EmpleadoViewSet)

schema_view = get_schema_view(
    openapi.Info(
        title="Tasks API",
        default_version='v1',
        description="Tasks API documentation",
        contact=openapi.Contact(email="contact@tasks.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
)

urlpatterns = [
  #  path("", lambda request: HttpResponse("¡Bienvenido a la API de Tasks!")),
    path("api/v1/", include(router.urls)),
    path('docs/', schema_view.as_view(), name='swagger-docs'),
]

#venv\Scripts\Activate.ps1
