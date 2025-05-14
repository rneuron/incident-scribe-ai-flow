
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Incident, IncidentStatus, IncidentFormData, Attachment } from '../types/incident';

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: IncidentFormData) => string;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  getIncidentById: (id: string) => Incident | undefined;
  updateIncidentReport: (id: string, report: string) => void;
  deleteIncident: (id: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};

export const IncidentProvider = ({ children }: { children: ReactNode }) => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      date: '2025-04-08',
      airline: 'Aerolíneas Ejemplo',
      arrivingAirport: 'LAX',
      departureAirport: 'JFK',
      incident: 'Retraso de vuelo debido a problemas mecánicos',
      investigation: 'La inspección inicial reveló un problema en el sistema de combustible',
      attachments: [
        { id: '1', name: 'informe.pdf', url: '#', type: 'pdf' }
      ],
      status: 'preliminary',
      createdAt: '2025-04-07',
      eventNumber: 'EV-2025-042',
      baseIATA: 'JFK',
      registration: 'N12345',
      flightNumber: 'AE789',
      selectedManuals: ['manual4']
    },
    {
      id: '2',
      date: '2025-04-06',
      airline: 'Sky Express',
      arrivingAirport: 'ORD',
      departureAirport: 'ATL',
      incident: 'Problema de carga',
      investigation: 'Error de distribución de peso en el manifiesto de carga',
      attachments: [],
      status: 'draft',
      createdAt: '2025-04-06',
      eventNumber: 'EV-2025-041',
      baseIATA: 'ATL',
      registration: 'N54321',
      flightNumber: 'SE456',
      selectedManuals: ['manual2', 'manual5']
    },
    {
      id: '3',
      date: '2025-04-05',
      airline: 'Global Air',
      arrivingAirport: 'DFW',
      departureAirport: 'SFO',
      incident: 'Lesión menor por turbulencia',
      investigation: 'El pasajero no tenía el cinturón de seguridad abrochado',
      attachments: [
        { id: '2', name: 'informe-lesion.pdf', url: '#', type: 'pdf' }
      ],
      status: 'done',
      createdAt: '2025-04-05',
      eventNumber: 'EV-2025-040',
      baseIATA: 'SFO',
      registration: 'N98765',
      flightNumber: 'GA123',
      selectedManuals: ['manual1']
    }
  ]);

  const addIncident = (formData: IncidentFormData): string => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const attachments: Attachment[] = formData.attachments.map((file, index) => ({
      id: `${id}-${index}`,
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.includes('image') 
        ? 'image' 
        : file.type.includes('pdf') 
          ? 'pdf' 
          : 'doc'
    }));

    const newIncident: Incident = {
      id,
      ...formData,
      attachments,
      status: 'draft',
      createdAt: new Date().toISOString(),
    };

    setIncidents(prev => [newIncident, ...prev]);
    return id;
  };

  const updateIncidentStatus = (id: string, status: IncidentStatus) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === id 
          ? { ...incident, status } 
          : incident
      )
    );
  };

  const getIncidentById = (id: string) => {
    return incidents.find(incident => incident.id === id);
  };

  const updateIncidentReport = (id: string, investigation: string) => {
    setIncidents(prev => 
      prev.map(incident => 
        incident.id === id 
          ? { ...incident, investigation } 
          : incident
      )
    );
  };

  const deleteIncident = (id: string) => {
    setIncidents(prev => prev.filter(incident => incident.id !== id));
  };

  return (
    <IncidentContext.Provider 
      value={{ 
        incidents, 
        addIncident, 
        updateIncidentStatus, 
        getIncidentById,
        updateIncidentReport,
        deleteIncident
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
