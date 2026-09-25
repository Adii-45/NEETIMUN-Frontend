import { Input } from "@/components/ui/Input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { CheckField, Field, invalidControlClass } from "./FormControls";
import {
  accommodationOptions,
  dietaryOptions,
  experienceOptions,
  MOTIVATION_MAX,
  type DelegateDetails,
  type DetailErrors,
} from "./types";

type Props = {
  details: DelegateDetails;
  errors: DetailErrors;
  onChange: <K extends keyof DelegateDetails>(
    field: K,
    value: DelegateDetails[K],
  ) => void;
};

function Section({
  index,
  title,
  children,
}: {
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <span className="font-display text-sm text-gold-600">{index}</span>
        <h3 className="font-display text-lg text-navy-900">{title}</h3>
        <span className="h-px flex-1 bg-border" aria-hidden="true" />
      </div>
      {children}
    </section>
  );
}

export function DelegateDetailsStep({ details, errors, onChange }: Props) {
  const motivationRemaining = MOTIVATION_MAX - details.motivation.length;

  return (
    <div className="flex flex-col gap-10">
      {/* 01 - Personal Information */}
      <Section index="01" title="Personal Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Field
              label="Full Name"
              htmlFor="fullName"
              required
              error={errors.fullName}
            >
              <Input
                id="fullName"
                value={details.fullName}
                onChange={(event) => onChange("fullName", event.target.value)}
                aria-invalid={errors.fullName ? true : undefined}
                aria-describedby={errors.fullName ? "fullName-error" : undefined}
                placeholder="Your full name"
                className={cn(errors.fullName && invalidControlClass)}
              />
            </Field>
          </div>

          <Field label="Email" htmlFor="email" required error={errors.email}>
            <Input
              id="email"
              type="email"
              value={details.email}
              onChange={(event) => onChange("email", event.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={errors.email ? "email-error" : undefined}
              placeholder="you@example.com"
              className={cn(errors.email && invalidControlClass)}
            />
          </Field>

          <Field
            label="Phone Number"
            htmlFor="phone"
            required
            error={errors.phone}
          >
            <Input
              id="phone"
              type="tel"
              value={details.phone}
              onChange={(event) => onChange("phone", event.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              placeholder="+91 00000 00000"
              className={cn(errors.phone && invalidControlClass)}
            />
          </Field>

          <div className="sm:col-span-2">
            <Field
              label="Institution"
              htmlFor="institution"
              required
              error={errors.institution}
            >
              <Input
                id="institution"
                value={details.institution}
                onChange={(event) =>
                  onChange("institution", event.target.value)
                }
                aria-invalid={errors.institution ? true : undefined}
                aria-describedby={
                  errors.institution ? "institution-error" : undefined
                }
                placeholder="School / University / Organisation"
                className={cn(errors.institution && invalidControlClass)}
              />
            </Field>
          </div>

          <Field label="City" htmlFor="city" required error={errors.city}>
            <Input
              id="city"
              value={details.city}
              onChange={(event) => onChange("city", event.target.value)}
              aria-invalid={errors.city ? true : undefined}
              aria-describedby={errors.city ? "city-error" : undefined}
              placeholder="City"
              className={cn(errors.city && invalidControlClass)}
            />
          </Field>

          <Field label="Country" htmlFor="country" required error={errors.country}>
            <Input
              id="country"
              value={details.country}
              onChange={(event) => onChange("country", event.target.value)}
              aria-invalid={errors.country ? true : undefined}
              aria-describedby={errors.country ? "country-error" : undefined}
              placeholder="Country"
              className={cn(errors.country && invalidControlClass)}
            />
          </Field>
        </div>
      </Section>

      {/* 02 - MUN Experience */}
      <Section index="02" title="MUN Experience">
        <Field label="Previous MUN Experience" htmlFor="munExperience">
          <PremiumSelect
            id="munExperience"
            value={details.munExperience}
            onValueChange={(value) => onChange("munExperience", value)}
            placeholder="Select your experience level"
            options={experienceOptions}
          />
        </Field>
      </Section>

      {/* 03 - Committee Motivation */}
      <Section index="03" title="Committee Motivation">
        <Field
          label="Why are you interested in this committee?"
          htmlFor="motivation"
          hint={`${motivationRemaining} characters remaining`}
        >
          <Textarea
            id="motivation"
            rows={4}
            maxLength={MOTIVATION_MAX}
            value={details.motivation}
            onChange={(event) => onChange("motivation", event.target.value)}
            placeholder="Share what draws you to this committee (max 250 characters)."
          />
        </Field>
      </Section>

      {/* 04 - Emergency Contact */}
      <Section index="04" title="Emergency Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="emergencyName" required error={errors.emergencyName}>
            <Input
              id="emergencyName"
              value={details.emergencyName}
              onChange={(event) =>
                onChange("emergencyName", event.target.value)
              }
              aria-invalid={errors.emergencyName ? true : undefined}
              aria-describedby={errors.emergencyName ? "emergencyName-error" : undefined}
              placeholder="Contact name"
              className={cn(errors.emergencyName && invalidControlClass)}
            />
          </Field>

          <Field label="Relationship" htmlFor="emergencyRelationship">
            <Input
              id="emergencyRelationship"
              value={details.emergencyRelationship}
              onChange={(event) =>
                onChange("emergencyRelationship", event.target.value)
              }
              placeholder="e.g. Parent, Guardian"
            />
          </Field>

          <div className="sm:col-span-2">
            <Field label="Phone Number" htmlFor="emergencyPhone" required error={errors.emergencyPhone}>
              <Input
                id="emergencyPhone"
                type="tel"
                value={details.emergencyPhone}
                onChange={(event) =>
                  onChange("emergencyPhone", event.target.value)
                }
                aria-invalid={errors.emergencyPhone ? true : undefined}
                aria-describedby={errors.emergencyPhone ? "emergencyPhone-error" : undefined}
                placeholder="+91 00000 00000"
                className={cn(errors.emergencyPhone && invalidControlClass)}
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* 05 - Dietary & Accommodation */}
      <Section index="05" title="Dietary & Accommodation">
        <Field label="Dietary Preference" htmlFor="dietary" required error={errors.dietary}>
          <PremiumSelect
            id="dietary"
            value={details.dietary}
            onValueChange={(value) => onChange("dietary", value)}
            placeholder="Select a dietary preference"
            options={dietaryOptions.map((option) => ({
              value: option,
              label: option,
            }))}
            aria-invalid={errors.dietary ? true : undefined}
            aria-describedby={errors.dietary ? "dietary-error" : undefined}
          />
        </Field>

        <Field
          label="Accommodation Required?"
          htmlFor="accommodationRequired"
          required
          error={errors.accommodationRequired}
        >
          <PremiumSelect
            id="accommodationRequired"
            value={details.accommodationRequired}
            onValueChange={(value) => onChange("accommodationRequired", value)}
            placeholder="Select Yes or No"
            options={accommodationOptions}
            aria-invalid={errors.accommodationRequired ? true : undefined}
            aria-describedby={
              errors.accommodationRequired ? "accommodationRequired-error" : undefined
            }
          />
        </Field>

        <Field
          label="Accommodation Details"
          htmlFor="accommodationDetails"
          hint="Optional - please mention any accommodation details we should be aware of."
        >
          <Textarea
            id="accommodationDetails"
            rows={3}
            value={details.accommodationDetails}
            onChange={(event) => onChange("accommodationDetails", event.target.value)}
            placeholder="Please mention any accommodation details we should be aware of."
          />
        </Field>
      </Section>

      {/* 06 - Declaration */}
      <Section index="06" title="Declaration">
        <CheckField
          id="declaration"
          checked={details.declaration}
          onChange={(checked) => onChange("declaration", checked)}
          error={errors.declaration}
        >
          I confirm that the information provided is accurate.
        </CheckField>
      </Section>
    </div>
  );
}
