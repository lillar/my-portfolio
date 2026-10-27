import { singleLayout, calendarLayout, yearLayout, chartLayout, emptyLayout } from "./layouts";
import { AnatomyOverlay, CalendarOverlay, RowsOverlay, ChartOverlay, Sw } from "./overlays";
import { SkylineOverlay } from "./Skyline";

const HERO = "2025-10-23";
const ALL = "L-photo L-rain L-sunrise L-strip";
const labelW = (A) => (A.w < 600 ? 150 : 260);
const single = (A) => singleLayout(A, HERO, labelW(A));
const firstWeeks = (A) => calendarLayout(A, [{ from: "2025-10-23", to: "2025-11-30" }]);
const anatomy = (level) => (meta, size) => <AnatomyOverlay meta={meta} size={size} level={level} date={HERO} />;
const rows = (props = {}) => (meta, size) => <RowsOverlay meta={meta} size={size} {...props} />;

// One entry per scroll step: what the stage shows, and the text beside it
export const steps = [
  {
    id: "first",
    cls: "L-photo anatomy",
    layout: single,
    overlay: anatomy(0),
    alt: "The first photo: a dark, wet view over rooftops at 07:30 on 23 October 2025.",
    text: (
      <>
        <p className="ftw-kicker">23 October 2025, 07:30</p>
        <p>This is the first photo. It's dark and wet, and the sun won't be up for another 51 minutes.</p>
        <p>That Thursday, Storm Benjamin crossed the Netherlands, with a code orange for North Holland. I didn't know it yet, but it would turn out to be the wettest day of my whole year.</p>
      </>
    ),
  },
  {
    id: "rain",
    cls: "L-photo L-rain anatomy",
    layout: single,
    overlay: anatomy(1),
    alt: "Three rain bars hang from the top of the photo; the first and last are full.",
    text: (
      <>
        <p className="ftw-kicker">Rain, in three bars</p>
        <p>Every day gets three <b className="c-rain">rain bars</b> hanging from the top of its photo: midnight to 08:00, 08:00 to 16:00, and 16:00 to midnight.</p>
        <p>Before this first photo, 22.3 mm fell between midnight and eight, most of it between 03:00 and 07:00 as Storm Benjamin arrived: the wettest eight hours of the whole year. Another 19.5 mm came that evening. The bars stop at 12 mm, and a white cut marks the ones that go off the scale.</p>
      </>
    ),
  },
  {
    id: "sunrise",
    cls: "L-photo L-rain L-sunrise anatomy",
    layout: single,
    overlay: anatomy(2),
    alt: "An orange sunrise line and a hollow dot for the photo time, above the line.",
    text: (
      <>
        <p className="ftw-kicker">Racing the sunrise</p>
        <p>The <b className="c-sunrise">orange line</b> is sunrise and the <b className="c-photo">golden dot</b> is the moment I took the photo. Higher means earlier, from 05:00 halfway down the frame to 09:00 at the bottom.</p>
        <p>A hollow dot means I beat the sun. That morning, sunrise was at 08:21, so my 07:30 photo was taken in the half-dark.</p>
      </>
    ),
  },
  {
    id: "sun",
    cls: `${ALL} anatomy`,
    layout: single,
    overlay: anatomy(3),
    alt: "A sunshine strip under the photo, mostly grey.",
    text: (
      <>
        <p className="ftw-kicker">How sunny was the day?</p>
        <p>The <b className="c-sun">strip</b> under the photo shows how much of the possible sunshine the day actually got, from grey (none) to yellow (all of it).</p>
        <p>My first day managed 1.2 hours, 12% of what was possible. That's one day: a photo, three rain bars, a sunrise, a dot and a strip.</p>
      </>
    ),
  },
  {
    id: "month",
    cls: ALL,
    layout: firstWeeks,
    overlay: (meta, size) => <CalendarOverlay meta={meta} size={size} />,
    alt: "A weekly calendar of the first weeks, 23 October to 30 November 2025, with gaps.",
    text: (
      <>
        <p className="ftw-kicker">One day becomes a month</p>
        <p>Here are my first weeks as a calendar, Monday to Sunday. Not every day has a photo, and there are two reasons for that.</p>
        <p className="ftw-legend"><Sw kind="photo" /> photo <Sw kind="nophoto" /> no photo <Sw kind="away" /> away</p>
      </>
    ),
  },
  {
    id: "weekends",
    cls: ALL,
    layout: firstWeeks,
    overlay: (meta, size) => <CalendarOverlay meta={meta} size={size} mode="weekend" />,
    alt: "The Saturday and Sunday columns are highlighted; they are almost all empty.",
    text: (
      <>
        <p className="ftw-kicker">Weekends: I slept in</p>
        <p>Look at the Saturday and Sunday columns. In these first weeks, I didn't take a single weekend photo.</p>
        <p>The photo became part of my weekday morning routine. At weekends there was no routine, so I mostly slept through 07:30.</p>
      </>
    ),
  },
  {
    id: "away",
    cls: ALL,
    layout: firstWeeks,
    overlay: (meta, size) => <CalendarOverlay meta={meta} size={size} mode="away" />,
    alt: "The hatched days from 30 October to 4 November are outlined.",
    text: (
      <>
        <p className="ftw-kicker">Hatched: I was away</p>
        <p>From 30 October to 4 November I was out of town, so nobody was at the window.</p>
        <p>The weather didn't take a break, though. Even the empty days still have their rain bars, sunrise and sunshine strip.</p>
      </>
    ),
  },
  {
    id: "year",
    cls: ALL,
    layout: (A) => yearLayout(A),
    overlay: rows(),
    alt: "The full year: thirteen month rows, one cell per day.",
    text: (
      <>
        <p className="ftw-kicker">A month becomes a year</p>
        <p>One row per month, one column per day of the month: 365 days, 215 with a photo.</p>
        <p>On days I was home, I photographed 85% of weekday mornings and only 16% of weekend ones. I was away for 51 days on nine trips, and on four of them I still took a photo before I left.</p>
      </>
    ),
  },
  {
    id: "dark",
    cls: "L-photo dim-photo L-sunrise",
    layout: (A) => yearLayout(A),
    overlay: rows(),
    alt: "Photos faded; the sunrise line and photo dots across the year. Winter rows show hollow dots above the line.",
    text: (
      <>
        <p className="ftw-kicker">89 mornings in the dark</p>
        <p>Fade the photos and the year turns into a race. From autumn to February the sun rose after I took my photo, so the dot sits above the orange line, hollow.</p>
        <p>89 photos were taken before sunrise. The latest sunrise was 08:52, in the last days of December. On 22 December, I was 87 minutes ahead of the sun.</p>
      </>
    ),
  },
  {
    id: "chart",
    cls: "chart-mode",
    layout: chartLayout,
    overlay: (meta, size) => <ChartOverlay meta={meta} size={size} />,
    stagger: true,
    alt: "Line chart: photo times as dots, between 07:20 and 08:25, against a sunrise curve from 08:52 in December to 05:17 in June.",
    text: (
      <>
        <p className="ftw-kicker">The same race, on one timeline</p>
        <p>Here every photo is a dot at its time of day, against the sunrise and civil dawn (the moment the sun is 6° below the horizon and it gets light enough to see outside without street lights).</p>
        <p>The jumps are the clock changes. On 26 October 2025 sunrise suddenly came an hour earlier. On 29 March 2026 it jumped an hour later, but by then I was ahead of it anyway: from 25 February to 1 October, every photo was taken in daylight.</p>
        <p>The earliest sunrise was 05:17, in mid-June.</p>
      </>
    ),
  },
  {
    id: "azimuth",
    cls: "",
    layout: emptyLayout,
    long: true,
    overlay: (meta, size) => <SkylineOverlay meta={meta} size={size} stepId="azimuth" />,
    alt: "The horizon seen from the window, with the photo placed where the camera points. For each photo morning it marks where the sun rose, its path, and where it was when the photo was taken.",
    text: (
      <>
        <p className="ftw-kicker">The sun walks along the horizon</p>
        <p>Sunrise doesn't only move in time, it moves along the skyline. The dashed frame is what my camera sees: about 52° of horizon, centred just north of east. I worked that out from the summer photos with the sun in shot.</p>
        <p>Scroll through my photo mornings. The ring is where the sun rose, the dotted line is its path until I took the photo, and the filled sun is where it was at that moment. In summer it rose out of view on the left and had climbed into the frame by the time I took the photo. In winter it was still below the rooftops, mostly off to the right.</p>
        <p>It rose at 47.8° around the June solstice and at 129.5° in December: a swing of 82° along the same skyline, there and back once a year.</p>
      </>
    ),
  },
  {
    id: "rain-year",
    cls: "L-photo dim-photo L-rain",
    layout: (A) => yearLayout(A),
    overlay: rows({ right: "rain", badges: [{ date: "2025-10-23", n: 1 }, { date: "2026-09-08", n: 2 }, { date: "2026-08-29", n: 3 }] }),
    alt: "The rain bars for the whole year, with the three wettest days marked.",
    text: (
      <>
        <p className="ftw-kicker">753 mm at my window</p>
        <p>That's over 342 days of radar, because KNMI hasn't released October 2026 yet. Rain fell on 169 of them.</p>
        <p>The biggest bars come at the start and the end: <span className="ftw-badge">1</span> Storm Benjamin on my very first night (22.3 mm before 08:00), <span className="ftw-badge">2</span> the evening of 8 September (19.7 mm) and <span className="ftw-badge">3</span> the night of 29 August (18.6 mm, 10.1 of it in the first hour after midnight).</p>
      </>
    ),
  },
  {
    id: "night",
    cls: "L-photo dim-photo L-rain night-only",
    layout: (A) => yearLayout(A),
    overlay: rows({ right: "rain" }),
    alt: "Only the night-time rain bars (midnight to 08:00) stay bright.",
    text: (
      <>
        <p className="ftw-kicker">What fell before the photo</p>
        <p>On 31% of my photo mornings, it had rained during the night (at least 0.1 mm between midnight and 08:00). In autumn that was 47%, in winter 38%, but in spring only 16%.</p>
        <p>The daytime block, 08:00 to 16:00, was the driest over the year, with 26% of the rain. The night got 37% and the evening 38%.</p>
      </>
    ),
  },
  {
    id: "dry",
    cls: "L-photo dim-photo L-rain",
    layout: (A) => yearLayout(A),
    focus: (d) => (d.d.startsWith("2026-04") || d.d.startsWith("2026-07") ? 1 : 0.35),
    overlay: rows({ right: "rain", highlight: ["2026-04", "2026-07"] }),
    alt: "April and July highlighted: almost no rain bars.",
    text: (
      <>
        <p className="ftw-kicker">The dry months</p>
        <p>April got 7.1 mm and July just 4.1 mm, with a 13-day dry spell up to 17 July.</p>
        <p>November, January and August each got close to 100 mm, and the last nine days of October 2025 alone brought 104 mm.</p>
      </>
    ),
  },
  {
    id: "sunshine",
    cls: "L-photo dim-photo L-strip",
    layout: (A) => yearLayout(A),
    overlay: rows({ right: "sun" }),
    alt: "The sunshine strips for the whole year: grey in winter, yellow from March to August.",
    text: (
      <>
        <p className="ftw-kicker">Grey winters, bright springs</p>
        <p>Schiphol logged 2,100 hours of sunshine over the year. I counted a day as grey with 10% or less of the possible sunshine, and as sunny with 60% or more.</p>
        <p>In winter, 40% of days were grey. In spring it was only 7%, and half of all spring days were sunny. March was the turning point: 207 hours of sunshine, against 82 in February.</p>
      </>
    ),
  },
  {
    id: "decjun",
    cls: ALL,
    layout: (A) => calendarLayout(A, [{ from: "2025-12-01", to: "2025-12-31" }, { from: "2026-06-01", to: "2026-06-30" }]),
    overlay: (meta, size) => <CalendarOverlay meta={meta} size={size} titles={["December 2025", "June 2026"]} />,
    alt: "December 2025 and June 2026 side by side as calendars.",
    text: (
      <>
        <p className="ftw-kicker">December and June</p>
        <p><b>December:</b> sunrise between 08:29 and 08:52, barely eight hours of daylight, and 62 hours of sunshine all month. Every one of my 20 December photos was taken before sunrise.</p>
        <p><b>June:</b> sunrise around 05:20, almost 17 hours of daylight and 255 hours of sunshine. I took my photos more than two hours after sunrise. June was also the wetter month, with 76 mm against December's 34.</p>
      </>
    ),
  },
  {
    id: "all",
    cls: ALL,
    layout: (A) => yearLayout(A),
    overlay: rows(),
    alt: "The full year again, with every layer.",
    text: (
      <>
        <p className="ftw-kicker">The whole year</p>
        <p>Put back together, that's the year from my window: rain hanging from the top, the race with the sunrise at the bottom, and the light of every morning in between.</p>
        <p>You can explore every day yourself further down. First, a word on where the numbers come from.</p>
      </>
    ),
  },
];

// Steps from here on are shown on the dark background
export const DARK_FROM = steps.findIndex((s) => s.id === "year");
