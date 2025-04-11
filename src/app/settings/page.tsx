'use client';

import {Button} from '@/components/ui/button';
import {Settings, User} from 'lucide-react';
import {ArrowLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {Switch} from '@/components/ui/switch';
import {Label} from '@/components/ui/label';
import {Moon, Sun} from 'lucide-react';
import {useTheme} from 'next-themes';
import {Input} from '@/components/ui/input';
import {useState} from 'react';

export default function SettingsPage() {
  const router = useRouter();
  const {setTheme, theme} = useTheme();
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Software Engineer',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({...profile, [e.target.name]: e.target.value});
  };

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarContent>
          <SidebarHeader>
            <SidebarInput placeholder="Search..." />
          </SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => router.push('/teacher-dashboard')}>
                <ArrowLeft className="mr-2" />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <User className="mr-2" />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings className="mr-2" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarSeparator />
          <SidebarFooter>
            <Button variant="ghost" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
              {theme === 'light' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
              Toggle Theme
            </Button>
            <Button onClick={() => router.push('/teacher-dashboard')} className="mt-4">
              <ArrowLeft className="mr-2" />
              Back to Dashboard
            </Button>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <main className="flex flex-col items-center justify-start min-h-screen p-4 md:p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
          <p className="mb-4">Manage your account settings here.</p>

          {/* Profile Management Section */}
          <div className="w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Profile Management</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  name="bio"
                  value={profile.bio}
                  onChange={handleInputChange}
                  className="w-full"
                />
              </div>
              <Button className="w-full">Update Profile</Button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
