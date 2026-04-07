// Sources:
// GDP growth %: World Bank, annual % change, EU aggregate
// GHG emissions change %: EEA (European Environment Agency), EU-27, year-on-year % change
// Note: negative GHG change = good (emissions falling)

export const euData = [
  { year: 1995, gdp:  2.8, ghg: -1.2 },
  { year: 1996, gdp:  1.7, ghg:  1.8 },
  { year: 1997, gdp:  2.7, ghg: -1.4 },
  { year: 1998, gdp:  3.0, ghg: -0.8 },
  { year: 1999, gdp:  3.0, ghg: -1.1 },
  { year: 2000, gdp:  3.8, ghg:  0.3 },
  { year: 2001, gdp:  2.1, ghg:  0.5 },
  { year: 2002, gdp:  1.3, ghg: -1.2 },
  { year: 2003, gdp:  1.3, ghg:  1.1 },
  { year: 2004, gdp:  2.6, ghg:  0.4 },
  { year: 2005, gdp:  2.2, ghg: -1.5 },
  { year: 2006, gdp:  3.4, ghg:  0.1 },
  { year: 2007, gdp:  3.2, ghg: -1.8 },
  { year: 2008, gdp:  0.4, ghg: -2.1 },
  { year: 2009, gdp: -4.3, ghg: -7.0 },
  { year: 2010, gdp:  2.1, ghg:  3.3 },
  { year: 2011, gdp:  1.8, ghg: -4.0 },
  { year: 2012, gdp: -0.7, ghg: -2.1 },
  { year: 2013, gdp:  0.3, ghg: -2.8 },
  { year: 2014, gdp:  1.8, ghg: -5.0 },
  { year: 2015, gdp:  2.3, ghg:  0.7 },
  { year: 2016, gdp:  2.0, ghg:  0.4 },
  { year: 2017, gdp:  2.7, ghg: -0.6 },
  { year: 2018, gdp:  2.2, ghg: -2.6 },
  { year: 2019, gdp:  1.8, ghg: -3.7 },
  { year: 2020, gdp: -5.6, ghg: -9.8 },
  { year: 2021, gdp:  5.9, ghg:  6.0 },
  { year: 2022, gdp:  3.5, ghg: -2.8 },
  { year: 2023, gdp:  0.4, ghg: -8.0 },
];

export const annotations = [
  { year: 2009, label: "Financial crisis" },
  { year: 2020, label: "COVID-19" },
  { year: 2021, label: "Rebound" },
];