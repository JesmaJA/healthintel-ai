from django.shortcuts import render

# Create your views here.

from rest_framework import generics, filters
from rest_framework.permissions import AllowAny

from .models import Clinic
from .serializers import ClinicSerializer


class ClinicListCreateView(generics.ListCreateAPIView):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [AllowAny]

    filter_backends = [filters.SearchFilter, filters.OrderingFilter]

    search_fields = [
        "name",
        "address",
        "suburb",
        "state",
        "category",
    ]

    ordering_fields = ["name", "state", "created_at"]
    ordering = ["name"]


class ClinicDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Clinic.objects.all()
    serializer_class = ClinicSerializer
    permission_classes = [AllowAny]