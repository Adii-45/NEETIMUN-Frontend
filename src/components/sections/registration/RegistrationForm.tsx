"use client";

import { useState } from "react";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { committees } from "@/lib/data/committees";

const steps = ["Committees", "Details", "Confirm"];

export function RegistrationForm() {
  const [selected, setSelected] = useState(committees[0]?.tag ?? "");
  const [country, setCountry] = useState("");

  return (
    <div className="mx-auto w-full max-w-3xl rounded-3xl border border-border bg-cream-50/60 p-6 sm:p-10">
      <Stepper steps={steps} activeStep={0} />

      <div className="mt-10 flex flex-col gap-8">
        <h2 className="font-display text-2xl text-navy-900">
          Choose Committee Preference
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {committees.map((committee) => {
            const isSelected = selected === committee.tag;
            return (
              <button
                key={committee.tag}
                type="button"
                onClick={() => setSelected(committee.tag)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col gap-1 rounded-2xl border p-5 text-left transition-all duration-200 ease-out",
                  isSelected
                    ? "border-navy-900 bg-cream-200/70 shadow-md shadow-navy-900/5"
                    : "border-border bg-cream-50 hover:border-gold-400/40",
                )}
              >
                <span className="font-display text-lg text-navy-900">
                  {committee.tag}
                </span>
                <span className="text-sm text-muted">{committee.title}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="country-preference"
            className="text-xs font-medium uppercase tracking-wide-label text-muted"
          >
            Country Preference
          </label>
          <input
            id="country-preference"
            type="text"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
            placeholder="e.g. United Kingdom, India, France"
            className="rounded-full border border-border bg-cream-50 px-5 py-3 text-sm text-navy-900 placeholder:text-navy-900/40 focus:border-navy-900 focus:outline-none"
          />
          <p className="text-xs text-muted">
            Mention up to three countries separated by commas.
          </p>
        </div>

        <div className="flex justify-end border-t border-border pt-6">
          <Button type="button">Next Step &rarr;</Button>
        </div>
      </div>
    </div>
  );
}
