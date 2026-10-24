from django.urls import path
from .views import ClinicListCreateView, ClinicDetailView

urlpatterns = [
    path("", ClinicListCreateView.as_view(), name="clinic-list"),
    path("<int:pk>/", ClinicDetailView.as_view(), name="clinic-detail"),
]