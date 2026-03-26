import { Link } from "react-router-dom";
import { blogposts } from "../data/blogposts";

export default function Blog() {
  const sorted = [...blogposts].reverse();

  return (
    <div className="page">

      <div className="page-header">
        <p className="page-eyebrow">2020 — {new Date().getFullYear()}</p>
        <h1 className="page-title">Blog Archive</h1>
        <p className="page-subtitle">
          Writing about data visualization, analytics, and the occasional
          detour into houseplants and clinical trials.
        </p>
      </div>

      <div className="blog-grid">
        {sorted.map((post) => (
          <Link
            key={post.id}
            to={`/blog/${post.slug}`}
            className="blog-card"
          >
            <div className="blog-card-meta">
              <span className="blog-card-category">{post.category}</span>
              <span className="blog-card-date">{post.date}</span>
            </div>
            <h2 className="blog-card-title">{post.title}</h2>
            <p className="blog-card-subtitle">{post.subtitle}</p>
            <span className="blog-card-link">Read post &rarr;</span>
          </Link>
        ))}
      </div>

    </div>
  );
}