'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EnhancedProctorView } from '@/components/proctor/EnhancedProctorView';
import { useProctor } from '@/context/ProctorContext';
import { Progress } from '@/components/ui/progress';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle, Clock, Shield, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function StudentDashboard() {
  const {
    violations,
    isExamActive,
    startExam,
    endExam,
    handleViolation,
    examDuration,
    timeRemaining,
  } = useProctor();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background p-8 transition-colors duration-300">
      <ThemeToggle />
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="max-w-7xl mx-auto space-y-6"
      >
        <motion.div variants={item} className="flex justify-between items-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Student Dashboard
          </h1>
          {!isExamActive && (
            <Button
              onClick={startExam}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Start Exam
            </Button>
          )}
        </motion.div>

        {isExamActive ? (
          <>
            <motion.div variants={item}>
              <Card className="border-2">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Shield className="h-6 w-6 text-purple-600" />
                      <span>Active Exam: Mathematics Test</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 bg-secondary p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="text-sm text-muted-foreground">Time Remaining</div>
                          <div className="text-xl font-bold">{formatTime(timeRemaining)}</div>
                        </div>
                      </div>
                      <Button 
                        variant="destructive"
                        onClick={endExam}
                        className="hover:bg-red-600 transition-colors"
                      >
                        End Exam
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="w-full bg-secondary rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">Progress</span>
                      <span className="text-sm font-medium">
                        {Math.round((timeRemaining / examDuration) * 100)}%
                      </span>
                    </div>
                    <Progress 
                      value={(timeRemaining / examDuration) * 100} 
                      className="h-2"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <EnhancedProctorView 
                        studentImage="/student-profile.jpg"
                        onViolation={handleViolation}
                      />
                      {violations.length > 0 && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Warning: {violations.length} violation{violations.length > 1 ? 's' : ''} detected
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                    <Card className="border-2">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          Violations Log
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ScrollArea className="h-[300px] pr-4">
                          {violations.length > 0 ? (
                            <div className="space-y-3">
                              {violations.map((violation, index) => (
                                <motion.div
                                  key={index}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                                >
                                  <div className="flex items-center gap-2">
                                    <Badge variant="destructive" className="h-6">
                                      #{index + 1}
                                    </Badge>
                                    <span>{violation}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {new Date().toLocaleTimeString()}
                                  </span>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center text-muted-foreground p-4">
                              No violations detected
                            </div>
                          )}
                        </ScrollArea>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          <motion.div variants={item}>
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Welcome to ProctorAI</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Click the "Start Exam" button when you're ready to begin your examination.
                  Make sure your webcam is properly set up and you're in a well-lit environment.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
