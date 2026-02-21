import { useGetAllRelationships } from '../hooks/useQueries';
import PartnerCard from './PartnerCard';
import PetCareSection from './PetCareSection';
import InviteLinkGenerator from './InviteLinkGenerator';
import { Users, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const { data: relationships, isLoading } = useGetAllRelationships();

  // Get the first relationship or create a default ID
  const relationshipId = relationships && relationships.length > 0 ? relationships[0][0] : 'default';
  const relationship = relationships && relationships.length > 0 ? relationships[0][1] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-rose-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your relationships...</p>
        </div>
      </div>
    );
  }

  const partners = relationship?.partners || [];
  const pets = relationship?.pets || [];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Partners Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center shadow-lg">
            <Users className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Partners</h2>
            <p className="text-muted-foreground">Nurture your connections with love and care</p>
          </div>
        </div>

        {/* Invitation Link Generator */}
        <InviteLinkGenerator />

        {partners.length === 0 ? (
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-rose-200/50 dark:border-rose-900/30 shadow-xl">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No partners yet</h3>
            <p className="text-muted-foreground">
              Generate an invitation link above to invite your first partner to join your relationship network
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {partners.map((partner, index) => (
              <PartnerCard key={index} partner={partner} />
            ))}
          </div>
        )}
      </section>

      {/* Pet Care Section */}
      <PetCareSection relationshipId={relationshipId} pets={pets} />
    </div>
  );
}
