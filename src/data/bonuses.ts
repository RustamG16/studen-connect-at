/** What a visitor can tick in the personal ledger (DESIGN.md, Gamification). */
export type Fact = "under24" | "away" | "uniWien" | "need";

/** The six bonuses, moved verbatim from `src/pages/Bonuses.tsx` (copy is frozen). `facts` and `maxAmount` are not copy. */
export interface Bonus {
  id: number;
  name: string;
  amount: string;
  deadline: string;
  eligibility: string;
  description: string;
  requirements: string[];
  facts: Fact[];
  maxAmount: number;
}

export const bonuses: Bonus[] = [
  {
    id: 1,
    name: "Studienbeihilfe",
    amount: "€5,040/year",
    deadline: "December 15, 2025",
    eligibility: "All students",
    description: "Austria's main student grant for those with financial need",
    requirements: ["Income proof", "Study confirmation", "Residence permit"],
    facts: ["need"],
    maxAmount: 5040,
  },
  {
    id: 2,
    name: "Wohnbeihilfe",
    amount: "€3,600/year",
    deadline: "Ongoing",
    eligibility: "Students with housing costs",
    description: "Housing subsidy for students living away from parents",
    requirements: ["Rental contract", "Income declaration", "Study enrollment"],
    facts: ["away"],
    maxAmount: 3600,
  },
  {
    id: 3,
    name: "Familienbeihilfe",
    amount: "€1,476/year",
    deadline: "Ongoing",
    eligibility: "Students under 24",
    description: "Family allowance for students in tertiary education",
    requirements: ["Age verification", "Study progress", "Austrian residence"],
    facts: ["under24"],
    maxAmount: 1476,
  },
  {
    id: 4,
    name: "Stipendium der Universität Wien",
    amount: "€7,200/year",
    deadline: "March 31, 2025",
    eligibility: "Uni Wien students",
    description: "Merit-based scholarship for outstanding academic performance",
    requirements: ["GPA 1.5 or better", "Recommendation letters", "Application essay"],
    facts: ["uniWien"],
    maxAmount: 7200,
  },
  {
    id: 5,
    name: "ÖH Sozialfonds",
    amount: "€500-2,000",
    deadline: "Quarterly",
    eligibility: "Students in hardship",
    description: "Emergency fund for students facing financial difficulties",
    requirements: ["Financial proof", "Personal statement", "ÖH membership"],
    facts: ["need"],
    maxAmount: 2000,
  },
  {
    id: 6,
    name: "Leistungsstipendium",
    amount: "€750-1,500",
    deadline: "May 1, 2025",
    eligibility: "High achievers",
    description: "Performance scholarship for academic excellence",
    requirements: ["Minimum GPA 1.0", "Study progress", "Application form"],
    facts: [],
    maxAmount: 1500,
  },
];
