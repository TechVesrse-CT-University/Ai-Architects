'use client';

import { useEffect, useState } from 'react';
import * as faceapi from 'face-api.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

interface AIModelLoaderProps {
  onModelsLoaded: () => void;
}

export function AIModelLoader({ onModelsLoaded }: AIModelLoaderProps) {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadModels = async () => {
      try {
        // Load face-api.js models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.load('/models'),
          faceapi.nets.faceLandmark68Net.load('/models'),
          faceapi.nets.faceRecognitionNet.load('/models')
        ]);
        
        if (!isMounted) return;
        setLoadingProgress(50);

        // Load TensorFlow object detection model
        await cocoSsd.load();
        
        if (!isMounted) return;
        setLoadingProgress(100);
        
        onModelsLoaded();
      } catch (err) {
        console.error('Error loading AI models:', err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load AI models');
        }
      }
    };

    loadModels();

    return () => {
      isMounted = false;
    };
  }, [onModelsLoaded]);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Error loading AI models: {error}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h3 className="text-lg font-medium">Loading AI Models...</h3>
      <Progress value={loadingProgress} />
      <p className="text-sm text-muted-foreground">
        {loadingProgress < 50 ? 'Loading face detection models...' : 'Loading object detection models...'}
      </p>
    </div>
  );
}
