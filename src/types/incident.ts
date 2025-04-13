
export type IncidentStatus = 'draft' | 'preliminary' | 'done' | 'sent to client';

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'doc';
}

export interface Incident {
  id: string;
  date: string;
  airline: string;
  arrivingAirport: string;
  departureAirport: string;
  incident: string;
  investigation: string;
  attachments: Attachment[];
  status: IncidentStatus;
  createdAt: string;
  eventNumber?: string;
  baseIATA?: string;
  registration?: string;
  flightNumber?: string;
}

export interface IncidentFormData {
  date: string;
  airline: string;
  arrivingAirport: string;
  departureAirport: string;
  incident: string;
  investigation: string;
  attachments: File[];
  eventNumber: string;
  baseIATA: string;
  registration: string;
  flightNumber: string;
}
