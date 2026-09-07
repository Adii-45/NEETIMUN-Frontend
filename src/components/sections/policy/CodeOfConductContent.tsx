import Link from "next/link";
import { PolicySection } from "@/components/policy/PolicySection";
import { PolicyNote } from "@/components/policy/PolicyNote";
import { contactInfo } from "@/lib/data/contact";
import type { PolicySectionMeta } from "@/lib/data/policy";

export const CODE_OF_CONDUCT_SECTIONS: PolicySectionMeta[] = [
  { id: "purpose-and-scope", title: "1. Purpose and Scope" },
  { id: "core-principles", title: "2. Core Principles" },
  { id: "expected-conduct", title: "3. Expected Conduct" },
  { id: "committee-room-conduct", title: "4. Committee Room Conduct" },
  { id: "harassment-and-discrimination", title: "5. Harassment and Discrimination" },
  { id: "academic-integrity", title: "6. Academic and Intellectual Integrity" },
  { id: "digital-conduct", title: "7. Digital and Social Media Conduct" },
  { id: "photography", title: "8. Photography and Recording" },
  { id: "prohibited-substances", title: "9. Prohibited Substances and Illegal Activity" },
  { id: "safety", title: "10. Safety and Emergency Situations" },
  { id: "reporting", title: "11. Reporting Misconduct" },
  { id: "confidentiality-retaliation", title: "12. Confidentiality and Retaliation" },
  { id: "investigation", title: "13. Investigation and Response" },
  { id: "consequences", title: "14. Possible Consequences" },
  { id: "false-reports", title: "15. False or Malicious Reports" },
  { id: "final-authority", title: "16. Final Authority" },
  { id: "contact", title: "17. Contact and Reporting" },
];

