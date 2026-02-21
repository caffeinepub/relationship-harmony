import { Pet } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Cat, Dog, Bird, PawPrint, Heart, Calendar } from 'lucide-react';

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
  const getPetIcon = () => {
    if ('dog' in pet.petType) {
      return <Dog className="w-6 h-6 text-amber-600" />;
    } else if ('cat' in pet.petType) {
      return <Cat className="w-6 h-6 text-amber-600" />;
    } else if ('bird' in pet.petType) {
      return <Bird className="w-6 h-6 text-amber-600" />;
    } else {
      return <PawPrint className="w-6 h-6 text-amber-600" />;
    }
  };

  const getPetType = () => {
    if ('dog' in pet.petType) return 'Dog';
    if ('cat' in pet.petType) return 'Cat';
    if ('bird' in pet.petType) return 'Bird';
    if ('other' in pet.petType) return pet.petType.other;
    return 'Pet';
  };

  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Card className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-amber-200/50 dark:border-amber-900/30 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              {getPetIcon()}
            </div>
            <div>
              <CardTitle className="text-xl">{pet.name}</CardTitle>
              <Badge className="mt-1 bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-0">
                {getPetType()}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm">
          <Calendar className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div>
            <span className="font-medium text-foreground">Added: </span>
            <span className="text-muted-foreground">{formatDate(pet.addedDate)}</span>
          </div>
        </div>

        {pet.careSchedule && (
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <PawPrint className="w-4 h-4 text-amber-500" />
              <span className="font-medium text-sm">Care Schedule</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap">{pet.careSchedule}</p>
          </div>
        )}

        {pet.emotionalSupportNotes && (
          <div className="space-y-1 bg-rose-50/50 dark:bg-rose-950/20 rounded-xl p-3 border border-rose-200/30 dark:border-rose-900/30">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="font-medium text-sm text-rose-700 dark:text-rose-400">Emotional Support</span>
            </div>
            <p className="text-sm text-muted-foreground pl-6 whitespace-pre-wrap">
              {pet.emotionalSupportNotes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
