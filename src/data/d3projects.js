import projectWebdev from "../assets/project-webdev.png";
import projectPokemon from "../assets/project-pokemon.png";
import projectD3Bar from "../assets/project-d3-bar.png";

export const d3projects = [
  {
    id: 1,
    title: "WebDev Foundation",
    description:
      "A hero section built with vanilla JavaScript. Covers core web fundamentals — HTML structure, CSS styling, and JS interactivity — before diving into frameworks.",
    tags: ["Vanilla JS", "HTML", "CSS"],
    github: "https://lillar.github.io/d3xreact_course/",
    image: projectWebdev,
  },
  {
    id: 2,
    title: "React Foundation",
    description:
      "A Pokémon card explorer app built with React. Covers components, props, state, and fetching data from an external API.",
    tags: ["React", "API", "Components"],
    github: "https://lillar.github.io/pokemon-card-collection/",
    image: projectPokemon,
  },
  {
    id: 3,
    title: "D3 Introduction",
    description:
      "A bar chart showing the number of students from each country enrolled in the D3 x React course. Built with D3 scales and pure React JSX rendering.",
    tags: ["D3", "Bar chart", "React"],
    github: "https://lillar.github.io/first-d3-bar/",
    image: projectD3Bar,
  },
];