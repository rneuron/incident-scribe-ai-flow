
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { ArrowLeft } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentFormData } from '@/types/incident';
import { toast } from '@/hooks/use-toast';
import ReportTypeSelector from '@/components/incidents/ReportTypeSelector';
import ManualSelectionSection from '@/components/incidents/ManualSelectionSection';
import IncidentDetailsForm from '@/components/incidents/IncidentDetailsForm';
import CauseAnalysisForm from '@/components/incidents/CauseAnalysisForm';

const CreateIncident = () => {
  const { addIncident } = useIncidents();
  const navigate = useNavigate();
  const [autoFillTriggered, setAutoFillTriggered] = useState(false);

  const form = useForm<IncidentFormData>({
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
      airline: '',
      arrivingAirport: '',
      departureAirport: '',
      incident: '',
      investigation: '',
      attachments: [],
      eventNumber: '',
      baseIATA: '',
      registration: '',
      flightNumber: '',
      reportType: 'quality',
      selectedManuals: []
    }
  });

  const handleFlightNumberChange = (value: string) => {
    form.setValue('flightNumber', value);
    
    // Only auto-fill if both airline and flight number are filled
    if (value && form.getValues('airline') && !autoFillTriggered) {
      // Simulate auto-filling based on flight number and airline
      setTimeout(() => {
        // This is just a demonstration - in a real app you would fetch this data
        form.setValue('departureAirport', 'BOG');
        form.setValue('arrivingAirport', 'MDE');
        form.setValue('registration', 'HK-4321');
        form.setValue('baseIATA', 'BOG');
        
        setAutoFillTriggered(true);
        
        toast({
          title: "Datos completados automáticamente",
          description: "Campos adicionales han sido rellenados basados en el número de vuelo y aerolínea."
        });
      }, 500);
    }
  };

  const handleAirlineChange = (value: string) => {
    form.setValue('airline', value);
    
    // Reset auto-fill trigger if airline changes
    if (autoFillTriggered) {
      setAutoFillTriggered(false);
    }
  };

  const onSubmit = (data: IncidentFormData) => {
    const incidentId = addIncident(data);
    
    toast({
      title: "Incidente Creado",
      description: "Su reporte de incidente ha sido creado exitosamente"
    });
    
    navigate(`/review-incident/${incidentId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto py-4 px-4">
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
            <ArrowLeft className="h-4 w-4 text-indigo-600" />
          </Button>
          <h1 className="text-2xl font-bold text-indigo-700">Crear Nuevo Reporte de Incidente</h1>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Tipo de Reporte */}
              <ReportTypeSelector control={form.control} />
              
              {/* Selección de Manuales */}
              <ManualSelectionSection control={form.control} />

              {/* Información básica */}
              <IncidentDetailsForm 
                control={form.control}
                handleAirlineChange={handleAirlineChange}
                handleFlightNumberChange={handleFlightNumberChange}
              />

              {/* Causas Raíces, Novedad y Notas de Investigación */}
              <CauseAnalysisForm control={form.control} />

              <div className="flex justify-between pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleBack}
                  className="border-slate-300"
                >
                  Volver
                </Button>
                <Button 
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Proceder a Revisión
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CreateIncident;
