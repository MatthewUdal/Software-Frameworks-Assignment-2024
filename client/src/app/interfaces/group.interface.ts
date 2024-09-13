export interface Group {
    _id: string;
    memberIDs: string[];
    name: string;
    adminIDs: string[];
    blacklistedIDs: string[];
  }
  