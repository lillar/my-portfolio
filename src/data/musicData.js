// US Recorded Music Revenue by Format — market share (%)
// Source: RIAA via AEI Animated Chart series, 1973–2023
// Formats: vinyl, eightTrack, cassette, cd, digital, streaming
// Values sum to ~100% per year

export const formats = [
  { id: "vinyl",      label: "Vinyl",           color: "#5800FF" }, // purple
  { id: "cassette",   label: "Cassette",        color: "#15bc9d" }, // teal
    { id: "cd",         label: "CD",              color: "#ffc600" }, // ochre
  { id: "eightTrack", label: "8-Track",         color: "#b904ca" }, // magenta
  { id: "digital",    label: "Digital download",color: "#f97316" }, // orange
  { id: "streaming",  label: "Streaming",       color: "#dc2626" }, // red
];

// [year, vinyl, eightTrack, cassette, cd, digital, streaming]
export const rawData = [
  [1973, 73, 25,  2,  0,  0,  0],
  [1974, 72, 25,  3,  0,  0,  0],
  [1975, 71, 25,  4,  0,  0,  0],
  [1976, 69, 25,  6,  0,  0,  0],
  [1977, 65, 25, 10,  0,  0,  0],
  [1978, 60, 24, 16,  0,  0,  0],
  [1979, 57, 22, 21,  0,  0,  0],
  [1980, 55, 17, 28,  0,  0,  0],
  [1981, 50, 12, 38,  0,  0,  0],
  [1982, 46,  5, 49,  0,  0,  0],
  [1983, 44,  1, 54,  1,  0,  0],
  [1984, 37,  0, 62,  1,  0,  0],
  [1985, 33,  0, 62,  5,  0,  0],
  [1986, 29,  0, 60, 11,  0,  0],
  [1987, 24,  0, 57, 19,  0,  0],
  [1988, 19,  0, 55, 26,  0,  0],
  [1989, 12,  0, 57, 31,  0,  0],
  [1990,  8,  0, 54, 38,  0,  0],
  [1991,  5,  0, 49, 46,  0,  0],
  [1992,  4,  0, 43, 53,  0,  0],
  [1993,  3,  0, 38, 59,  0,  0],
  [1994,  3,  0, 32, 65,  0,  0],
  [1995,  3,  0, 25, 72,  0,  0],
  [1996,  3,  0, 19, 78,  0,  0],
  [1997,  2,  0, 18, 80,  0,  0],
  [1998,  2,  0, 15, 83,  0,  0],
  [1999,  2,  0, 12, 86,  0,  0],
  [2000,  2,  0,  9, 89,  0,  0],
  [2001,  2,  0,  7, 91,  0,  0],
  [2002,  2,  0,  3, 95,  0,  0],
  [2003,  2,  0,  2, 94,  2,  0],
  [2004,  1,  0,  1, 92,  6,  0],
  [2005,  1,  0,  1, 87, 11,  1],
  [2006,  1,  0,  1, 82, 15,  1],
  [2007,  1,  0,  1, 76, 21,  1],
  [2008,  1,  0,  1, 68, 27,  3],
  [2009,  1,  0,  1, 60, 33,  5],
  [2010,  1,  0,  1, 53, 37,  8],
  [2011,  1,  0,  0, 46, 40, 13],
  [2012,  1,  0,  0, 38, 41, 20],
  [2013,  1,  0,  0, 30, 37, 32],
  [2014,  2,  0,  0, 22, 30, 46],
  [2015,  3,  0,  0, 17, 24, 56],
  [2016,  3,  0,  0, 12, 18, 67],
  [2017,  4,  0,  0, 10, 13, 73],
  [2018,  4,  0,  0,  8, 10, 78],
  [2019,  5,  0,  0,  6,  8, 81],
  [2020,  5,  0,  0,  4,  7, 84],
  [2021,  7,  0,  0,  4,  4, 85],
  [2022,  7,  0,  0,  3,  4, 86],
  [2023,  7,  0,  0,  3,  3, 87],
];

// Structured as array of objects, shares normalised to sum 100
export const data = rawData.map(([year, vinyl, eightTrack, cassette, cd, digital, streaming]) => {
  const total = vinyl + eightTrack + cassette + cd + digital + streaming;
  return {
    year,
    vinyl:      (vinyl      / total) * 100,
    eightTrack: (eightTrack / total) * 100,
    cassette:   (cassette   / total) * 100,
    cd:         (cd         / total) * 100,
    digital:    (digital    / total) * 100,
    streaming:  (streaming  / total) * 100,
  };
});