
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Control } from 'react-hook-form';
import { IncidentFormData } from '@/types/incident';

interface ReportTypeSelectorProps {
  control: Control<IncidentFormData>;
}

const ReportTypeSelector: React.FC<ReportTypeSelectorProps> = ({ control }) => {
  return (
    <div className="bg-sky-50 rounded-lg p-5 border border-sky-100">
      <h2 className="font-medium text-lg mb-4 text-indigo-800">Tipo de Reporte</h2>
      <FormField
        control={control}
        name="reportType"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="quality" id="quality" />
                  <div>
                    <Label htmlFor="quality" className="font-medium">Calidad</Label>
                    <p className="text-sm text-slate-500">Reporte de incidente de calidad</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="safety" id="safety" />
                  <div>
                    <Label htmlFor="safety" className="font-medium">Seguridad Operacional</Label>
                    <p className="text-sm text-slate-500">Reporte de seguridad operacional</p>
                  </div>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default ReportTypeSelector;
