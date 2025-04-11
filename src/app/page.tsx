'use client';

import {Button} from '@/components/ui/button';
import {ArrowRight, Loader2} from 'lucide-react';
import {useState} from 'react';
import {useRouter} from 'next/navigation';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [activeButton, setActiveButton] = useState<string | null>(null); // 'student' or 'teacher'

  const handleStudentLogin = () => {
    setActiveButton('student');
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/student-dashboard');
    }, 2000);
  };

  const handleTeacherLogin = () => {
    setActiveButton('teacher');
    setIsLoading(true);
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/teacher-dashboard');
    }, 2000);
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 md:p-24 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
      {/* Animated Bubbles Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(10)].map((_, index) => (
          <div
            key={index}
            className="absolute rounded-full bg-white opacity-20 animate-float"
            style={{
              left: `${Math.random() * 100}vw`,
              animationDuration: `${Math.random() * 3 + 2}s`,
              top: `${Math.random() * 100}vh`,
              width: `${Math.random() * 10 + 10}px`,
              height: `${Math.random() * 10 + 10}px`,
            }}
          />
        ))}
      </div>

      <div className="grid place-items-center h-full w-full relative z-10">
        <h1 className="text-5xl font-bold text-center mb-4 text-gray-800">
          <span className="text-blue-600">Proctor</span>AI
        </h1>
        <div className="grid grid-cols-1 gap-8">
          {/* Student Login */}
          <div className="border rounded-lg p-6 shadow-md flex flex-col items-center transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Student Login
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Login to access your exams and view results.
            </p>
            <Button
              className="w-full md:w-auto hover:shadow-lg transition-shadow flex items-center justify-center"
              onClick={handleStudentLogin}
              disabled={isLoading}
            >
              {isLoading && activeButton === 'student' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Student Login
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </div>
          {/* Teacher Login */}
          <div className="border rounded-lg p-6 shadow-md flex flex-col items-center transition-all duration-300 transform hover:scale-105 bg-white/80 backdrop-blur-sm animate-fade-in">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">
              Teacher Login
            </h2>
            <p className="text-gray-600 mb-4 text-center">
              Login to manage exams and view student proctoring data.
            </p>
            <Button
              className="w-full md:w-auto hover:shadow-lg transition-shadow flex items-center justify-center"
              onClick={handleTeacherLogin}
              disabled={isLoading}
            >
              {isLoading && activeButton === 'teacher' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  Teacher Login
                  <ArrowRight className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

