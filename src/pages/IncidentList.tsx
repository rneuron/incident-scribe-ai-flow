
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Plane, MapPin, PenLine } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentStatus } from '@/types/incident';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const IncidentList = () => {
  const { incidents, updateIncidentStatus } = useIncidents();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/crear-incidente');
  };

  const handleStatusChange = (id: string, status: IncidentStatus) => {
    updateIncidentStatus(id, status);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'dd MMM, yyyy', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  const getStatusBadgeClass = (status: IncidentStatus): string => {
    switch (status) {
      case 'draft': return 'bg-slate-200 text-slate-700';
      case 'preliminary': return 'bg-amber-100 text-amber-800';
      case 'done': return 'bg-emerald-100 text-emerald-800';
      case 'sent to client': return 'bg-blue-100 text-blue-800';
      default: return 'bg-slate-200 text-slate-700';
    }
  };

  const translateStatus = (status: IncidentStatus): string => {
    switch (status) {
      case 'draft': return 'Borrador';
      case 'preliminary': return 'Preliminar';
      case 'done': return 'Finalizado';
      case 'sent to client': return 'Enviado al Cliente';
      default: return status;
    }
  };

  return (
    <div className="page-container py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Reportes de Incidentes</h1>
        <Button 
          onClick={handleCreateNew} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Crear Nuevo Incidente
        </Button>
      </div>

      <div className="card-container bg-white rounded-xl shadow-sm border border-slate-100">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="py-4 whitespace-nowrap"><Calendar className="h-4 w-4 inline mr-2" /> Fecha</TableHead>
              <TableHead className="whitespace-nowrap"><Plane className="h-4 w-4 inline mr-2" /> Aerolínea</TableHead>
              <TableHead className="whitespace-nowrap"><MapPin className="h-4 w-4 inline mr-2" /> Salida</TableHead>
              <TableHead className="whitespace-nowrap"><MapPin className="h-4 w-4 inline mr-2" /> Llegada</TableHead>
              <TableHead className="whitespace-nowrap"><FileText className="h-4 w-4 inline mr-2" /> Incidente</TableHead>
              <TableHead className="whitespace-nowrap">Estado</TableHead>
              <TableHead className="text-right whitespace-nowrap">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  No se encontraron incidentes. Cree su primer reporte de incidente.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow key={incident.id} className="hover:bg-slate-50">
                  <TableCell className="font-medium">{formatDate(incident.date)}</TableCell>
                  <TableCell>{incident.airline}</TableCell>
                  <TableCell>{incident.departureAirport}</TableCell>
                  <TableCell>{incident.arrivingAirport}</TableCell>
                  <TableCell className="max-w-xs truncate">{incident.incident}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span className={`w-2 h-2 rounded-full mr-2 ${
                        incident.status === 'draft' ? 'bg-slate-500' :
                        incident.status === 'preliminary' ? 'bg-amber-500' :
                        incident.status === 'done' ? 'bg-emerald-500' :
                        'bg-blue-500'
                      }`}></span>
                      <Select 
                        defaultValue={incident.status}
                        onValueChange={(value) => handleStatusChange(incident.id, value as IncidentStatus)}
                      >
                        <SelectTrigger className={`w-36 h-8 text-xs ${getStatusBadgeClass(incident.status)} border-none`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Borrador</SelectItem>
                          <SelectItem value="preliminary">Preliminar</SelectItem>
                          <SelectItem value="done">Finalizado</SelectItem>
                          <SelectItem value="sent to client">Enviado al Cliente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/revisar-incidente/${incident.id}`)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      <PenLine className="h-4 w-4 mr-1" />
                      Editar Reporte
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default IncidentList;
