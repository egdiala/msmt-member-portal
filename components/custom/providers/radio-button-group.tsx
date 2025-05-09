
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup } from "@/components/ui/radio-group";
import { RadioButton } from "@/components/shared";
import { Control } from "react-hook-form";
import { FormOption } from "@/types/appointment";

interface RadioButtonGroupProps {
  name: string;
  control: Control<any>;
  options: FormOption[];
  question: string;
}

export const RadioButtonGroup = ({ name, control, options, question }: RadioButtonGroupProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <p className="font-medium text-sm text-brand-1">
            {question}
          </p>
          <FormControl>
            <RadioGroup
              className="flex items-center flex-wrap gap-2"
              defaultValue={field.value}
              onValueChange={field.onChange}
            >
              {options.map((option) => (
                <RadioButton
                  key={option.id}
                  isActive={field.value === option.value}
                  option={option}
                  className="rounded-full border border-divider px-3 py-2"
                />
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};