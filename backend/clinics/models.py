from django.db import models

# Create your models here.

from django.db import models


class Clinic(models.Model):
    CATEGORY_CHOICES = [
        ("general_practice", "General Practice"),
        ("specialist", "Specialist"),
        ("allied_health", "Allied Health"),
        ("unknown", "Unknown"),
    ]

    QUALITY_CHOICES = [
        ("good", "Good"),
        ("needs_review", "Needs Review"),
        ("duplicate", "Possible Duplicate"),
    ]

    name = models.CharField(max_length=200)
    address = models.CharField(max_length=255, blank=True)
    suburb = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=10, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    email = models.EmailField(blank=True)
    website = models.URLField(blank=True)
    source_url = models.URLField(blank=True)
    description = models.TextField(blank=True)

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="unknown",
    )

    quality_status = models.CharField(
        max_length=20,
        choices=QUALITY_CHOICES,
        default="needs_review",
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name