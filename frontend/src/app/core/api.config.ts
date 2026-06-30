import { environment } from '../../environments/environment';

export const API = {
  BASE_URL: environment.apiUrl,

  AUTH: {
    LOGIN: '/auth/login',
  },

  USERS: {
    BASE: '/users',
    BY_ID: (id: number) => `/users/${id}`,
    DISABLE: (id: number) => `/users/${id}/disable`,
  },

  CLIENTS: {
    BASE: '/clients',
    BY_ID: (id: number) => `/clients/${id}`,
  },

  CASES: {
    BASE: '/cases',
    BY_ID: (id: number) => `/cases/${id}`,
    ASSIGN_LAWYER: (id: number) => `/cases/${id}/assign`,
    STATUS: (id: number) => `/cases/${id}/status`,
  },

  TASKS: {
    BASE: '/tasks',
    BY_CASE: (caseId: number) => `/tasks/case/${caseId}`,
    COMPLETE: (id: number) => `/tasks/${id}/complete`,
  },

  DOCUMENTS: {
    BASE: '/documents',
    UPLOAD: '/documents/upload',
    BY_CASE: (caseId: number) => `/documents/case/${caseId}`,
    DOWNLOAD: (id: number) => `/documents/${id}/download`,
  },

  SEARCH: {
    QUERY: (q: string) => `/search?q=${encodeURIComponent(q)}`,
  },

  DASHBOARD: {
    ADMIN: '/dashboard/admin',
    LAWYER: '/dashboard/lawyer',
    CLIENT: (clientId: number) => `/dashboard/client/${clientId}`,
  },
};
