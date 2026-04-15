import PopulationSunburst from "../components/PopulationSunburst";
import TvTreemap from "../components/TvTreemap";
import SlopeChart from "../components/SlopeChart";
import ForestPictogram from "../components/ForestPictogram";
import ClimateAreaChart from "../components/ClimateAreaChart";
import PressFreedomMap from "../components/PressFreedomMap";
import DivergingBarChart from "../components/DivergingBarChart";
import RoseChart from "../components/RoseChart";
import WealthMap from "../components/WealthMap";
import MelkwegChart from "../components/MelkwegUnitChart";
import ElevationChart from "../components/ElevationHistogramChart";
import SankeyChart from "../components/SankeyChart";

export const chartchallengeprojects = [
{
  id: 1,
  category: "Comparison",
  topic: "Part-to-Whole",
  title: "5 continents, unevenly sliced",
  description:
    "Two rings, one story: most of us, humans, live in Asia. India and China each are home for more than 1.4 billion people — together they outweigh every other continent. The 10 largest countries per continent already account for 6.4 billion of the world's 8 billion people.",
  source: "UN World Population Prospects 2023",
  tags: [],
  chart: <PopulationSunburst />,
},

{
  id: 2,
  category: "Comparison",
  topic: "Pictogram",
  title: "You don't have to be the biggest to have the most trees",
  description:
    "Each rectangle represents a European country, sized by total land area. Tree icons fill from the bottom up based on forest coverage — the more trees, the more forested the country. Finland leads at 66%, Malta barely registers at 1%. Ordered from most to least forested, left to right.",
  source: "Eurostat / FAO Global Forest Resources Assessment 2022",
  tags: [],
  chart: <ForestPictogram />,
},

{
  id: 3,
  category: "Comparison",
  topic: "Mosaic",
  title: "Tuning in — how long does the world watch TV?",
  description:
    "Explore the habits of the 15 most populated countries of each continent. Rectangle size represents population, color represents continent, with darker shades for countries watching above their regional average. Where data is missing, we're left with static. Note: figures reflect linear TV and broadcaster catch-up (BVoD). SVoD platforms (Netflix, Prime Video etc.) not fully included.",
  source: "Médiamétrie One Television Year 2024, Zenith Media",
  tags: [],
  chart: <TvTreemap />,
},

{
  id: 4,
  category: "Comparison",
  topic: "Slope",
  title: "What minimum wage actually buys",
  description:
    "A slope chart comparing monthly minimum wage against average cost of living across 27 European countries. Green lines show where the minimum wage covers living costs — magenta where it falls short. Click ☰ to highlight your country.",
  source: "Eurostat 2025, Numbeo 2025",
  tags: [],
  chart: <SlopeChart />,
},

{
  id: 5,
  category: "Comparison",
  topic: "Experimental",
  title: "A century of warming",
  description:
    "Monthly temperature anomalies at the beginning of each decade since 1880, overlaid on the same axes. Navigate through chapters to see how each era compares — from pre-industrial stability to the record-breaking 2020s. Inspired by Tamas Varga and the Visualizing Climate 2026 conference.",
  source: "NASA GISS Surface Temperature Analysis (GISTEMP v4), 2024",
  tags: [],
  chart: <ClimateAreaChart />,
},

{
  id: 6,
  category: "Comparison",
  topic: "Data Day",
  title: "Reporters Without Borders",
  description:
    "One square, one country, one score. The RSF Press Freedom Index ranks 180 countries on how safely and freely journalists can report. Teal means freedom. Magenta means silence. Most of the world sits somewhere in between.",
  source: "rsf.org, 2025",
  tags: [],
  chart: <PressFreedomMap />,
},

{
  id: 7,
  category: "Distribution",
  topic: "Multiscale",
  title: "Never grow apart!",
description:
  "Since 1990, the EU has grown its economy by nearly 70% while cutting greenhouse gas emissions by 36%. Each bar tells a year's story: teal rises when GDP grows, magenta rises when emissions drop. The best years are when both bars go up simultaneously — more economy, less carbon. 2009 and 2020 are the exceptions: both crash together, not from clean policy, but because economies simply stopped.",
  source: "World Bank (GDP growth), European Environment Agency (GHG emissions), 1995–2023",
  tags: [],
  chart: <DivergingBarChart />,
},

{
  id: 8,
  category: "Distribution",
  topic: "Circular",
  title: "When Europe switches on",
  description:
    "Every hour of every day, Europe draws hundreds of gigawatts from the grid. This rose chart shows the average hourly electricity load across EU-27 by season — each slice is one hour of the day, its radius the average demand in gigawatts. The pattern is consistent year-round: demand collapses overnight, surges at 08:00 as industry wakes up, holds through the working day, and fades again after 21:00. Winter sits heaviest on the grid. Spring is the lightest touch.",
  source: "ENTSO-E Transparency Platform, European Environment Agency, 2023 average workday",
  tags: [],
  chart: <RoseChart />,
},

{
  id: 9,
  category: "Distribution",
  topic: "Wealth",
  title: "What the average hides",
  description:
    "Household net wealth = everything you own (property, savings, investments) minus everything you owe (mortgages, loans). Each tile shows one EU country: the left edge of the ramp is the median household — the most typical — and the right edge is the mean. The steeper the angle, the more a wealthy minority pulls the average away from reality. For example, Germany and the Netherlands look poor by median but wealthy by mean — because most households rent, while a few own significant assets.",
  source: "ECB Household Finance and Consumption Survey (HFCS), Wave 4 (2021)",
  tags: [],
  chart: <WealthMap />,
},

{
  id: 10,
  category: "Distribution",
  topic: "Pop Culture",
  title: "A night at the ... Melkweg",
  description:
    "50 past concerts at Amsterdam's Melkweg — one of the Netherlands' most iconic music venues and my personal favorite. Each dot is a concert: filled means sold out, hollow means it wasn't. Color tells you where the artist came from. Indie and Electronic dominate the agenda, but Hiphop and R&B sell out fastest. European acts make up the majority, with a strong international presence — Dutch artists are a small but loyal slice.",
  source: "Melkweg Amsterdam agenda (melkweg.nl), concerts Oct 2025 – Mar 2026. Nationality based on artist country of origin. Sold-out status reflects Melkweg's own ticketing labels and may not capture partial sell-outs or last-minute availability. Note: sold-out status and genre tags are sourced from the Melkweg website as listed at time of the show. Some genre classifications are approximate — Melkweg often tags acts with multiple overlapping genres, and this chart uses the primary one.",
  tags: [],
  chart: <MelkwegChart />,
},

{
  id: 11,
  category: "Distribution",
  topic: "Physical",
  title: "Built below the sea",
  description:
    "26% of the Netherlands sits below sea level. Without dikes, pumps and centuries of water engineering, a quarter of the country — including Amsterdam and Schiphol airport — would be permanently underwater. Another 39.5% sits between 0m and 5m above sea level, protected by dike rings but vulnerable to breach or river surge. Only 34.5% of Dutch land drains naturally. Each rectangle's area is proportional to its land surface — height reflects the elevation range, width the share of national territory.",
  source: "AHN4 (Actueel Hoogtebestand Nederland) 2020–2022, CBS Statistics Netherlands",
  tags: [],
  chart: <ElevationChart />,
},

{
  id: 12,
  category: "Distribution",
  topic: "Theme Day - Flowing Data",
  title: "How energy comes and goes",
  description:
    "In 2023 the Netherlands consumed nearly 2,929 PJ of primary energy. Natural gas and oil together account for almost 80% of all supply — the two dominant flows on the left. Renewables (wind, solar, biomass) are visible but thin by comparison. On the right, industry absorbs the most at 1,061 PJ, followed by transport — almost entirely oil. Each band's thickness is proportional to the energy flow in petajoules. The fossil threads still dwarf the renewable ones. The transition is underway, but in absolute terms it has barely begun.",
  source: "CBS Statistics Netherlands, EBN Energy Infographic 2023, IEA Netherlands Energy Policy Review 2024. Values in PJ (petajoules), primary energy supply.",
  tags: [],
  chart: <SankeyChart />,
},

];