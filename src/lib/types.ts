export type UserSummary = {
  id: string;
  email: string;
  name: string;
};

export type ShareRole = "viewer" | "editor";
export type AccessRole = "owner" | ShareRole;

export type DocumentListItem = {
  id: string;
  title: string;
  updatedAt: string;
  createdAt: string;
  owner: UserSummary;
  access: AccessRole;
  _count?: { versions: number; files: number };
};

export type DocumentShare = {
  id: string;
  role: ShareRole;
  user: UserSummary;
};

export type DocumentVersion = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: UserSummary;
};

export type Attachment = {
  id: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  createdAt: string;
};

export type DocumentDetail = {
  id: string;
  title: string;
  content: string;
  updatedAt: string;
  createdAt: string;
  owner: UserSummary;
  shares: DocumentShare[];
  versions: DocumentVersion[];
  files: Attachment[];
};
