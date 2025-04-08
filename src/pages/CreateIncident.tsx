
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
            title: "Invalid file type",
            description: "Only images, PDFs, and documents are allowed",
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
      title: "Incident Created",
      description: "Your incident report has been created successfully"
    });
    
    navigate(`/review-incident/${incidentId}`);
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
          <h1 className="text-3xl font-bold">Create New Incident Report</h1>
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
                      <FormLabel>Date of Incident</FormLabel>
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
                      <FormLabel>Airline</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter airline name" {...field} />
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
                      <FormLabel>Departure Airport</FormLabel>
                      <FormControl>
                        <Input placeholder="Airport code (e.g., JFK)" {...field} />
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
                      <FormLabel>Arriving Airport</FormLabel>
                      <FormControl>
                        <Input placeholder="Airport code (e.g., LAX)" {...field} />
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
                    <FormLabel>Incident Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide a detailed description of the incident" 
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
                    <FormLabel>Investigation Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter initial investigation findings" 
                        className="min-h-[150px]" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <Label>Attachments (Images, PDFs, Documents)</Label>
                
                <div className="flex items-center gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="relative"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Add Files
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
                    Supported file types: Images, PDFs, Word documents
                  </p>
                </div>

                {files.length > 0 && (
                  <div className="border rounded-md p-4">
                    <p className="text-sm font-medium mb-2">Attached Files ({files.length})</p>
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
                  Back
                </Button>
                <Button type="submit">
                  Proceed to Review
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
