'use client';

import {Button} from '@/components/ui/button';
import {
  ArrowLeft,
  FileText,
  Monitor,
  AlertTriangle,
  User,
  Eye,
  Settings
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useState} from 'react';

interface Exam {
  id: string;
  title: string;
  status: 'Upcoming' | 'Live' | 'Graded' | 'Under Review';
  studentCount: number;
  gradedCount: number;
  suspicionLevel: number;
}

const examData: Exam[] = [
  {
    id: '1',
    title: 'Calculus I Final Exam',
    status: 'Upcoming',
    studentCount: 60,
    gradedCount: 0,
    suspicionLevel: 0,
  },
  {
    id: '2',
    title: 'Linear Algebra Midterm',
    status: 'Live',
    studentCount: 45,
    gradedCount: 0,
    suspicionLevel: 0,
  },
  {
    id: '3',
    title: 'Discrete Mathematics Quiz',
    status: 'Graded',
    studentCount: 50,
    gradedCount: 45,
    suspicionLevel: 75,
  },
  {
    id: '4',
    title: 'Probability and Statistics',
    status: 'Under Review',
    studentCount: 55,
    gradedCount: 0,
    suspicionLevel: 0,
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const [totalExams, setTotalExams] = useState(5);
  const [activeExams, setActiveExams] = useState(1);
  const [examsUnderReview, setExamsUnderReview] = useState(2);
  const [totalStudents, setTotalStudents] = useState(50);
  const [suspiciousAlerts, setSuspiciousAlerts] = useState(5);
  const [completedExams, setCompletedExams] = useState(
    examData.filter(exam => exam.status === 'Graded' || exam.status === 'Under Review')
  );

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          Teacher Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Welcome, Teacher! Manage your exams and student proctoring data here.
        </p>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          <Card className="bg-green-100 border-green-200 dark:bg-green-900 dark:border-green-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams Created</CardTitle>
              <FileText className="h-4 w-4 text-green-500 dark:text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalExams}</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-100 border-blue-200 dark:bg-blue-900 dark:border-blue-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Exams Now</CardTitle>
              <Monitor className="h-4 w-4 text-blue-500 dark:text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeExams}</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border-yellow-200 dark:bg-yellow-900 dark:border-yellow-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exams Under Review</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500 dark:text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{examsUnderReview}</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-100 border-purple-200 dark:bg-purple-900 dark:border-purple-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students Monitored</CardTitle>
              <User className="h-4 w-4 text-purple-500 dark:text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>

          <Card className="bg-red-100 border-red-200 dark:bg-red-900 dark:border-red-800">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Suspicious Activity Alerts (Today)
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500 dark:text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{suspiciousAlerts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Grade & Review Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Grade &amp; Review
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedExams.map(exam => (
              <Card key={exam.id} className="rounded-lg shadow-md">
                <CardHeader>
                  <CardTitle>{exam.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    {exam.gradedCount} / {exam.studentCount} Graded
                  </p>
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <span>Suspicion: {exam.suspicionLevel}%</span>
                  </div>
                  <Button onClick={() => router.push('/proctoring-center')} className="mt-4">
                    Start Review
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* My Exams Panel */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
              Manage Exams
            </h2>
            <Button onClick={() => router.push('/my-exams')}>View My Exams</Button>
          </div>
        </section>
        <div className="flex space-x-4">
                <Button
                    onClick={() => router.push('/settings')}
                    className="mt-4 rounded-md hover:shadow-lg transition-shadow"
                >
                    <Settings className="mr-2" />
                    Go to Settings
                </Button>

        <Button
          onClick={() => router.push('/')}
          className="mt-4 rounded-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="mr-2" />
          Back to Home
        </Button>
        </div>
      </div>
    </main>
  );
}

