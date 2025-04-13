
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Check, Paperclip, Send } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { IncidentStatus } from '@/types/incident';

const IncidentReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIncidentById, updateIncidentReport, updateIncidentStatus } = useIncidents();
  
  const incident = getIncidentById(id!);
  const [feedback, setFeedback] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string }[]>([]);
  const [showAttachment, setShowAttachment] = useState<string | null>(null);

  if (!incident) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4 text-slate-800">Incidente No Encontrado</h1>
          <p className="mb-6 text-slate-600">El reporte de incidente que está buscando no existe o ha sido eliminado.</p>
          <Button onClick={() => navigate('/')} className="bg-blue-600 hover:bg-blue-700 text-white">
            Volver a Incidentes
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { role: 'user', content: feedback }]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = `He actualizado el reporte según su solicitud: "${feedback}"`;
      setChatHistory(prev => [...prev, { role: 'ai', content: aiResponse }]);
      
      // Update the report with the feedback
      updateIncidentReport(id!, `${incident.investigation}\n\nActualización (${new Date().toLocaleTimeString()}): ${feedback}`);
      
      // Clear the feedback input
      setFeedback('');
    }, 1000);
  };

  const handleStatusChange = (status: IncidentStatus) => {
    updateIncidentStatus(id!, status);
    
    const statusLabels: Record<IncidentStatus, string> = {
      'draft': 'borrador',
      'preliminary': 'preliminar',
      'done': 'completado',
      'sent to client': 'enviado al cliente'
    };
    
    toast({
      title: "Estado Actualizado",
      description: `El reporte ha sido marcado como ${statusLabels[status]}.`
    });
    
    if (status === 'done' || status === 'sent to client') {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)]">
        <div className="flex items-center space-x-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => navigate('/')} className="rounded-full shadow-sm">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-slate-800">Revisión de Reporte de Incidente</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          {/* Left Column - Incident Details */}
          <div className="bg-slate-100 rounded-xl shadow-sm p-6 border border-slate-200 flex flex-col h-full overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 pb-3 border-b border-slate-200">
              Detalles del Incidente
            </h2>
            
            <div className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Fecha del Incidente</p>
                  <p className="font-medium text-slate-800">{formatDate(incident.date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Número de Evento</p>
                  <p className="font-medium text-slate-800">{incident.eventNumber || '-'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Aerolínea</p>
                <p className="font-medium text-slate-800">{incident.airline}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Base IATA</p>
                  <p className="font-medium text-slate-800">{incident.baseIATA || '-'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Matrícula</p>
                  <p className="font-medium text-slate-800">{incident.registration || '-'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Número de Vuelo</p>
                <p className="font-medium text-slate-800">{incident.flightNumber || '-'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Salida</p>
                  <p className="font-medium text-slate-800">{incident.departureAirport}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Llegada</p>
                  <p className="font-medium text-slate-800">{incident.arrivingAirport}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Descripción del Incidente</p>
                <p className="mt-1 text-slate-700">{incident.incident}</p>
              </div>

              {incident.attachments.length > 0 && (
                <div>
                  <p className="text-sm text-slate-500 mb-2">Adjuntos</p>
                  <div className="space-y-2">
                    {incident.attachments.map((attachment) => (
                      <div 
                        key={attachment.id} 
                        className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-slate-50 border border-slate-200 transition-colors"
                        onClick={() => setShowAttachment(attachment.url)}
                      >
                        <Paperclip className="h-4 w-4 mr-2 text-blue-500" />
                        <span className="text-sm text-slate-700">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Report Content */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-full lg:col-span-1 overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 pb-3 border-b border-slate-100">
              Reporte Generado
            </h2>
            <div className="prose prose-sm max-w-none bg-slate-50 p-5 rounded-lg border border-slate-100 flex-grow">
              <p className="whitespace-pre-line">{incident.investigation}</p>
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-100 flex flex-col h-full overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-slate-800 pb-3 border-b border-slate-100">
              Asistente IA
            </h2>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p>Pida al asistente IA que le ayude a mejorar su reporte o hacer cambios en el contenido.</p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-blue-50 ml-4 border border-blue-100' 
                        : 'bg-slate-50 mr-4 border border-slate-100'
                    }`}
                  >
                    <p className="text-sm">
                      {message.content}
                    </p>
                  </div>
                ))
              )}
            </div>
            
            <div className="flex gap-2">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escriba sus comentarios o preguntas aquí..."
                className="min-h-[80px] resize-none"
              />
              <Button 
                className="self-end" 
                size="icon" 
                onClick={handleSendFeedback}
                disabled={!feedback.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 flex items-center">
              <Select
                onValueChange={handleStatusChange}
                defaultValue={incident.status}
              >
                <SelectTrigger className="w-full bg-blue-600 hover:bg-blue-700 text-white border-0">
                  <Check className="mr-2 h-4 w-4" />
                  <span>Marcar como:</span>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Borrador</SelectItem>
                  <SelectItem value="preliminary">Preliminar</SelectItem>
                  <SelectItem value="done">Completado</SelectItem>
                  <SelectItem value="sent to client">Enviado al Cliente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Attachment Preview Dialog */}
      <Dialog open={!!showAttachment} onOpenChange={() => setShowAttachment(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vista Previa del Adjunto</DialogTitle>
          </DialogHeader>
          {showAttachment && (
            showAttachment.includes('pdf') ? (
              <div className="h-[70vh]">
                <iframe 
                  src={showAttachment} 
                  className="w-full h-full" 
                  title="Vista Previa PDF"
                />
              </div>
            ) : (
              <div className="flex justify-center">
                <img 
                  src={showAttachment} 
                  alt="Adjunto" 
                  className="max-h-[70vh] object-contain"
                />
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IncidentReview;
