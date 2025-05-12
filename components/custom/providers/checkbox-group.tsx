import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Control } from "react-hook-form";
import { FormOption } from "@/types/appointment";
import { Label } from "@/components/ui/label";

interface CheckboxGroupProps {
  name: string;
  control: Control<any>;
  options: FormOption[];
  question: string;
}

export const CheckboxGroup = ({
  name,
  control,
  options,
  question,
}: CheckboxGroupProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <div className="grid gap-y-0.5">
            <h4 className="text-sm font-medium text-brand-1">{question}</h4>
            <p className="text-xs text-brand-2">
              You can select multiple answers
            </p>
          </div>
          <FormControl>
            <div className="flex flex-wrap gap-4 mt-2">
              {options.map((option) => (
                <div
                  key={option.id}
                  className="flex items-center gap-x-2 rounded-full border border-divider px-3 py-2 cursor-pointer"
                >
                  {/* Only the checkbox has the handler now */}
                  <Checkbox
                    id={option.name}
                    checked={field.value?.includes(option.value)}
                    onCheckedChange={(checked) => {
                      const currentValues = Array.isArray(field.value)
                        ? [...field.value]
                        : [];

                      const updatedValues = checked
                        ? [...currentValues, option.value]
                        : currentValues.filter((v) => v !== option.value);

                      field.onChange(updatedValues);
                    }}
                  />
                  <Label htmlFor={option.name} className="text-sm text-brand-2 cursor-pointer">{option.value}</Label>
                </div>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
