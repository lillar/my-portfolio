import { nodes, links } from "../data/energyData";

// ── Layout constants ───────────────────────────────────────
const width   = 480;
const height  = 480;
const margin  = { top: 16, right: 110, bottom: 16, left: 80 };
const innerW  = width  - margin.left - margin.right;
const innerH  = height - margin.top  - margin.bottom;

const NODE_W  = 12;   // node rectangle width
const GAP     = 4;    // gap between stacked nodes
const OPACITY = 0.45; // link opacity

// ── Total flow (sum of all link values) ────────────────────
const totalFlow = links.reduce((s, l) => s + l.value, 0);

// ── Source nodes (left) ───────────────────────────────────
const sourceIds  = ["gas","oil","coal","wind","solar","biomass","nuclear"];
const targetIds  = ["industry","transport","losses","households","export"];

// Compute node total values
const nodeValue = {};
nodes.forEach(n => { nodeValue[n.id] = 0; });
links.forEach(l => {
  nodeValue[l.source] += l.value;
  nodeValue[l.target] += l.value;
});

// Layout: stack nodes top-to-bottom, height proportional to value
function layoutNodes(ids, x) {
  const total = ids.reduce((s, id) => s + nodeValue[id], 0);
  const scale = (innerH - GAP * (ids.length - 1)) / total;
  let y = margin.top;
  return ids.map(id => {
    const h = nodeValue[id] * scale;
    const node = { id, x, y, h, cy: y + h / 2 };
    y += h + GAP;
    return node;
  });
}

const srcNodes = layoutNodes(sourceIds, margin.left);
const tgtNodes = layoutNodes(targetIds, margin.left + innerW - NODE_W);

// After layoutNodes, resolve label positions
function resolveLabels(nodeList, minSpacing = 18) {
  // Start with cy as desired position
  const positions = nodeList.map(n => ({ id: n.id, desired: n.cy, actual: n.cy }));
  
  // Push labels apart if too close — iterate a few times
  for (let iter = 0; iter < 10; iter++) {
    for (let i = 1; i < positions.length; i++) {
      const gap = positions[i].actual - positions[i - 1].actual;
      if (gap < minSpacing) {
        const push = (minSpacing - gap) / 2;
        positions[i - 1].actual -= push;
        positions[i].actual += push;
      }
    }
  }
  return positions;
}

const srcLabelY = resolveLabels(srcNodes);
const tgtLabelY = resolveLabels(tgtNodes);

// Build lookup
const nodeMap = {};
[...srcNodes, ...tgtNodes].forEach(n => { nodeMap[n.id] = n; });

// ── Link paths ─────────────────────────────────────────────
// Track current y offset within each source and target node
const srcOffset = {};
const tgtOffset = {};
srcNodes.forEach(n => { srcOffset[n.id] = 0; });
tgtNodes.forEach(n => { tgtOffset[n.id] = 0; });

// Scale link thickness
const total = links.reduce((s, l) => s + l.value, 0);
const srcTotal = {};
links.forEach(l => { srcTotal[l.source] = (srcTotal[l.source]||0) + l.value; });

const layoutLinks = links.map(l => {
  const src = nodeMap[l.source];
  const tgt = nodeMap[l.target];
  const srcH = src.h;
  const tgtH = tgt.h;
  const srcScale = srcH / nodeValue[l.source];
  const tgtScale = tgtH / nodeValue[l.target];
  const th = l.value * Math.min(srcScale, tgtScale);

  const y0 = src.y + srcOffset[l.source] + th / 2;
  const y1 = tgt.y + tgtOffset[l.target] + th / 2;

  srcOffset[l.source] += l.value * srcScale;
  tgtOffset[l.target] += l.value * tgtScale;

  const x0 = src.x + NODE_W;
  const x1 = tgt.x;
  const mx = (x0 + x1) / 2;

  return {
    ...l,
    path: `M ${x0} ${y0} C ${mx} ${y0} ${mx} ${y1} ${x1} ${y1}`,
    th,
    color: nodeMap[l.source] ? nodes.find(n => n.id === l.source)?.color : "#888",
  };
});

// ── Render ─────────────────────────────────────────────────
export default function SankeyChart() {
  return (
    <div style={{ width: "100%", fontFamily: "var(--mono)" }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%" height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: "block" }}
      >
        {/* ── Links ── */}
        {layoutLinks.map((l, i) => (
          <path
            key={i}
            d={l.path}
            fill="none"
            stroke={l.color}
            strokeWidth={Math.max(l.th, 1)}
            strokeOpacity={OPACITY}
          />
        ))}

        {/* ── Source nodes ── */}
        {srcNodes.map(n => {
          const nd = nodes.find(x => x.id === n.id);
            const label = srcLabelY.find(p => p.id === n.id);  // ← must exist
            const labelY = label?.actual ?? n.cy;               // ← safe fallback
            return (
                <g key={n.id}>
                <rect x={n.x} y={n.y} width={NODE_W} height={n.h}
                    fill={nd.color} fillOpacity={0.9} rx={2} />
                {Math.abs(labelY - n.cy) > 4 && (
                    <line x1={n.x - 4} y1={n.cy} x2={n.x - 4} y2={labelY}
                    stroke="var(--border)" strokeWidth={0.5} />
                )}
                <text x={n.x - 6} y={labelY}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={9} fontFamily="var(--mono)"
                    fontWeight={600} fill={nd.color}>
                    {nd.label}
                </text>
                <text x={n.x - 6} y={labelY + 10}
                    textAnchor="end" dominantBaseline="middle"
                    fontSize={7} fontFamily="var(--mono)"
                    fill="var(--text-muted)">
                    {nodeValue[n.id]} PJ
                </text>
                </g>
            );
            })}

        {/* ── Target nodes ── */}
        {tgtNodes.map(n => {
          const nd = nodes.find(x => x.id === n.id);
          const label = tgtLabelY.find(p => p.id === n.id);  // ← must exist
          const labelY = label?.actual ?? n.cy;               // ← safe fallback
          return (
            <g key={n.id}>
              <rect
                x={n.x} y={n.y}
                width={NODE_W} height={n.h}
                fill={nd.color} fillOpacity={0.9}
                rx={2}
              />
              {/* Label right of node */}
              <text
                x={n.x + NODE_W + 6} y={labelY}
                textAnchor="start" dominantBaseline="middle"
                fontSize={9} fontFamily="var(--mono)"
                fontWeight={600} fill={nd.color}>
                {nd.label}
              </text>
              {/* PJ value */}
              <text
                x={n.x + NODE_W + 6} y={labelY + 10}
                textAnchor="start" dominantBaseline="middle"
                fontSize={7} fontFamily="var(--mono)"
                fill="var(--text-muted)">
                {nodeValue[n.id]} PJ
              </text>
            </g>
          );
        })}

        {/* ── Column labels ── */}
        <text
          x={margin.left + NODE_W / 2} y={margin.top - 6}
          textAnchor="middle" fontSize={8}
          fontFamily="var(--mono)" fontWeight={600}
          fill="var(--text-muted)">
          Sources
        </text>
        <text
          x={margin.left + innerW - NODE_W / 2} y={margin.top - 6}
          textAnchor="middle" fontSize={8}
          fontFamily="var(--mono)" fontWeight={600}
          fill="var(--text-muted)">
          Uses
        </text>

      </svg>
    </div>
  );
}