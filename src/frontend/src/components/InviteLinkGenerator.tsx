import { useState } from 'react';
import { useGenerateInviteCode } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Copy, Link2, Loader2, UserPlus } from 'lucide-react';
import { toast } from 'sonner';

export default function InviteLinkGenerator() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const generateInviteCode = useGenerateInviteCode();

  const handleGenerate = async () => {
    try {
      const code = await generateInviteCode.mutateAsync();
      setGeneratedCode(code);
      toast.success('Invitation link generated! 💕');
    } catch (error) {
      toast.error('Failed to generate invitation link. Please try again.');
      console.error('Error generating invite code:', error);
    }
  };

  const inviteLink = generatedCode
    ? `${window.location.origin}?invite=${generatedCode}`
    : '';

  const handleCopyLink = async () => {
    if (!inviteLink) return;

    try {
      await navigator.clipboard.writeText(inviteLink);
      toast.success('Invitation link copied to clipboard! 📋');
    } catch (error) {
      toast.error('Failed to copy link. Please try again.');
      console.error('Error copying to clipboard:', error);
    }
  };

  return (
    <Card className="border-rose-200/50 dark:border-rose-900/30 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl">
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
            <UserPlus className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl">Invite a Partner</CardTitle>
            <CardDescription>
              Generate a unique invitation link to share with your partner
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!generatedCode ? (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Create a secure invitation link that your partner can use to join your relationship network.
              They'll need to create their own account to accept the invitation.
            </p>
            <Button
              onClick={handleGenerate}
              disabled={generateInviteCode.isPending}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white"
            >
              {generateInviteCode.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4 mr-2" />
                  Generate Invitation Link
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Your Invitation Link</label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium text-rose-900 dark:text-rose-100">
                How to share this invitation:
              </p>
              <ol className="text-sm text-rose-800 dark:text-rose-200 space-y-1 list-decimal list-inside">
                <li>Copy the invitation link above</li>
                <li>Share it with your partner via your preferred method</li>
                <li>They'll click the link and create their account</li>
                <li>Once authenticated, they'll automatically join your relationship</li>
              </ol>
            </div>
            <Button
              onClick={() => setGeneratedCode(null)}
              variant="outline"
              className="w-full"
            >
              Generate Another Link
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
