
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Plane, MapPin } from 'lucide-react';
import { useIncidents } from '@/context/IncidentContext';
import { IncidentStatus } from '@/types/incident';
import { format } from 'date-fns';

const IncidentList = () => {
  const { incidents, updateIncidentStatus } = useIncidents();
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate('/create-incident');
  };

  const handleStatusChange = (id: string, status: IncidentStatus) => {
    updateIncidentStatus(id, status);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
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

  return (
    <div className="page-container py-12 px-6">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Incident Reports</h1>
        <Button 
          onClick={handleCreateNew} 
          className="bg-blue-600 hover:bg-blue-700 text-white"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Create New Incident
        </Button>
      </div>

      <div className="card-container bg-white rounded-xl shadow-sm border border-slate-100">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="py-4"><Calendar className="h-4 w-4 inline mr-2" /> Date</TableHead>
              <TableHead><Plane className="h-4 w-4 inline mr-2" /> Airline</TableHead>
              <TableHead><MapPin className="h-4 w-4 inline mr-2" /> Departure</TableHead>
              <TableHead><MapPin className="h-4 w-4 inline mr-2" /> Arrival</TableHead>
              <TableHead><FileText className="h-4 w-4 inline mr-2" /> Incident</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12 text-slate-500">
                  No incidents found. Create your first incident report.
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
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="preliminary">Preliminary</SelectItem>
                          <SelectItem value="done">Done</SelectItem>
                          <SelectItem value="sent to client">Sent to Client</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/review-incident/${incident.id}`)}
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700"
                    >
                      View Details
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
