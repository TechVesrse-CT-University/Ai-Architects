'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TeacherDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Active Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No active exams</p>
            <Button className="mt-4">Create New Exam</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Student Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <p>No reports available</p>
            <Button className="mt-4">View All Reports</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full">Schedule Exam</Button>
            <Button className="w-full">View Students</Button>
            <Button className="w-full">Generate Reports</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
