export interface Document {
  id: number;
  fileName: string;
  originalName?: string;
  mimeType: string;
  fileSize: number;
  caseId: number;
  caseTitle: string;
  uploadedByName: string;
  uploadedById?: string;
  createdAt: string;
  updatedAt?: string;
}
