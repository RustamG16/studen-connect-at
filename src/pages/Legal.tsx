import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import Fold from "@/components/page/Fold";

const Legal = () => {
  return (
    <PageShell>
      <PageHeader eyebrow="Legal" title="Legal Information" lead="Your privacy and rights matter to us" />

      <section className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
        <div className="shell-x">
          <div className="max-w-[68ch] md:ml-[16.66%]">
            <Fold summary="Privacy Policy">
              <div className="space-y-4 pb-8 text-ink-2">
                <h2 className="sr-only">Privacy Policy</h2>
              <p>
                <strong>Last updated:</strong> January 2025
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">1. Data Collection</h3>
              <p>
                We collect information you provide directly to us, including your name, email
                address, university details, and documents you upload for bonus applications.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">2. How We Use Your Data</h3>
              <p>
                Your data is used to match you with relevant bonuses, housing opportunities, and
                potential roommates. We process your documents to help you complete applications
                to funding organizations.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">3. Data Security</h3>
              <p>
                We implement industry-standard security measures to protect your personal
                information. All uploaded documents are encrypted and stored securely.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">4. Data Sharing</h3>
              <p>
                We do not sell your personal information. We only share data with organizations
                you explicitly choose to apply to for bonuses or housing.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">5. Your Rights</h3>
              <p>
                You have the right to access, correct, or delete your personal data at any time.
                Contact us at privacy@care4students.at for requests.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">6. Cookies</h3>
              <p>
                We use essential cookies to maintain your session and improve your experience.
                You can control cookie preferences in your browser settings.
              </p>

              </div>
            </Fold>

            <Fold summary="Terms of Service">
              <div className="space-y-4 pb-8 text-ink-2">
                <h2 className="sr-only">Terms of Service</h2>
              <p>
                <strong>Last updated:</strong> January 2025
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">1. Acceptance of Terms</h3>
              <p>
                By accessing and using Care4Students, you accept and agree to be bound by these
                Terms of Service.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">2. Eligibility</h3>
              <p>
                Our services are available to students enrolled in Austrian higher education
                institutions. You must be at least 18 years old or have parental consent.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">3. User Responsibilities</h3>
              <p>
                You are responsible for maintaining the confidentiality of your account, providing
                accurate information, and complying with all applicable laws.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">4. Service Availability</h3>
              <p>
                While we strive for 100% uptime, we cannot guarantee uninterrupted access to our
                services. We reserve the right to modify or discontinue services with notice.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">5. Content and Conduct</h3>
              <p>
                Users must not post inappropriate content, harass others, or use the platform for
                illegal activities. We reserve the right to remove content and suspend accounts.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">6. Limitation of Liability</h3>
              <p>
                Care4Students provides information and matching services but does not guarantee
                acceptance of bonus applications or success in finding housing.
              </p>

              <h3 className="mb-1 mt-8 text-lg font-bold text-foreground first-of-type:mt-6">7. Changes to Terms</h3>
              <p>
                We may modify these terms at any time. Continued use of the service constitutes
                acceptance of modified terms.
              </p>

              </div>
            </Fold>

            <div className="border-b">
              <Fold summary="Imprint" defaultOpen>
                <div className="space-y-6 pb-8 text-ink-2">
                  <h2 className="text-2xl font-extrabold text-foreground">Imprint (Impressum)</h2>
              <div>
                <h3 className="mb-1 font-bold text-foreground">Information according to § 5 TMG:</h3>
                <p>
                  Care4Students GmbH<br />
                  Universitätsring 1<br />
                  1010 Vienna<br />
                  Austria
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">Represented by:</h3>
                <p>Managing Director: [Name]</p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">Contact:</h3>
                <p>
                  Phone: +43 123 456 789<br />
                  Email: legal@care4students.at
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">Register Entry:</h3>
                <p>
                  Registration court: Handelsgericht Vienna<br />
                  Registration number: FN 123456x
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">VAT ID:</h3>
                <p>
                  VAT identification number according to §27 a<br />
                  Umsatzsteuergesetz: ATU12345678
                </p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">Responsible for content according to § 55 Abs. 2 RStV:</h3>
                <p>[Name and Address]</p>
              </div>

              <div>
                <h3 className="mb-1 font-bold text-foreground">Dispute Resolution:</h3>
                <p>
                  The European Commission provides a platform for online dispute resolution (ODR):
                  https://ec.europa.eu/consumers/odr. We are not willing or obliged to participate
                  in dispute resolution proceedings before a consumer arbitration board.
                </p>
              </div>

                </div>
              </Fold>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
};

export default Legal;
