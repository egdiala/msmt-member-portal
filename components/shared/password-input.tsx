"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { IconEye, IconEyeOff } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FloatingInput } from "@/components/shared/floating-input";
import { RenderIf } from "./render-if";

const CustomRadioItem = ({
  isValid,
  label,
  id,
}: {
  isValid: boolean;
  label: string;
  id: string;
}) => {
  return (
    <div className="flex items-center space-x-1">
      <RadioGroupItem
        value={id}
        id={id}
        className={cn(
          isValid
            ? "border-brand-accent-2 bg-brand-accent-2"
            : "border-brand-3",
          "relative rounded-full size-2.5 border flex items-center justify-center text-brand-3 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50"
        )}
        checked={isValid}
      />
      <RenderIf condition={isValid}>
        <Check className="size-2.5 absolute text-white" />
      </RenderIf>

      <label
        htmlFor={id}
        className={cn(
          " text-brand-3 cursor-none text-xs",
          isValid && "text-brand-2"
        )}
      >
        {label}
      </label>
    </div>
  );
};

interface PasswordRequirement {
  id: string;
  label: string;
  validator: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    id: "minLength",
    label: "Must be 6 characters",
    validator: (password) => password.length >= 6,
  },
  // {
  //   id: "specialChar",
  //   label: "At least One special character",
  //   validator: (password) =>
  //     /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
  // },
  {
    id: "uppercase",
    label: "Atleast One uppercase",
    validator: (password) => /[A-Z]/.test(password),
  },
  {
    id: "lowercase",
    label: "Atleast One lowercase",
    validator: (password) => /[a-z]/.test(password),
  },
  {
    id: "number",
    label: "At least One number",
    validator: (password) => /\d/.test(password),
  },
];

interface PasswordInputProps {
  value: string;
  labelTitle: string;
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  showRequirements?: boolean;
  turnOffAutocomplete?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      value,
      labelTitle,
      onChange,
      showRequirements = true,
      turnOffAutocomplete,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };
    const requirementStatus = passwordRequirements.map((requirement) => ({
      ...requirement,
      isValid: value?.length > 0 && requirement?.validator(value),
    }));

    return (
      <div className="space-y-2">
        <div className="relative">
          <FloatingInput
            label={labelTitle}
            type={showPassword ? "text" : "password"}
            className="pr-10"
            value={value}
            onChange={handleChange}
            ref={ref}
            
            autoComplete={turnOffAutocomplete ? "off" : "on"}
            {...props}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 bottom-2 h-fit px-3 py-2 text-brand-3 hover:bg-transparent "
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <IconEyeOff className="h-4 w-4 stroke-brand-3" />
            ) : (
              <IconEye className="h-4 w-4 stroke-brand-3" />
            )}
            <span className="sr-only">
              {showPassword ? "Hide password" : "Show password"}
            </span>
          </Button>
        </div>
        <RenderIf condition={showRequirements}>
          <div className="">
            <RadioGroup
              className="grid sm:grid-cols-[auto_1fr] gap-x-5 gap-y-2"
              value={requirementStatus.find((r) => r.isValid)?.id || ""}
              onValueChange={() => {}}
            >
              {requirementStatus.map((requirement) => (
                <CustomRadioItem
                  key={requirement.id}
                  id={requirement.id}
                  isValid={requirement.isValid}
                  label={requirement.label}
                />
              ))}
            </RadioGroup>
          </div>
        </RenderIf>
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export default PasswordInput;
