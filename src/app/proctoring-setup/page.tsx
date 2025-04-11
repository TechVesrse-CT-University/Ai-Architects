'use client';

import {useState, useEffect, useRef} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Checkbox} from '@/components/ui/checkbox';
import {Alert, AlertDescription, AlertTitle} from '@/components/ui/alert';
import {useToast} from '@/hooks/use-toast';
import {useRouter} from 'next/navigation'; // Import useRouter

import {CheckCircle, Camera, Upload, RefreshCw} from 'lucide-react';

export default function ProctoringSetup() {
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [isMicWorking, setIsMicWorking] = useState(false);
  const [systemCheckPassed, setSystemCheckPassed] = useState(false);
  const [idUploaded, setIdUploaded] = useState(false);
  const [environmentScanned, setEnvironmentScanned] = useState(false);
  const [rulesAccepted, setRulesAccepted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const {toast} = useToast();
  const router = useRouter(); // Initialize useRouter


  useEffect(() => {
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
  }, []);

  const testMicrophone = () => {
    navigator.mediaDevices
      .getUserMedia({audio: true})
      .then(stream => {
        setIsMicWorking(true);
        stream.getTracks().forEach(track => track.stop()); // Stop the stream immediately
        toast({
          title: 'Microphone Test Passed',
          description: 'Your microphone is working correctly.',
        });
      })
      .catch(error => {
        console.error('Error accessing microphone:', error);
        setIsMicWorking(false);
        toast({
          variant: 'destructive',
          title: 'Microphone Access Denied',
          description: 'Please enable microphone permissions in your browser settings.',
        });
      });
  };

  const runSystemCheck = () => {
    // Simulate system check
    setTimeout(() => {
      setSystemCheckPassed(true);
      toast({
        title: 'System Check Passed',
        description: 'All system requirements are met.',
      });
    }, 1500);
  };

  const uploadID = () => {
    // Simulate ID Upload
    setTimeout(() => {
      setIdUploaded(true);
      toast({
        title: 'ID Verification Complete',
        description: 'Your ID has been successfully uploaded.',
      });
    }, 1000);
  };

  const scanEnvironment = () => {
    // Simulate environment scan
    setTimeout(() => {
      setEnvironmentScanned(true);
      toast({
        title: 'Environment Scan Complete',
        description: 'Environment scan was successful.',
      });
    }, 2000);
  };

  const allChecksPassed =
    hasCameraPermission &&
    isMicWorking &&
    systemCheckPassed &&
    idUploaded &&
    environmentScanned &&
    rulesAccepted;

  const handleStartExam = () => {
    if (allChecksPassed) {
      router.push('/exam-taking'); // Navigate to exam-taking page
    } else {
      toast({
        variant: 'destructive',
        title: 'Setup Incomplete',
        description: 'Please complete all proctoring setup steps before starting the exam.',
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 md:p-24">
      <div className="container max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Proctoring Setup
        </h1>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Webcam Test</CardTitle>
            <CardDescription>
              Please ensure your webcam is working properly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {hasCameraPermission ? (
              <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted />
            ) : (
              <Alert variant="destructive">
                <AlertTitle>Camera Access Required</AlertTitle>
                <AlertDescription>
                  Please allow camera access to use this feature.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Microphone Test</CardTitle>
            <CardDescription>
              Please ensure your microphone is working properly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={testMicrophone}
              disabled={isMicWorking}
              className="w-full flex items-center justify-center rounded-md hover:shadow-lg transition-shadow"
            >
              {isMicWorking ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Microphone Working
                </>
              ) : (
                <>
                  Test Microphone
                  <Camera className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>System Check</CardTitle>
            <CardDescription>
              Checking browser permissions, tab focus detection, etc.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={runSystemCheck}
              disabled={systemCheckPassed}
              className="w-full flex items-center justify-center rounded-md hover:shadow-lg transition-shadow"
            >
              {systemCheckPassed ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  System Check Passed
                </>
              ) : (
                <>
                  Run System Check
                  <RefreshCw className="ml-2 h-4 w-4 animate-spin" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>ID Verification Upload</CardTitle>
            <CardDescription>Please upload a valid form of identification.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={uploadID}
              disabled={idUploaded}
              className="w-full flex items-center justify-center rounded-md hover:shadow-lg transition-shadow"
            >
              {idUploaded ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  ID Uploaded
                </>
              ) : (
                <>
                  Upload ID
                  <Upload className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Environment Scan</CardTitle>
            <CardDescription>
              Show your surroundings using the webcam to ensure a clear environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={scanEnvironment}
              disabled={environmentScanned}
              className="w-full flex items-center justify-center rounded-md hover:shadow-lg transition-shadow"
            >
              {environmentScanned ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Environment Scanned
                </>
              ) : (
                <>
                  Scan Environment
                  <Camera className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="mb-4 rounded-lg shadow-md">
          <CardHeader>
            <CardTitle>Rules Acknowledgment</CardTitle>
            <CardDescription>
              Please acknowledge that you have read and agree to the exam rules.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rules"
                onCheckedChange={checked => setRulesAccepted(!!checked)}
              />
              <label
                htmlFor="rules"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I agree to the exam rules.
              </label>
            </div>
          </CardContent>
        </Card>

        <Button
          disabled={!allChecksPassed}
          className="w-full rounded-md hover:shadow-lg transition-shadow"
          onClick={handleStartExam} // Add onClick handler
        >
          Start Exam
        </Button>
      </div>
    </main>
  );
}
