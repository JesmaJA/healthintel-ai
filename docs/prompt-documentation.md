# HealthIntel AI — Prompt Engineering & AI-Assisted Development Documentation

**Project Name:** HealthIntel AI  
**Project Domain:** Healthcare Technology / Data Intelligence  
**Project Type:** Full-Stack Web Application  
**Frontend:** React, Vite, JavaScript, CSS  
**Backend:** Python, Django, Django REST Framework  
**Database:** SQLite  
**AI Development Assistant:** ChatGPT  
**Document Purpose:** To document the prompts, development workflow, iterations, problem-solving approach, and limitations of the project.

---

## 1. Project Overview

HealthIntel AI is a healthcare data intelligence prototype designed to organise clinic records, identify data-quality problems, detect potential duplicate records, and present useful findings through a responsive dashboard.

The project was developed to demonstrate how AI-assisted software development can help turn a practical problem into a working web application.

The application contains five main pages:

1. **Dashboard:** Displays clinic statistics and a summary of data quality.
2. **Clinic Directory:** Supports clinic record management, searching, filtering, and pagination.
3. **Data Quality:** Identifies missing or incorrectly formatted information.
4. **Duplicate Detection:** Flags potentially duplicated clinic records using name similarity and address matching.
5. **AI Insights:** Presents summaries of validation findings and recommended data-cleanup actions.

The current application uses deterministic validation and duplicate-detection rules. The AI Insights page presents findings derived from these rules; it is not connected to a live generative AI model.

## 2. Problem Statement

Healthcare datasets can contain incomplete contact details, inconsistent information, and duplicate records. These problems can make data management difficult and reduce confidence in the quality of a dataset.

The objective was to build a practical application that allows users to manage clinic records and identify potential data-quality problems through a centralised interface.

The project also explores how AI-assisted development tools can help with planning, coding, interface design, debugging, and documentation.

## 3. Objectives

- Build a functional healthcare data-management application.
- Develop a REST API using Django REST Framework.
- Store and manage clinic records using SQLite.
- Implement data validation and quality reporting.
- Identify potential duplicate records using similarity matching.
- Create a responsive React dashboard.
- Generate synthetic records for testing with larger datasets.
- Use ChatGPT to assist with implementation, troubleshooting, and refinement.
- Document prompts and explain the decisions made during development.

## 4. AI Tools and Development Approach

### 4.1 Tool Used

**ChatGPT**

ChatGPT was used as a development assistant to help break the project into manageable tasks, suggest implementation approaches, generate and revise code, troubleshoot errors, and prepare documentation.

### 4.2 Why This Tool Was Chosen

A conversational AI assistant made it possible to develop the project incrementally. Instead of attempting to build the entire application in one step, the work was divided into backend setup, API implementation, frontend pages, data generation, testing, and submission preparation.

The iterative workflow also made it easier to review code, identify problems, and request targeted improvements.

### 4.3 Development Workflow

The general workflow was:

1. Define the project objective and required features.
2. Ask ChatGPT for implementation guidance.
3. Implement the suggested code in the project.
4. Run the application and inspect the results.
5. Identify errors or missing functionality.
6. Provide follow-up prompts with specific requirements.
7. Test the revised implementation.
8. Document the completed features and remaining limitations.

**Important:** ChatGPT-assisted development does not mean every feature in the application is powered by AI. The current data-quality and duplicate-detection functionality is rule-based.

---

## 5. Prompt Documentation

The following sections provide representative prompts aligned with the development tasks undertaken in this project. They should be checked against the actual conversation history before submission so that the final document accurately reflects the prompts used.

### 5.1 Project Idea and Requirements

**Objective:** Select a suitable healthcare technology problem and define a manageable full-stack project.

**Prompt:**

> I need to build a project for an AI Skills and Prompt Engineering Assessment in the healthcare or technology domain. Suggest a practical project that demonstrates problem-solving, technical implementation, and useful real-world functionality. I want to use Django, React, and SQLite. Explain the project idea, problem statement, main features, architecture, and implementation steps.

**Purpose:**

This prompt establishes the problem domain, technical stack, and expected outcome before implementation begins.

**Development decision:**

HealthIntel AI was selected as a clinic data-management and intelligence prototype. The scope was divided into clinic management, data validation, duplicate detection, and dashboard-based reporting.

**Expected outcome:**

A clearly defined project that can be implemented, tested, and demonstrated within the assessment process.

### 5.2 Backend Architecture and Django Setup

**Objective:** Establish a maintainable backend structure.

