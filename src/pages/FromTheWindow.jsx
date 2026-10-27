import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { blogposts } from "../data/blogposts";
import Stage from "../components/fromTheWindow/Stage";
import Timelapse from "../components/fromTheWindow/Timelapse";
import CrossCheck from "../components/fromTheWindow/CrossCheck";
import Explore from "../components/fromTheWindow/Explore";
import Verdicts from "../components/fromTheWindow/Verdicts";
import { steps, DARK_FROM } from "../components/fromTheWindow/steps";
import "../components/fromTheWindow/fromTheWindow.css";

const post = blogposts.find((p) => p.slug === "from-the-window");

function Scrolly() {
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(false);
  const refs = useRef([]);
  const sectionRef = useRef(null);

  useEffect(() => {
    // The step whose card crosses the trigger line drives the stage
    const narrow = window.innerWidth < 720;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number(e.target.dataset.i)); }),
      { rootMargin: narrow ? "-70% 0px -29% 0px" : "-50% 0px -49% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    // Is the scrolly still under the middle of the screen? Past it, the prose takes over
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "-50% 0px -50% 0px" });
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  // From "A month becomes a year" until the prose, the whole page goes dark
  const dark = inView && active >= DARK_FROM;
  useEffect(() => {
    document.documentElement.classList.toggle("ftw-dark", dark);
  }, [dark]);
  useEffect(() => () => document.documentElement.classList.remove("ftw-dark"), []);

  const step = steps[active];
  return (
    <section className="ftw-scrolly ftw-wide" ref={sectionRef}>
      <div className="ftw-sticky">
        <Stage step={step} label={step.alt} style={{ height: "100%" }} />
      </div>
      <div className="ftw-steps">
        {steps.map((s, i) => (
          <div key={s.id} className={`ftw-step${s.long ? " ftw-step-long" : ""}${i === active ? " is-active" : ""}`} data-i={i} data-id={s.id} ref={(el) => (refs.current[i] = el)}>
            <div className="ftw-card">{s.text}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function FromTheWindow() {
  const pageRef = useRef(null);

  useEffect(() => {
    const nav = document.querySelector("nav");
    const set = () => nav && pageRef.current?.style.setProperty("--nav-h", `${nav.offsetHeight}px`);
    set();
    window.addEventListener("resize", set);
    return () => window.removeEventListener("resize", set);
  }, []);

  return (
    <div className="page ftw-page" ref={pageRef}>
      <div className="post-header">
        <Link to="/blog" className="post-back">&larr; Back to blog</Link>
        <div className="post-meta">
          <span className="blog-card-category">{post.category}</span>
          <span className="blog-card-date">{post.date}</span>
        </div>
        <h1 className="post-title">{post.title}</h1>
        <p className="post-subtitle">{post.subtitle}</p>
      </div>

      <div className="post-body">
        <p className="ftw-lede">
          In 2025 we started a morning routine, and we've stuck to it ever since. Part of it is yoga, and before
          we start I often look out of the window to see the sunrise. It's a window in North
          Holland, looking east over back gardens and rooftops, with a television tower on the horizon.
        </p>
        <p>
          On 23 October 2025 the sky was so intense that I grabbed my phone and took a picture. Then I decided to
          keep going: a photo of the same view every morning for a year, at around half past seven. I was curious
          whether I could prove or disprove what everyone "knows" about the Dutch weather. Does it really rain all the
          time? Are the summers a washout? Are the winter mornings as dark and grey as they feel?
        </p>
        <p>
          Then I did what a BI developer does with 215 photos: I joined them to data. Rain from the KNMI weather
          radar, sunshine from the nearest weather station, and the sunrise calculated for every single day. Scroll
          down to see the year being built up, one morning at a time, and which of those assumptions survived.
        </p>
      </div>

      <Scrolly />

      <div className="post-body">
        <h2>Where the numbers come from</h2>
        <p>Three kinds of data, and three different ways of getting them.</p>
        <p>
          <b>Rain: the radar, not a rain gauge.</b> The Schiphol weather station is about 20 km away, and showers
          here can be very local. So I used KNMI's gauge-adjusted radar product
          (<code>RAD_NL21_RAC_MFBS_01H</code>): one file per hour for the whole country, on a grid of 2.5 km cells.
          From each hourly file I read the value of the one cell that covers my window, converted the hours from UTC
          to Dutch time, and added them up into the three eight-hour blocks. That's around 8,200 hours of radar for
          the year.
        </p>
        <p>
          Is one radar cell any good? For September 2026 I could compare it with KNMI's validated monthly totals from
          the stations around me. The radar came out within a few millimetres of them:
        </p>
        <CrossCheck />
        <p>
          <b>Sunshine: a station 20 km away.</b> Sunshine, cloud cover and temperature come from KNMI's daily data
          for Schiphol (station 240). There's no radar for sunshine, and whether a day is sunny or grey is a fairly
          regional thing, so the station is a fair stand-in. KNMI calculates the sunshine duration from global
          radiation, and the most recent days can still change slightly after validation.
        </p>
        <p>
          <b>Sunrise: calculated, not downloaded.</b> I didn't need a dataset for this. Sunrise, dawn and the
          direction of the sun follow from the date and the location, so I calculated them with the NOAA solar
          algorithm (the Python <code>astral</code> library). That's accurate to about a minute, but it assumes a
          flat horizon. The rooftops make the real sunrise a little later.
        </p>

        <h2>The bumps along the way</h2>
        <p>
          I didn't do this on my own. I built most of it together with Claude, Anthropic's AI assistant, in Claude
          Code: it helped me find the right datasets, wrote and ran the processing scripts, aligned the photos and
          built this page with me. What it didn't do is supply the data. Every number here comes from the actual
          sources: KNMI's own files, my photos and the standard sunrise calculation. Nothing comes from the AI's
          own knowledge, and the totals were spot-checked against the raw KNMI downloads.
        </p>
        <p>
          <b>Finding the right dataset.</b> KNMI publishes a lot of data, and several datasets have very similar
          names. It took a while to narrow it down to the one I wanted: hourly, gauge-adjusted and on a grid, rather
          than the raw five-minute radar images or the daily station tables.
        </p>
        <p>
          <b>Two ways to download.</b> The station data came from the old <i>daggegevens</i> script interface, which
          is pleasantly simple: one request with the station, the variables and the dates. But KNMI is switching it
          off at the end of 2026, so for future updates we've already set up a downloader for the KNMI Open Data
          API, which needs an API key.
        </p>
        <p>
          <b>Data that doesn't exist yet.</b> The radar product is published with a delay. When the year ended on
          22 October, it only went up to 30 September. So October 2026 has no rain bars, which isn't the same as
          bars of zero: no data is not the same as no rain.
        </p>
        <p>
          <b>A wobbly camera.</b> I took the photos with my phone, by hand, so the framing drifts from day to day: up
          to about 4° of rotation and 40 pixels of shift. Put the photos side by side and the skyline jumps around.
        </p>
        <p>
          To fix that, Claude and I aligned every photo to one reference morning, 15 June 2026. The script looks for matching
          features on the rooftops and the tower (the sky and the window sill are masked out, because clouds move
          and the sill is too close), fits a rotation, a shift and a small change of scale, and warps the photo to
          match. The dark winter photos had to be brightened first so the matching had something to work with, and
          some were aligned via a neighbouring day that was already done. Every result was checked by eye, on the
          tower.
        </p>
        <p>
          <b>Where the camera points.</b> To put the photo on the horizon in the sun-walk step, Claude worked out
          which way my camera looks from the photos with the sun in them: where the sun really was at that moment,
          compared with where it shows up in the picture. Across 33 photos the two agree to within about 2.5 pixels.
        </p>
        <p>
          Scroll to play the whole year, as shot and aligned. The dashed line marks the tower:
        </p>
      </div>

      <Timelapse />

      <div className="post-body">
        <h2>Explore the year</h2>
        <p>
          Here's the full visual. Every cell is a morning: the photo, the rain in three blocks hanging from the top,
          the sunrise line with my photo time as a dot, and the sunshine strip underneath. Hover a day for the
          details, or click it to open the photo.
        </p>
      </div>

      <div className="ftw-wide">
        <Explore />
      </div>

      <div className="post-body">
        <h2>So, true or false?</h2>
        <p>
          I started with a few things everyone "knows" about the Dutch weather. Here's how they held up after a year
          at the window.
        </p>
        <Verdicts />
        <p>
          The Dutch weather turned out less wet than its reputation. The rain isn't constant, and it mostly fell at
          night and in the evening rather than during the day. What the reputation gets right is the darkness: from
          November until late February, the sun simply got up later than I did.
        </p>
        <p className="ftw-note">
          Seasons are meteorological (winter is December to February). Autumn mixes late October and November 2025
          with September 2026, because the year started and ended in October and the October 2026 radar data isn't
          released yet.
        </p>

        <h2>Looking back</h2>
        <p>
          I started this as a small morning habit with a data project attached. What I didn't expect was how much the
          photos would change the way I read the numbers. 22 mm of rain is a figure in a table; the first morning,
          dark and dripping, is something I remember. It works the other way round as well. I knew Dutch winter
          mornings are dark, but 89 hollow dots in a row make it concrete.
        </p>
        <p>
          Working with Claude changed how the project went. It did the heavy lifting on the code: the scripts, the
          alignment, this scrollytelling page. That left me the parts I cared about most: the photos, the questions,
          and deciding what the story should be. One rule stayed fixed throughout: the numbers had to be real.
          Every figure in this post is calculated from the KNMI files and my own photos, not from an AI's memory of
          what Dutch weather is usually like.
        </p>
        <p>
          There's also something honest about a dataset you make yourself. The gaps are mine: the weekends I slept
          in and the trips. They're part of the year, so they stay in the chart.
        </p>
        <p>
          The next year has already started outside the same window. Whether or not I keep taking the photo every
          morning, I don't think I'll look at that view the same way again.
        </p>

        <div className="ftw-credits">
          <p>
            <b>Data & credits.</b> Photos: Lilla Rasztik. Precipitation: KNMI radar
            (<a href="https://dataplatform.knmi.nl/dataset/preview/rad-nl21-rac-mfbs-01h-2-0" target="_blank" rel="noopener noreferrer">RAD_NL21_RAC_MFBS_01H v2.0</a>),
            window grid cell, 8-hour totals. Sunshine & cloud: KNMI daily station data, Schiphol (240), via the
            {" "}<a href="https://www.knmi.nl/kennis-en-datacentrum/achtergrond/data-ophalen-vanuit-een-script" target="_blank" rel="noopener noreferrer">daggegevens script interface</a>.
            Sunrise: calculated (NOAA algorithm) for the window location.
          </p>
          <p>
            Storm Benjamin, 23 October 2025:{" "}
            <a href="https://www.dutchnews.nl/2025/10/storm-benjamin-batters-the-netherlands/" target="_blank" rel="noopener noreferrer">DutchNews.nl</a>.
          </p>
          <p>
            Cross-check: KNMI validated monthly station observations, September 2026. Station series can be
            inhomogeneous and are meant for describing the weather, not for trend analysis.
          </p>
        </div>
      </div>
    </div>
  );
}
