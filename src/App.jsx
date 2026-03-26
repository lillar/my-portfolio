import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import D3Course from "./pages/D3Course";
import ChartChallenge from "./pages/ChartChallenge";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";

function App() {
  return (
    <BrowserRouter basename="/my-portfolio/">
      <nav>
        <span className="site-logo">lilla.r</span>
        <div className="site-nav">
          <NavLink to="/d3-course" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            D3 Course
          </NavLink>
          <NavLink to="/30daychartchallenge" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            #30DayChartChallenge
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
            Blog
          </NavLink>
        </div>
      </nav>

      <main>
        <Routes>
          <Route path="/d3-course" element={<D3Course />} />
          <Route path="/30daychartchallenge" element={<ChartChallenge />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<D3Course />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;