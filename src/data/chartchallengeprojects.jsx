import PopulationSunburst from "../components/PopulationSunburst";
import TvTreemap from "../components/TvTreemap";
import SlopeChart from "../components/SlopeChart";
import ForestPictogram from "../components/ForestPictogram";
import ClimateAreaChart from "../components/ClimateAreaChart";

export const chartchallengeprojects = [
{
  id: 1,
  category: "Comparison",
  title: "Part-to-Whole",
  description:
    "A sunburst chart showing world population by continent and country. The inner ring represents continents, the outer ring shows the top 10 largest countries per continent — together covering 6.4 billion people. Part-to-whole charts reveal how individual pieces contribute to a larger total: here, Asia alone accounts for over 60% of the dataset, driven by India and China each crossing 1.4 billion.",
  source: "UN World Population Prospects 2023",
  tags: ["D3", "Comparison", "Part-to-Whole", "Sunburst"],
  chart: <PopulationSunburst />,
},
/*
{
  id: 2,
  category: "Comparison",
  title: "Pictogram",
  description:
    "Each rectangle represents a European country, sized by total land area. Tree icons fill from the bottom up based on forest coverage — the more trees, the more forested the country. Finland leads at 66%, Malta barely registers at 1%. Ordered from most to least forested, left to right.",
  source: "Eurostat / FAO Global Forest Resources Assessment 2022",
  tags: ["D3", "Comparison", "Pictogram", "Treemap"],
  chart: <ForestPictogram />,
},
{
  id: 3,
  category: "Comparison",
  title: "Mosaic",
  description:
    "Tuning in — how long does the world watch TV, country by country? Rectangle size represents population, color represents continent, with darker shades for countries watching above their regional average. Where data is missing, we're left with static.",
  source: "Médiamétrie One Television Year 2024, Zenith Media",
  tags: ["D3", "Comparison", "Mosaic", "Treemap"],
  chart: <TvTreemap />,
},
{
  id: 4,
  category: "Comparison",
  title: "Slope",
  description:
    "A slope chart comparing monthly minimum wage against average cost of living across 27 European countries. Green lines show where the minimum wage covers living costs — red where it falls short. Use the dropdown to highlight your country.",
  source: "Eurostat 2025, Numbeo 2025",
  tags: ["D3", "Comparison", "Slope"],
  chart: <SlopeChart />,
},
{
  id: 5,
  category: "Comparison",
  title: "Experimental",
  description:
    "Monthly temperature anomalies for every decade since 1880, overlaid on the same axes. The dashed line is the average across all decades. Navigate through chapters to see how each era compares — from pre-industrial stability to the record-breaking 2020s. Inspired by Tamas Varga.",
  source: "NASA GISS Surface Temperature Analysis (GISTEMP v4), 2024",
  tags: ["D3", "Comparison", "Area"],
  chart: <ClimateAreaChart />,
},
{
  id: 6,
  category: "Comparison",
  title: "Data Day - Reporters Without Borders",
  description:
    "",
  source: "",
  tags: ["D3", "Comparison"],
  chart: "",
},
*/
];