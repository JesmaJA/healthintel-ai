from django.urls import path
from .views import QualityReportView

urlpatterns = [
    path("quality/", QualityReportView.as_view(), name="quality-report"),
]