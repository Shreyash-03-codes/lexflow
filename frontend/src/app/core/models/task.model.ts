export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  caseId: number;
  caseTitle: string;
  assignedToId?: string;
  assignedToName?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  caseId: number;
  assignedToId?: string;
}
