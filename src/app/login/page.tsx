'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { ThemeToggle } from '@/components/theme-toggle';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function LoginPage() {
  const router = useRouter();
  const { login, error } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (role: 'student' | 'teacher') => {
    try {
      setLoading(true);
      await login(email, password, role);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background transition-colors duration-300">
      <ThemeToggle />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-[400px] shadow-lg border-2">
          <CardHeader>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                ProctorAI
              </h1>
              <p className="text-center text-muted-foreground">
                Secure online examination platform
              </p>
            </motion.div>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="student">Student</TabsTrigger>
                <TabsTrigger value="teacher">Teacher</TabsTrigger>
              </TabsList>
              {['student', 'teacher'].map((role) => (
                <TabsContent key={role} value={role}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor={`${role}-email`}>Email</Label>
                      <Input
                        id={`${role}-email`}
                        type="email"
                        placeholder={`${role.charAt(0).toUpperCase() + role.slice(1)} Email`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`${role}-password`}>Password</Label>
                      <Input
                        id={`${role}-password`}
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="transition-all duration-200 focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all duration-300"
                      onClick={() => handleLogin(role as 'student' | 'teacher')}
                      disabled={loading}
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Logging in...</span>
                        </div>
                      ) : (
                        `Login as ${role.charAt(0).toUpperCase() + role.slice(1)}`
                      )}
                    </Button>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
