from django.core.management.base import BaseCommand
from clinics.models import Clinic
from clinics.sample_data import SAMPLE_CLINICS


class Command(BaseCommand):
    help = "Load fictional HealthIntel AI sample clinics"

    def handle(self, *args, **options):
        created_count = 0

        for item in SAMPLE_CLINICS:
            _, created = Clinic.objects.get_or_create(
                name=item["name"],
                address=item["address"],
                defaults=item,
            )

            if created:
                created_count += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Sample data loaded. New records: {created_count}"
            )
        )