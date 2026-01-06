export type MarketplaceVenture = {
  id: string;
  ventureName: string;
  founderName: string;
  elevatorPitch: string;
  category: "Tech" | "Social Impact" | "Food" | "Education" | "Environment" | "FinTech" | "Sustainability";
  industry: string;
  createdAt: string; // ISO date
  baseTrendingScore: number;
  canvas: {
    problem: string;
    solution: string;
    revenueStreams: string;
  };
};

export const MARKETPLACE_VENTURES: MarketplaceVenture[] = [
  {
    id: "venture-1",
    ventureName: "Cool Breeze Lemonade Co.",
    founderName: "Alex",
    elevatorPitch:
      "A student-run lemonade stand that turns hot walks home from school into a fun, refreshing ritual.",
    category: "Food",
    industry: "Food & Beverage",
    createdAt: "2025-09-01T10:00:00.000Z",
    baseTrendingScore: 95,
    canvas: {
      problem: "Students and parents walking home after school are hot, thirsty, and don’t have a fun, affordable drink option nearby.",
      solution:
        "A colourful student-run lemonade stand just outside school selling cold, flavoured lemonade and small snacks.",
      revenueStreams:
        "Per-cup lemonade sales, snack add-ons, and a loyalty card where every 6th drink is free to encourage repeat visits.",
    },
  },
  {
    id: "venture-2",
    ventureName: "Homework Heroes Club",
    founderName: "Maria",
    elevatorPitch:
      "An after-school club where older students tutor younger ones and earn badges instead of grades.",
    category: "Education",
    industry: "EdTech / Tutoring",
    createdAt: "2025-09-03T15:30:00.000Z",
    baseTrendingScore: 88,
    canvas: {
      problem:
        "Younger students often feel stuck with homework at home, while older students want leadership experience but don’t have an easy way to help.",
      solution:
        "A structured after-school club where older students run short, fun homework sessions for younger students in small groups.",
      revenueStreams:
        "School-supported funding, optional membership fees, and small sponsorships from local businesses to cover materials and snacks.",
    },
  },
  {
    id: "venture-3",
    ventureName: "Eco Champions Clean-Up Crew",
    founderName: "Nikos",
    elevatorPitch:
      "A weekend clean-up squad that turns littered parks into green, photo-worthy spaces.",
    category: "Social Impact",
    industry: "Environment & Community",
    createdAt: "2025-09-05T09:15:00.000Z",
    baseTrendingScore: 78,
    canvas: {
      problem:
        "Local parks and playgrounds are often messy and full of litter, making them less safe and enjoyable for families.",
      solution:
        "Organised weekend clean-up missions led by students, with clear roles, equipment, and mini-celebrations after each event.",
      revenueStreams:
        "Donations from families, small grants, and partnerships with local businesses that sponsor specific clean-up days.",
    },
  },
  {
    id: "venture-4",
    ventureName: "SnackTrack Vending Squad",
    founderName: "Eleni",
    elevatorPitch:
      "A student team that curates healthier, student-approved snacks for school events and pop-up stands.",
    category: "Tech",
    industry: "Food & Retail",
    createdAt: "2025-09-07T12:45:00.000Z",
    baseTrendingScore: 82,
    canvas: {
      problem:
        "Students want tasty snacks that aren’t just sugar, but school events often only offer the same unhealthy options.",
      solution:
        "A student-led snack squad that sources and sells a curated list of healthier yet exciting snacks at school events.",
      revenueStreams:
        "Per-item sales, pre-order snack boxes for events, and bundle deals for clubs and sports teams.",
    },
  },
];
