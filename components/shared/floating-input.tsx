"use client";

import * as React from "react";
import { Input } from "../ui";
import { cn } from "@/lib/utils";

interface FloatingInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  (
    { className, label, id: propsId, type, value, defaultValue, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);
    const inputId = React.useId();
    const id = propsId || inputId;
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useImperativeHandle(ref, () => inputRef.current!);

    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(value !== "");
      } else if (inputRef.current) {
        setHasValue(inputRef.current.value !== "");
      }
    }, [value]);

    React.useEffect(() => {
      if (inputRef.current && defaultValue) {
        setHasValue(true);
      }
    }, [defaultValue]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);

      const isEmpty = !inputRef.current?.value;
      setHasValue(!isEmpty);

      props.onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const isEmpty = e.target.value === "";
      setHasValue(!isEmpty);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <Input
          id={id}
          ref={inputRef}
          type={type}
          className={cn("pt-3 placeholder:text-transparent", className)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={label}
          value={value}
          defaultValue={defaultValue}
          {...props}
        />
        <label
          htmlFor={id}
          className={cn(
            "absolute left-1.25 text-brand-2 transition-all duration-200 pointer-events-none",
            hasValue
              ? "transform -translate-y-2 left-3 text-left text-xs top-3.25 text-primary"
              : "top-1/2 -translate-y-1/2 text-sm left-3"
          )}
        >
          {label}
        </label>
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };
