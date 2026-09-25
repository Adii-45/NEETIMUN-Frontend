import Link from "next/link";
import { PolicySection } from "@/components/policy/PolicySection";
import { PolicyNote } from "@/components/policy/PolicyNote";
import { contactInfo } from "@/lib/data/contact";
import type { PolicySectionMeta } from "@/lib/data/policy";

export const PRIVACY_POLICY_SECTIONS: PolicySectionMeta[] = [
  { id: "introduction", title: "1. Introduction" },
  { id: "information-we-collect", title: "2. Information We Collect" },
  { id: "how-we-use-information", title: "3. How We Use Information" },
  { id: "payment-information", title: "4. Payment Information" },
  { id: "information-sharing", title: "5. Information Sharing" },
  { id: "data-security", title: "6. Data Security" },
  { id: "data-retention", title: "7. Data Retention" },
  { id: "your-rights", title: "8. Your Rights" },
  { id: "minors", title: "9. Participants Under 18" },
  { id: "cookies", title: "10. Cookies & Similar Technologies" },
  { id: "third-party-links", title: "11. Third-Party Links" },
  { id: "policy-changes", title: "12. Changes to This Policy" },
  { id: "contact", title: "13. Contact & Grievance Redressal" },
];

export function PrivacyPolicyContent() {
  return (
    <>
      <PolicySection id="introduction" title="1. Introduction">
        <p>
          NEETI MUN (&ldquo;NEETI MUN,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is a
          Model United Nations conference. This Privacy Policy explains what
          personal information we collect through the NEETI MUN website (the
          &ldquo;Website&rdquo;) - including the registration, contact, and
          payment processes - why we collect it, how it is used, and the
          choices available to you.
        </p>
        <p>
          This Policy applies to the public NEETI MUN Website and the
          registration and payment flows it provides. It does not apply to
          third-party websites or services that NEETI MUN links to or relies
          on, which are governed by their own privacy policies (see{" "}
          <Link href="#third-party-links">Section 11</Link>).
        </p>
      </PolicySection>

      <PolicySection id="information-we-collect" title="2. Information We Collect">
        <h3>Information you provide during registration</h3>
        <p>When you register as a delegate, we collect:</p>
        <ul>
          <li>Full name, email address, and phone number</li>
          <li>Institution (school, college, or university)</li>
          <li>Year/grade and course or stream, where provided</li>
          <li>City and country</li>
          <li>Committee and portfolio preferences</li>
          <li>Prior MUN experience and a short committee motivation statement, where provided</li>
          <li>
            Emergency contact name, relationship, and phone number, where
            provided
          </li>
          <li>Dietary restrictions and accessibility requirements, where provided</li>
          <li>Your acceptance of the registration declaration</li>
        </ul>

        <h3>Contact and inquiry information</h3>
        <p>
          If you use the Contact page, we collect your full name, email
          address, inquiry category, and the message you submit.
        </p>

        <h3>Payment-related identifiers</h3>
        <p>
          When you complete a registration payment, we retain the payment and
          order identifiers, amount, currency, status, and timestamp returned
          by our payment processor, Razorpay, after the payment has been
          verified. See <Link href="#payment-information">Section 4</Link> for
          detail on how payments are handled.
        </p>

        <h3>Technical information</h3>
        <p>
          Our servers record standard technical details for each request -
          such as IP address, the page or endpoint requested, response
          status, and timestamp - in operational logs used for security,
          diagnostics, and abuse prevention. We do not currently use any
          third-party analytics or advertising service on the Website.
        </p>
      </PolicySection>

      <PolicySection id="how-we-use-information" title="3. How We Use Information">
        <p>We use the information described above to:</p>
        <ul>
          <li>Process and administer your registration</li>
          <li>Allocate committees and portfolios to delegates</li>
          <li>Process registration payments and verify their authenticity</li>
          <li>Respond to inquiries submitted through the Contact page</li>
          <li>
            Plan and administer conference logistics, including accessibility
            and dietary accommodations and emergency contact arrangements
          </li>
          <li>Maintain records of registrations, payments, and inquiries</li>
          <li>Detect, investigate, and prevent fraud, abuse, and security incidents</li>
          <li>
            Comply with legal obligations and respond to lawful requests from
            public authorities
          </li>
        </ul>
        <p>
          Registration submissions do not currently trigger an automated
          email confirmation; a successful registration is confirmed on
          screen once your payment has been verified. Automated acknowledgement
          emails are currently sent only for Contact page submissions, where an
          email delivery provider is configured.
        </p>
      </PolicySection>

      <PolicySection id="payment-information" title="4. Payment Information">
        <p>
          Registration payments are processed through{" "}
          <strong>Razorpay</strong>, using its Standard Checkout product.
          Razorpay handles the entry and processing of your card, UPI, net
          banking, or wallet details directly; NEETI MUN does not receive or
          store your full card number, CVV, UPI PIN, or net banking
          credentials at any point.
        </p>
        <p>
          After you complete a payment, our backend independently verifies it
          with Razorpay before creating a registration record. The
          information we retain from this process is limited to the Razorpay
          order ID, payment ID, payment status, amount, currency, and the
          time the payment was confirmed.
        </p>
        <p>
          Razorpay processes payment information under its own privacy policy
          and applicable payment-industry standards, independently of NEETI
          MUN.
        </p>
      </PolicySection>

      <PolicySection id="information-sharing" title="5. Information Sharing">
        <p>
          We do not sell personal information. We share information only with
          the following categories of recipients, and only as necessary for
          the purposes described in this Policy:
        </p>
        <ul>
          <li>
            <strong>Razorpay</strong> - to process and verify registration
            payments.
          </li>
          <li>
            <strong>Email delivery provider</strong> - where configured, to
            deliver acknowledgement emails for Contact page submissions.
          </li>
          <li>
            <strong>Hosting and infrastructure providers</strong> - our
            website is hosted on Vercel, our backend server on Render, and
            registration/inquiry data is stored in a PostgreSQL database
            operated on our behalf. These providers process data as
            infrastructure operators and do not use it for their own
            independent purposes.
          </li>
          <li>
            <strong>Authorized NEETI MUN Secretariat and administrators</strong> -
            for conference administration, committee allocation, and inquiry
            handling, through access-controlled administrative accounts.
          </li>
          <li>
            <strong>Legal and regulatory authorities</strong> - where required
            by applicable law or a valid legal process.
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="data-security" title="6. Data Security">
        <p>
          We apply reasonable technical and organizational safeguards to
          protect the information we hold, including encrypted connections
          between your browser and our servers, restricting administrative
          access to authenticated NEETI MUN Secretariat accounts, and
          independent server-side verification of every payment before a
          registration is created. Payment authentication with Razorpay uses
          cryptographic signature verification rather than trusting
          client-reported outcomes.
        </p>
        <p>
          No method of transmission or storage is completely secure, and we
          cannot guarantee absolute security. We do not publicly disclose the
          specific technical mechanisms behind these safeguards, in keeping
          with standard security practice.
        </p>
      </PolicySection>

      <PolicySection id="data-retention" title="7. Data Retention">
        <p>
          We retain registration, payment, and inquiry information for as
          long as reasonably necessary to fulfil the purposes described in
          this Policy - including conference administration, record-keeping,
          financial reconciliation, and compliance with applicable legal
          obligations - and not longer than necessary for those purposes.
        </p>
        <PolicyNote>
          NEETI MUN has not established a fixed retention period (e.g., a set
          number of years) for registration and payment records. Organizers
          should confirm a specific retention schedule, after which this
          section should be updated accordingly.
        </PolicyNote>
      </PolicySection>

      <PolicySection id="your-rights" title="8. Your Rights">
        <p>Subject to applicable law, you may:</p>
        <ul>
          <li>Request access to the personal information we hold about you</li>
          <li>Request correction of inaccurate or incomplete information</li>
          <li>
            Request deletion of your information, where it is no longer
            required for the purposes described in this Policy or applicable
            legal obligations
          </li>
          <li>
            Withdraw consent for a specific processing activity, where our
            processing relies on your consent
          </li>
          <li>Raise a grievance regarding how your information is handled</li>
        </ul>
        <p>
          To exercise any of these rights, contact us using the details in{" "}
          <Link href="#contact">Section 13</Link>. Because committee
          allocation and payment records may need to be retained for
          conference administration and financial record-keeping, some
          requests - such as deletion before the conference concludes - may be
          fulfilled on a delayed or partial basis, and we will explain the
          reason if so.
        </p>
      </PolicySection>

      <PolicySection id="minors" title="9. Participants Under 18">
        <p>
          NEETI MUN&rsquo;s registration process does not currently include a
          date-of-birth field or a formal age-verification step, and
          registration is not restricted to adults. Because of this, some
          participants may be minors. Where a minor registers, the
          information described in <Link href="#information-we-collect">
            Section 2
          </Link>{" "}
          - including, where provided, an emergency contact - is processed
          for the same conference-administration purposes described in this
          Policy.
        </p>
        <p>
          We encourage a parent or guardian to review this Policy together
          with any participant under the age of 18 before registration is
          completed.
        </p>
        <PolicyNote>
          A formal minimum-age policy and/or parental-consent requirement for
          registration has not been established in the current registration
          flow. Organizers should confirm whether one applies, and this
          section should be revised to reflect it.
        </PolicyNote>
      </PolicySection>

      <PolicySection id="cookies" title="10. Cookies & Similar Technologies">
        <p>
          The public NEETI MUN Website does not currently set cookies or use
          browser local/session storage, and does not use any analytics or
          advertising technology. If this changes in the future, this section
          will be updated to describe the technologies used and the choices
          available to you.
        </p>
      </PolicySection>

      <PolicySection id="third-party-links" title="11. Third-Party Links">
        <p>
          The Website may reference or link to third-party services,
          including Razorpay&rsquo;s payment interface. These third parties
          operate under their own privacy policies, which we encourage you to
          review. NEETI MUN is not responsible for the privacy practices of
          third-party services.
        </p>
      </PolicySection>

      <PolicySection id="policy-changes" title="12. Changes to This Policy">
        <p>
          We may update this Policy from time to time to reflect changes in
          our practices or for legal, operational, or regulatory reasons. The
          &ldquo;Last Updated&rdquo; date at the top of this page reflects the
          most recent revision. Material changes will be reflected on this
          page before or as they take effect.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="13. Contact & Grievance Redressal">
        <p>
          NEETI MUN processes personal information for the purposes described
          in this Privacy Policy. Where applicable, this processing takes
          into account principles reflected in India&rsquo;s Digital Personal
          Data Protection Act, 2023 and its rules; this statement describes
          our practices and is not a representation of certified legal
          compliance.
        </p>
        <p>
          For questions, requests, or grievances relating to this Policy or
          your personal information, contact the NEETI MUN Secretariat at{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or
          through the <Link href="/contact">Contact page</Link>.
        </p>
      </PolicySection>
    </>
  );
}
