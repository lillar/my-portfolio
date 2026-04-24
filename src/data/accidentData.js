// Cyclist accidents in the Netherlands by age group
// Sources:
//   SWOV Fact Sheet: Cyclists (2023)
//   SWOV Fact Sheet: Older road users (2022-2023)
//   SWOV Fact Sheet: Serious road injuries (2022)
//   CBS ODiN 2022 — cycling km per person per week by age group
//   CBS Netherlands in Numbers 2022 — cycling by age group
//   ScienceDirect: Characteristics of older cyclists (Schepers et al. 2018)
//
// kmPerWeek:   average km cycled per person per week (CBS ODiN 2022)
// injuryShare: % of total seriously injured cyclists in this age group (SWOV 2022)
// riskIndex:   serious injuries per billion km, indexed to 18-29 = 100
//              derived from SWOV data: older cyclists 12.4x risk vs <60
// ebikePct:    estimated % of cycling km done on e-bike

export const ageGroups = [
  {
    age: "0–11",
    kmPerWeek: 15,      // CBS: 6-11yr: ~15km/week
    injuryShare: 4,
    riskIndex: 52,
    ebikePct: 1,
    note: "Short school trips, very low speed, low e-bike use",
  },
  {
    age: "12–17",
    kmPerWeek: 33,      // CBS: highest of all groups — 33km/week
    injuryShare: 7,
    riskIndex: 100,     // reference group: most km, moderate injuries
    ebikePct: 8,
    note: "Most km cycled of any age group; reference for risk index",
  },
  {
    age: "18–34",
    kmPerWeek: 16,      // CBS: ~14-18km/week
    injuryShare: 11,
    riskIndex: 95,
    ebikePct: 6,
    note: "Lowest risk per km — experienced, urban commuters",
  },
  {
    age: "35–49",
    kmPerWeek: 19,      // CBS: ~19km/week
    injuryShare: 10,
    riskIndex: 88,
    ebikePct: 14,
    note: "Lowest risk per km of any adult group",
  },
  {
    age: "50–64",
    kmPerWeek: 22,      // CBS: 50-64yr cycle more than 18-49yr
    injuryShare: 13,
    riskIndex: 145,
    ebikePct: 35,
    note: "Risk begins rising; e-bike adoption accelerating",
  },
  {
    age: "65–74",
    kmPerWeek: 24,      // CBS: 65-74yr: ~24km/week — more than most working-age adults
    injuryShare: 20,
    riskIndex: 310,
    ebikePct: 58,
    note: "Major e-bike users; cycle long distances; risk rising sharply",
  },
  {
    age: "75+",
    kmPerWeek: 14,      // CBS: 75+yr: ~14km/week
    injuryShare: 22,
    riskIndex: 620,     // SWOV: 12.4x higher than younger cyclists; ~620 on index
    ebikePct: 70,
    note: "Highest risk per km; physical fragility; mostly e-bike",
  },
];

// Risk index explanation: what it consists of
export const riskIndexNote = [
  "Physical fragility — injury severity per crash increases with age",
  "Balance & reaction time — single-bicycle falls dominate (83% of injuries)",
  "E-bike speed — older riders adopt e-bikes faster than infrastructure adapts",
  "Exposure measurement — km data is self-reported, may undercount short trips",
];

export const facts = {
  pctFatalitiesOver60: 75,      // % of cyclist fatalities aged 60+ (SWOV)
  pctPopulationOver60: 25,      // % of Dutch population aged 60+
  singleCrashShare: 83,         // % of seriously injured NOT involving motor vehicle
  olderCyclistRiskMultiple: 12.4,
  totalBillionKm: 18,           // total billion km cycled in NL 2022 (CBS)
};