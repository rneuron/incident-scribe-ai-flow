
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
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="icon" onClick={handleBack} className="rounded-full shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-3xl font-bold text-slate-800">Crear Nuevo Reporte de Incidente</h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8 border border-slate-100">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-700">Fecha del Incidente</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="rounded-lg border-slate-200" />
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
                      <FormLabel className="text-slate-700">Aerolínea</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre de la aerolínea" {...field} className="rounded-lg border-slate-200" />
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
                      <FormLabel className="text-slate-700">Aeropuerto de Salida</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de aeropuerto (ej. JFK)" {...field} className="rounded-lg border-slate-200" />
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
                      <FormLabel className="text-slate-700">Aeropuerto de Llegada</FormLabel>
                      <FormControl>
                        <Input placeholder="Código de aeropuerto (ej. LAX)" {...field} className="rounded-lg border-slate-200" />
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
                    <FormLabel className="text-slate-700">Descripción del Incidente</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Proporcione una descripción detallada del incidente" 
                        className="min-h-[100px] rounded-lg border-slate-200" 
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
                    <FormLabel className="text-slate-700">Notas de Investigación</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese los hallazgos iniciales de la investigación" 
                        className="min-h-[150px] rounded-lg border-slate-200" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label className="text-slate-700">Adjuntos (Imágenes, PDFs, Documentos)</Label>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative rounded-lg border-slate-200 hover:bg-blue-50 hover:text-blue-600"
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
                    Tipos de archivo soportados: Imágenes, PDFs, documentos Word
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                    <p className="text-sm font-medium mb-3 text-slate-700">Archivos Adjuntos ({files.length})</p>
                    <div className="space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-100">
                          <div className="flex items-center">
                            <File className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm truncate max-w-xs text-slate-700">{file.name}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => removeFile(index)}
                            className="hover:bg-red-50 hover:text-red-500 rounded-full"
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
                  className="border-slate-200 text-slate-700 hover:bg-slate-100"
                >
                  Atrás
                </Button>
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
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
