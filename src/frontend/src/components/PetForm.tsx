import { useState } from 'react';
import { useAddPet } from '../hooks/useQueries';
import { PetType } from '../backend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface PetFormProps {
  relationshipId: string;
  onSuccess: () => void;
}

export default function PetForm({ relationshipId, onSuccess }: PetFormProps) {
  const [name, setName] = useState('');
  const [petType, setPetType] = useState<string>('');
  const [otherType, setOtherType] = useState('');
  const [careSchedule, setCareSchedule] = useState('');
  const [emotionalSupportNotes, setEmotionalSupportNotes] = useState('');
  const addPet = useAddPet();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error('Please enter a pet name');
      return;
    }

    if (!petType) {
      toast.error('Please select a pet type');
      return;
    }

    if (petType === 'other' && !otherType.trim()) {
      toast.error('Please specify the pet type');
      return;
    }

    let petTypeValue: PetType;
    if (petType === 'dog') {
      petTypeValue = { __kind__: 'dog', dog: null };
    } else if (petType === 'cat') {
      petTypeValue = { __kind__: 'cat', cat: null };
    } else if (petType === 'bird') {
      petTypeValue = { __kind__: 'bird', bird: null };
    } else {
      petTypeValue = { __kind__: 'other', other: otherType.trim() };
    }

    try {
      await addPet.mutateAsync({
        relationshipId,
        name: name.trim(),
        petType: petTypeValue,
        careSchedule: careSchedule.trim(),
        emotionalSupportNotes: emotionalSupportNotes.trim(),
      });
      toast.success(`${name} has been added to your pet family! 🐾`);
      setName('');
      setPetType('');
      setOtherType('');
      setCareSchedule('');
      setEmotionalSupportNotes('');
      onSuccess();
    } catch (error) {
      toast.error('Failed to add pet. Please try again.');
      console.error('Error adding pet:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="pet-name">Pet Name *</Label>
        <Input
          id="pet-name"
          placeholder="Enter pet's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="pet-type">Pet Type *</Label>
        <Select value={petType} onValueChange={setPetType}>
          <SelectTrigger id="pet-type">
            <SelectValue placeholder="Select pet type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="dog">Dog</SelectItem>
            <SelectItem value="cat">Cat</SelectItem>
            <SelectItem value="bird">Bird</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {petType === 'other' && (
        <div className="space-y-2">
          <Label htmlFor="other-type">Specify Pet Type *</Label>
          <Input
            id="other-type"
            placeholder="e.g., Rabbit, Hamster, Fish"
            value={otherType}
            onChange={(e) => setOtherType(e.target.value)}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="care-schedule">Care Schedule</Label>
        <Textarea
          id="care-schedule"
          placeholder="e.g., Feed twice daily, walk in the morning and evening, vet checkup monthly"
          value={careSchedule}
          onChange={(e) => setCareSchedule(e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="emotional-support">Emotional Support Notes</Label>
        <Textarea
          id="emotional-support"
          placeholder="How does this pet provide emotional support and comfort?"
          value={emotionalSupportNotes}
          onChange={(e) => setEmotionalSupportNotes(e.target.value)}
          rows={3}
          className="border-rose-200 dark:border-rose-900/30 focus-visible:ring-rose-500"
        />
        <p className="text-xs text-muted-foreground">
          Share how your companion brings joy and emotional wellbeing to your life
        </p>
      </div>

      <Button
        type="submit"
        disabled={addPet.isPending}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
      >
        {addPet.isPending ? 'Adding...' : 'Add Pet'}
      </Button>
    </form>
  );
}
