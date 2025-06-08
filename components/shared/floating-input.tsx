"use client";

import * as React from "react";
import { Input } from "../ui";
import { cn } from "@/lib/utils";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ className, label, id: propsId, ...props }, ref) => {
    const inputId = React.useId();
    const id = propsId || inputId;

    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={id} className="text-sm font-medium text-brand-2">
          {label}
        </label>
        <Input
          id={id}
          ref={ref}
          placeholder={`Enter ${label}`}
          className={cn(className)}
          {...props}
        />
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
