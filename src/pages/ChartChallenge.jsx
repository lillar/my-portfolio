import { chartchallengeprojects } from "../data/chartchallengeprojects.jsx";

export default function ChartChallenge() {
  return (
    <div className="page">

      <div className="page-header">
        <p className="page-eyebrow">April 2026</p>
        <h1 className="page-title">#30DayChartChallenge</h1>
        <p className="page-subtitle">
          One chart per day for 30 days. Each entry follows a daily prompt
          from the{" "}
          <a href="https://github.com/30DayChartChallenge/Edition2026" target="_blank" rel="noopener noreferrer">
            30 Day Chart Challenge Edition 2026
          </a>{" "}
        </p>
      </div>

      <div className="project-list">
        {chartchallengeprojects.map((project, i) => (
          <section key={project.id} className="project-section">
            <div className="project-body">
              <div className="project-text">
                <p className="project-index">{String(i + 1).padStart(2, "0")} | {project.category.toUpperCase()}</p>
                <h2 className="project-title">{project.title}</h2>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
              </div>

              <div className="project-preview">
                {project.chart}
              </div>
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}