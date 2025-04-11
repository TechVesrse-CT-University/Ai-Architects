'use client';

import {useState, useEffect, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation';
import {ArrowLeft, CheckCircle, Eye, Mic, AlertTriangle} from 'lucide-react';
import {analyzeStudentBehavior} from '@/ai/flows/analyze-student-behavior';
import {Alert, AlertTitle, AlertDescription} from '@/components/ui/alert';

const examDuration = 60 * 60; // 1 hour in seconds
const totalQuestions = 10;

export default function ExamTaking() {
  const [timeRemaining, setTimeRemaining] = useState(examDuration);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState(Array(totalQuestions).fill(''));
  const [isWebcamOn, setIsWebcamOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [aiWarning, setAiWarning] = useState('');
  const [isFullScreen, setIsFullScreen] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {toast} = useToast();
  const router = useRouter();
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [alerts, setAlerts] = useState<string[]>([]); // Track alerts

  useEffect(() => {
    // Enforce fullscreen mode
    if (isFullScreen) {
      const enterFullscreen = async () => {
        try {
          if (document.documentElement.requestFullscreen) {
            await document.documentElement.requestFullscreen();
          } else if (document.documentElement.mozRequestFullScreen) {
            await document.documentElement.mozRequestFullScreen();
          } else if (document.documentElement.webkitRequestFullscreen) {
            await document.documentElement.webkitRequestFullscreen();
          } else if (document.documentElement.msRequestFullscreen) {
            await document.documentElement.msRequestFullscreen();
          }
          console.log('Fullscreen enabled');
        } catch (error) {
          console.error('Failed to enable fullscreen:', error);
          setIsFullScreen(false); // If failed, don't keep trying
          toast({
            variant: 'destructive',
            title: 'Fullscreen Error',
            description: 'Failed to enter fullscreen mode. Please try again.',
          });
        }
      };

      enterFullscreen();

      const exitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
          setIsFullScreen(false);
          toast({
            variant: 'destructive',
            title: 'Fullscreen Exited',
            description: 'Exam automatically stopped as fullscreen was exited.',
          });
          router.push('/student-dashboard'); // Redirect to dashboard or results page
        }
      };

      document.addEventListener('fullscreenchange', exitHandler);
      document.addEventListener('webkitfullscreenchange', exitHandler);
      document.addEventListener('mozfullscreenchange', exitHandler);
      document.addEventListener('MSFullscreenChange', exitHandler);

      return () => {
        document.removeEventListener('fullscreenchange', exitHandler);
        document.removeEventListener('webkitfullscreenchange', exitHandler);
        document.removeEventListener('mozfullscreenchange', exitHandler);
        document.removeEventListener('MSFullscreenChange', exitHandler);
      };
    }
  }, [isFullScreen, router, toast]);

  useEffect(() => {
    // Initialize webcam
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    // Initialize microphone
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(() => {
        setIsMicOn(true);
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setIsMicOn(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      });
  }, [toast]);

  useEffect(() => {
    // Timer setup
    if (timeRemaining > 0) {
      const timerId = setInterval(() => {
        setTimeRemaining(prevTime => prevTime - 1);
      }, 1000);
      return () => clearInterval(timerId);
    } else {
      toast({
        title: 'Exam Finished',
        description: 'Time is up! Your answers have been automatically submitted.',
      });
      // Auto submit exam logic here
      handleSubmitExam();
    }
  }, [timeRemaining, toast]);

  const formatTime = (time: number): string => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionNumber: number, answer: string) => {
    const newAnswers = [...answers];
    newAnswers[questionNumber - 1] = answer;
    setAnswers(newAnswers);
    // Simulate auto-saving
    toast({
      title: 'Answer Saved',
      description: `Answer for Question ${questionNumber} saved.`,
    });
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(prevQuestion => prevQuestion - 1);
    }
  };

  const goToNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(prevQuestion => prevQuestion + 1);
    }
  };

  // Simulate AI proctoring and flag generation
  const simulateAiProctoring = () => {
    // Simulate different alerts
    const possibleAlerts = [
      'Face not detected',
      'Multiple faces detected',
      'Tab switch blocked',
      'Unusual noise detected',
    ];

    // Randomly select alerts (between 0 and 2 alerts)
    const numberOfAlerts = Math.floor(Math.random() * 3);
    const selectedAlerts: string[] = [];

    for (let i = 0; i < numberOfAlerts; i++) {
      const randomIndex = Math.floor(Math.random() * possibleAlerts.length);
      selectedAlerts.push(possibleAlerts[randomIndex]);
    }
    return selectedAlerts;
  };

  // Function to handle AI analysis and update alerts
  const handleAiAnalysis = async () => {
    if (!hasCameraPermission || !videoRef.current) {
      return;
    }

    const videoUrl = videoRef.current.srcObject ? 'video_stream' : ''; // Placeholder
    const newAlerts = simulateAiProctoring();
    setAlerts(prevAlerts => [...prevAlerts, ...newAlerts]);

     newAlerts.forEach(alert => {
       toast({
         title: 'Violation Alert',
         description: alert,
         variant: 'destructive',
       });
     });

    try {
      const analysisResult = await analyzeStudentBehavior({
        videoUrl: videoUrl,
        alerts: newAlerts,
      });

      setAiWarning(`${analysisResult.suspicionLevel}: ${analysisResult.justification}`);
    } catch (error) {
      console.error('Error analyzing student behavior:', error);
      setAiWarning('AI analysis is unavailable at the moment.');
    }
  };

  // Submit exam and trigger AI analysis
  const handleSubmitExam = async () => {
    await handleAiAnalysis(); // Trigger AI analysis before submission
    toast({
      title: 'Exam Submitted',
      description: 'Your exam has been submitted successfully.',
    });
    router.push('/student-dashboard'); // Redirect to dashboard
  };

  useEffect(() => {
    // Simulate periodic AI proctoring (e.g., every 30 seconds)
    const proctoringInterval = setInterval(handleAiAnalysis, 30000);

    return () => clearInterval(proctoringInterval);
  }, [hasCameraPermission, toast]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 md:p-6">
      <div className="container max-w-4xl mx-auto">
        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Exam in Progress</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                Time Remaining: <span className="font-semibold ml-1">{formatTime(timeRemaining)}</span>
              </div>
              <div className="flex items-center">
                {isWebcamOn ? (
                  <Eye className="text-green-500 mr-2" />
                ) : (
                  <Eye className="text-red-500 mr-2" />
                )}
                {isMicOn ? (
                  <Mic className="text-green-500" />
                ) : (
                  <Mic className="text-red-500" />
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* AI Warning Display */}
            {aiWarning && (
              <div className="mb-4 p-3 rounded-md bg-yellow-50 border border-yellow-200 text-yellow-700 flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                {aiWarning}
              </div>
            )}

            {/* Webcam Display */}
            {hasCameraPermission && (
              <video ref={videoRef} className="w-full aspect-video rounded-md mb-4" autoPlay muted />
            )}
             { !(hasCameraPermission) && (
                <Alert variant="destructive">
                          <AlertTitle>Camera Access Required</AlertTitle>
                          <AlertDescription>
                            Please allow camera access to use this feature.
                          </AlertDescription>
                  </Alert>
            )
            }

            {/* Question Display */}
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-2">Question {currentQuestion}:</h2>
              <textarea
                className="w-full h-32 p-2 border rounded-md"
                placeholder="Enter your answer here..."
                value={answers[currentQuestion - 1]}
                onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
              />
            </div>

            {/* Navigation and Submit Buttons */}
            <div className="flex justify-between">
              <Button onClick={goToPreviousQuestion} disabled={currentQuestion === 1} className="rounded-md hover:shadow-lg transition-shadow">
                Previous
              </Button>
              <Button onClick={goToNextQuestion} disabled={currentQuestion === totalQuestions} className="rounded-md hover:shadow-lg transition-shadow">
                Next
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button onClick={handleSubmitExam} className="mt-4 rounded-md hover:shadow-lg transition-shadow">
          Submit Exam
        </Button>
        <Button onClick={() => router.push('/student-dashboard')} className="mt-4 rounded-md hover:shadow-lg transition-shadow">
          <ArrowLeft className="mr-2" />
          Back to Dashboard
        </Button>
      </div>
    </main>
  );
}
