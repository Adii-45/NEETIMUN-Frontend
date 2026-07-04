import { ShieldAlert } from "lucide-react";
import type { Committee } from "@/lib/data/committees";
import { cn } from "@/lib/utils";
import { CheckField } from "./FormControls";
import {
  experienceLabel,
  type DelegateDetails,
} from "./types";

type Props = {
  committee: Committee | undefined;
  portfolio: string;
  details: DelegateDetails;
  confirmChecked: boolean;
  confirmError?: string;
  onConfirmChange: (checked: boolean) => void;
};

function Row({ label, value }: { label: string; value: string }) {
  const empty = !value.trim();
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-xs uppercase tracking-wide-label text-muted">
        {label}
      </dt>
      <dd
        className={cn(
          "text-sm",
          empty ? "italic text-navy-900/40" : "text-navy-900",
        )}
      >
        {empty ? "Not provided" : value}
      </dd>
    </div>
  );
}

function SummaryCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-cream-50 p-6">
      <h4 className="font-display text-base text-navy-900">{title}</h4>
      <dl className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

export function ReviewStep({
  committee,
  portfolio,
  details,
  confirmChecked,
  confirmError,
  onConfirmChange,
}: Props) {
  const CommitteeIcon = committee?.icon;

  return (
    <div className="flex flex-col gap-6">
      {/* Highlighted committee + portfolio card */}
      <div className="rounded-3xl border border-navy-900 bg-cream-200/70 p-6 shadow-md shadow-navy-900/5 sm:p-8">
        <div className="flex items-start gap-5">
          {CommitteeIcon ? (
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-navy-900 text-cream-50">
              <CommitteeIcon aria-hidden="true" className="size-6" />
            </span>
          ) : null}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wide-label text-gold-600">
              {committee?.tag ?? "Committee"}
            </span>
            <h3 className="font-display text-xl text-navy-900">
              {committee?.title ?? "Not selected"}
            </h3>
            {committee?.agenda ? (
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {committee.agenda}
              </p>
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-navy-900/10 pt-5">
          <span className="text-xs uppercase tracking-wide-label text-muted">
            Portfolio Preference
          </span>
          {portfolio ? (
            <span className="inline-flex w-fit items-center rounded-full border border-gold-400/60 bg-gold-300/30 px-4 py-1.5 text-sm font-medium text-navy-900">
              {portfolio}
            </span>
          ) : (
            <span className="text-sm italic text-navy-900/40">
              No portfolio required for this committee
            </span>
          )}
        </div>

        {details.motivation.trim() ? (
          <div className="mt-5 flex flex-col gap-1.5 border-t border-navy-900/10 pt-5">
            <span className="text-xs uppercase tracking-wide-label text-muted">
              Motivation
            </span>
            <p className="text-sm leading-relaxed text-navy-900">
              {details.motivation}
            </p>
          </div>
        ) : null}
      </div>

      {/* Summary cards */}
      <SummaryCard title="Personal Information">
        <Row label="Full Name" value={details.fullName} />
        <Row label="Email" value={details.email} />
        <Row label="Phone Number" value={details.phone} />
        <Row label="Institution" value={details.institution} />
        <Row label="City" value={details.city} />
        <Row label="Country" value={details.country} />
      </SummaryCard>

      <SummaryCard title="Academic Information">
        <Row label="Current Year / Grade" value={details.yearGrade} />
        <Row label="Course / Stream" value={details.courseStream} />
      </SummaryCard>

      <SummaryCard title="Experience & Preferences">
        <Row
          label="Previous MUN Experience"
          value={experienceLabel(details.munExperience)}
        />
        <Row label="Dietary Preference" value={details.dietary} />
        <Row label="Accessibility Requirements" value={details.accessibility} />
      </SummaryCard>

      <SummaryCard title="Emergency Contact">
        <Row label="Name" value={details.emergencyName} />
        <Row label="Relationship" value={details.emergencyRelationship} />
        <Row label="Phone Number" value={details.emergencyPhone} />
      </SummaryCard>

      {/* Allocation notice */}
      <div className="flex items-start gap-3 rounded-2xl border border-gold-400/60 bg-gold-300/25 p-5">
        <ShieldAlert
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-gold-600"
        />
        <p className="text-sm leading-relaxed text-navy-900">
          Please review your application carefully. Committee allocation cannot
          be modified after submission.
        </p>
      </div>

      {/* Required confirmation */}
      <div className="rounded-2xl border border-border bg-cream-50 p-5">
        <CheckField
          id="review-confirm"
          checked={confirmChecked}
          onChange={onConfirmChange}
          error={confirmError}
        >
          I have reviewed my application and confirm that all details are
          correct.
        </CheckField>
      </div>
    </div>
  );
}
