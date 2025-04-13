
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Upload, X, File } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentFormData } from '@/types/incident';
import { toast } from '@/hooks/use-toast';

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
      attachments: []
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
    
    navigate(`/revisar-incidente/${incidentId}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-6 max-w-3xl mx-auto">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold">Crear Nuevo Reporte de Incidente</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha del Incidente</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
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
                        <Input placeholder="Ingrese el nombre de la aerolínea" {...field} />
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
                        <Input placeholder="Código de aeropuerto (ej. JFK)" {...field} />
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
                        <Input placeholder="Código de aeropuerto (ej. LAX)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="incident"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción del Incidente</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Proporcione una descripción detallada del incidente" 
                        className="min-h-[100px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="investigation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notas de Investigación</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese los hallazgos iniciales de la investigación" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label>Adjuntos (Imágenes, PDFs, Documentos)</Label>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative"
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
                  <p className="text-sm text-muted-foreground">
                    Tipos de archivo soportados: Imágenes, PDFs, documentos Word
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Archivos Adjuntos ({files.length})</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2" />
                            <span className="text-sm truncate max-w-xs">{file.name}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(index)}
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
                <Button type="button" variant="outline" onClick={handleBack}>
                  Atrás
                </Button>
                <Button type="submit">
                  Proceder a Revisar
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
