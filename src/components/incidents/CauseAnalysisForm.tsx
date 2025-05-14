
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
import { IncidentFormData } from '@/types/incident';

interface CauseAnalysisFormProps {
  control: Control<IncidentFormData>;
}

const CauseAnalysisForm: React.FC<CauseAnalysisFormProps> = ({ control }) => {
  return (
    <>
      {/* Causas Raíces */}
      <FormField
        control={control}
        name="incident"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Causas Raíces</FormLabel>
            <p className="text-sm text-slate-500 mb-2">
              Edite el siguiente listado de causas potenciales seleccionando las que apliquen al evento
            </p>
            <FormControl>
              <Textarea 
                placeholder="Factor Humano: Error de juicio, Falta de comunicación, Fatiga
Factor Técnico: Falla de equipo, Mantenimiento inadecuado, Diseño deficiente
Factor Organizacional: Procedimiento inadecuado, Presión operacional, Cultura de seguridad" 
                className="min-h-[120px] border-slate-300" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Novedad */}
      <div className="bg-slate-50 p-5 rounded-lg border border-slate-200">
        <h2 className="font-medium text-indigo-800 mb-3">Novedad</h2>
        <Textarea 
          placeholder="Registra el incidente informado por el cliente"
          className="min-h-[100px] border-slate-300"
        />
      </div>

      {/* Notas de Investigación */}
      <FormField
        control={control}
        name="investigation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Notas de Investigación</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Ingrese la información recolectada y el análisis realizado. Sé detallado para mejorar trazabilidad y calidad" 
                className="min-h-[150px] border-slate-300" 
                {...field} 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CauseAnalysisForm;
