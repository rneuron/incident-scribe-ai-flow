
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
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

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Incident Reports</h1>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Incident
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Airline</TableHead>
              <TableHead>Departure</TableHead>
              <TableHead>Arrival</TableHead>
              <TableHead>Incident</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  No incidents found. Create your first incident report.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow key={incident.id}>
                  <TableCell>{formatDate(incident.date)}</TableCell>
                  <TableCell>{incident.airline}</TableCell>
                  <TableCell>{incident.departureAirport}</TableCell>
                  <TableCell>{incident.arrivingAirport}</TableCell>
                  <TableCell className="max-w-xs truncate">{incident.incident}</TableCell>
                  <TableCell>
                    <Select 
                      defaultValue={incident.status}
                      onValueChange={(value) => handleStatusChange(incident.id, value as IncidentStatus)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="preliminary">Preliminary</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="sent to client">Sent to Client</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate(`/review-incident/${incident.id}`)}
                    >
                      View
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
