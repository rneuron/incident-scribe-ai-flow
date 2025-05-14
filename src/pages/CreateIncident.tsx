
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, X, File, Download } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentFormData } from '@/types/incident';
import { toast } from '@/hooks/use-toast';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const CreateIncident = () => {
  const { addIncident } = useIncidents();
  const navigate = useNavigate();
  const [files, setFiles] = useState<File[]>([]);

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
      reportType: 'quality'
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles = newFiles.filter(file => {
        const isValid = 
          file.type.includes('image') || 
          file.type.includes('pdf') || 
          file.type.includes('msword') ||
          file.type.includes('officedocument');
        
        if (!isValid) {
          toast({
            title: "Tipo de archivo inválido",
            description: "Solo se permiten imágenes, PDFs y documentos",
            variant: "destructive"
          });
        }
        
        return isValid;
      });
      
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = (data: IncidentFormData) => {
    const formData = {
      ...data,
      attachments: files
    };
    
    const incidentId = addIncident(formData);
    
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

                <FormField
                  control={form.control}
                  name="airline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Aerolínea</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese nombre de aerolínea" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

                <FormField
                  control={form.control}
                  name="flightNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Vuelo</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej. LA2456" {...field} className="border-slate-300" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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

              {/* Adjuntos */}
              <div className="bg-sky-50 p-5 rounded-lg border border-sky-100">
                <h2 className="font-medium text-indigo-800 mb-3">Adjuntos (Imágenes, PDFs, Documentos)</h2>
                
                <div className="flex items-center gap-4 mb-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Agregar Archivos
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                      accept="image/*,application/pdf,.doc,.docx"
                    />
                  </Button>
                  <p className="text-sm text-slate-500">
                    Formatos soportados: Imágenes, PDFs, documentos Word
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="border rounded-md p-4 bg-white">
                    <p className="text-sm font-medium mb-2">Archivos Adjuntos ({files.length})</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-slate-50 p-2 rounded-md">
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2 text-indigo-500" />
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(index)}
                            className="text-slate-400 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

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
