import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useCreateRelationship, useGetAllRelationships } from './hooks/useQueries';
import { useEffect, useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InvitationAcceptance from './components/InvitationAcceptance';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';

function App() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { data: relationships, isLoading } = useGetAllRelationships();
  const createRelationship = useCreateRelationship();
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  // Check for invitation code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('invite');
    if (code) {
      setInviteCode(code);
    }
  }, []);

  // Auto-create default relationship if user is authenticated and has no relationships
  useEffect(() => {
    if (isAuthenticated && !isLoading && relationships && relationships.length === 0 && !inviteCode) {
      createRelationship.mutate('default');
    }
  }, [isAuthenticated, isLoading, relationships, inviteCode]);

  const handleInvitationSuccess = () => {
    // Clear invitation code from URL
    const url = new URL(window.location.href);
    url.searchParams.delete('invite');
    window.history.replaceState({}, '', url.toString());
    setInviteCode(null);
  };

  // Show invitation acceptance flow if there's an invite code
  if (inviteCode) {
    return (
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Layout>
          <InvitationAcceptance inviteCode={inviteCode} onSuccess={handleInvitationSuccess} />
        </Layout>
        <Toaster />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Layout>
        {!isAuthenticated ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-rose-500 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                Welcome to Relationship Harmony
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                A nurturing space to manage your polyamorous relationships and pet care with love and compassion.
              </p>
              <p className="text-base text-muted-foreground mb-8">
                Please log in to access your relationship dashboard and pet care center.
              </p>
            </div>
          </div>
        ) : isLoading ? (
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading your relationships...</p>
            </div>
          </div>
        ) : (
          <Dashboard />
        )}
      </Layout>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
