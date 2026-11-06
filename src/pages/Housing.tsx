import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AuthCta from "@/components/AuthCta";
import PageShell from "@/components/PageShell";
import PageHeader from "@/components/page/PageHeader";
import HeaderBanner from "@/components/media/HeaderBanner";
import ClosingBand from "@/components/page/ClosingBand";
import Amount from "@/components/page/Amount";
import { usePageRows } from "@/components/page/usePageRows";

const listings = [
  {
    id: 1,
    title: "Cozy Student Room in Alser Grund",
    location: "9th District, Vienna",
    rent: "€450/month",
    type: "WG",
    available: "March 1, 2025",
    amenities: ["Wifi", "Furnished", "Kitchen"],
    description: "15m² room in friendly 3-person WG. 5 min walk to U6 Alser Straße.",
  },
  {
    id: 2,
    title: "Modern Studio Near TU Wien",
    location: "4th District, Vienna",
    rent: "€650/month",
    type: "Studio",
    available: "Now",
    amenities: ["Wifi", "Private Bath", "Kitchen"],
    description: "25m² studio apartment, newly renovated. Perfect for focused studying.",
  },
  {
    id: 3,
    title: "Shared Apartment in Student Dorm",
    location: "2nd District, Vienna",
    rent: "€380/month",
    type: "Dorm",
    available: "September 1, 2025",
    amenities: ["Wifi", "Laundry", "Common Room"],
    description: "Official student housing with all amenities. International community.",
  },
  {
    id: 4,
    title: "Spacious Room in Währing",
    location: "18th District, Vienna",
    rent: "€520/month",
    type: "WG",
    available: "April 15, 2025",
    amenities: ["Wifi", "Balcony", "Garden"],
    description: "18m² room with balcony. Quiet neighborhood, close to tram.",
  },
];

const housingTypes = [
  {
    title: "WG (Shared Flat)",
    price: "€350-550/month",
    description: "Most popular option. Share apartment with other students.",
  },
  {
    title: "Studio Apartment",
    price: "€600-900/month",
    description: "Private space with kitchen and bathroom. More independence.",
  },
  {
    title: "Student Dorms",
    price: "€300-450/month",
    description: "Affordable official housing with great community atmosphere.",
  },
];


const Housing = () => {
  const rows = usePageRows();

  return (
    <PageShell>
      <PageHeader
        media={<HeaderBanner name="housing" stillToggle />}
        eyebrow="Housing"
        title={
          <>
            Student <em className="t-serif -mx-[0.08em] px-[0.08em]">Housing</em> Help
          </>
        }
        lead="Find verified student accommodation in Vienna. We connect you with safe, affordable housing options near your university."
      >
        <Button size="lg" asChild>
          <AuthCta>Search Housing Now</AuthCta>
        </Button>
      </PageHeader>

      <div ref={rows}>
        <section className="clip-x" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Housing Options</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">Choose the type that fits your lifestyle and budget</p>
            </div>
            <ul className="grid gap-x-6 md:grid-cols-3">
              {housingTypes.map((type, i) => (
                <li
                  key={type.title}
                  data-rule-row
                  style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                  className="row-rule py-6 md:py-8"
                >
                  <p className="t-row-amount tnum mb-3">
                    <Amount value={type.price} />
                  </p>
                  <h3 className="t-row-name mb-1 text-xl">{type.title}</h3>
                  <p className="max-w-[40ch] text-ink-2">{type.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="clip-x rule" style={{ paddingBlock: "var(--section-y)" }}>
          <div className="shell-x">
            <div className="mb-8 md:mb-12">
              <h2 className="t-display mb-4 text-[clamp(1.75rem,4vw,3.5rem)]">Available Listings</h2>
              <p className="t-lead max-w-[46ch] text-ink-2">
                Recent verified housing options for students (login to see all listings)
              </p>
            </div>

            <ul className="border-b">
              {listings.map((listing, i) => (
                <li
                  key={listing.id}
                  data-rule-row
                  style={{ "--i": Math.min(i, 7) } as React.CSSProperties}
                  className="row-rule grid gap-x-6 gap-y-3 py-6 md:grid-cols-12 md:py-9"
                >
                  <p className="t-row-amount tnum md:col-span-4 lg:col-span-3">
                    <Amount value={listing.rent} />
                  </p>
                  <div className="md:col-span-5 lg:col-span-6">
                    <h3 className="t-row-name mb-1 text-xl md:text-2xl">{listing.title}</h3>
                    <p className="t-meta mb-3 text-ink-2">
                      <span className="font-bold text-foreground">{listing.type}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{listing.location}</span>
                    </p>
                    <p className="mb-3 max-w-[56ch] text-ink-2">{listing.description}</p>
                    <p className="t-meta tnum mb-3 text-ink-2">Available: {listing.available}</p>
                    <ul className="tag-rules t-meta text-ink-2">
                      {listing.amenities.map((amenity) => (
                        <li key={amenity}>{amenity}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex md:col-span-3 md:justify-end">
                    <Button variant="outline" asChild className="w-full md:w-auto">
                      <AuthCta>View Details</AuthCta>
                    </Button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 md:mt-12">
              <Button size="lg" asChild>
                <AuthCta>View All Listings</AuthCta>
              </Button>
            </div>
          </div>
        </section>
      </div>

      <ClosingBand
        title="Need Help Finding Housing?"
        action={
          <>
            <Button variant="warm" size="lg" asChild>
              <AuthCta>Set Housing Preferences</AuthCta>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-canvas text-canvas">
              <Link to="/find-buddy">Find a Roommate</Link>
            </Button>
          </>
        }
      >
        Tell us your preferences and budget, and we'll match you with suitable options. Plus, find compatible roommates
        through our House Buddy feature!
      </ClosingBand>
    </PageShell>
  );
};

export default Housing;
