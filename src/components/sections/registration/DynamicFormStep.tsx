import { Check } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { Textarea } from "@/components/ui/Textarea";
import type { FormField } from "@/lib/api/registrationForm";
import { cn } from "@/lib/utils";
import { CheckField, Field, invalidControlClass } from "./FormControls";
import type { AnswerErrors, AnswerState } from "./types";

type FieldProps = {
  field: FormField;
  value: AnswerState[string] | undefined;
  error?: string;
  onChange: (value: AnswerState[string]) => void;
};

const inputId = (field: FormField) => `field-${field.id}`;

function invalidProps(field: FormField, error?: string) {
  return {
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": error ? `${inputId(field)}-error` : undefined,
  };
}

/** Shared wrapper: label, required marker, description/hint and error, in the existing Field layout. */
function Shell({
  field,
  error,
  hint,
  children,
}: {
  field: FormField;
  error?: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Field label={field.label} htmlFor={inputId(field)} required={field.required} error={error} hint={hint ?? field.description}>
      {children}
    </Field>
  );
}

function TextInputField({ field, value, error, onChange, type }: FieldProps & { type: "text" | "email" | "tel" | "number" }) {
  return (
    <Shell field={field} error={error}>
      <Input
        id={inputId(field)}
        type={type}
        inputMode={type === "number" ? "decimal" : undefined}
        min={type === "number" ? field.min : undefined}
        max={type === "number" ? field.max : undefined}
        value={typeof value === "string" ? value : ""}
        onChange={(event) => onChange(event.target.value)}
        maxLength={field.maxLength}
        placeholder={field.placeholder}
        className={cn(error && invalidControlClass)}
        {...invalidProps(field, error)}
      />
    </Shell>
  );
}

export const ShortTextField = (p: FieldProps) => <TextInputField {...p} type="text" />;
export const EmailField = (p: FieldProps) => <TextInputField {...p} type="email" />;
export const PhoneField = (p: FieldProps) => <TextInputField {...p} type="tel" />;
export const NumberField = (p: FieldProps) => <TextInputField {...p} type="number" />;

export function LongTextField({ field, value, error, onChange }: FieldProps) {
  const text = typeof value === "string" ? value : "";
  const remaining = field.maxLength ? field.maxLength - text.length : null;
  return (
    <Shell
      field={field}
      error={error}
      hint={
        remaining !== null
          ? `${field.description ? `${field.description} · ` : ""}${remaining} characters remaining`
          : field.description
      }
    >
      <Textarea
        id={inputId(field)}
        rows={4}
        maxLength={field.maxLength}
        value={text}
        onChange={(event) => onChange(event.target.value)}
        placeholder={field.placeholder}
        className={cn(error && invalidControlClass)}
        {...invalidProps(field, error)}
      />
    </Shell>
  );
}

export function SelectField({ field, value, error, onChange }: FieldProps) {
  return (
    <Shell field={field} error={error}>
      <PremiumSelect
        id={inputId(field)}
        value={typeof value === "string" ? value : ""}
        onValueChange={onChange}
        placeholder={field.placeholder || "Select an option"}
        options={field.options ?? []}
        {...invalidProps(field, error)}
      />
    </Shell>
  );
}

/** Radio and checkbox groups share one card-style option list, matching the committee picker. */
function ChoiceGroup({ field, value, error, onChange, multiple }: FieldProps & { multiple: boolean }) {
  const selected = multiple ? (Array.isArray(value) ? value : []) : typeof value === "string" ? value : "";
  const name = inputId(field);

  function toggle(option: string, checked: boolean) {
    if (!multiple) return onChange(option);
    const current = selected as string[];
    onChange(checked ? [...current, option] : current.filter((v) => v !== option));
  }

  return (
    <fieldset className="m-0 flex flex-col gap-2 border-0 p-0" aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="mb-2 p-0 text-xs font-medium uppercase tracking-wide-label text-muted">
        {field.label}
        {field.required ? <span className="text-gold-600"> *</span> : null}
      </legend>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {(field.options ?? []).map((option) => {
          const checked = multiple ? (selected as string[]).includes(option.value) : selected === option.value;
          return (
            <label
              key={option.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm text-navy-900 transition-all duration-200 ease-out focus-within:ring-2 focus-within:ring-gold-500 focus-within:ring-offset-2 focus-within:ring-offset-cream-50",
                checked ? "border-navy-900 bg-cream-200/70" : "border-border bg-cream-50 hover:border-gold-400/40",
                error && !checked && "border-red-400/70",
              )}
            >
              <input
                type={multiple ? "checkbox" : "radio"}
                name={name}
                value={option.value}
                checked={checked}
                onChange={(event) => toggle(option.value, event.target.checked)}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center border transition-colors",
                  multiple ? "rounded" : "rounded-full",
                  checked ? "border-navy-900 bg-navy-900" : "border-border bg-cream-50",
                )}
              >
                {checked ? <Check className="size-3 text-cream-50" /> : null}
              </span>
              {option.label}
            </label>
          );
        })}
      </div>
      {error ? (
        <p id={`${name}-error`} role="alert" className="text-xs text-red-500">
          {error}
        </p>
      ) : field.description ? (
        <p className="text-xs text-muted">{field.description}</p>
      ) : null}
    </fieldset>
  );
}

export const RadioField = (p: FieldProps) => <ChoiceGroup {...p} multiple={false} />;
export const CheckboxField = (p: FieldProps) => <ChoiceGroup {...p} multiple />;

export function ConsentField({ field, value, error, onChange }: FieldProps) {
  return (
    <CheckField id={inputId(field)} checked={value === true} onChange={onChange} error={error}>
      {field.label}
      {field.required ? <span className="text-gold-600"> *</span> : null}
    </CheckField>
  );
}

const renderers: Record<FormField["type"], (props: FieldProps) => React.JSX.Element> = {
  short_text: ShortTextField,
  long_text: LongTextField,
  email: EmailField,
  phone: PhoneField,
  number: NumberField,
  select: SelectField,
  radio: RadioField,
  checkbox: CheckboxField,
  consent: ConsentField,
};

/** Types that need the whole row; the rest sit two to a row on wider screens. */
const fullWidth = new Set<FormField["type"]>(["long_text", "radio", "checkbox", "consent"]);

/**
 * Renders an event's registration form straight from its schema, in the
 * schema's order. Adding a new field type means adding a renderer above and
 * an entry in `renderers` — nothing about any specific event is hardcoded.
 */
export function DynamicFormStep({
  fields,
  answers,
  errors,
  onChange,
}: {
  fields: FormField[];
  answers: AnswerState;
  errors: AnswerErrors;
  onChange: (fieldId: string, value: AnswerState[string]) => void;
}) {
  if (fields.length === 0) {
    return <p className="text-sm text-muted">No additional details are needed for this event.</p>;
  }

  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm text-gold-600">01</span>
        <h3 className="font-display text-lg text-navy-900">Delegate Details</h3>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {fields.map((field) => {
          const Render = renderers[field.type];
          return (
            <div key={field.id} className={cn(fullWidth.has(field.type) && "sm:col-span-2")}>
              <Render
                field={field}
                value={answers[field.id]}
                error={errors[field.id]}
                onChange={(value) => onChange(field.id, value)}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