export function CodeOfConductContent() {
  return (
    <>
      <PolicySection id="purpose-and-scope" title="1. Purpose and Scope">
        <p>
          NEETI MUN is committed to creating a safe, respectful, inclusive,
          intellectually rigorous, and professionally conducted conference
          environment. This Code of Conduct sets out the standards of
          behaviour expected of everyone involved in NEETI MUN.
        </p>
        <p>This Code applies to:</p>
        <ul>
          <li>Delegates</li>
          <li>Chairs and the Executive Board</li>
          <li>Secretariat members</li>
          <li>Volunteers and the organizing team</li>
          <li>Faculty advisors</li>
          <li>Guests</li>
          <li>Photographers and media personnel</li>
          <li>Any other individual participating in the conference</li>
        </ul>
        <p>
          It applies to conduct within committee rooms, throughout the
          conference venue, and in official conference-related digital spaces
          (see <Link href="#digital-conduct">Section 7</Link>).
        </p>
      </PolicySection>

      <PolicySection id="core-principles" title="2. Core Principles">
        <p>NEETI MUN asks every participant to uphold six core principles:</p>
        <ul>
          <li><strong>Respect</strong> — for fellow participants, chairs, staff, and the venue.</li>
          <li><strong>Professionalism</strong> — in conduct, communication, and appearance appropriate to a diplomatic simulation.</li>
          <li><strong>Diplomacy</strong> — resolving disagreement through argument and negotiation, not hostility.</li>
          <li><strong>Integrity</strong> — honesty in representation, research, and conduct.</li>
          <li><strong>Inclusivity</strong> — welcoming participants of every background on equal terms.</li>
          <li><strong>Safety</strong> — for oneself and for others, at all times.</li>
        </ul>
      </PolicySection>

      <PolicySection id="expected-conduct" title="3. Expected Conduct">
        <p>All participants are expected to:</p>
        <ul>
          <li>Treat other participants, chairs, staff, and venue personnel with respect</li>
          <li>Engage in debate diplomatically, addressing positions rather than people</li>
          <li>Follow the instructions of committee chairs and conference organizers</li>
          <li>Follow conference procedures and rules of procedure</li>
          <li>Communicate professionally, in person and in writing</li>
          <li>Behave responsibly both inside and outside committee sessions</li>
        </ul>
      </PolicySection>

      <PolicySection id="committee-room-conduct" title="4. Committee Room Conduct">
        <p>Within committee sessions, participants are expected to:</p>
        <ul>
          <li>Follow the chair&rsquo;s instructions and rulings</li>
          <li>Maintain decorum and avoid disruptive behaviour</li>
          <li>Avoid intimidation, raised voices, or aggressive conduct directed at other delegates</li>
          <li>Use appropriate, professional language at all times</li>
          <li>Respect established speaking and procedural rules</li>
          <li>
            Refrain from targeting or demeaning another delegate under the
            guise of diplomatic debate — pointed disagreement on policy is
            welcome; personal attacks are not
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="harassment-and-discrimination" title="5. Harassment and Discrimination">
        <p>
          NEETI MUN prohibits harassment and discrimination of any kind. This
          includes, without limitation:
        </p>
        <ul>
          <li>Harassment, bullying, or intimidation of any participant</li>
          <li>Sexual harassment or unwanted sexual attention or conduct</li>
          <li>Threats, stalking, or conduct intended to frighten another participant</li>
          <li>
            Discriminatory behaviour or hate speech directed at a
            participant&rsquo;s race, ethnicity, nationality, gender, gender
            identity, sexual orientation, religion, disability, age, or any
            other protected characteristic
          </li>
          <li>Degrading remarks, slurs, or comments that demean another participant</li>
        </ul>
        <p>
          This applies regardless of whether the conduct occurs in a
          committee room, elsewhere at the venue, or in an official
          conference-related digital space.
        </p>
      </PolicySection>

      <PolicySection id="academic-integrity" title="6. Academic and Intellectual Integrity">
        <p>Participants are expected to uphold academic and intellectual integrity, including by not:</p>
        <ul>
          <li>Plagiarizing position papers, resolutions, or other conference materials</li>
          <li>Fabricating citations, sources, or evidence</li>
          <li>Impersonating another delegate, country, or organization beyond their assigned role</li>
          <li>Cheating or otherwise deliberately misrepresenting facts during committee proceedings</li>
          <li>Falsifying any conference material submitted to chairs or the Secretariat</li>
        </ul>
      </PolicySection>

      <PolicySection id="digital-conduct" title="7. Digital and Social Media Conduct">
        <p>
          Where NEETI MUN maintains official conference-related group chats
          or channels (for example, WhatsApp or Discord groups used to
          coordinate committee logistics), the standards in this Code apply
          there as they would in person. In these spaces and in any public
          posts referencing the conference, participants must not:
        </p>
        <ul>
          <li>Harass or target another participant online</li>
          <li>Share another participant&rsquo;s private information without consent</li>
          <li>Impersonate another participant, chair, or organizer</li>
          <li>Post malicious, defamatory, or degrading content about another participant or NEETI MUN</li>
          <li>
            Record or share committee proceedings without authorization,
            where such recording is not part of official conference
            documentation
          </li>
        </ul>
      </PolicySection>

      <PolicySection id="photography" title="8. Photography and Recording">
        <PolicyNote>
          A detailed consent procedure for conference photography and video
          (for example, an opt-out process) has not been established in the
          materials reviewed for this page. NEETI MUN organizers should
          confirm the intended approach.
        </PolicyNote>
        <p>
          Subject to the above, official conference photography and video may
          be captured for archival and promotional purposes. Participants
          designated as photographers or media personnel are expected to
          conduct themselves professionally and respectfully while doing so.
        </p>
      </PolicySection>

      <PolicySection id="prohibited-substances" title="9. Prohibited Substances and Illegal Activity">
        <p>
          Participants must not possess or use alcohol, illegal drugs, or
          weapons at the conference venue or during conference-related
          activities, and must not engage in any other illegal conduct.
          Participants are expected to comply with the laws applicable at the
          conference venue at all times.
        </p>
      </PolicySection>

      <PolicySection id="safety" title="10. Safety and Emergency Situations">
        <p>
          Participants should follow all venue safety instructions and the
          directions of conference staff during any emergency. If you become
          aware of a safety concern during the conference, notify the nearest
          member of the Secretariat, Executive Board, or venue staff
          immediately.
        </p>
      </PolicySection>

      <PolicySection id="reporting" title="11. Reporting Misconduct">
        <p>
          If you experience or witness conduct that violates this Code,
          please report it as soon as possible. Reports can be made:
        </p>
        <ul>
          <li>
            In person, to any available member of the Secretariat or
            Executive Board at the conference
          </li>
          <li>
            By email to the NEETI MUN Secretariat at{" "}
            <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
          </li>
          <li>
            Through the <Link href="/contact">Contact page</Link>
          </li>
        </ul>
        <p>Where possible, include what happened, when and where, and who was involved.</p>
      </PolicySection>

      <PolicySection id="confidentiality-retaliation" title="12. Confidentiality and Retaliation">
        <p>
          Reports are handled as discreetly as the situation allows, with
          information shared only with those who need it to review and
          respond to the report. Retaliation against anyone for making a
          good-faith report is itself a violation of this Code and will be
          treated seriously.
        </p>
      </PolicySection>

      <PolicySection id="investigation" title="13. Investigation and Response">
        <p>
          Reports of misconduct are reviewed by the Secretariat and, where
          appropriate, the Executive Board. The individuals involved may be
          asked for their account of events. Based on that review,
          appropriate action will be taken in line with{" "}
          <Link href="#consequences">Section 14</Link>.
        </p>
      </PolicySection>

      <PolicySection id="consequences" title="14. Possible Consequences">
        <p>
          Depending on the nature and severity of a violation, consequences
          may include:
        </p>
        <ul>
          <li>A verbal or written warning</li>
          <li>Removal from a specific committee session or activity</li>
          <li>Suspension from the remainder of the conference</li>
          <li>Disqualification from the conference</li>
          <li>Restriction from participating in future NEETI MUN events</li>
          <li>Referral to venue security or the appropriate authorities, where warranted</li>
        </ul>
        <p>
          The specific consequence is determined case by case by the
          Secretariat rather than by a fixed penalty schedule.
        </p>
      </PolicySection>

      <PolicySection id="false-reports" title="15. False or Malicious Reports">
        <p>
          Reports made in good faith — including those that, after review,
          are not substantiated — will not be treated as violations. However,
          knowingly making a false or malicious report about another
          participant is itself a serious violation of this Code and will be
          addressed accordingly.
        </p>
      </PolicySection>

      <PolicySection id="final-authority" title="16. Final Authority">
        <p>
          The NEETI MUN Secretariat holds final authority in interpreting
          this Code of Conduct and in determining the appropriate response to
          a reported violation.
        </p>
      </PolicySection>

      <PolicySection id="contact" title="17. Contact and Reporting">
        <p>
          To report a concern or ask a question about this Code, contact the
          NEETI MUN Secretariat at{" "}
          <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a> or
          through the <Link href="/contact">Contact page</Link>. This Code
          should be read together with our{" "}
          <Link href="/terms-of-service">Terms of Service</Link> and{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>.
        </p>
      </PolicySection>
    </>
  );
}
