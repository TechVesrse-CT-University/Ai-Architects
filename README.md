# ProctorAI

A Next.js application with real-time proctoring features using face detection and object detection.

## Features

- Role-based authentication (Student/Teacher)
- Real-time face detection
- Multiple face detection alerts
- Prohibited object detection
- Real-time violation alerts
- Student and Teacher dashboards

## Prerequisites

- Node.js 16+ and npm

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. The face detection models should be in the `public/models` directory. If they're not present, run:
```bash
node scripts/download-models.js
```

## Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. Login as either a student or teacher
2. For students:
   - Navigate to the dashboard
   - Click "Start Exam" to begin a proctored session
   - Allow camera access when prompted
   - The proctoring system will automatically detect:
     - No face in frame
     - Multiple faces
     - Prohibited objects (phones, books, etc.)

3. For teachers:
   - Access the dashboard to manage exams
   - View student reports and violations

## Technology Stack

- Next.js
- TypeScript
- Tailwind CSS
- face-api.js
- TensorFlow.js
- COCO-SSD object detection model
