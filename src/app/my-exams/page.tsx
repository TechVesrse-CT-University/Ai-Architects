'use client';

import {Button} from '@/components/ui/button';
import {
  ArrowLeft,
  FileText,
  Monitor,
  AlertTriangle,
  User,
  Eye,
  Edit,
  Trash,
  CheckCircle,
  Send,
  MessageSquare,
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useEffect, useState} from 'react';
import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@/components/ui/table';
import {format} from 'date-fns';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';
import {AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction} from "@/components/ui/alert-dialog"

interface Exam {
  id: string;
  title: string;
  date: Date;
  status: 'Upcoming' | 'Live' | 'Graded' | 'Under Review';
  studentCount: number;
}

const examData: Exam[] = [
  {
    id: '1',
    title: 'Calculus I Final Exam',
    date: new Date(2024, 7, 15, 9, 0, 0),
    status: 'Upcoming',
    studentCount: 60,
  },
  {
    id: '2',
    title: 'Linear Algebra Midterm',
    date: new Date(2024, 6, 28, 13, 30, 0),
    status: 'Live',
    studentCount: 45,
  },
  {
    id: '3',
    title: 'Discrete Mathematics Quiz',
    date: new Date(2024, 6, 14, 10, 0, 0),
    status: 'Graded',
    studentCount: 50,
  },
  {
    id: '4',
    title: 'Probability and Statistics',
    date: new Date(2024, 5, 30, 16, 0, 0),
    status: 'Under Review',
    studentCount: 55,
  },
];

export default function MyExamsPage() {
  const router = useRouter();
  const {toast} = useToast();
  const [selectedExamId, setSelectedExamId] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const handleViewClick = (examId: string) => {
    router.push(`/exam-details?examId=${examId}`);
  };

  const handleEditClick = (examId: string) => {
    router.push(`/exam-edit?examId=${examId}`);
  };

  const handleDeleteClick = (examId: string) => {
    // Implement delete logic here
    toast({
      title: 'Exam Deleted',
      description: `Exam ${examId} has been deleted.`,
    });
  };

  const handleGradeClick = (examId: string) => {
    router.push(`/exam-grading?examId=${examId}`);
  };


  const handleMonitorClick = (examId: string) => {
    router.push(`/proctoring-center?examId=${examId}`);
  };

  const handleSendAnnouncement = () => {
    if (selectedExamId && announcement.trim() !== '') {
      // Simulate sending the announcement
      toast({
        title: 'Announcement Sent',
        description: `Announcement sent to students in exam ${selectedExamId}: ${announcement}`,
      });
      setAnnouncement(''); // Clear the input
    } else {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select an exam and enter an announcement.',
      });
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };


  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="container max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-8">
          My Exams
        </h1>
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100">
              My Exams
            </h2>
            <Button onClick={() => router.push('/exam-creation')}>Create New Exam</Button>
          </div>

          <Table>
            <TableCaption>A list of all exams created by the teacher.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Exam Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date &amp; Time</TableHead>
                <TableHead>No. of Students</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {examData.map(exam => (
                <TableRow key={exam.id}>
                  <TableCell>{exam.title}</TableCell>
                  <TableCell>{exam.status}</TableCell>
                  <TableCell>{format(exam.date, 'PPP p')}</TableCell>
                  <TableCell>{exam.studentCount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleViewClick(exam.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditClick(exam.id)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the exam.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteClick(exam.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button variant="ghost" size="sm" onClick={() => handleGradeClick(exam.id)}>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Grade
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleMonitorClick(exam.id)}>
                        <Monitor className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                      <input
                        type="radio"
                        name="selectedExam"
                        value={exam.id}
                        className="h-4 w-4"
                        onChange={(e) => setSelectedExamId(e.target.value)}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>
        {/* Announcements Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
            Send Announcement
          </h2>
          <div className="flex flex-col space-y-4">
            <Textarea
              placeholder="Enter your announcement here..."
              value={announcement}
              onChange={(e) => setAnnouncement(e.target.value)}
              className="w-full"
            />
            <Button onClick={handleSendAnnouncement} className="w-fit">
              Send Announcement <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>
        {/* Chat Interface */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
            Live Chat
          </h2>
          <div className="mb-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className="bg-gray-100 p-2 rounded-md mb-2 dark:bg-gray-700 dark:text-white">
                {message}
              </div>
            ))}
          </div>
          <div className="flex space-x-2">
            <Input
              type="text"
              placeholder="Enter your message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSendMessage}>
              Send
              <Send className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </section>


        <Button
          onClick={() => router.push('/teacher-dashboard')}
          className="mt-4 rounded-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </main>
  );
}

