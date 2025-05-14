
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Download, Send, Check, Paperclip, Info, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';
import { IncidentStatus } from '@/types/incident';
import { Card, CardContent } from '@/components/ui/card';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const IncidentReview = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIncidentById, updateIncidentReport, updateIncidentStatus } = useIncidents();
  
  const incident = getIncidentById(id!);
  const [feedback, setFeedback] = useState('');
  const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai'; content: string; timestamp?: string }[]>([
    {
      role: 'ai',
      content: `He generado un reporte inicial basado en la información proporcionada. Se utilizó como referencia el **${getManualName(incident?.selectedManuals?.[0] || 'manual4')}**, Sección 4.3 - "Procedimiento de investigación de incidentes".\n\nA continuación, el reporte generado para el evento ${incident?.eventNumber || 'EV-2025-042'}:`,
      timestamp: new Date().toISOString()
    }
  ]);
  const [showAttachment, setShowAttachment] = useState<string | null>(null);
  const [statusValue, setStatusValue] = useState<IncidentStatus>(incident?.status || 'draft');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    incident: false,
    investigation: false
  });

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

  function getManualName(manualId: string): string {
    const manuals: {[key: string]: string} = {
      'manual1': 'Manual de Operaciones (MO)',
      'manual2': 'Manual General de Mantenimiento (MGM)',
      'manual3': 'Manual de Vuelo de la Aeronave (AFM)',
      'manual4': 'Manual de Control de Calidad (QCM)',
      'manual5': 'Manual de Operaciones de Tierra (GOM)',
    };
    return manuals[manualId] || 'Manual de Control de Calidad (QCM)';
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSendFeedback = () => {
    if (!feedback.trim()) return;
    
    // Add user message to chat history
    setChatHistory(prev => [...prev, { 
      role: 'user', 
      content: feedback,
      timestamp: new Date().toISOString()
    }]);
    
    // Simulate AI response
    setTimeout(() => {
      // Determine which manual to reference
      const manualId = incident.selectedManuals && incident.selectedManuals.length > 0 
        ? incident.selectedManuals[0] 
        : 'manual4';
      
      const manualName = getManualName(manualId);
      
      const aiResponse = `He actualizado el reporte según su solicitud: "${feedback}".\n\nSe tomó como referencia el ${manualName}, sección 4.3.2 - "Actualización de reportes basados en nueva información".`;
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: aiResponse,
        timestamp: new Date().toISOString()
      }]);
      
      // Update the report with the feedback
      updateIncidentReport(id!, `${incident.investigation}\n\nActualización (${new Date().toLocaleTimeString()}): ${feedback}`);
      
      // Clear the feedback input
      setFeedback('');
    }, 1000);
  };

  const handleStatusChange = (status: IncidentStatus) => {
    updateIncidentStatus(id!, status);
    setStatusValue(status);
    
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

        {/* Incident Details Card - Horizontal with improved information display */}
        <div className="mb-6">
          <Card className="bg-gray-100 border border-gray-200">
            <CardContent className="p-6">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-indigo-700 mb-4">
                      Detalles del Incidente
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Número de Evento</p>
                        <p className="font-medium text-slate-800">{incident.eventNumber || 'EV-2025-042'}</p>
                        
                        <p className="text-sm text-slate-500 mb-1 mt-4">Fecha del Incidente</p>
                        <p className="font-medium text-slate-800">{formatDate(incident.date)}</p>
                        
                        <p className="text-sm text-slate-500 mb-1 mt-4">Tipo de Reporte</p>
                        <p className="font-medium text-slate-800 inline-flex items-center">
                          <span className="h-2 w-2 rounded-full bg-green-500 mr-2"></span>
                          {incident.reportType === 'safety' ? 'Seguridad Operacional' : 'Calidad'}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Aerolínea</p>
                        <p className="font-medium text-slate-800">{incident.airline}</p>
                        
                        <p className="text-sm text-slate-500 mb-1 mt-4">Base IATA</p>
                        <p className="font-medium text-slate-800">{incident.baseIATA || 'JFK'}</p>
                        
                        <p className="text-sm text-slate-500 mb-1 mt-4">Matrícula</p>
                        <p className="font-medium text-slate-800">{incident.registration || 'N12345'}</p>
                        
                        <p className="text-sm text-slate-500 mb-1 mt-4">Número de Vuelo</p>
                        <p className="font-medium text-slate-800">{incident.flightNumber || 'AE789'}</p>
                      </div>
                      
                      <div>
                        <div className="flex items-start space-x-4 mb-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div className="border border-slate-200 rounded-md bg-white p-3">
                                  <p className="text-sm text-slate-500 mb-1">Ruta</p>
                                  <div className="flex items-center">
                                    <div className="text-center">
                                      <p className="font-medium text-slate-800">{incident.departureAirport || 'BOG'}</p>
                                      <p className="text-xs text-slate-500">Salida</p>
                                    </div>
                                    <div className="mx-2 text-slate-400">→</div>
                                    <div className="text-center">
                                      <p className="font-medium text-slate-800">{incident.arrivingAirport || 'MDE'}</p>
                                      <p className="text-xs text-slate-500">Llegada</p>
                                    </div>
                                  </div>
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Ruta del vuelo {incident.flightNumber}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                        
                        {incident.selectedManuals && incident.selectedManuals.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm text-slate-500 mb-1 flex items-center">
                              <FileText className="h-4 w-4 mr-1" />
                              Manuales de Referencia
                            </p>
                            <div className="flex flex-wrap gap-2 mt-1">
                              {incident.selectedManuals.map((manualId) => (
                                <span key={manualId} className="bg-indigo-100 text-indigo-700 text-xs px-2 py-1 rounded">
                                  {getManualName(manualId)}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Expandable/Collapsible Sections for longer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {/* Novedad Section */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('incident')}
                    >
                      <h3 className="font-medium text-indigo-700">Descripción de la Novedad</h3>
                      {expandedSections.incident ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                    
                    <div className={`mt-2 text-sm text-slate-700 ${expandedSections.incident ? '' : 'line-clamp-2'}`}>
                      {incident.incident || 
                        "Factor Humano: Error de juicio, Falta de comunicación, Fatiga\n" +
                        "Factor Técnico: Falla de equipo, Mantenimiento inadecuado, Diseño deficiente\n" +
                        "Factor Organizacional: Procedimiento inadecuado, Presión operacional, Cultura de seguridad"
                      }
                    </div>
                    
                    {!expandedSections.incident && incident.incident && incident.incident.length > 100 && (
                      <div className="text-xs text-indigo-600 mt-1 cursor-pointer" onClick={() => toggleSection('incident')}>
                        Ver más...
                      </div>
                    )}
                  </div>
                  
                  {/* Notas de Investigación Section */}
                  <div className="bg-white rounded-lg border border-slate-200 p-4">
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('investigation')}
                    >
                      <h3 className="font-medium text-indigo-700">Notas de Investigación</h3>
                      {expandedSections.investigation ? (
                        <ChevronUp className="h-4 w-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-slate-500" />
                      )}
                    </div>
                    
                    <div className={`mt-2 text-sm text-slate-700 ${expandedSections.investigation ? '' : 'line-clamp-2'}`}>
                      {incident.investigation || "No hay notas de investigación disponibles."}
                    </div>
                    
                    {!expandedSections.investigation && incident.investigation && incident.investigation.length > 100 && (
                      <div className="text-xs text-indigo-600 mt-1 cursor-pointer" onClick={() => toggleSection('investigation')}>
                        Ver más...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Chat UI */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between border-b border-slate-100 p-4">
            <h2 className="text-xl font-semibold text-indigo-700">
              Generador de Reportes IA
            </h2>
            
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Marcar como:</span>
              <Select
                value={statusValue}
                onValueChange={handleStatusChange}
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
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message, index) => (
              <div 
                key={index} 
                className={`p-4 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-indigo-50 ml-12 border border-indigo-100' 
                    : 'bg-white mr-12 border border-slate-200'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">
                    {message.role === 'user' ? 'Tú' : 'Asistente de Reportes IA'}
                  </h3>
                  {message.timestamp && (
                    <span className="text-xs text-slate-500">
                      {format(new Date(message.timestamp), 'HH:mm')}
                    </span>
                  )}
                </div>
                
                {message.role === 'ai' && index === 0 ? (
                  <div className="space-y-4">
                    <p className="whitespace-pre-line text-sm">{message.content}</p>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                      <div className="flex justify-between mb-2">
                        <h4 className="font-medium text-indigo-700">Reporte Generado</h4>
                        <Button variant="outline" size="sm" className="h-7 px-2">
                          <Download className="h-3.5 w-3.5 mr-1" />
                          Descargar
                        </Button>
                      </div>
                      
                      <div className="prose prose-sm max-w-none">
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
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="whitespace-pre-line text-sm">{message.content}</p>
                )}
                
                {message.role === 'ai' && index > 0 && (
                  <Button variant="outline" size="sm" className="mt-2">
                    <Download className="h-3.5 w-3.5 mr-1" />
                    Descargar este reporte
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <div className="border-t border-slate-100 p-4">
            <div className="flex gap-2">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Escriba sus comentarios o solicitudes para refinar el reporte..."
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
            
            <p className="text-xs text-slate-500 mt-2 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Puede solicitar ajustes específicos o generar un nuevo reporte con diferentes enfoques
            </p>
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
