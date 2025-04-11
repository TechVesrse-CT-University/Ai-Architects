import * as faceapi from 'face-api.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface ViolationEvent {
  type: 'NO_FACE' | 'MULTIPLE_FACES' | 'OBJECT_DETECTED';
  message: string;
  timestamp: Date;
  details?: any;
}

export class ProctorService {
  private faceDetectionNet: faceapi.TinyFaceDetector;
  private objectDetectionModel: cocoSsd.ObjectDetection | null = null;
  private isInitialized = false;
  private onViolation: (event: ViolationEvent) => void;

  constructor(onViolation: (event: ViolationEvent) => void) {
    this.faceDetectionNet = new faceapi.TinyFaceDetector();
    this.onViolation = onViolation;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Load face detection models
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');

      // Load object detection model
      this.objectDetectionModel = await cocoSsd.load();
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Error initializing ProctorService:', error);
      throw error;
    }
  }

  async analyzeFrame(videoElement: HTMLVideoElement) {
    if (!this.isInitialized) {
      throw new Error('ProctorService not initialized');
    }

    // Detect faces
    const detections = await faceapi.detectAllFaces(
      videoElement,
      new faceapi.TinyFaceDetectorOptions()
    );

    // Check for face violations
    if (detections.length === 0) {
      this.onViolation({
        type: 'NO_FACE',
        message: 'No face detected',
        timestamp: new Date()
      });
    } else if (detections.length > 1) {
      this.onViolation({
        type: 'MULTIPLE_FACES',
        message: `Multiple faces detected (${detections.length})`,
        timestamp: new Date(),
        details: { faceCount: detections.length }
      });
    }

    // Detect objects
    if (this.objectDetectionModel) {
      const objects = await this.objectDetectionModel.detect(videoElement);
      const suspiciousObjects = objects.filter(obj => 
        ['cell phone', 'book', 'laptop', 'remote'].includes(obj.class)
      );

      if (suspiciousObjects.length > 0) {
        this.onViolation({
          type: 'OBJECT_DETECTED',
          message: 'Suspicious objects detected',
          timestamp: new Date(),
          details: { objects: suspiciousObjects }
        });
      }
    }

    return {
      faces: detections,
      isValid: detections.length === 1
    };
  }
}
