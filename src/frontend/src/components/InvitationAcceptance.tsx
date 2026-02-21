import { useEffect, useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile, useSaveCallerUserProfile, useAcceptInvitation } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

interface InvitationAcceptanceProps {
  inviteCode: string;
  onSuccess: () => void;
}

export default function InvitationAcceptance({ inviteCode, onSuccess }: InvitationAcceptanceProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveCallerUserProfile();
  const acceptInvitation = useAcceptInvitation();
  const [name, setName] = useState('');
  const [step, setStep] = useState<'auth' | 'profile' | 'accepting' | 'complete'>('auth');

  const isAuthenticated = !!identity;

  useEffect(() => {
    if (!isAuthenticated) {
      setStep('auth');
    } else if (profileLoading) {
      setStep('profile');
    } else if (isFetched && userProfile === null) {
      setStep('profile');
    } else if (isFetched && userProfile) {
      setStep('accepting');
      handleAcceptInvitation();
    }
  }, [isAuthenticated, profileLoading, isFetched, userProfile]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please try again.');
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    try {
      await saveProfile.mutateAsync({ name: name.trim() });
      setStep('accepting');
      handleAcceptInvitation();
    } catch (error) {
      toast.error('Failed to save profile. Please try again.');
      console.error('Error saving profile:', error);
    }
  };

  const handleAcceptInvitation = async () => {
    try {
      await acceptInvitation.mutateAsync(inviteCode);
      setStep('complete');
      toast.success('Welcome to the relationship! 💕');
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (error) {
      toast.error('Failed to accept invitation. The code may be invalid or expired.');
      console.error('Error accepting invitation:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full border-rose-200/50 dark:border-rose-900/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl">Join a Relationship</CardTitle>
              <CardDescription>
                You've been invited to join a relationship network
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {step === 'auth' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                To accept this invitation, you'll need to authenticate with Internet Identity.
              </p>
              <Button
                onClick={handleLogin}
                disabled={loginStatus === 'logging-in'}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              >
                {loginStatus === 'logging-in' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Log In to Accept
                  </>
                )}
              </Button>
            </div>
          )}

          {step === 'profile' && !profileLoading && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Before joining, please tell us your name so your partner can recognize you.
              </p>
              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={saveProfile.isPending}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Continue'
                )}
              </Button>
            </form>
          )}

          {(step === 'accepting' || profileLoading) && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
              <p className="text-muted-foreground">
                {profileLoading ? 'Loading your profile...' : 'Accepting invitation...'}
              </p>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto">
                <Heart className="w-8 h-8 text-rose-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Welcome! 💕</h3>
                <p className="text-muted-foreground">
                  You've successfully joined the relationship. Redirecting to your dashboard...
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
