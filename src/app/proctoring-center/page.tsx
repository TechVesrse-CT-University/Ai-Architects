'use client';

import {useRouter, useSearchParams} from 'next/navigation';
import {Button} from '@/components/ui/button';
import {ArrowLeft, AlertTriangle, User, Pause, Send, XCircle} from 'lucide-react';
import {useEffect, useState} from 'react';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {useToast} from '@/hooks/use-toast';

export default function ProctoringCenter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const examId = searchParams.get('examId');
    const {toast} = useToast();

  const [studentWebcams, setStudentWebcams] = useState([
    'https://picsum.photos/200/150',
    'https://picsum.photos/200/150',
    'https://picsum.photos/200/150',
    'https://picsum.photos/200/150',
    'https://picsum.photos/200/150',
    'https://picsum.photos/200/150',
  ]);

  const [suspicionFlags, setSuspicionFlags] = useState([
    'Tab switch detected',
    'No face detected',
    'Background noise',
  ]);

  const handlePauseStudent = () => {
      toast({
        title: 'Student Paused',
        description: 'This feature is under development and will be functional upon database integration.',
      });
  };

  const handleSendWarning = () => {
    toast({
      title: 'Warning Sent',
      description: 'This feature is under development and will be functional upon database integration.',
    });
  };

  const handleTerminateExam = () => {
    toast({
      title: 'Exam Terminated',
      description: 'This feature is under development and will be functional upon database integration.',
    });
  };

  const [expandedWebcam, setExpandedWebcam] = useState<string | null>(null);

  const handleWebcamClick = (webcamUrl: string) => {
    setExpandedWebcam(webcamUrl);
  };

  const handleCloseExpandedWebcam = () => {
    setExpandedWebcam(null);
  };

  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState('');

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
          Proctoring Center
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Monitoring Exam ID: {examId}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Live Webcams
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {studentWebcams.map((webcam, index) => (
              <img
                key={index}
                src={webcam}
                alt={`Student ${index + 1}`}
                className="rounded-md cursor-pointer"
                onClick={() => handleWebcamClick(webcam)}
              />
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Suspicion Flags
          </h2>
          {suspicionFlags.map((flag, index) => (
            <div key={index} className="flex items-center mb-2">
              <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
              {flag}
            </div>
          ))}
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


        <section>
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-100 mb-4">
            Quick Actions
          </h2>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={handlePauseStudent}>
              <Pause className="h-4 w-4 mr-2" />
              Pause Student
            </Button>
            <Button variant="ghost" onClick={handleSendWarning}>
              <Send className="h-4 w-4 mr-2" />
              Send Warning
            </Button>
            <Button variant="ghost" onClick={handleTerminateExam}>
              <XCircle className="h-4 w-4 mr-2" />
              Terminate Exam
            </Button>
          </div>
        </section>

        <Button
          onClick={() => router.back()}
          className="mt-4 rounded-md hover:shadow-lg transition-shadow"
        >
          <ArrowLeft className="mr-2" />
          Back to My Exams
        </Button>
      </div>

      {/* Expanded Webcam Modal */}
      {expandedWebcam && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-50 flex justify-center items-center">
          <img
            src={expandedWebcam}
            alt="Expanded Webcam"
            className="rounded-md max-w-4xl max-h-4xl"
            onClick={handleCloseExpandedWebcam}
          />
          <Button
            variant="ghost"
            onClick={handleCloseExpandedWebcam}
            className="absolute top-4 right-4"
          >
            <XCircle className="h-6 w-6" />
          </Button>
        </div>
      )}
    </main>
  );
}

