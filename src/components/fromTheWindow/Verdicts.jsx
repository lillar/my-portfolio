// What everyone "knows" about Dutch weather, checked against the year at the window.
// Numbers come from derived/from_the_window_daily.csv (radar rain: 23 Oct 2025 – 29 Sep 2026;
// sunshine and temperature: Schiphol, the full year).
const VERDICTS = [
  {
    claim: "It rains all the time",
    verdict: "Half true",
    kind: "half",
    text: "It rained on 169 of 342 days, so roughly every other day. But only 36% of the days got a millimetre or more.",
  },
  {
    claim: "Dutch summers are a washout",
    verdict: "Mostly false",
    kind: "false",
    text: "Summer got as much rain as winter (177 vs 178 mm), but on fewer days, in short heavy bursts. July was the driest month of the year with 4.1 mm, and summer had 787 hours of sunshine and nine days of 30 °C or more.",
  },
  {
    claim: "Winter mornings are dark and grey",
    verdict: "True",
    kind: "true",
    text: "40% of winter days were grey, against 7% in spring. Every one of my 20 December photos was taken before sunrise.",
  },
  {
    claim: "It always rains at the weekend",
    verdict: "False",
    kind: "false",
    text: "Weekend days were wet just as often as weekdays: 50% against 49%.",
  },
  {
    claim: "Four seasons in one day",
    verdict: "Sometimes",
    kind: "half",
    text: "On 19 days it rained at least a millimetre and the sun still shone for half of the possible time or more.",
  },
  {
    claim: "Autumn is the wettest season",
    verdict: "True",
    kind: "true",
    text: "294 mm, with rain on more than two out of three days, starting with Storm Benjamin.",
  },
];

export default function Verdicts() {
  return (
    <ul className="ftw-verdicts">
      {VERDICTS.map((v) => (
        <li key={v.claim}>
          <span className={`ftw-verdict ftw-verdict-${v.kind}`}>{v.verdict}</span>
          <div>
            <p className="ftw-claim">"{v.claim}"</p>
            <p>{v.text}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
