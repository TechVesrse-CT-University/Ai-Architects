'use client';

import {Button} from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {Progress} from '@/components/ui/progress';
import {
  ArrowLeft,
  Bell,
  Calendar as CalendarIcon,
  MessageSquare,
  User,
  Send,
  Brain,
  CheckCircle,
  GitGraph, // Added Graph icon
} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {useEffect, useState} from 'react';
import {summarizeExamViolations} from '@/ai/flows/summarize-exam-violations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {Calendar as DatePicker} from '@/components/ui/calendar';
import React from 'react';
import {cn} from '@/lib/utils';
import {format} from 'date-fns';
import {useTheme} from 'next-themes';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Badge} from '@/components/ui/badge'; // Added Badge
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

interface Exam {
  id: string;
  title: string;
  date: Date;
  duration: number;
  status: 'Upcoming' | 'Active' | 'Submitted' | 'Graded' | 'Under Review';
  suspicionLevel?: number;
  alerts?: string[];
  grade?: string;
}

const exams: Exam[] = [
  {
    id: '1',
    title: 'Calculus I Final Exam',
    date: new Date(2024, 7, 15, 9, 0, 0),
    duration: 120,
    status: 'Upcoming',
  },
  {
    id: '2',
    title: 'Linear Algebra Midterm',
    date: new Date(2024, 6, 28, 13, 30, 0),
    duration: 90,
    status: 'Active',
  },
  {
    id: '3',
    title: 'Discrete Mathematics Quiz',
    date: new Date(2024, 6, 14, 10, 0, 0),
    duration: 60,
    status: 'Graded',
    suspicionLevel: 25,
    alerts: ['Face not detected', 'Tab switch blocked'],
    grade: 'B+',
  },
  {
    id: '4',
    title: 'Probability and Statistics',
    date: new Date(2024, 5, 30, 16, 0, 0),
    duration: 150,
    status: 'Graded',
    suspicionLevel: 75,
    grade: 'A-',
  },
  {
    id: '5',
    title: 'Complex Variables',
    date: new Date(2024, 5, 15, 11, 0, 0),
    duration: 120,
    status: 'Under Review',
  },
  {
    id: '6',
    title: 'Differential Equations',
    date: new Date(2024, 4, 20, 14, 0, 0),
    duration: 100,
    status: 'Graded',
    suspicionLevel: 30,
    grade: 'C+',
  },
  {
    id: '7',
    title: 'Advanced Algorithms',
    date: new Date(2024, 4, 5, 9, 30, 0),
    duration: 180,
    status: 'Graded',
    suspicionLevel: 90,
    grade: 'A',
  },
];

interface NotificationItem {
  id: string;
  type: 'examReminder' | 'scheduleChange' | 'message' | 'postExam';
  title: string;
  message: string;
  date: Date;
}

const notifications: NotificationItem[] = [
  {
    id: 'n1',
    type: 'examReminder',
    title: 'Calculus I Exam Reminder',
    message: 'Your Calculus I exam is scheduled for tomorrow at 9:00 AM.',
    date: new Date(2024, 7, 14, 16, 0, 0),
  },
  {
    id: 'n2',
    type: 'scheduleChange',
    title: 'Linear Algebra Schedule Change',
    message: 'The Linear Algebra midterm has been rescheduled to July 30th at 1:30 PM.',
    date: new Date(2024, 6, 25, 10, 0, 0),
  },
  {
    id: 'n3',
    type: 'message',
    title: 'Message from Professor Smith',
    message: 'Please review Chapter 5 before the upcoming exam.',
    date: new Date(2024, 6, 20, 14, 0, 0),
  },
  {
    id: 'n4',
    type: 'postExam',
    title: 'Discrete Mathematics Quiz Results',
    message: 'The results for the Discrete Mathematics Quiz are now available.',
    date: new Date(2024, 6, 15, 12, 0, 0),
  },
];

