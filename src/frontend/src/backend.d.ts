import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Relationship {
    owner: Principal;
    pets: Array<Pet>;
    lastUpdated: Time;
    createdDate: Time;
    partners: Array<Partner>;
}
export interface InviteCode {
    created: Time;
    code: string;
    used: boolean;
}
export interface Pet {
    name: string;
    emotionalSupportNotes: string;
    petType: PetType;
    addedDate: Time;
    careSchedule: string;
}
export type Time = bigint;
export type PetType = {
    __kind__: "cat";
    cat: null;
} | {
    __kind__: "dog";
    dog: null;
} | {
    __kind__: "other";
    other: string;
} | {
    __kind__: "bird";
    bird: null;
};
export interface Partner {
    name: string;
    connectionDate: Time;
    relationshipType: RelationshipType;
}
export interface UserProfile {
    name: string;
}
export interface RSVP {
    name: string;
    inviteCode: string;
    timestamp: Time;
    attending: boolean;
}
export enum RelationshipType {
    pet = "pet",
    romantic = "romantic",
    friend = "friend",
    family = "family"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addPartner(relationshipId: string, name: string, relationshipType: RelationshipType): Promise<void>;
    addPet(relationshipId: string, name: string, petType: PetType, careSchedule: string, emotionalSupportNotes: string): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createRelationship(relationshipId: string): Promise<void>;
    generateInviteCode(): Promise<string>;
    getAllRSVPs(): Promise<Array<RSVP>>;
    getAllRelationships(): Promise<Array<[string, Relationship]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInviteCodes(): Promise<Array<InviteCode>>;
    getRelationship(relationshipId: string): Promise<Relationship | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitRSVP(name: string, attending: boolean, inviteCode: string): Promise<void>;
}
