from django.contrib import admin

# Register your models here.

from django.contrib import admin
from .models import Clinic


@admin.register(Clinic)
class ClinicAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "state",
        "category",
        "quality_status",
    )

    search_fields = ("name", "suburb", "state", "email")
    list_filter = ("state", "category", "quality_status")