**Prompt:**

> Help me build the backend for HealthIntel AI using Python, Django, Django REST Framework, and SQLite. Suggest a clean project structure with separate apps for clinic management, intelligence, and analytics. Explain the purpose of each app and provide the setup commands step by step for Windows.

**Purpose:**

The prompt requests a structured backend rather than placing all application logic in a single file.

**Implementation approach:**

The project uses Django apps to separate clinic data management from intelligence-related functionality. This separation makes the code easier to understand and extend.

The backend includes models, serializers, views, URL routing, and management commands.

**Expected outcome:**

A backend structure that supports API development and future extensions.

### 5.3 Clinic Data Model

**Objective:** Define the information required to manage clinic records.

**Prompt:**

> Create a Django Clinic model for a healthcare data intelligence application. Include clinic name, address, suburb, Australian state, phone, email, website, source URL, description, clinic category, quality status, created timestamp, and updated timestamp. Include suitable field types, sensible defaults, and readable model names.

**Purpose:**

The model provides a consistent structure for clinic information and supports data validation and filtering.

**Implementation approach:**

A Django model was created with fields for clinic details, category choices, quality-status choices, and timestamps. A serializer exposes the model through the REST API.

**Expected outcome:**

A structured database table that supports clinic creation, retrieval, updating, and deletion.

### 5.4 Clinic REST API

**Objective:** Make clinic records accessible to the React frontend.

**Prompt:**

> Implement Django REST Framework API endpoints for listing and creating clinic records and retrieving, updating, and deleting individual records. Use a model serializer, search filters, ordering filters, and clear URL routes. Explain how to test the endpoints using a browser or API client.

**Purpose:**

The frontend needs an API to retrieve and manage the records stored in SQLite.

**Implementation approach:**

List/create and detail views were implemented, along with URL routing and search and ordering support.

**Expected outcome:**

API endpoints that allow the frontend to communicate with the backend.

**Security consideration:**

The initial prototype uses permissive access for development. Public deployment requires suitable authentication, permissions, input validation, and protection of write operations.

### 5.5 Data-Quality Validation

**Objective:** Detect incomplete or incorrectly formatted clinic information.

**Prompt:**

> Build a Python service for HealthIntel AI that checks clinic records for missing names, addresses, phone numbers, and source URLs. Validate phone and email formats where applicable. Return a list of understandable validation issues for each record. Keep the validation logic separate from the Django API view.

**Purpose:**

This prompt focuses on a reusable validation service with clear, explainable rules.

**Implementation approach:**

A Python service was implemented to inspect clinic fields and return validation issues. The quality-report endpoint uses those results to summarise records requiring review.

**Expected outcome:**

A data-quality report that can identify records requiring attention and explain why they were flagged.

**Limitation:**

Format checks do not prove that a phone number, email address, website, or clinic record is genuine.

### 5.6 Duplicate Detection

**Objective:** Identify possible duplicate clinic records.

**Prompt:**

> Implement a Python function to detect possible duplicate clinic records using name similarity and address matching. Use Python's difflib SequenceMatcher to calculate name similarity, set a configurable similarity threshold, and return both record IDs, their names, and the similarity score. Explain the limitations of this approach.

**Purpose:**

The project needs to identify likely duplicate records without automatically merging them.

**Implementation approach:**

The duplicate-detection service compares clinic names and checks whether the addresses match. Candidate pairs are returned when the configured similarity threshold is met.

**Expected outcome:**

A list of candidate duplicate pairs that a user can review.

**Limitation:**

This approach can miss duplicates with different addresses or substantially different names. It can also flag similar names that belong to separate organisations. Human verification is required.

### 5.7 Quality-Report API

**Objective:** Combine validation and duplicate detection into a single report.

**Prompt:**

> Create a Django REST API endpoint for the HealthIntel AI quality report. It should return the total number of clinic records, the number requiring review, the number of possible duplicate pairs, individual record issues, and duplicate-pair details. Use the existing validation and duplicate-detection services.

**Purpose:**

The frontend needs a consistent response containing the results required by its dashboard and reporting pages.

**Implementation approach:**

A Django view was implemented to collect clinic records, run the validation service, identify possible duplicates, and return a JSON response.

**Expected outcome:**

A single API endpoint that supports multiple frontend components.

### 5.8 React Application Structure

**Objective:** Organise the frontend into separate pages and reusable components.

**Prompt:**

