import { chartchallengeprojects } from "../data/chartchallengeprojects.jsx";

const toSlug = (title) =>
  title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

export default function ChartChallenge() {
  return (
    <div className="page">

      <div className="page-header">
        <p className="page-eyebrow">April 2026</p>
        <h1 className="page-title">#30DayChartChallenge</h1>
        <p className="page-subtitle">
          One chart per day for 30 days working with Claude. Each entry follows a daily prompt
          from the{" "}
          <a href="https://github.com/30DayChartChallenge/Edition2026" target="_blank" rel="noopener noreferrer">
            30 Day Chart Challenge Edition 2026
          </a>{" "}
        </p>
      </div>

      <div className="project-list">
        {chartchallengeprojects.map((project, i) => (
          <section key={project.id} id={toSlug(project.title)} className="project-section">
            <div className="project-body">
              <div className="project-text">
                <p className="project-index">
                  {String(i + 1).padStart(2, "0")} | {project.category.toUpperCase()} | {project.topic.toUpperCase()}
                </p>
                <h2
                  className="project-title"
                  onClick={() => {
                    const el = document.getElementById(toSlug(project.title));
                    el?.scrollIntoView({ behavior: "smooth" });
                    window.history.pushState(null, "", `#${toSlug(project.title)}`);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {project.title}
                </h2>
                <p className="project-description">{project.description}</p>
                <p className="project-source">Source: {project.source}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="chart-challenge-preview">
                {project.chart}
              </div>
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}