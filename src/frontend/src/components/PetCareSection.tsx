import { Pet } from '../backend';
import PetCard from './PetCard';
import AddPetModal from './AddPetModal';
import { PawPrint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface PetCareSectionProps {
  relationshipId: string;
  pets: Pet[];
}

export default function PetCareSection({ relationshipId, pets }: PetCareSectionProps) {
  const [showAddPet, setShowAddPet] = useState(false);

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <PawPrint className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-foreground">Pet Care & Support</h2>
            <p className="text-muted-foreground">Companions who bring joy and emotional comfort</p>
          </div>
        </div>
        <Button
          onClick={() => setShowAddPet(true)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg"
        >
          Add Pet
        </Button>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl p-12 text-center border border-amber-200/50 dark:border-amber-900/30 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-10 h-10 text-amber-500" />
          </div>
          <h3 className="text-xl font-semibold mb-2">No pets yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your furry, feathered, or scaled companions who provide emotional support
          </p>
          <Button
            onClick={() => setShowAddPet(true)}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
          >
            Add Your First Pet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pets.map((pet, index) => (
            <PetCard key={index} pet={pet} />
          ))}
        </div>
      )}

      <AddPetModal open={showAddPet} onOpenChange={setShowAddPet} relationshipId={relationshipId} />
    </section>
  );
}