function getRemainingTime(examDate: Date): string {
  const now = new Date().getTime();
  const timeDiff = examDate.getTime() - now;

  if (timeDiff <= 0) {
    return 'Exam started!';
  }

  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  return `Starts in ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

interface ExamCardProps {
  exam: Exam;
  onPrepare: () => void;
  onJoin: () => void;
}

const ExamCard = ({exam, onPrepare, onJoin}: ExamCardProps) => {
  let statusBadge = null;

  if (exam.status === 'Upcoming') {
    statusBadge = <Badge variant="secondary">Upcoming</Badge>;
  } else if (exam.status === 'Active') {
    statusBadge = <Badge variant="default">Active</Badge>;
  } else if (exam.status === 'Graded') {
    statusBadge = <Badge variant="success">Graded</Badge>;
  } else if (exam.status === 'Under Review') {
    statusBadge = <Badge>Under Review</Badge>;
  }
  const getSubjectIcon = (examTitle: string) => {
    const lowerCaseTitle = examTitle.toLowerCase();
    if (lowerCaseTitle.includes('calculus') || lowerCaseTitle.includes('math')) {
      return <GitGraph className="mr-2 h-4 w-4" />;
    } else {
      return null;
    }
  };

  return (
    <Card className="rounded-lg shadow-md hover:scale-105 transition-transform">
      <CardHeader>
        <CardTitle>
          {getSubjectIcon(exam.title)}
          {exam.title}
        </CardTitle>
        <CardDescription className="flex items-center justify-between">
          {exam.status === 'Upcoming'
            ? getRemainingTime(exam.date)
            : `Status: ${exam.status}`}
          {statusBadge}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {exam.status === 'Upcoming' && (
          <Button
            onClick={onPrepare}
            className="rounded-md hover:shadow-lg transition-shadow">
            Prepare for Exam
          </Button>
        )}
        {exam.status === 'Active' && (
          <Button
            onClick={onJoin}
            className="rounded-md hover:shadow-lg transition-shadow">
            Join Exam
          </Button>
        )}
        {exam.status === 'Graded' && (
          <>
            <p>Grade: {exam.grade}</p>
            {exam.suspicionLevel !== undefined && (
              <>
                <p>Suspicion Level: {exam.suspicionLevel}%</p>
                <Progress value={exam.suspicionLevel} />
                {exam.alerts && exam.alerts.length > 0 && (
                  <div>
                    Alerts:
                    <ul>
                      {exam.alerts.map((alert, index) => (
                        <li key={index}>{alert}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </>
        )}
        {exam.status === 'Under Review' && (
          <p>Exam is under review. Please check back later.</p>
        )}
      </CardContent>
    </Card>
  );
};

function ThemeToggleButton() {
  const {setTheme, theme} = useTheme();
  return (
        <Button
              variant="ghost"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              Toggle Theme
            </Button>
  )
}

export default function StudentDashboard() {
  const router = useRouter();

  const [upcomingExams, setUpcomingExams] = useState(
    exams.filter(exam => exam.status === 'Upcoming')
  );
  const [activeExams, setActiveExams] = useState(
    exams.filter(exam => exam.status === 'Active')
  );
  const [completedExams, setCompletedExams] = useState(
    exams.filter(
      exam => exam.status !== 'Upcoming' && exam.status !== 'Active'
    )
  );
  const [countdown, setCountdown] = useState('');

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

    const [isClient, setIsClient] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterSubject, setFilterSubject] = useState('All');
    const [expanded, setExpanded] = React.useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

  useEffect(() => {
    if (upcomingExams.length > 0) {
      const examDate = upcomingExams[0].date;
      setCountdown(getRemainingTime(examDate));

      const intervalId = setInterval(() => {
        setCountdown(getRemainingTime(examDate));
      }, 1000);

      return () => clearInterval(intervalId);
    } else {
      setCountdown('No upcoming exams.');
    }
  }, [upcomingExams]);

  const handlePrepareExam = () => {
    router.push('/proctoring-setup');
  };

  const handleJoinExam = () => {
    router.push('/exam-taking');
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {
      setMessages([...messages, newMessage]);
      setNewMessage('');
    }
  };

    const filteredExams = completedExams
        .filter(exam =>
            exam.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
            (filterSubject === 'All' || exam.title.includes(filterSubject)) // Basic subject filtering
        );

  return (
    <main className="flex min-h-screen flex-col items-center p-6 md:p-24">
      <div className="container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <img
              src="/logo.svg"
              alt="ProctorAI Logo"
              className="h-8 w-auto mr-4"
	      onError={(e) => {
                  e.currentTarget.onerror = null; // prevents looping
                  e.currentTarget.src="/logo.png";
                }}
            />
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              Student Dashboard
            </h1>
          </div>

          <div className="flex items-center space-x-4">
              {isClient && (
                  <ThemeToggleButton/>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>Calendar</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/settings')}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Messages</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100 flex items-center">
           <CalendarIcon className="mr-2 h-5 w-5 text-gray-500"/> Upcoming Exams
          </h2>
          {upcomingExams.length > 0 ? (
            <ExamCard
              exam={upcomingExams[0]}
              onPrepare={handlePrepareExam}
              onJoin={handleJoinExam}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No upcoming exams scheduled.</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100 flex items-center">
           <Brain className="mr-2 h-5 w-5 text-gray-500"/> Active Exams
          </h2>
          {activeExams.length > 0 ? (
            <ExamCard
              exam={activeExams[0]}
              onPrepare={handlePrepareExam}
              onJoin={handleJoinExam}
            />
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No active exams at the moment.</p>
          )}
        </section>

          <section className="mb-8">
              <Accordion type="single" collapsible>
                  <AccordionItem value="completed-exams">
                      <AccordionTrigger>
                          <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100 flex items-center">
                              <CheckCircle className="mr-2 h-5 w-5 text-gray-500"/> Completed Exams
                          </h2>
                      </AccordionTrigger>
                      <AccordionContent>
                          <div className="mb-4">
                              <Input
                                  type="text"
                                  placeholder="Search exam..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  className="w-full"
                              />
                              {/* Basic filter - extend with a Select component if needed */}
                              {/*<select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>*/}
                              {/*    <option value="All">All Subjects</option>*/}
                              {/*    <option value="Calculus">Calculus</option>*/}
                              {/*    <option value="Linear Algebra">Linear Algebra</option>*/}
                              {/*</select>*/}
                          </div>
                          {filteredExams.length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {filteredExams.map(exam => (
                                      <ExamCard
                                          key={exam.id}
                                          exam={exam}
                                          onPrepare={handlePrepareExam}
                                          onJoin={handleJoinExam}
                                      />
                                  ))}
                              </div>
                          ) : (
                              <p className="text-gray-500 dark:text-gray-400">No completed exams yet.</p>
                          )}
                      </AccordionContent>
                  </AccordionItem>
              </Accordion>
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

        
      </div>
    </main>
  );
}

