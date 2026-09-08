import { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes } from "react";

interface FieldProps {
  label?: string;
  description?: string;
  error?: string;
  hint?: string;
}

export interface InputProps extends FieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  size?: "sm" | "md" | "lg";
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, description, error, hint, size = "md", className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium leading-5 text-[var(--ink)]"
          >
            {label}
            {props.required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
          </label>
        )}
        {description && <p className="text-xs text-[var(--muted)]">{description}</p>}
        <input
          ref={ref}
          id={fieldId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={`w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""} ${size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-11 text-base py-3" : "h-10"} ${className}`}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-[var(--muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps extends FieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> {
  size?: "sm" | "md" | "lg";
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, description, error, hint, size = "md", className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium leading-5 text-[var(--ink)]"
          >
            {label}
            {props.required && <span className="ml-0.5 text-red-500" aria-hidden="true">*</span>}
          </label>
        )}
        {description && <p className="text-xs text-[var(--muted)]">{description}</p>}
        <textarea
          ref={ref}
          id={fieldId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={`w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed resize-y min-h-[80px] ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""} ${size === "sm" ? "text-xs" : size === "lg" ? "h-16 text-base" : "h-10"} ${className}`}
          {...props}
        />
        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-[var(--muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

interface SelectProps extends FieldProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  size?: "sm" | "md" | "lg";
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, description, error, hint, size = "md", options, className = "", id, ...props }, ref) => {
    const fieldId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="block text-sm font-medium leading-5 text-[var(--ink)]"
          >
            {label}
          </label>
        )}
        {description && <p className="text-xs text-[var(--muted)]">{description}</p>}
        <select
          ref={ref}
          id={fieldId}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? `${fieldId}-error` : hint ? `${fieldId}-hint` : undefined}
          className={`w-full rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm transition-colors focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 disabled:opacity-50 disabled:cursor-not-allowed ${error ? "border-red-400 focus:border-red-500 focus:ring-red-200" : ""} ${size === "sm" ? "h-8 text-xs" : size === "lg" ? "h-11 text-base py-3" : "h-10"} ${className}`}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && (
          <p id={`${fieldId}-error`} className="text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${fieldId}-hint`} className="text-xs text-[var(--muted)]">
            {hint}
          </p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";
