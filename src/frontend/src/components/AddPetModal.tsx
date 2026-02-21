import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import PetForm from './PetForm';

interface AddPetModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relationshipId: string;
}

export default function AddPetModal({ open, onOpenChange, relationshipId }: AddPetModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add a Pet</DialogTitle>
          <DialogDescription>
            Welcome your companion who brings joy and emotional support to your life.
          </DialogDescription>
        </DialogHeader>
        <PetForm relationshipId={relationshipId} onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
