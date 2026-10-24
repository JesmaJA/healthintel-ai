from django.shortcuts import render

# Create your views here.

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from clinics.models import Clinic
from .services.quality_service import (
    validate_clinic,
    find_possible_duplicates,
)


class QualityReportView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        clinics = list(Clinic.objects.all())

        records = []
        for clinic in clinics:
            issues = validate_clinic(clinic)

            records.append({
                "id": clinic.id,
                "name": clinic.name,
                "issues": issues,
                "status": "needs_review" if issues else "good",
            })

        duplicates = find_possible_duplicates(clinics)

        return Response({
            "total_clinics": len(clinics),
            "records_needing_review": sum(
                bool(record["issues"]) for record in records
            ),
            "duplicate_candidates": len(duplicates),
            "records": records,
            "duplicates": duplicates,
        })