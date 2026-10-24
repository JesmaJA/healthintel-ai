import re
from difflib import SequenceMatcher


def validate_clinic(clinic):
    issues = []

    if not clinic.name.strip():
        issues.append("Missing clinic name")

    if not clinic.address.strip():
        issues.append("Missing address")

    if not clinic.phone.strip():
        issues.append("Missing phone number")
    elif not re.fullmatch(r"[0-9+\s()\-]{7,20}", clinic.phone):
        issues.append("Invalid phone format")

    if clinic.email and not re.fullmatch(
        r"[^@\s]+@[^@\s]+\.[^@\s]+",
        clinic.email,
    ):
        issues.append("Invalid email format")

    if not clinic.source_url.strip():
        issues.append("Missing source URL")

    return issues


def find_possible_duplicates(clinics, threshold=0.90):
    results = []
    records = list(clinics)

    for i, first in enumerate(records):
        for second in records[i + 1:]:
            first_name = first.name.lower().strip()
            second_name = second.name.lower().strip()

            similarity = SequenceMatcher(
                None, first_name, second_name
            ).ratio()

            same_address = (
                first.address.lower().strip()
                == second.address.lower().strip()
            )

            if similarity >= threshold and same_address:
                results.append({
                    "clinic_1_id": first.id,
                    "clinic_1_name": first.name,
                    "clinic_2_id": second.id,
                    "clinic_2_name": second.name,
                    "similarity": round(similarity, 2),
                })

    return results