> Build the React frontend for HealthIntel AI using Vite. Create a shared application layout with a sidebar, header, page container, and React Router navigation. Use separate files for each page and its CSS. Connect the frontend to the Django REST API using Axios. Keep the interface professional and responsive.

**Purpose:**

The prompt establishes a reusable frontend structure and avoids mixing all page logic into one component.

**Implementation approach:**

The frontend uses shared layout components, separate page components, an API service, and React Router.

**Expected outcome:**

A multi-page application with consistent navigation and reusable styling.

### 5.9 Dashboard Development

**Objective:** Provide an overview of clinic records and quality metrics.

**Prompt:**

> Create a responsive HealthIntel AI dashboard in React. Fetch clinic records and quality-report statistics from the Django API. Display metric cards, a searchable clinic table, a quality summary, loading and error states, and a clean healthcare-inspired green theme. Put the JSX and CSS in separate files.

**Purpose:**

The dashboard acts as the main entry point and provides a quick overview of the dataset.

**Implementation approach:**

The dashboard retrieves data through the API service and displays clinic statistics, records, and a quality summary.

**Expected outcome:**

An overview page that updates according to the backend data.

### 5.10 Clinic Directory

**Objective:** Enable users to manage and explore clinic records.

**Prompt:**

> Build a responsive Clinic Directory page for HealthIntel AI. Include search by clinic name, category and state filters, pagination, and a modal form for adding and editing records. Add delete confirmation, basic form validation, loading and error handling, and separate JSX and CSS files. Connect all record operations to the existing Django API.

**Purpose:**

The directory makes the application interactive rather than a static dashboard.

**Implementation approach:**

The page uses the clinic API to retrieve, create, update, and delete records. Search, filtering, pagination, and a modal form support day-to-day data management.

**Expected outcome:**

A directory that allows users to explore and manage the demonstration dataset.

### 5.11 Data Quality Page

**Objective:** Make validation findings easy to review.

**Prompt:**

> Create a responsive Data Quality page that fetches the quality-report API. Show the number of records requiring review, a quality estimate, and the validation issues for each record. Add search, status filters, loading and error states, and a link to the clinic directory. Use separate JSX and CSS files.

**Purpose:**

The page presents backend validation results in a form that users can understand and act upon.

**Implementation approach:**

The page displays summary cards and searchable validation findings. The quality estimate is based on the current rule-based report.

**Expected outcome:**

A dedicated interface for identifying incomplete or incorrectly formatted data.

### 5.12 Duplicate Detection Page

**Objective:** Present candidate duplicate pairs for manual review.

**Prompt:**

> Build a responsive Duplicate Detection page for HealthIntel AI using the existing quality-report API. Show candidate clinic pairs side by side, their record IDs, similarity percentages, a similarity indicator, and filters for minimum similarity. Include loading, error, and empty states. Use separate JSX and CSS files.

**Purpose:**

The prompt turns the duplicate-detection output into an understandable review interface.

**Implementation approach:**

The page retrieves duplicate pairs from the backend and displays names, IDs, and similarity scores.

**Expected outcome:**

A user-friendly interface for reviewing potential duplicates before taking action.

### 5.13 AI Insights Page

**Objective:** Summarise data-quality findings and recommend next steps.

**Prompt:**

> Create an AI Insights page for HealthIntel AI using the existing quality-report API. Display total records, records needing review, a quality estimate, possible duplicate pairs, key findings, and recommended data-cleanup actions. Use separate JSX and CSS files and make the page responsive. Clearly distinguish rule-based findings from actual generative AI output.

**Purpose:**

The page provides a central location for understanding the current data-quality findings and recommended actions.

**Implementation approach:**

The current implementation derives findings from the quality-report response and displays explanatory messages and suggested data-cleanup actions.

**Important limitation:**

The page is not connected to a live generative AI model. The label and content should accurately represent the rule-based implementation.

### 5.14 Synthetic Demo-Data Generation

**Objective:** Test the application with more than 100 records.

**Prompt:**

> Create a Python script for my Django HealthIntel AI project to generate at least 150 synthetic clinic records for testing. Include Australian states and territories, different clinic categories, and some deliberately incomplete records. Add a few similar clinic names with matching addresses to test duplicate detection. Use clearly fictional details and make the script safe to run more than once without creating the same demo records again.

**Purpose:**

A larger dataset makes it possible to test searching, filtering, pagination, quality reporting, and duplicate detection more realistically.

**Implementation approach:**

A Python script creates synthetic clinic records using the existing Django model. The generated records are marked as demonstration data and include selected test cases.

**Expected outcome:**

