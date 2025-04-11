'use client';

import * as faceapi from 'face-api.js';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import screenfull from 'screenfull';

export interface ViolationEvent {
  type: 'NO_FACE' | 'MULTIPLE_FACES' | 'UNKNOWN_FACE' | 'OBJECT_DETECTED' | 'TAB_SWITCH' | 'FULLSCREEN_EXIT';
  message: string;
  timestamp: Date;
  details?: any;
}

export class EnhancedProctorService {
  private faceDetectionNet: faceapi.TinyFaceDetector;
  private faceRecognitionNet: faceapi.FaceRecognitionNet;
  private objectDetectionModel: cocoSsd.ObjectDetection | null = null;
  private isInitialized = false;
  private onViolation: (event: ViolationEvent) => void;
  private knownFaceDescriptor: Float32Array | null = null;
  private lastActiveTime: number = Date.now();
  private tabFocusListener: any;
  private fullscreenListener: any;
  private lastViolationTime: { [key: string]: number } = {};
  private violationCooldown = 3000; // 3 seconds cooldown between same type of violations

  constructor(onViolation: (event: ViolationEvent) => void) {
    this.onViolation = onViolation;
    this.faceDetectionNet = new faceapi.TinyFaceDetector();
    this.faceRecognitionNet = new faceapi.FaceRecognitionNet();
  }

  private canTriggerViolation(type: ViolationEvent['type']): boolean {
    const now = Date.now();
    if (!this.lastViolationTime[type] || now - this.lastViolationTime[type] >= this.violationCooldown) {
      this.lastViolationTime[type] = now;
      return true;
    }
    return false;
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log('Loading face-api.js models...');
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models')
      ]);
      console.log('Face-api.js models loaded successfully');

      console.log('Loading TensorFlow object detection model...');
      this.objectDetectionModel = await cocoSsd.load();
      console.log('TensorFlow model loaded successfully');

      this.setupTabSwitchDetection();
      this.setupFullscreenMonitoring();
      
      this.isInitialized = true;
      console.log('EnhancedProctorService initialized successfully');
    } catch (error) {
      console.error('Error initializing EnhancedProctorService:', error);
      throw error;
    }
  }

  private setupTabSwitchDetection() {
    console.log('Setting up tab switch detection');
    this.tabFocusListener = () => {
      if (document.hidden && this.canTriggerViolation('TAB_SWITCH')) {
        console.log('Tab switch detected!');
        this.onViolation({
          type: 'TAB_SWITCH',
          message: 'Warning: Tab switching detected',
          timestamp: new Date()
        });
      }
    };

    document.addEventListener('visibilitychange', this.tabFocusListener);
  }

  private setupFullscreenMonitoring() {
    console.log('Setting up fullscreen monitoring');
    this.fullscreenListener = () => {
      if (screenfull.isEnabled && !screenfull.isFullscreen && this.canTriggerViolation('FULLSCREEN_EXIT')) {
        console.log('Fullscreen exit detected!');
        this.onViolation({
          type: 'FULLSCREEN_EXIT',
          message: 'Warning: Fullscreen mode exited',
          timestamp: new Date()
        });
      }
    };

    if (screenfull.isEnabled) {
      document.addEventListener(screenfull.raw.fullscreenchange, this.fullscreenListener);
    }
  }

  async setKnownFace(faceImageElement: HTMLImageElement) {
    console.log('Attempting to set known face...');
    try {
      const detection = await faceapi
        .detectSingleFace(faceImageElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (detection) {
        this.knownFaceDescriptor = detection.descriptor;
        console.log('Known face set successfully');
        return true;
      }
      console.log('No face detected in profile image');
      return false;
    } catch (error) {
      console.error('Error setting known face:', error);
      return false;
    }
  }

  async enterFullscreen(element: HTMLElement) {
    if (screenfull.isEnabled) {
      try {
        await screenfull.request(element);
        console.log('Entered fullscreen mode');
      } catch (error) {
        console.error('Error entering fullscreen:', error);
      }
    }
  }

  async analyzeFrame(videoElement: HTMLVideoElement) {
    if (!this.isInitialized) {
      throw new Error('EnhancedProctorService not initialized');
    }

    try {
      // Detect faces
      console.log('Analyzing video frame...');
      const detections = await faceapi
        .detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      // Check for face violations
      if (detections.length === 0) {
        if (this.canTriggerViolation('NO_FACE')) {
          console.log('No face detected!');
          this.onViolation({
            type: 'NO_FACE',
            message: 'Warning: No face detected',
            timestamp: new Date()
          });
        }
      } else if (detections.length > 1) {
        if (this.canTriggerViolation('MULTIPLE_FACES')) {
          console.log(`Multiple faces detected: ${detections.length}`);
          this.onViolation({
            type: 'MULTIPLE_FACES',
            message: `Warning: Multiple faces detected (${detections.length})`,
            timestamp: new Date(),
            details: { faceCount: detections.length }
          });
        }
      } else if (this.knownFaceDescriptor) {
        // Compare detected face with known face
        const distance = faceapi.euclideanDistance(
          detections[0].descriptor,
          this.knownFaceDescriptor
        );
        if (distance > 0.6 && this.canTriggerViolation('UNKNOWN_FACE')) {
          console.log('Unknown face detected! Distance:', distance);
          this.onViolation({
            type: 'UNKNOWN_FACE',
            message: 'Warning: Unknown person detected',
            timestamp: new Date(),
            details: { distance }
          });
        }
      }

      // Detect objects
      if (this.objectDetectionModel) {
        const objects = await this.objectDetectionModel.detect(videoElement);
        const suspiciousObjects = objects.filter(obj => 
          ['cell phone', 'book', 'laptop', 'remote'].includes(obj.class)
        );

        if (suspiciousObjects.length > 0 && this.canTriggerViolation('OBJECT_DETECTED')) {
          console.log('Suspicious objects detected:', suspiciousObjects);
          this.onViolation({
            type: 'OBJECT_DETECTED',
            message: `Warning: Prohibited items detected: ${suspiciousObjects.map(obj => obj.class).join(', ')}`,
            timestamp: new Date(),
            details: { objects: suspiciousObjects }
          });
        }
      }

      return {
        faces: detections,
        isValid: detections.length === 1
      };
    } catch (error) {
      console.error('Error analyzing frame:', error);
      return {
        faces: [],
        isValid: false
      };
    }
  }

  cleanup() {
    console.log('Cleaning up EnhancedProctorService');
    document.removeEventListener('visibilitychange', this.tabFocusListener);
    if (screenfull.isEnabled) {
      document.removeEventListener(screenfull.raw.fullscreenchange, this.fullscreenListener);
    }
  }
}
