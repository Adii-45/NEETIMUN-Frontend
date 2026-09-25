import Link from "next/link";
import { PolicySection } from "@/components/policy/PolicySection";
import { PolicyNote } from "@/components/policy/PolicyNote";
import { contactInfo } from "@/lib/data/contact";
import type { PolicySectionMeta } from "@/lib/data/policy";

export const TERMS_OF_SERVICE_SECTIONS: PolicySectionMeta[] = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "about", title: "2. About NEETI MUN" },
  { id: "eligibility", title: "3. Eligibility and Participation" },
  { id: "registration", title: "4. Registration" },
  { id: "committee-allocation", title: "5. Committee and Portfolio Allocation" },
  { id: "fees-payments", title: "6. Fees and Payments" },
  { id: "cancellations-refunds", title: "7. Cancellation and Refunds" },
  { id: "conference-participation", title: "8. Conference Participation" },
  { id: "website-use", title: "9. Website Use" },
  { id: "intellectual-property", title: "10. Intellectual Property" },
  { id: "media", title: "11. Photography, Video & Media" },
  { id: "prohibited-conduct", title: "12. Prohibited Conduct" },
  { id: "suspension", title: "13. Suspension, Removal & Disqualification" },
  { id: "third-party-services", title: "14. Third-Party Services" },
  { id: "disclaimers", title: "15. Disclaimers" },
  { id: "limitation-of-liability", title: "16. Limitation of Liability" },
  { id: "changes-to-terms", title: "17. Changes to These Terms" },
  { id: "governing-law", title: "18. Governing Law & Jurisdiction" },
  { id: "contact", title: "19. Contact" },
];

