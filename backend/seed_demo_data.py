"""
Generate 150 synthetic clinic records for the HealthIntel AI demo.

Run from the folder containing manage.py:
    python manage.py shell < seed_demo_data.py

All names and contact details are fictional test data.
"""
import random
from clinics.models import Clinic

random.seed(42)

suburbs_by_state = {
    "NSW": ["Sydney", "Newcastle", "Wollongong", "Parramatta", "Dubbo"],
    "VIC": ["Melbourne", "Geelong", "Ballarat", "Bendigo", "Shepparton"],
    "QLD": ["Brisbane", "Gold Coast", "Townsville", "Cairns", "Toowoomba"],
    "WA": ["Perth", "Bunbury", "Geraldton", "Albany", "Kalgoorlie"],
    "SA": ["Adelaide", "Mount Gambier", "Whyalla", "Port Augusta", "Gawler"],
    "TAS": ["Hobart", "Launceston", "Devonport", "Burnie", "Kingston"],
    "ACT": ["Canberra", "Belconnen", "Gungahlin", "Tuggeranong", "Woden"],
    "NT": ["Darwin", "Palmerston", "Alice Springs", "Katherine", "Nhulunbuy"],
}
states = list(suburbs_by_state)
prefixes = [
    "Riverbank", "Coastal", "Green Valley", "Northern", "Sunrise",
    "Lakeside", "Central", "Tropical", "Westside", "Harmony",
    "Meadow", "Silverline", "Oakwood", "Brightpath", "Horizon",
    "Parkview", "Bluewater", "Summit", "Willow", "Evergreen",
    "Cedar", "Highland", "Seaview", "Brookside", "Maple",
    "Pioneer", "Clearwater", "Rosewood", "Fairview", "Springfield",
]
suffixes = [
    ("Family Clinic", "general_practice"),
    ("Medical Centre", "general_practice"),
    ("General Practice", "general_practice"),
    ("Specialist Clinic", "specialist"),
    ("Specialist Centre", "specialist"),
    ("Physiotherapy", "allied_health"),
    ("Allied Health Centre", "allied_health"),
    ("Wellness Clinic", "unknown"),
]

created_count = 0
existing_count = 0
created_records = []

# Generate 150 deterministic, unique demo records.
for i in range(1, 151):
    state = states[(i - 1) % len(states)]
    suburb_list = suburbs_by_state[state]
    suburb = suburb_list[((i - 1) // len(states)) % len(suburb_list)]
    prefix = prefixes[(i - 1) % len(prefixes)]
    suffix, category = suffixes[(i - 1) % len(suffixes)]
    name = f"Demo {prefix} {suburb} {suffix} {i:03d}"

    # Intentionally introduce some missing data to exercise quality checks.
    address = "" if i % 17 == 0 else f"{i + 10} Example Street"
    phone = "" if i % 19 == 0 else f"0{(i % 8) + 2}0000{i:04d}"
    email = "" if i % 13 == 0 else f"demo.clinic{i:03d}@example.com"

    data = {
        "name": name,
        "address": address,
        "suburb": suburb,
        "state": state,
        "phone": phone,
        "email": email,
        "website": "",
        "source_url": "https://example.com/",
        "description": "SYNTHETIC DEMO RECORD — not a verified healthcare provider.",
        "category": category,
        "quality_status": "needs_review",
    }

    clinic, created = Clinic.objects.get_or_create(
        name=name,
        defaults=data,
    )
    if created:
        created_count += 1
        created_records.append(clinic)
    else:
        existing_count += 1

# Add several deliberately similar pairs at the same address to test matching.
# The names are synthetic and use a shared example address.
duplicate_pairs = [
    ("Demo Test Harbour Family Clinic", "Demo Test Harbour Family Clinik"),
    ("Demo Test Green Valley Physiotherapy", "Demo Test Green Valley Physio"),
    ("Demo Test Coastal Specialist Centre", "Demo Test Coastal Specialist Ctr"),
]
for pair_index, pair in enumerate(duplicate_pairs, start=1):
    shared_address = f"{100 + pair_index} Duplicate Test Road"
    for name in pair:
        data = {
            "name": name,
            "address": shared_address,
            "suburb": "Sydney",
            "state": "NSW",
            "phone": f"020000{pair_index:04d}",
            "email": "",
            "website": "",
            "source_url": "https://example.com/",
            "description": "SYNTHETIC DUPLICATE-TEST RECORD — not a real provider.",
            "category": "general_practice",
            "quality_status": "needs_review",
        }
        _, created = Clinic.objects.get_or_create(name=name, defaults=data)
        if created:
            created_count += 1
        else:
            existing_count += 1

print("HealthIntel AI demo-data seeding complete.")
print(f"New records created this run: {created_count}")
print(f"Records already present (not duplicated): {existing_count}")
print(f"Total clinic records in database: {Clinic.objects.count()}")
print("All generated entries are synthetic demonstration records.")
