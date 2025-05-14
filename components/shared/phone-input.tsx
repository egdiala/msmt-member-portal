"use client";
import { cn } from "@/lib/utils";
import type React from "react";
import { ChevronDownIcon } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import countryNames from "react-phone-number-input/locale/en.json";

import { useId, useState, useEffect } from "react";
import { IconPhone } from "../icons";

export type PhoneInputWithLabelProps = {
  value: string;
  onChange: (value: string) => void;
  onCountryChange?: (countryCode: string) => void;
  placeholder?: string;
  className?: string;
  defaultCountry?: RPNInput.Country;
  phonePrefix?: string;
};

// Floating label component
interface FloatingLabelProps {
  id: string;
  visible: boolean;
  placeholder: string;
}

const FloatingLabel = ({ id, visible, placeholder }: FloatingLabelProps) => (
  <label
    htmlFor={id}
    className={cn(
      "absolute left-2 pointer-events-none transition-all duration-200 z-10 text-brand-3 bg-transparent px-1",
      visible ? "transform -translate-y-3 text-brand-2 text-xs top-3" : "hidden"
    )}
  >
    {placeholder}
  </label>
);

const Divider = () => (
  <div className="border-r border-brand-3 h-5 mx-2 self-center">
    {/* Using border-r instead of border-r-1 for Tailwind compatibility */}
  </div>
);

// Phone icon component
const PhoneIcon = () => (
  <div className="flex items-center pr-4 text-gray-400">
    <IconPhone className="w-4 h-4 stroke-brand-2" />
  </div>
);

interface PhoneNumberInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  showPlaceholder: boolean;
  placeholder: string;
}

const PhoneNumberInput = ({
  id,
  value,
  onChange,
  onFocus,
  onBlur,
  showPlaceholder,
  placeholder,
}: PhoneNumberInputProps) => (
  <div className="flex-1 relative flex items-center">
    {showPlaceholder && (
      <div className="absolute inset-0 flex items-center pointer-events-none">
        <span className="text-brand-3 text-sm">{placeholder}</span>
      </div>
    )}
    <input
      id={id}
      type="tel"
      className="w-full bg-transparent outline-none text-brand-2 text-sm placeholder:text-brand-3 py-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  </div>
);

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
  onFocus?: () => void;
  onBlur?: () => void;
};

export const CountrySelect = ({
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
    <div className="flex items-center pl-3">
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

export const findCountryByDialCode = (
  dialCode: string
): RPNInput.Country | undefined => {
  if (!dialCode || typeof dialCode !== "string") return undefined;

  const cleanDialCode = dialCode.startsWith("+") ? dialCode.slice(1) : dialCode;

  if (!cleanDialCode.trim()) return undefined;

  try {
    const countries = RPNInput.getCountries();
    return countries.find((country) => {
      try {
        const countryDialCode = RPNInput.getCountryCallingCode(country);
        return countryDialCode === cleanDialCode;
      } catch (error) {
        console.error(error);
        return false;
      }
    });
  } catch (error) {
    console.error("Error in findCountryByDialCode:", error);
    return undefined;
  }
};

export const getCountryOptions = () => {
  const validCountries = RPNInput.getCountries();

  return Object.entries(countryNames)
    .filter(([code]) => validCountries.includes(code as RPNInput.Country))
    .map(([code, name]) => ({
      value: code as RPNInput.Country,
      label: name as string,
    }));
};

export const BasePhoneInput = ({
  value,
  onChange,
  className,
  onCountryChange,
  placeholder = "Phone number",
  defaultCountry = "NG",
  phonePrefix,
}: PhoneInputWithLabelProps) => {
  const id = useId();
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(!!value);

  const initialCountry = phonePrefix
    ? findCountryByDialCode(phonePrefix) || defaultCountry
    : defaultCountry;

  const [country, setCountry] = useState<RPNInput.Country>(initialCountry);
  const countryOptions = getCountryOptions();

  useEffect(() => {
    if (phonePrefix) {
      const countryFromPrefix = findCountryByDialCode(phonePrefix);
      if (countryFromPrefix) {
        setCountry(countryFromPrefix);
      }
    }
  }, [phonePrefix]);

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

  return (
    <div className="w-full relative flex flex-col items-center">
      <div
        className={cn(
          "file:text-foreground bg-input-field placeholder:text-brand-2 selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex h-12 items-center w-full min-w-0 rounded-sm border font-medium text-base transition-colors outline-none file:inline-flex file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-input-field",
          isFocused
            ? "border-brand-accent-2 selection:bg-primary focus-visible:border-brand-accent-2 bg-blue-400 ring-brand-accent-2/20"
            : "",
          "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
          className
        )}
      >
        <FloatingLabel
          id={id}
          visible={isFocused || hasValue}
          placeholder={placeholder}
        />

        <div className="flex items-center w-full h-full relative">
          <CountrySelect
            value={country}
            onChange={handleCountryChange}
            options={countryOptions}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />

          <Divider />

          <PhoneNumberInput
            id={id}
            value={value}
            onChange={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            showPlaceholder={!isFocused && !hasValue}
            placeholder={placeholder}
          />

          <PhoneIcon />
        </div>
      </div>
    </div>
  );
};

export const PhoneInputWithLabel = (props: PhoneInputWithLabelProps) => {
  return <BasePhoneInput {...props} />;
};