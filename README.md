# HealthIntel AI — Healthcare Data Intelligence

## Project Overview

HealthIntel AI is a healthcare technology prototype built to organise clinic records, identify data-quality issues, flag potential duplicate records, and present useful data-management insights through a responsive dashboard.

## Problem Statement

Healthcare information can contain missing contact details, inconsistent formatting, and potentially duplicated records. These issues make it harder to maintain organised and reliable datasets.

## Objectives

- Manage clinic records through a web interface.
- Identify missing or incorrectly formatted data.
- Detect potential duplicates using name similarity and address matching.
- Present data-quality findings in a dashboard.
- Demonstrate how AI-assisted development tools can support software development.

## Technology Stack

**Frontend:** React, Vite, JavaScript, CSS  
**Backend:** Python, Django, Django REST Framework  
**Database:** SQLite  
**Development tools:** Git, GitHub, ChatGPT

## Main Features

1. Dashboard with clinic statistics.
2. Clinic directory with search, filtering, pagination, and record management.
3. Data-quality report with validation findings.
4. Potential duplicate detection.
5. Insights page with explainable findings and recommended data-cleanup actions.

## Data and Limitations

The project uses synthetic demonstration records for testing. These records do not represent verified healthcare providers.

The current quality checks and duplicate detection are rule-based. The insights page summarises those results; a live generative AI model is not currently integrated.

This prototype is intended for software demonstration and data-management testing, not clinical decision-making.

## Running the Project

### Backend

1. Open a terminal in the `backend` directory.
2. Create and activate a Python virtual environment.
3. Install dependencies:

   `pip install -r requirements.txt`

4. Apply migrations:

   `python manage.py migrate`

5. Load demonstration data using the documented seeding script.
6. Start Django:

   `python manage.py runserver`

### Frontend

1. Open a second terminal in the `frontend` directory.
2. Install dependencies:

   `npm install`

3. Start the development server:

   `npm run dev`

Ensure the frontend API base URL matches the backend address.

## AI-Assisted Development

ChatGPT was used as a development assistant for implementation guidance, component development, styling, debugging, and project planning. The accompanying prompt documentation should record the actual prompts used and meaningful revisions.

## Future Improvements

- Integrate a genuine AI model for evidence-grounded data-quality explanations.
- Add authentication and role-based access control.
- Add automated tests and performance benchmarks.
- Deploy the application with appropriate security controls.

## Assessment Demonstration

The demonstration covers clinic management, data validation, duplicate detection, dashboard analytics, and responsive interface behaviour.
