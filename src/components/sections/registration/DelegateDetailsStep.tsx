import { Input } from "@/components/ui/Input";
import { PremiumSelect } from "@/components/ui/premium-select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import { CheckField, Field, invalidControlClass } from "./FormControls";
import {
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
      {/* 01 — Personal Information */}
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

          <Field label="City" htmlFor="city">
            <Input
              id="city"
              value={details.city}
              onChange={(event) => onChange("city", event.target.value)}
              placeholder="City"
            />
          </Field>

          <Field label="Country" htmlFor="country">
            <Input
              id="country"
              value={details.country}
              onChange={(event) => onChange("country", event.target.value)}
              placeholder="Country"
            />
          </Field>
        </div>
      </Section>

      {/* 02 — Academic Information */}
      <Section index="02" title="Academic Information">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Current Year / Grade" htmlFor="yearGrade">
            <Input
              id="yearGrade"
              value={details.yearGrade}
              onChange={(event) => onChange("yearGrade", event.target.value)}
              placeholder="e.g. Second Year, Grade 12"
            />
          </Field>

          <Field label="Course / Stream" htmlFor="courseStream">
            <Input
              id="courseStream"
              value={details.courseStream}
              onChange={(event) => onChange("courseStream", event.target.value)}
              placeholder="e.g. Law, Commerce, Science"
            />
          </Field>
        </div>
      </Section>

      {/* 03 — MUN Experience */}
      <Section index="03" title="MUN Experience">
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

      {/* 04 — Committee Motivation */}
      <Section index="04" title="Committee Motivation">
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

      {/* 05 — Emergency Contact */}
      <Section index="05" title="Emergency Contact">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Name" htmlFor="emergencyName">
            <Input
              id="emergencyName"
              value={details.emergencyName}
              onChange={(event) =>
                onChange("emergencyName", event.target.value)
              }
              placeholder="Contact name"
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
            <Field label="Phone Number" htmlFor="emergencyPhone">
              <Input
                id="emergencyPhone"
                type="tel"
                value={details.emergencyPhone}
                onChange={(event) =>
                  onChange("emergencyPhone", event.target.value)
                }
                placeholder="+91 00000 00000"
              />
            </Field>
          </div>
        </div>
      </Section>

      {/* 06 — Dietary Preferences */}
      <Section index="06" title="Dietary Preferences">
        <Field label="Dietary Preference" htmlFor="dietary">
          <PremiumSelect
            id="dietary"
            value={details.dietary}
            onValueChange={(value) => onChange("dietary", value)}
            placeholder="Select a dietary preference"
            options={dietaryOptions.map((option) => ({
              value: option,
              label: option,
            }))}
          />
        </Field>
      </Section>

      {/* 07 — Accessibility Requirements */}
      <Section index="07" title="Accessibility Requirements">
        <Field
          label="Accessibility Requirements"
          htmlFor="accessibility"
          hint="Optional — let us know how we can support you."
        >
          <Textarea
            id="accessibility"
            rows={3}
            value={details.accessibility}
            onChange={(event) => onChange("accessibility", event.target.value)}
            placeholder="Any accommodations you may require."
          />
        </Field>
      </Section>

      {/* 08 — Declaration */}
      <Section index="08" title="Declaration">
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
