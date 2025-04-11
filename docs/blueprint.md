# **App Name**: ProctorAI

## Core Features:

- Secure Login: Secure login panels with role-based access (Student/Teacher).
- Role-Based Dashboards: Role-specific dashboards for students and teachers to manage exams and results.
- AI Proctoring Engine: AI-powered proctoring tool that analyzes video/audio for suspicious activity and generates alerts. This feature will use an LLM as a tool to analyze student behavior.
- Real-Time Alerts: Real-time alerts and feedback displayed to students during exams, such as 'Face not detected' or 'Tab switch blocked'.
- Exam Builder: Exam creation tool for teachers with options to upload questions and define custom proctoring settings.

## Style Guidelines:

- Primary color: White or light grey for a clean background.
- Secondary color: Dark grey or black for text and important elements.
- Accent: Blue (#007BFF) for interactive elements and highlights.
- Use a grid-based layout for responsive design.
- Use modern and simple icons for easy navigation.
- Subtle transitions and animations to enhance user experience.

## Original User Request:
AI-Powered Online Exam Proctoring Platform
Dual Portals | Advanced AI Proctoring | Real-Time Alerts | Modern UI | Hackathon-Ready

Build a fully-functional AI-based online exam proctoring system with two separate portals—Student and Teacher—featuring secure login panels, role-specific dashboards, and a modern, responsive UI. The system must enforce real-time AI proctoring rules like face detection, phone detection, sound analysis, eye tracking, and tab switch monitoring.

 Student Portal Features
Login Panel

Secure login for students with password reset and session management.

Dashboard

Overview of upcoming exams, in-progress exams, and past performance.

Notifications for schedules and updates.

Exam History

List of completed exams with:

Scores

Time taken

Suspicious activity reports

Teacher feedback

Option to download PDF report.

Practice Mode

Access mock exams without proctoring.

Instant feedback with explanations.

Profile Management

Edit personal details, password, and preferences.

Exam Instructions

Pre-exam checklist and environment setup guidance.

Timer countdown and exam readiness confirmation.

Real-Time Feedback

On-screen alerts:

“Face not detected”

“Phone detected”

“Eye off-screen”

“Sound detected”

“Tab switch blocked”

Progress bar showing exam status.

Live Support/Chat

Contact technical support or exam proctor instantly.

 Teacher Portal Features
Login Panel

Secure access with role-based permissions.

Dashboard

Overview of live exams, student participation, pending reviews, and alerts.

Exam Creation

Build exams with question types, time limits, and correct answers.

Upload questions via CSV/PDF.

Define custom proctoring settings per exam.

Live Monitoring

Real-time view of student video feeds.

Display triggered AI alerts, status indicators, and suspicion score.

Click to view violation logs with timestamps/screenshots.

Scheduling

Set exam date, time, duration, and assign to specific students.

Automated reminders via email and dashboard alerts.

Student Management

Add/remove/edit student profiles.

Assign students to exams or courses.

Result Analysis

Individual and class-level reports:

Scores

Exam duration

Violation logs

Suspicion level score

Export results to Excel or CSV.

Review & Grading

Manually review flagged activities (with video/audio).

Override AI decisions and adjust grades.

Leave comments/feedback per student.

 AI Proctoring Rules (Enforced During Exams)
All violations are logged in real-time and visible to both teacher and student (with alerts and timestamps)

One Face Rule

Only one face allowed in webcam frame.

Face Detection Violation

Alerts if student face is missing, turned away, or obstructed.

Phone Detection

Detects mobile devices or similar objects in view.

Sound Detection

Alerts for suspicious audio:

Background voices

Conversation

Repeated ambient noise

Eye Tracking

Detects frequent eye movements away from screen.

Alerts for “Eyes off-screen too often”.

Tab Switching Detection

Block and alert on any browser tab or app switch.

Message: “Tab switching is not allowed.”

Head Pose Estimation

Alerts if student turns head too far left/right or looks down repeatedly.

Lighting Analysis

Warns if lighting is poor or face is not clearly visible.

Idle Time Detection

Warns if student is inactive for a long time (e.g., no movement).

Object Detection

Detects books, papers, second screens, etc., in webcam view.

 Bonus: Cheating Confidence Score
Combine all violations to generate a suspicion score per student.

Example: “Suspicion Level: High (87%) – 6 violations detected.”

 UI/UX Requirements
Clean, modern UI (suggest TailwindCSS, Material UI, or Bootstrap).

Responsive for desktop and tablet.

Dark mode optional.

Real-time graphs, status badges, and alert modals.
  