import { useParams, Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { blogposts } from "../data/blogposts";

export default function BlogPost() {
  const { slug } = useParams();
  const [content, setContent] = useState("");
  const [showTop, setShowTop] = useState(false);

  const post = blogposts.find((p) => p.slug === slug);

  useEffect(() => {
    import(`../posts/${slug}.md?raw`)
      .then((module) => {
        // Strip Hexo frontmatter (everything between --- and ---)
        const raw = module.default;
        const stripped = raw
          .replace(/^---[\s\S]*?---/, "")
          .replace(/<!-- more -->/g, "")
          .replace(/^\s*\*\*\*.*?\*\*\*\s*/m, "")
          .trim();
        setContent(stripped);
      })
      .catch(() => setContent("Post not found."));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!post) {
    return (
      <div className="page">
        <div className="page-header">
          <p className="page-eyebrow">404</p>
          <h1 className="page-title">Post not found</h1>
          <Link to="/blog" className="post-back">&larr; Back to blog</Link>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const vizDivs = document.querySelectorAll("[id^='viz']");
    vizDivs.forEach((div) => {
      const existing = document.querySelector("script[src*='viz_v1']");
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://public.tableau.com/javascripts/api/viz_v1.js";
        document.body.appendChild(script);
      }
      const inlineScripts = div.parentElement?.querySelectorAll("script:not([src])");
      inlineScripts?.forEach((s) => {
        try { eval(s.textContent); } catch(e) {}
      });
    });
  }, [content]); 

  return (
    <div className="page">
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            img({ src, alt }) {
              return (
                <img
                  src={`${import.meta.env.BASE_URL}blog-images/${slug}/${src}`}
                  alt={alt}
                  style={{ maxWidth: "100%", borderRadius: "6px", margin: "24px 0" }}
                />
              );
            },

          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {showTop && (
        <button
          className="scroll-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          ↑
        </button>
      )}
    </div>
  );
}