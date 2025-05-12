"use client";

import type React from "react";
import { useId, useState, useEffect } from "react";
import { IconPhone } from "../icons";
import { ChevronDownIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import countryNames from "react-phone-number-input/locale/en.json";
import { cn } from "@/lib/utils";
import { on } from "events";

export type PhoneInputWithLabelProps = {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  defaultCountry?: RPNInput.Country;
};

export const PhoneInputWithLabel = ({
  value,
  onChange,
  className,
  onCountryChange,
  placeholder = "Phone number",
  defaultCountry = "NG", // Default to Nigeria or whatever your default should be
}: PhoneInputWithLabelProps) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [country, setCountry] = useState<RPNInput.Country>(defaultCountry);

  useEffect(() => {
    setHasValue(!!value);
  }, [value]);

  useEffect(() => {
    if (onCountryChange) {
      const countryCode = RPNInput.getCountryCallingCode(country);
      onCountryChange(countryCode);
    }
  }, [onCountryChange, country]);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleCountryChange = (newCountry: RPNInput.Country) => {
    setCountry(newCountry);
    if (onCountryChange) {
      const countryCode = RPNInput.getCountryCallingCode(newCountry);
      onCountryChange(countryCode);
    }
  };

  const validCountries = RPNInput.getCountries();
  const countryOptions = Object.entries(countryNames)
    .filter(([code]) => validCountries.includes(code as RPNInput.Country))
    .map(([code, name]) => ({
      value: code as RPNInput.Country,
      label: name,
    }));

  return (
    <div className="w-full relative flex flex-col items-center">
      <div
        className={cn(
          "file:text-foreground bg-input-field placeholder:text-brand-2 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-[3.125rem] items-center w-full min-w-0 rounded-sm border font-medium text-base transition-colors py-4 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-input-field",
          isFocused
            ? "border-brand-accent-2 selection:bg-primary focus-visible:border-brand-accent-2 bg-blue-400  ring-brand-accent-2/20"
            : "",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
      >
        <label
          htmlFor={id}
          className={cn(
            "absolute left-2 pointer-events-none transition-all duration-200 z-10 text-brand-3 bg-transparent px-1",
            isFocused || hasValue
              ? "transform -translate-y-3  text-brand-2 text-xs top-3"
              : "hidden"
          )}
        >
          {placeholder}
        </label>

        <div className="flex items-center w-full">
          <CountrySelect
            value={country}
            onChange={handleCountryChange}
            options={countryOptions}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <div className="border-r-1 border-brand-3 h-4 mx-2">
            <div></div>
          </div>

          <div className="flex-1 relative">
            {!isFocused && !hasValue && (
              <div className="absolute inset-0 flex items-center pointer-events-none">
                <span className="text-brand-3 text-sm">{placeholder}</span>
              </div>
            )}
            <input
              id={id}
              type="tel"
              className="w-full bg-transparent outline-none text-brand-2 text-sm placeholder:text-brand-3"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="pr-4 text-gray-400 pb-2">
            <IconPhone className="w-4 h-4 stroke-brand-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  onFocus?: () => void;
  onBlur?: () => void;
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
  onFocus,
  onBlur,
}: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  const dialCode = value ? `+${RPNInput.getCountryCallingCode(value)}` : "";

  return (
    <div className="relative pl-3 py-4">
      <div
        className="inline-flex items-center gap-1 text-gray-700"
        aria-hidden="true"
      >
        <span className="font-normal">{dialCode}</span>
        <ChevronDownIcon size={16} className="text-gray-400" />
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        onFocus={onFocus}
        onBlur={onBlur}
        className="absolute inset-0 opacity-0 cursor-pointer"
        aria-label="Select country"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}{" "}
            {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
          </option>
        ))}
      </select>
    </div>
  );
};
