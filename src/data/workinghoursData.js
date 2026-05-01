// Average annual working hours per worker — Netherlands, 1870–2023
// Sources:
//   1870–1938: Huberman & Minns (2005/2007), combined with ILO historical data
//   1950–2023: Penn World Table v11.0 (indicator: avh), via Our World in Data
//   Cross-checked with TheGlobalEconomy.com (PWT-based, NL average 1971–2023)
// Note: small discontinuity at 1938/1950 due to WWII and source methodology change

export const data = [
  { year: 1870, hours: 3080 },
  { year: 1880, hours: 2980 },
  { year: 1890, hours: 2880 },
  { year: 1900, hours: 2812 },
  { year: 1910, hours: 2680 },
  { year: 1913, hours: 2640 },
  { year: 1920, hours: 2400 },
  { year: 1929, hours: 2400 },
  { year: 1938, hours: 2270 },
  { year: 1945, hours: 2300 },
  { year: 1950, hours: 2208 },
  { year: 1955, hours: 2120 },
  { year: 1960, hours: 2051 },
  { year: 1965, hours: 1960 },
  { year: 1970, hours: 1870 },
  { year: 1975, hours: 1760 },
  { year: 1980, hours: 1680 },
  { year: 1982, hours: 1640 },
  { year: 1985, hours: 1620 },
  { year: 1990, hours: 1580 },
  { year: 1995, hours: 1510 },
  { year: 2000, hours: 1467 },
  { year: 2005, hours: 1452 },
  { year: 2010, hours: 1460 },
  { year: 2015, hours: 1452 },
  { year: 2019, hours: 1448 },
  { year: 2020, hours: 1416 },
  { year: 2021, hours: 1440 },
  { year: 2022, hours: 1450 },
  { year: 2023, hours: 1449 },
];

// Key events annotated on the chart
// side: "top" or "bottom" — which side of the line to place the label
export const events = [
  {
    year: 1919,
    label: "Arbeidswet 1919",
    detail: "48-hour week\nenshrined in law",
    side: "top",
  },
  {
    year: 1930,
    label: "Great Depression",
    detail: "Work-sharing schemes\nreduce hours",
    side: "bottom",
  },
  {
    year: 1945,
    label: "WWII ends",
    detail: "Reconstruction drives\na brief uptick",
    side: "top",
  },
  {
    year: 1960,
    label: "Economic miracle",
    detail: "Post-war prosperity,\n5-day week spreads",
    side: "bottom",
  },
  {
    year: 1982,
    label: "Wassenaar Accord",
    detail: "Unions trade wages\nfor shorter hours",
    side: "top",
  },
  {
    year: 1996,
    label: "Arbeidstijdenwet",
    detail: "New Working Hours Act\nreplaces 1919 law",
    side: "bottom",
  },
  {
    year: 2020,
    label: "COVID-19",
    detail: "Lowest recorded:\n1,416 hrs",
    side: "top",
  },
];