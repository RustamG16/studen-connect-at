import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Legal = () => {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="gradient-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold text-primary-foreground md:text-5xl">
            Legal Information
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-primary-foreground/90">
            Your privacy and rights matter to us
          </p>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <Tabs defaultValue="privacy" className="w-full">
              <TabsList className="mb-8 grid w-full grid-cols-3">
                <TabsTrigger value="privacy">Privacy Policy</TabsTrigger>
                <TabsTrigger value="terms">Terms of Service</TabsTrigger>
                <TabsTrigger value="imprint">Imprint</TabsTrigger>
              </TabsList>

              <TabsContent value="privacy">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Policy</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none space-y-4 text-muted-foreground">
                    <p>
                      <strong>Last updated:</strong> January 2025
                    </p>
                    
                    <h3 className="text-lg font-semibold text-foreground">1. Data Collection</h3>
                    <p>
                      We collect information you provide directly to us, including your name, email
                      address, university details, and documents you upload for bonus applications.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">2. How We Use Your Data</h3>
                    <p>
                      Your data is used to match you with relevant bonuses, housing opportunities, and
                      potential roommates. We process your documents to help you complete applications
                      to funding organizations.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">3. Data Security</h3>
                    <p>
                      We implement industry-standard security measures to protect your personal
                      information. All uploaded documents are encrypted and stored securely.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">4. Data Sharing</h3>
                    <p>
                      We do not sell your personal information. We only share data with organizations
                      you explicitly choose to apply to for bonuses or housing.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">5. Your Rights</h3>
                    <p>
                      You have the right to access, correct, or delete your personal data at any time.
                      Contact us at privacy@care4students.at for requests.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">6. Cookies</h3>
                    <p>
                      We use essential cookies to maintain your session and improve your experience.
                      You can control cookie preferences in your browser settings.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="terms">
                <Card>
                  <CardHeader>
                    <CardTitle>Terms of Service</CardTitle>
                  </CardHeader>
                  <CardContent className="prose max-w-none space-y-4 text-muted-foreground">
                    <p>
                      <strong>Last updated:</strong> January 2025
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h3>
                    <p>
                      By accessing and using Care4Students, you accept and agree to be bound by these
                      Terms of Service.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">2. Eligibility</h3>
                    <p>
                      Our services are available to students enrolled in Austrian higher education
                      institutions. You must be at least 18 years old or have parental consent.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">3. User Responsibilities</h3>
                    <p>
                      You are responsible for maintaining the confidentiality of your account, providing
                      accurate information, and complying with all applicable laws.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">4. Service Availability</h3>
                    <p>
                      While we strive for 100% uptime, we cannot guarantee uninterrupted access to our
                      services. We reserve the right to modify or discontinue services with notice.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">5. Content and Conduct</h3>
                    <p>
                      Users must not post inappropriate content, harass others, or use the platform for
                      illegal activities. We reserve the right to remove content and suspend accounts.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">6. Limitation of Liability</h3>
                    <p>
                      Care4Students provides information and matching services but does not guarantee
                      acceptance of bonus applications or success in finding housing.
                    </p>

                    <h3 className="text-lg font-semibold text-foreground">7. Changes to Terms</h3>
                    <p>
                      We may modify these terms at any time. Continued use of the service constitutes
                      acceptance of modified terms.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="imprint">
                <Card>
                  <CardHeader>
                    <CardTitle>Imprint (Impressum)</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6 text-muted-foreground">
                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Information according to § 5 TMG:</h3>
                      <p>
                        Care4Students GmbH<br />
                        Universitätsring 1<br />
                        1010 Vienna<br />
                        Austria
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Represented by:</h3>
                      <p>Managing Director: [Name]</p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Contact:</h3>
                      <p>
                        Phone: +43 123 456 789<br />
                        Email: legal@care4students.at
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Register Entry:</h3>
                      <p>
                        Registration court: Handelsgericht Vienna<br />
                        Registration number: FN 123456x
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">VAT ID:</h3>
                      <p>
                        VAT identification number according to §27 a<br />
                        Umsatzsteuergesetz: ATU12345678
                      </p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Responsible for content according to § 55 Abs. 2 RStV:</h3>
                      <p>[Name and Address]</p>
                    </div>

                    <div>
                      <h3 className="mb-2 font-semibold text-foreground">Dispute Resolution:</h3>
                      <p>
                        The European Commission provides a platform for online dispute resolution (ODR):
                        https://ec.europa.eu/consumers/odr. We are not willing or obliged to participate
                        in dispute resolution proceedings before a consumer arbitration board.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Legal;
