
import React from 'react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { IncidentFormData } from '@/types/incident';

interface IncidentDetailsFormProps {
  control: Control<IncidentFormData>;
  handleAirlineChange: (value: string) => void;
  handleFlightNumberChange: (value: string) => void;
}

const IncidentDetailsForm: React.FC<IncidentDetailsFormProps> = ({ 
  control, 
  handleAirlineChange, 
  handleFlightNumberChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={control}
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
        control={control}
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

      <div className="relative">
        <FormField
          control={control}
          name="airline"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Aerolínea
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Auto-completa otros campos</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ingrese nombre de aerolínea" 
                  {...field}
                  onChange={(e) => handleAirlineChange(e.target.value)} 
                  className="border-slate-300" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
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
        control={control}
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

      <div className="relative">
        <FormField
          control={control}
          name="flightNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="flex items-center">
                Número de Vuelo
                <span className="ml-2 bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded">Auto-completa otros campos</span>
              </FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ej. LA2456" 
                  {...field} 
                  onChange={(e) => handleFlightNumberChange(e.target.value)}
                  className="border-slate-300" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
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
        control={control}
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
  );
};

export default IncidentDetailsForm;
