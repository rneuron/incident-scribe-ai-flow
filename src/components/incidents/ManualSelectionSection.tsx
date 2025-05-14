
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Info } from 'lucide-react';
import { Control } from 'react-hook-form';
import { IncidentFormData } from '@/types/incident';

interface ManualSelectionSectionProps {
  control: Control<IncidentFormData>;
}

const ManualSelectionSection: React.FC<ManualSelectionSectionProps> = ({ control }) => {
  const availableManuals = [
    { id: 'manual1', label: 'Manual de Operaciones (MO)' },
    { id: 'manual2', label: 'Manual General de Mantenimiento (MGM)' },
    { id: 'manual3', label: 'Manual de Vuelo de la Aeronave (AFM)' },
    { id: 'manual4', label: 'Manual de Control de Calidad (QCM)' },
    { id: 'manual5', label: 'Manual de Operaciones de Tierra (GOM)' },
  ];

  return (
    <div className="bg-sky-50 rounded-lg p-5 border border-sky-100">
      <div className="flex items-start justify-between mb-4">
        <h2 className="font-medium text-lg text-indigo-800">Manuales de Referencia</h2>
        <div className="flex items-center text-sky-700 text-sm">
          <Info className="h-4 w-4 mr-1" />
          <p>Elija el manual que debe ser utilizado por el modelo. En caso de no ser seleccionado, el modelo lo seleccionará por usted.</p>
        </div>
      </div>
      
      <FormField
        control={control}
        name="selectedManuals"
        render={() => (
          <FormItem>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableManuals.map((manual) => (
                <FormField
                  key={manual.id}
                  control={control}
                  name="selectedManuals"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={manual.id}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(manual.id)}
                            onCheckedChange={(checked) => {
                              const currentValues = field.value || [];
                              return checked
                                ? field.onChange([...currentValues, manual.id])
                                : field.onChange(
                                    currentValues.filter((value) => value !== manual.id)
                                  );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {manual.label}
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              ))}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default ManualSelectionSection;
