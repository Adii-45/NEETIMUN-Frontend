"use client";

import { useState } from "react";
import { Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Label } from "@/components/ui/Label";
import { PortfolioSelect } from "@/components/ui/PortfolioSelect";
import { inquiryCategories } from "@/lib/data/contact";

const fieldPolish = "hover:border-gold-400/50 transition-colors duration-200";

export function ContactForm() {
  const [category, setCategory] = useState("");

  return (
    <div className="h-full rounded-2xl border border-border bg-cream-50 p-7 shadow-sm sm:rounded-3xl sm:p-9">
      {/* Card header */}
      <h2 className="mb-4 font-display text-2xl text-navy-900 sm:text-3xl">
        Direct Inquiry
      </h2>

      <p className="mb-7 text-sm leading-relaxed text-muted">
        Our Secretariat reviews every inquiry with care and confidentiality.
        Whether you are a delegate, institution, media representative, or
        prospective partner, complete the form below and our team will respond
        within 24–48 hours.
      </p>

      {/* Fields */}
      <form className="flex flex-col gap-6">
        {/* Name + Email */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="full-name"
              type="text"
              placeholder="Ex. Hon. Jane Doe"
              className={fieldPolish}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Diplomatic Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="official@organization.org"
              className={fieldPolish}
            />
          </div>
        </div>

        {/* Inquiry Category — searchable combobox */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Inquiry Category</Label>
          <PortfolioSelect
            id="category"
            options={[...inquiryCategories]}
            value={category}
            onChange={setCategory}
            placeholder="Select Protocol Tier"
            searchPlaceholder="Search inquiry categories..."
          />
          {/* Hidden input carries the value for native form submission */}
          <input type="hidden" name="category" value={category} />
        </div>

        {/* Message */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="message">Official Statement / Message</Label>
          <Textarea
            id="message"
            name="message"
            rows={7}
            placeholder="Please provide a detailed formal inquiry…"
            className={fieldPolish}
          />
        </div>

        {/* Action */}
        <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck size={13} className="shrink-0 text-gold-600" />
            Your details are used solely to respond to your inquiry.
          </p>
          <Button
            type="submit"
            className="group w-full justify-center sm:w-auto"
          >
            Submit Formal Inquiry
            <Send
              size={14}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </Button>
        </div>
      </form>
    </div>
  );
}
