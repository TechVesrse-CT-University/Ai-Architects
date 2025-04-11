'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { EnhancedProctorService, ViolationEvent } from '@/services/enhanced-proctor-service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AIModelLoader } from './AIModelLoader';

export function EnhancedProctorView({ studentImage, onViolation }: { 
  studentImage: string;
  onViolation?: (violation: ViolationEvent) => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const proctorServiceRef = useRef<EnhancedProctorService | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds

  useEffect(() => {
    if (!modelsLoaded) return;

    const initializeProctor = async () => {
      try {
        // Get webcam access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Initialize proctor service
        proctorServiceRef.current = new EnhancedProctorService((violation) => {
          setViolations(prev => [...prev, violation].slice(-5));
          onViolation?.(violation);
        });

        await proctorServiceRef.current.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing EnhancedProctorView:', error);
      }
    };

    initializeProctor();

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
      proctorServiceRef.current?.cleanup();
    };
  }, [onViolation, modelsLoaded]);

  // Timer effect
  useEffect(() => {
    if (!isInitialized || showSetup) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isInitialized, showSetup]);

  const handleStartExam = async () => {
    if (!proctorServiceRef.current || !containerRef.current) return;

    try {
      // Load and verify student's face
      const img = new Image();
      img.src = studentImage;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      
      const faceVerified = await proctorServiceRef.current.setKnownFace(img);
      
      if (!faceVerified) {
        throw new Error('Could not detect face in profile image');
      }

      // Enter fullscreen
      await proctorServiceRef.current.enterFullscreen(containerRef.current);
      
      setShowSetup(false);
    } catch (error) {
      console.error('Error starting exam:', error);
    }
  };

  useEffect(() => {
    if (!isInitialized || !videoRef.current || !proctorServiceRef.current || showSetup) return;

    const analyzeInterval = setInterval(async () => {
      try {
        await proctorServiceRef.current?.analyzeFrame(videoRef.current!);
      } catch (error) {
        console.error('Error analyzing frame:', error);
      }
    }, 1000);

    return () => clearInterval(analyzeInterval);
  }, [isInitialized, showSetup]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!modelsLoaded) {
    return <AIModelLoader onModelsLoaded={() => setModelsLoaded(true)} />;
  }

  return (
    <div ref={containerRef} className="space-y-4">
      <Dialog open={showSetup} onOpenChange={setShowSetup}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exam Setup</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Please ensure:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>You are in a well-lit room</li>
              <li>Your face is clearly visible</li>
              <li>No other people are present</li>
              <li>No phones or other devices are nearby</li>
            </ul>
            <Button onClick={handleStartExam} className="w-full">
              Start Exam
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <Card className="p-4">
          <div className="absolute top-4 right-4 z-10 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-md">
            Time Remaining: {formatTime(timeRemaining)}
          </div>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-[640px] mx-auto rounded-lg"
          />
        </Card>
      </motion.div>

      <AnimatePresence>
        {violations.map((violation, index) => (
          <motion.div
            key={`${violation.timestamp.getTime()}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert
              variant="destructive"
              className="border-red-500"
            >
              <AlertDescription className="flex items-center justify-between">
                <span>{violation.message}</span>
                <span className="text-sm opacity-75">
                  {violation.timestamp.toLocaleTimeString()}
                </span>
              </AlertDescription>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