A larger test dataset that can exercise the main application features.

**Limitation:**

Synthetic records are not verified healthcare-provider data. Loading 150 or more records does not by itself establish production-scale performance.

### 5.15 SEO and Browser Metadata

**Objective:** Improve the application's browser presentation and sharing metadata.

**Prompt:**

> Improve the index.html file for my HealthIntel AI React application. Add a professional page title, healthcare-related favicon reference, meta description, theme colour, and Open Graph and social-sharing metadata. Preserve the existing Vite entry point and root element.

**Purpose:**

The application needs professional browser-tab branding and descriptive metadata.

**Implementation approach:**

The HTML document was updated with a project title, favicon reference, description, theme colour, and social-sharing metadata.

**Expected outcome:**

A more professional browser presentation and improved metadata when the site is shared.

**Limitation:**

Metadata alone does not guarantee search-engine indexing or improved search rankings.

---

## 6. Debugging and Iterative Improvements

The development process involved testing the application and refining individual features through follow-up requests.

The following are representative debugging prompts. Include them in the final submission only when they accurately reflect the troubleshooting work performed.

### 6.1 Frontend API Integration

**Representative follow-up prompt:**

> My React frontend needs to retrieve clinic records and the quality report from Django. Help me check the Axios base URL, API endpoint paths, CORS configuration, and loading and error handling. Explain how to verify that the frontend is receiving the expected JSON response.

**Purpose:**

To diagnose problems involving frontend-to-backend communication.

**Verification approach:**

Test the API directly, inspect browser Network requests, and confirm that the response structure matches the fields expected by the React components.

### 6.2 Data-Quality Findings

**Representative follow-up prompt:**

> I added a clinic record with missing information. Help me verify that the Django quality-report endpoint identifies the missing fields and that the React Data Quality and AI Insights pages display the updated results.

**Purpose:**

To verify that validation results propagate through the backend API to the frontend.

**Verification approach:**

Create a test record, request the quality-report endpoint, inspect the returned JSON, and refresh the relevant frontend page.

### 6.3 Responsive Design

**Representative follow-up prompt:**

> Review the responsive CSS for the HealthIntel AI pages. Improve the layout for desktop, tablet, and mobile screens. Ensure the sidebar, metric cards, tables, forms, and modals remain usable on smaller screens. Keep the CSS in separate files and avoid breaking the existing functionality.

**Purpose:**

To refine the user interface across different screen sizes.

**Verification approach:**

Test the pages at different viewport widths and check navigation, text wrapping, table usability, and modal behaviour.

### 6.4 Demo-Data Testing

**Representative follow-up prompt:**

> Help me verify that my generated clinic dataset tests the important cases: complete records, missing fields, and similar clinic names with matching addresses. Explain how to check the quality report and duplicate-detection results.

**Purpose:**

To validate the application against known test cases.

**Verification approach:**

Compare the generated records with the API output and confirm that the expected records are flagged by the existing rules.

### 6.5 Development-Server Warnings

**Representative follow-up prompt:**

> Django displays a Broken pipe warning when I refresh the frontend data. Help me determine whether the request was cancelled, the browser closed the connection, or the API returned an actual error. Explain how to inspect the browser Network panel and Django logs before changing the code.

**Purpose:**

To investigate server messages using evidence instead of assuming every warning represents a backend failure.

**Verification approach:**

Inspect the HTTP status, browser request state, response body, and Django traceback where available.

---

## 7. Prompt Refinement Strategy

The project used an iterative development approach rather than treating the first generated code as final.

The general refinement pattern was:

### Stage 1: Define the requirement

Request the feature, its purpose, and its expected behaviour.

### Stage 2: Specify the existing architecture

Provide the relevant framework, file structure, API endpoints, and data model to keep the implementation consistent with the project.

### Stage 3: Request targeted implementation

Ask for the specific component, service, view, or stylesheet rather than requesting a complete application rewrite.

### Stage 4: Test the result

Run the code and compare the actual behaviour with the intended result.

### Stage 5: Supply the observed problem

Provide the error message, unexpected output, or missing behaviour and ask for a focused correction.

### Stage 6: Verify the correction

Re-run the relevant feature and confirm that the fix works without breaking existing functionality.

This approach helps reduce unnecessary rewrites and makes debugging more systematic.

---

## 8. Testing and Verification

The application should be demonstrated against the following test cases.

