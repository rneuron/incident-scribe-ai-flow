
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentFormData } from '@/types/incident';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

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

  const availableManuals = [
    { id: 'manual1', label: 'Manual de Operaciones (MO)' },
    { id: 'manual2', label: 'Manual General de Mantenimiento (MGM)' },
    { id: 'manual3', label: 'Manual de Vuelo de la Aeronave (AFM)' },
    { id: 'manual4', label: 'Manual de Control de Calidad (QCM)' },
    { id: 'manual5', label: 'Manual de Operaciones de Tierra (GOM)' },
  ];

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
              <div className="bg-sky-50 rounded-lg p-5 border border-sky-100">
                <h2 className="font-medium text-lg mb-4 text-indigo-800">Tipo de Reporte</h2>
                <FormField
                  control={form.control}
                  name="reportType"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quality" id="quality" />
                            <div>
                              <Label htmlFor="quality" className="font-medium">Calidad</Label>
                              <p className="text-sm text-slate-500">Reporte de incidente de calidad</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="safety" id="safety" />
                            <div>
                              <Label htmlFor="safety" className="font-medium">Seguridad Operacional</Label>
                              <p className="text-sm text-slate-500">Reporte de seguridad operacional</p>
                            </div>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Selección de Manuales */}
              <div className="bg-sky-50 rounded-lg p-5 border border-sky-100">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="font-medium text-lg text-indigo-800">Manuales de Referencia</h2>
                  <div className="flex items-center text-sky-700 text-sm">
                    <Info className="h-4 w-4 mr-1" />
                    <p>Elija el manual que debe ser utilizado por el modelo. En caso de no ser seleccionado, el modelo lo seleccionará por usted.</p>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="selectedManuals"
                  render={() => (
                    <FormItem>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableManuals.map((manual) => (
                          <FormField
                            key={manual.id}
                            control={form.control}
                            name="selectedManuals"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={manual.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(manual.id)}
                                      onCheckedChange={(checked) => {
                                        const currentValues = field.value || [];
                                        return checked
                                          ? field.onChange([...currentValues, manual.id])
                                          : field.onChange(
                                              currentValues.filter((value) => value !== manual.id)
                                            );
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    {manual.label}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                    </FormItem>
                  )}
                />
              </div>

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha del Incidente</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="eventNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Evento</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese número de evento" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative">
                  <FormField
                    control={form.control}
                    name="airline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Aerolínea
                          <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Auto-completa otros campos</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ingrese nombre de aerolínea" 
                            {...field}
                            onChange={(e) => handleAirlineChange(e.target.value)} 
                            className="border-slate-300" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="baseIATA"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base (siglas IATA)</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. BOG, MEX, LIM" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Matrícula</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese matrícula de la aeronave" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="relative">
                  <FormField
                    control={form.control}
                    name="flightNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          Número de Vuelo
                          <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Auto-completa otros campos</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Ej. LA2456" 
                            {...field} 
                            onChange={(e) => handleFlightNumberChange(e.target.value)}
                            className="border-slate-300" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="departureAirport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aeropuerto de Salida</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de aeropuerto (ej. JFK)" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arrivingAirport"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aeropuerto de Llegada</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de aeropuerto (ej. LAX)" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Causas Raíces */}
              <FormField
                control={form.control}
                name="incident"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Causas Raíces</FormLabel>
                    <p className="text-sm text-slate-500 mb-2">
                      Edite el siguiente listado de causas potenciales seleccionando las que apliquen al evento
                    </p>
                    <FormControl>
                      <Textarea 
                        placeholder="Factor Humano: Error de juicio, Falta de comunicación, Fatiga
Factor Técnico: Falla de equipo, Mantenimiento inadecuado, Diseño deficiente
Factor Organizacional: Procedimiento inadecuado, Presión operacional, Cultura de seguridad" 
                        className="min-h-[120px] border-slate-300" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Novedad */}
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
                <h2 className="font-medium text-indigo-800 mb-3">Novedad</h2>
                <Textarea 
                  placeholder="Registra el incidente informado por el cliente"
                  className="min-h-[100px] border-slate-300"
                  onChange={(e) => {
                    // This is just for the UI, not affecting the form data
                  }}
                />
              </div>

              {/* Notas de Investigación */}
              <FormField
                control={form.control}
                name="investigation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Investigación</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese la información recolectada y el análisis realizado. Sé detallado para mejorar trazabilidad y calidad" 
                        className="min-h-[150px] border-slate-300" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
