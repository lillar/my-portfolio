import { d3projects } from "../data/d3projects";

export default function D3Course() {
  return (
    <div className="page">

      <div className="page-header">
        <p className="page-eyebrow">Learning in public</p>
        <h1 className="page-title">D3 Course</h1>
        <p className="page-subtitle">
          Charts built while following the React Graph Gallery D3 course.
          Each project explores a different chart type, scale, or layout.
        </p>
      </div>

      <div className="project-list">
        {d3projects.map((project, i) => (
          <section key={project.id} className="project-section">
            <p className="project-index">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="project-title">{project.title}</h2>

            <div className="project-body">
              <div className="project-text">
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <a
                  href={project.github}
                  className="project-link"
                  target="_blank"
                  rel="noopener noreferrer">
                  View on GitHub &rarr;
                </a>
              </div>

              <div className="project-preview">
                <div className="chart-placeholder">chart goes here</div>
              </div>
            </div>
          </section>
        ))}
      </div>

    </div>
  );
}