export function TermsOfServiceContent() {
  return (
    <>
      <PolicySection id="acceptance" title="1. Acceptance of Terms">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to
          and use of the NEETI MUN website (the &ldquo;Website&rdquo;) and
          your participation in the NEETI MUN conference as a registrant. By
          registering, submitting a form, or otherwise using the Website, you
          agree to these Terms. If you do not agree, please do not use the
          Website or register for the conference.
        </p>
      </PolicySection>

      <PolicySection id="about" title="2. About NEETI MUN">
        <p>
          NEETI MUN is a Model United Nations conference that brings together
          student delegates to simulate international deliberative bodies
          through structured committee debate. The Website is the primary
          channel through which delegates learn about the conference,
          register, and complete payment.
        </p>
      </PolicySection>

      <PolicySection id="eligibility" title="3. Eligibility and Participation">
        <p>
          Registration is open to individuals who complete the registration
          process and provide the information it requests. NEETI MUN does not
          currently apply a minimum age requirement as part of the
          registration flow; see our{" "}
          <Link href="/privacy-policy#minors">Privacy Policy</Link> regarding
          participants who may be minors.
        </p>
        <p>
          You are responsible for ensuring that the information you submit
          during registration is accurate, current, and complete, and for
          promptly correcting it if it changes.
        </p>
      </PolicySection>

      <PolicySection id="registration" title="4. Registration">
        <p>
          A registration is submitted through the multi-step form on the{" "}
          <Link href="/registration">Registration page</Link> and is created
          only after your payment has been verified. Duplicate registrations
          using the same email address are not permitted.
        </p>
        <p>
          Registrations are subject to availability and to the rules
          published for the current conference cycle. NEETI MUN may decline,
          waitlist, or request clarification of a registration where the
          information submitted is incomplete, inconsistent, or cannot be
          verified.
        </p>
      </PolicySection>

      <PolicySection id="committee-allocation" title="5. Committee and Portfolio Allocation">
        <p>
          As indicated during registration, committee and portfolio
          allocation is <strong>final once your registration is confirmed</strong> and
          cannot be modified after submission. Please review your committee
          and portfolio preferences carefully before completing payment.
        </p>
        <PolicyNote>
          Whether committee or portfolio assignments can be adjusted for
          capacity or availability reasons before this final allocation is
          not established in the current registration system, which records
          the committee and portfolio selected at registration directly.
          NEETI MUN organizers should confirm whether any such adjustment
          process applies.
        </PolicyNote>
      </PolicySection>

      <PolicySection id="fees-payments" title="6. Fees and Payments">
        <p>
          The applicable registration fee is displayed on the Registration
          page before you proceed to payment. All payments are processed in
          Indian Rupees (INR) through Razorpay Standard Checkout, which
          supports UPI, cards, net banking, and wallets.
        </p>
        <p>
          A registration is confirmed only after your payment has been
          independently verified by our backend with Razorpay - a successful
          on-screen checkout alone does not create a registration. If a
          payment fails or is not completed, no registration is created and
          you may retry payment. If a technical error causes a duplicate
          charge, contact us using the details in{" "}
          <Link href="#contact">Section 19</Link>.
        </p>
      </PolicySection>

      <PolicySection id="cancellations-refunds" title="7. Cancellation and Refunds">
        <p>
          If you wish to cancel your registration, contact the NEETI MUN
          Secretariat using the details in{" "}
          <Link href="#contact">Section 19</Link>.
        </p>
        <PolicyNote>
          A specific refund policy - including whether refunds are offered,
          any applicable time window, and any processing fee or deduction -
          has not been established in the materials reviewed for this page.
          This is a business decision for NEETI MUN organizers to confirm;
          until it is, cancellation requests will be reviewed by the
          Secretariat on a case-by-case basis.
        </PolicyNote>
      </PolicySection>

      <PolicySection id="conference-participation" title="8. Conference Participation">
        <p>
          By participating in NEETI MUN, you agree to comply with the rules
          of procedure and instructions of your committee chair, and with the
          NEETI MUN <Link href="/code-of-conduct">Code of Conduct</Link>,
          which governs expected conduct for all participants. Decisions of
          the Secretariat and Executive Board on procedural and conduct
          matters during the conference are final.
        </p>
      </PolicySection>

      <PolicySection id="website-use" title="9. Website Use">
        <p>
          You agree to use the Website only for its intended purposes -
          learning about the conference, registering, and making payment -
          and not to attempt to disrupt, probe, or gain unauthorized access
          to the Website, its underlying systems, or other users&rsquo;
          information.
        </p>
      </PolicySection>

      <PolicySection id="intellectual-property" title="10. Intellectual Property">
        <p>
          The NEETI MUN name, logo, and the content published on this
          Website - including text, graphics, and design - are the property
          of NEETI MUN or its licensors and are protected by applicable
          intellectual property law. You may not copy, reproduce, or
          distribute this content for commercial purposes without our prior
          written permission.
        </p>
      </PolicySection>

      <PolicySection id="media" title="11. Photography, Video & Media">
        <PolicyNote>
          A formal media/photography consent process (for example, an
          opt-out mechanism captured at registration) is not currently
          implemented in the registration flow. NEETI MUN organizers should
          confirm the intended policy for conference photography and video
          before this section is treated as final.
        </PolicyNote>
        <p>
          Subject to the above, conference sessions and activities may be
          documented through photography or video for archival and
          promotional purposes related to NEETI MUN.
        </p>
      </PolicySection>

      <PolicySection id="prohibited-conduct" title="12. Prohibited Conduct">
        <p>In connection with the Website or the conference, you agree not to:</p>
        <ul>
          <li>Harass, abuse, threaten, or discriminate against any other participant or member of the organizing team</li>
          <li>Submit false, misleading, or fraudulent information during registration</li>
          <li>Impersonate another person or misrepresent your affiliation</li>
          <li>Attempt to circumvent payment, or engage in payment fraud or chargeback abuse</li>
          <li>Attempt to gain unauthorized access to any account, system, or data</li>
          <li>Use the Website for any unlawful purpose</li>
        </ul>
      </PolicySection>

      <PolicySection id="suspension" title="13. Suspension, Removal & Disqualification">
        <p>
          Serious or repeated violations of these Terms or the{" "}
          <Link href="/code-of-conduct">Code of Conduct</Link> may result in
          removal from a committee activity, suspension, disqualification
          from the conference, or restriction from future NEETI MUN events,
          at the discretion of the Secretariat. The specific consequence
          depends on the nature and severity of the violation and is
          determined case by case rather than by a fixed penalty schedule.
        </p>
      </PolicySection>

      <PolicySection id="third-party-services" title="14. Third-Party Services">
        <p>
          The Website relies on third-party services to operate, including
          Razorpay for payment processing and infrastructure providers for
          hosting. Your use of these services in connection with the Website
          may also be subject to their own terms. See our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> for more detail
          on these providers.
        </p>
      </PolicySection>

      <PolicySection id="disclaimers" title="15. Disclaimers">
        <p>
          The Website and the information on it are provided on an
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis. While we
          take reasonable care to keep the Website accurate and available, we
          do not warrant that it will be uninterrupted, error-free, or free
          of technical issues.
        </p>
      </PolicySection>

      <PolicySection id="limitation-of-liability" title="16. Limitation of Liability">
        <p>
          To the extent permitted by applicable law, NEETI MUN and its
          organizing team will not be liable for indirect, incidental, or
          consequential loss arising from your use of the Website or
          participation in the conference. Nothing in these Terms limits any
          liability that cannot be excluded or limited under applicable law.
        </p>
      </PolicySection>

      <PolicySection id="changes-to-terms" title="17. Changes to These Terms">
        <p>
          We may revise these Terms from time to time. The &ldquo;Last
          Updated&rdquo; date at the top of this page reflects the most
          recent revision. Continued use of the Website or participation in
          the conference after a revision constitutes acceptance of the
          updated Terms.
        </p>
      </PolicySection>

      <PolicySection id="governing-law" title="18. Governing Law & Jurisdiction">
        <p>
          These Terms are intended to be governed by the laws of India, as
          NEETI MUN operates as an India-facing conference.
        </p>
        <PolicyNote>
          The specific courts or forum for resolving disputes (typically
          expressed as the courts of a named city) have not been established
          in the materials reviewed for this page. NEETI MUN organizers
          should confirm the intended jurisdiction, and this section should
          be updated accordingly.
        </PolicyNote>
      </PolicySection>

      <PolicySection id="contact" title="19. Contact">
        <p>
          Questions about these Terms can be directed to the NEETI MUN
          Secretariat at{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or
          through the <Link href="/contact">Contact page</Link>.
        </p>
      </PolicySection>
    </>
  );
}
