
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Incident, IncidentStatus, IncidentFormData } from '../types/incident';

interface IncidentContextType {
  incidents: Incident[];
  addIncident: (incident: IncidentFormData) => string;
  updateIncidentStatus: (id: string, status: IncidentStatus) => void;
  getIncidentById: (id: string) => Incident | undefined;
  updateIncidentReport: (id: string, report: string) => void;
}

const IncidentContext = createContext<IncidentContextType | undefined>(undefined);

export const useIncidents = () => {
  const context = useContext(IncidentContext);
  if (!context) {
    throw new Error('useIncidents must be used within an IncidentProvider');
  }
  return context;
};

export const IncidentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incidents, setIncidents] = useState<Incident[]>([
    {
      id: '1',
      date: '2025-04-08',
      airline: 'Example Airlines',
      arrivingAirport: 'LAX',
      departureAirport: 'JFK',
      incident: 'Flight delay due to mechanical issues',
      investigation: 'Initial inspection revealed fuel system problem',
      attachments: [
        { id: '1', name: 'report.pdf', url: '#', type: 'pdf' }
      ],
      status: 'preliminary',
      createdAt: '2025-04-07'
    },
    {
      id: '2',
      date: '2025-04-06',
      airline: 'Sky Express',
      arrivingAirport: 'ORD',
      departureAirport: 'ATL',
      incident: 'Cargo loading issue',
      investigation: 'Weight distribution error in loading manifest',
      attachments: [],
      status: 'draft',
      createdAt: '2025-04-06'
    },
    {
      id: '3',
      date: '2025-04-05',
      airline: 'Global Air',
      arrivingAirport: 'DFW',
      departureAirport: 'SFO',
      incident: 'Minor turbulence injury',
      investigation: 'Passenger did not have seatbelt fastened',
      attachments: [
        { id: '2', name: 'injury-report.pdf', url: '#', type: 'pdf' }
      ],
      status: 'done',
      createdAt: '2025-04-05'
    }
  ]);

  const addIncident = (formData: IncidentFormData): string => {
    const id = Math.random().toString(36).substring(2, 9);
    
    const attachments = formData.attachments.map((file, index) => ({
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

  return (
    <IncidentContext.Provider 
      value={{ 
        incidents, 
        addIncident, 
        updateIncidentStatus, 
        getIncidentById,
        updateIncidentReport
      }}
    >
      {children}
    </IncidentContext.Provider>
  );
};
