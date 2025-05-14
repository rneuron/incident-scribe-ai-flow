
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Paperclip, Send, Download, Check } from 'lucide-react';
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold mb-4 text-indigo-700">Incidente No Encontrado</h1>
          <p className="mb-6 text-slate-600">El reporte de incidente que está buscando no existe o ha sido eliminado.</p>
          <Button onClick={() => navigate('/')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
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
    <div className="min-h-screen bg-slate-50 py-4">
      <div className="container mx-auto h-[calc(100vh-2rem)] px-4">
        <div className="flex items-center space-x-3 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="rounded-full">
            <ArrowLeft className="h-4 w-4 text-indigo-600" />
          </Button>
          <h1 className="text-2xl font-bold text-indigo-700">Revisión de Reporte de Incidente</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-8rem)]">
          {/* Left Column - Incident Details */}
          <div className="bg-slate-100 rounded-lg shadow-sm p-6 border border-slate-200 flex flex-col h-full overflow-y-auto lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                Detalles del Incidente
              </h2>
              <Button variant="ghost" size="sm" className="text-indigo-600">
                <Edit className="h-4 w-4 mr-1" />
                Editar
              </Button>
            </div>
            <p className="text-sm text-slate-500 mb-6">Información básica del evento reportado</p>
            
            <div className="space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Fecha del Incidente</p>
                  <p className="font-medium text-slate-800">{formatDate(incident.date)}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Número de Evento</p>
                  <p className="font-medium text-slate-800">{incident.eventNumber || 'EV-2025-042'}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500 mb-1">Tipo de Reporte</p>
                <p className="font-medium text-slate-800 inline-flex items-center">
                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                  Calidad
                </p>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Aerolínea</p>
                <p className="font-medium text-slate-800">{incident.airline}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
                <div>
                  <p className="text-sm text-slate-500 mb-1">Base IATA</p>
                  <p className="font-medium text-slate-800">{incident.baseIATA || 'JFK'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-slate-500 mb-1">Matrícula</p>
                  <p className="font-medium text-slate-800">{incident.registration || 'N12345'}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-slate-500 mb-1">Número de Vuelo</p>
                <p className="font-medium text-slate-800">{incident.flightNumber || 'AE789'}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-x-4">
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
                <p className="text-sm text-slate-500 mb-1">Descripción de la Novedad</p>
                <p className="mt-1 text-slate-700 text-sm">{incident.incident}</p>
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
                        <Paperclip className="h-4 w-4 mr-2 text-indigo-500" />
                        <span className="text-sm text-slate-700">{attachment.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Middle Column - Report Content */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 flex flex-col h-full lg:col-span-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-indigo-700">
                Reporte Generado
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600">
                  <Edit className="h-4 w-4 mr-1" />
                  Modificar
                </Button>
                <Button variant="outline" size="sm" className="border-indigo-200 text-indigo-600">
                  <Download className="h-4 w-4 mr-1" />
                  Descargar
                </Button>
              </div>
            </div>

            <div className="prose prose-sm max-w-none flex-grow">
              <div className="mb-6">
                <p className="text-right mb-4">Medellín, {formatDate(incident.date)}</p>
                
                <p className="mb-4">Señores<br/>[Nombre del cliente – Ej. AVIANCA]</p>
                
                <p className="mb-4 font-medium">ASUNTO: Respuesta a Evento Novedad [{incident.eventNumber || 'Número de evento'}]</p>
                
                <p className="mb-4">Cordial saludo,</p>
                
                <p className="mb-4">A continuación, damos respuesta a la novedad generada en la base [{incident.baseIATA || 'Base en siglas IATA'}]</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Descripción del reporte:</h3>
                <p className="mb-4">Fecha de ocurrencia: {formatDate(incident.date)}<br/>
                Matrícula: {incident.registration || '[Ej. N000AV]'}<br/>
                Vuelo: {incident.flightNumber || '[Ej. AV0000]'}<br/>
                Origen: {incident.departureAirport || '[Ej. BOG]'}<br/>
                Destino: {incident.arrivingAirport || '[Ej. MDE]'}</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Descripción del evento:</h3>
                <p className="mb-4">{incident.incident || '[Descripción detallada]'}</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Análisis de causa raíz (5 ¿Por qué?):</h3>
                <p className="mb-4">{incident.investigation || '[Desarrollo del análisis]'}</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Factor(es) contribuyente(s):</h3>
                <p className="mb-4">[Descripción]</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Causa raíz identificada:</h3>
                <p className="mb-4">[Descripción]</p>
                
                <h3 className="text-indigo-700 font-medium mb-2">Planes de acción:</h3>
                <p className="mb-8">[Acciones correctivas y preventivas, responsables y fechas]</p>
                
                <p className="mb-2">Firmas:</p>
                <div className="border-b border-slate-300 w-48 h-10 mb-2"></div>
                <p>Nombre y cargo</p>
              </div>
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-slate-200 flex flex-col h-full lg:col-span-4 overflow-hidden">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 pb-3 border-b border-slate-100">
              Asistente IA
            </h2>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatHistory.length === 0 ? (
                <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 my-6">
                  <p className="text-sm text-slate-600">
                    Necesito actualizar la sección de "Análisis de causa raíz" para incluir un análisis más detallado de los factores técnicos.
                  </p>
                </div>
              ) : (
                chatHistory.map((message, index) => (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-indigo-50 ml-4 border border-indigo-100' 
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
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex gap-2 mb-2">
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Escriba sus comentarios o preguntas aquí..."
                  className="min-h-[80px] resize-none border-slate-300"
                />
                <Button 
                  className="self-end bg-indigo-600 hover:bg-indigo-700" 
                  size="icon" 
                  onClick={handleSendFeedback}
                  disabled={!feedback.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-indigo-600 mr-1" />
                  <span className="text-sm font-medium">Marcar como:</span>
                </div>
                
                <Select
                  onValueChange={handleStatusChange}
                  defaultValue={incident.status}
                >
                  <SelectTrigger className="w-[180px] bg-indigo-600 text-white border-0">
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
