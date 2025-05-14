import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      // data-active={!!props.value || !!props.defaultValue}
      className={cn(
        "file:text-foreground bg-input-field placeholder:text-brand-2 selection:bg-transparent selection:text-brand-1 dark:bg-input/30 flex h-[3.125rem] w-full min-w-0 rounded-sm border  font-medium  px-3 py-1 text-base transition-[color] aria-invalid:border-destructive aria-invalid:ring-destructive/20  outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-input-field",
        " focus-visible:border-brand-accent-2 focus-visible:bg-blue-400 ",
        // "data-[active=true]:border-brand-accent-2 data-[active=true]:bg-blue-400",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive aria-invalid:text-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
