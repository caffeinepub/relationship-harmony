import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import InviteLinksModule "invite-links/invite-links-module";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Invite links system state
  let inviteState = InviteLinksModule.initState();

  type RelationshipType = {
    #romantic;
    #friend;
    #family;
    #pet;
  };

  type Partner = {
    name : Text;
    relationshipType : RelationshipType;
    connectionDate : Time.Time;
  };

  type PetType = {
    #dog;
    #cat;
    #bird;
    #other : Text;
  };

  type Pet = {
    name : Text;
    petType : PetType;
    careSchedule : Text;
    emotionalSupportNotes : Text;
    addedDate : Time.Time;
  };

  type Relationship = {
    partners : [Partner];
    pets : [Pet];
    createdDate : Time.Time;
    lastUpdated : Time.Time;
    owner : Principal;
  };

  type UserProfile = {
    name : Text;
  };

  module Partner {
    public func compare(a : Partner, b : Partner) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  module Pet {
    public func compare(a : Pet, b : Pet) : Order.Order {
      Text.compare(a.name, b.name);
    };
  };

  let relationships = Map.empty<Text, Relationship>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Relationship management
  public shared ({ caller }) func createRelationship(relationshipId : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can create relationships");
    };

    switch (relationships.get(relationshipId)) {
      case (?_) { Runtime.trap("Relationship ID already exists") };
      case (null) {
        let currentTime = Time.now();
        let newRelationship : Relationship = {
          partners = [];
          pets = [];
          createdDate = currentTime;
          lastUpdated = currentTime;
          owner = caller;
        };

        relationships.add(relationshipId, newRelationship);
      };
    };
  };

  public shared ({ caller }) func addPartner(relationshipId : Text, name : Text, relationshipType : RelationshipType) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add partners");
    };

    let currentTime = Time.now();
    let newPartner : Partner = {
      name;
      relationshipType;
      connectionDate = currentTime;
    };

    switch (relationships.get(relationshipId)) {
      case (null) { Runtime.trap("Relationship not found") };
      case (?relationship) {
        if (relationship.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the relationship owner can add partners");
        };

        let partnerList = List.fromArray<Partner>(relationship.partners);
        partnerList.add(newPartner);
        let updatedPartners = partnerList.values().toArray().sort();
        let updatedRelationship = {
          relationship with
          partners = updatedPartners;
          lastUpdated = currentTime;
        };
        relationships.add(relationshipId, updatedRelationship);
      };
    };
  };

  public shared ({ caller }) func addPet(relationshipId : Text, name : Text, petType : PetType, careSchedule : Text, emotionalSupportNotes : Text) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can add pets");
    };

    let currentTime = Time.now();
    let newPet : Pet = {
      name;
      petType;
      careSchedule;
      emotionalSupportNotes;
      addedDate = currentTime;
    };

    switch (relationships.get(relationshipId)) {
      case (null) { Runtime.trap("Relationship not found") };
      case (?relationship) {
        if (relationship.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the relationship owner can add pets");
        };

        let petList = List.fromArray<Pet>(relationship.pets);
        petList.add(newPet);
        let updatedPets = petList.values().toArray().sort();
        let updatedRelationship = {
          relationship with
          pets = updatedPets;
          lastUpdated = currentTime;
        };
        relationships.add(relationshipId, updatedRelationship);
      };
    };
  };

  public query ({ caller }) func getRelationship(relationshipId : Text) : async ?Relationship {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view relationships");
    };

    switch (relationships.get(relationshipId)) {
      case (null) { null };
      case (?relationship) {
        if (relationship.owner != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only the relationship owner can view this relationship");
        };
        ?relationship;
      };
    };
  };

  public query ({ caller }) func getAllRelationships() : async [(Text, Relationship)] {
    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view relationships");
    };

    if (AccessControl.isAdmin(accessControlState, caller)) {
      relationships.toArray();
    } else {
      relationships.toArray().filter(func((id, rel) : (Text, Relationship)) : Bool {
        rel.owner == caller;
      });
    };
  };

  // Invite links functionality
  public shared ({ caller }) func generateInviteCode() : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can generate invite codes");
    };
    "";
  };

  public func submitRSVP(name : Text, attending : Bool, inviteCode : Text) : async () {
    InviteLinksModule.submitRSVP(inviteState, name, attending, inviteCode);
  };

  public query ({ caller }) func getAllRSVPs() : async [InviteLinksModule.RSVP] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view RSVPs");
    };
    InviteLinksModule.getAllRSVPs(inviteState);
  };

  public query ({ caller }) func getInviteCodes() : async [InviteLinksModule.InviteCode] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view invite codes");
    };
    InviteLinksModule.getInviteCodes(inviteState);
  };
};
