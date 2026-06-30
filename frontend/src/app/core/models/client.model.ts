export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
  enabled: boolean;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  phone: string;
  address: string;
}