| Test area | Test scenario | Expected behaviour |
|---|---|---|
| Dashboard | Load the application | Clinic statistics and quality summaries appear |
| Clinic Directory | Search by name | Matching records are displayed |
| Clinic Directory | Filter by state or category | Records are filtered accordingly |
| Record management | Add or edit a clinic | Changes appear in the application |
| Data Quality | Use a record with missing fields | Applicable validation issues are shown |
| Duplicate Detection | Add similar names with the same address | A candidate pair is flagged when the threshold is met |
| Pagination | Browse the larger dataset | Users can navigate between record pages |
| Responsive layout | Test mobile and desktop widths | Layout adapts to the viewport |
| API integration | Stop the backend temporarily | The frontend displays an appropriate error state |

These are verification scenarios, not a claim that every automated test has already been executed. Record the actual results before submitting the project.

---

## 9. Challenges and Problem-Solving

### 9.1 Separating the Application into Components

**Challenge:** Multiple features needed to share the same data without putting all logic into one component.

**Approach:** Use Django apps, reusable API services, React page components, shared layout components, and separate CSS files.

**Benefit:** This structure makes the application easier to maintain and extend.

### 9.2 Keeping Frontend and Backend Data Consistent

**Challenge:** React components depend on the JSON structure returned by Django.

**Approach:** Use a central API service and verify endpoints and response fields during development.

**Benefit:** This reduces duplicated request logic and makes API issues easier to troubleshoot.

### 9.3 Testing Data Quality

**Challenge:** A small dataset is not sufficient to demonstrate search, filtering, pagination, and validation behaviour across many records.

**Approach:** Generate synthetic records containing both normal and deliberately incomplete examples.

**Benefit:** The application can be tested against a wider range of conditions without presenting synthetic records as verified providers.

### 9.4 Distinguishing Rules from AI

**Challenge:** The application is called HealthIntel AI, but its current analysis uses deterministic rules.

**Approach:** Clearly label rule-based findings and avoid claiming that a live AI model generates the results.

**Benefit:** The demonstration remains technically accurate and identifies a concrete area for future improvement.

---

## 10. Lessons Learned

The project demonstrates several useful software-development practices:

1. **Clear requirements improve implementation.** Breaking the project into specific features makes development easier to manage.
2. **Incremental prompting supports refinement.** Small, targeted requests are easier to verify than large, vague instructions.
3. **Testing matters.** Generated code must be executed and checked against expected behaviour.
4. **Separation of concerns improves maintainability.** Backend services, API views, frontend pages, and styling have distinct responsibilities.
5. **Synthetic data enables controlled testing.** Known examples help verify validation and duplicate-matching rules.
6. **Technical accuracy matters.** Rule-based analysis should not be presented as generative AI.
7. **Security must be considered before deployment.** A working local prototype still needs authentication, permission controls, and appropriate configuration before public release.

---

## 11. Current Limitations

- The application uses synthetic demonstration clinic records.
- The current quality checks are rule-based.
- Duplicate detection uses name similarity and address matching, so it can produce false positives and false negatives.
- The quality estimate reflects the current validation rules and does not establish the real-world correctness of the records.
- The current prototype has not been established as suitable for production healthcare workflows.
- Authentication and access controls must be reviewed before public deployment.
- Performance with a large production dataset has not been established through formal benchmarking.
- No live generative AI model is currently integrated into the application.

---

## 12. Future Improvements

Possible future improvements include:

- Integrating a genuine AI model to explain data-quality findings using supplied evidence.
- Adding automated unit and API tests.
- Improving duplicate matching using additional record attributes.
- Adding authentication and role-based permissions.
- Improving dashboard analytics and reporting.
- Benchmarking API performance with larger datasets.
- Deploying the application with appropriate security and operational controls.

---

## 13. Conclusion

HealthIntel AI demonstrates a practical application of full-stack development to a healthcare data-management problem.

ChatGPT assisted the development process through planning, code-generation guidance, component implementation, troubleshooting, and documentation. The resulting application combines a Django REST API, SQLite database, and responsive React interface.

The project currently provides rule-based clinic validation, potential duplicate detection, and data-quality summaries. Its limitations are documented explicitly, and the architecture provides a foundation for future AI-assisted functionality.

The main lesson from the project is that AI-assisted development is most useful when prompts are specific, outputs are tested, errors are investigated systematically, and final claims reflect the actual implementation.

---

**Submission note:** This document contains representative prompts based on the project-development tasks. Before submitting, replace or supplement these examples with exact prompts and meaningful follow-up prompts from the actual development history. Do not claim that an unperformed test, feature, or AI integration has been completed.
