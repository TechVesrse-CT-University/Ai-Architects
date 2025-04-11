'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { ViolationEvent } from '@/services/enhanced-proctor-service';

interface ProctorContextType {
  violations: ViolationEvent[];
  isExamActive: boolean;
  startExam: () => void;
  endExam: () => void;
  handleViolation: (violation: ViolationEvent) => void;
  examDuration: number;
  timeRemaining: number;
}

const ProctorContext = createContext<ProctorContextType | undefined>(undefined);

export function ProctorProvider({ children }: { children: React.ReactNode }) {
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examDuration] = useState(3600); // 1 hour in seconds
  const [timeRemaining, setTimeRemaining] = useState(examDuration);
  const { toast } = useToast();

  const handleViolation = useCallback((violation: ViolationEvent) => {
    console.log('Violation detected:', violation);
    
    setViolations(prev => {
      const newViolations = [...prev, violation];
      // Store violations in localStorage for persistence
      localStorage.setItem('examViolations', JSON.stringify(newViolations));
      return newViolations;
    });

    // Show toast notification
    toast({
      title: 'Violation Detected',
      description: violation.message,
      variant: 'destructive',
      duration: 5000,
    });

    // End exam if too many violations
    if (violations.length >= 5) {
      endExam();
      toast({
        title: 'Exam Terminated',
        description: 'Too many violations detected.',
        variant: 'destructive',
        duration: 10000,
      });
    }
  }, [violations.length, toast]);

  const startExam = useCallback(() => {
    setIsExamActive(true);
    setTimeRemaining(examDuration);
    setViolations([]);
    localStorage.removeItem('examViolations');
  }, [examDuration]);

  const endExam = useCallback(() => {
    setIsExamActive(false);
    setTimeRemaining(0);
    // Store final violations
    localStorage.setItem('lastExamViolations', JSON.stringify(violations));
  }, [violations]);

  // Timer effect
  useEffect(() => {
    if (!isExamActive) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          endExam();
          toast({
            title: 'Exam Ended',
            description: 'Time is up!',
            variant: 'default',
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isExamActive, endExam, toast]);

  // Load violations from localStorage on mount
  useEffect(() => {
    const storedViolations = localStorage.getItem('examViolations');
    if (storedViolations) {
      setViolations(JSON.parse(storedViolations));
    }
  }, []);

  const value = {
    violations,
    isExamActive,
    startExam,
    endExam,
    handleViolation,
    examDuration,
    timeRemaining,
  };

  return (
    <ProctorContext.Provider value={value}>
      {children}
    </ProctorContext.Provider>
  );
}

export function useProctor() {
  const context = useContext(ProctorContext);
  if (context === undefined) {
    throw new Error('useProctor must be used within a ProctorProvider');
  }
  return context;
}
