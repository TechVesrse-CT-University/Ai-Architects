'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProctorService, ViolationEvent } from '@/services/proctor-service';

export function ProctorView() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const proctorServiceRef = useRef<ProctorService | null>(null);

  useEffect(() => {
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
        proctorServiceRef.current = new ProctorService((violation) => {
          setViolations(prev => [...prev, violation].slice(-5)); // Keep last 5 violations
        });

        await proctorServiceRef.current.initialize();
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing ProctorView:', error);
      }
    };

    initializeProctor();

    return () => {
      // Cleanup
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    if (!isInitialized || !videoRef.current || !proctorServiceRef.current) return;

    const analyzeInterval = setInterval(async () => {
      try {
        await proctorServiceRef.current?.analyzeFrame(videoRef.current!);
      } catch (error) {
        console.error('Error analyzing frame:', error);
      }
    }, 1000); // Check every second

    return () => clearInterval(analyzeInterval);
  }, [isInitialized]);

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full max-w-[640px] mx-auto"
        />
      </Card>

      <div className="space-y-2">
        {violations.map((violation, index) => (
          <Alert
            key={index}
            variant="destructive"
            className="animate-shake"
          >
            <AlertDescription>
              {violation.message} - {violation.timestamp.toLocaleTimeString()}
            </AlertDescription>
          </Alert>
        ))}
      </div>
    </div>
  );
}
