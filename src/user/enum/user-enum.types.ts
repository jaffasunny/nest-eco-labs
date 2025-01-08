export enum ROLES {
  ADMIN = 'super-admin',
  LANDOWNER = 'landowner',
  RESEARCHER = 'researcher',
  UNIVERSITY = 'university',
}

export type RoleType = `${ROLES}`;

export enum RESEARCHER_STATUS {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

export type ResearchStatusType = `${RESEARCHER_STATUS}`;
