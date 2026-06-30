export type CaseStatus = 'OPEN' | 'IN_PROGRESS' | 'CLOSED';

export interface LegalCase {
  id: number;
  title: string;
  description: string;
  status: CaseStatus;
  clientId: number;
  clientName: string;
  assignedLawyerId?: number;
  assignedLawyerName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCaseRequest {
  title: string;
  description: string;
  clientId: number;
}
