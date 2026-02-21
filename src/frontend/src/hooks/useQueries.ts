import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Relationship, RelationshipType, PetType, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Relationship Queries
export function useGetAllRelationships() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, Relationship][]>({
    queryKey: ['relationships'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllRelationships();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetRelationship(relationshipId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<Relationship | null>({
    queryKey: ['relationship', relationshipId],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getRelationship(relationshipId);
    },
    enabled: !!actor && !isFetching && !!relationshipId,
  });
}

export function useCreateRelationship() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (relationshipId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createRelationship(relationshipId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}

export function useAddPartner() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      relationshipId,
      name,
      relationshipType,
    }: {
      relationshipId: string;
      name: string;
      relationshipType: RelationshipType;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPartner(relationshipId, name, relationshipType);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}

export function useAddPet() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      relationshipId,
      name,
      petType,
      careSchedule,
      emotionalSupportNotes,
    }: {
      relationshipId: string;
      name: string;
      petType: PetType;
      careSchedule: string;
      emotionalSupportNotes: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addPet(relationshipId, name, petType, careSchedule, emotionalSupportNotes);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
    },
  });
}

// Invitation Link Queries
export function useGenerateInviteCode() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.generateInviteCode();
    },
  });
}

export function useAcceptInvitation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inviteCode: string) => {
      if (!actor) throw new Error('Actor not available');
      // Note: Backend needs to implement acceptInvitation function
      // For now, this will call submitRSVP as a placeholder
      // The backend should have a proper acceptInvitation(code: string) function
      throw new Error('Backend acceptInvitation function not yet implemented');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['relationships'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
