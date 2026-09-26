import type { FlowEdge, FlowNode, Project } from "@/data/projects";

const W = 190;
const H = 66;

// Connects two nodes with an S-curve from the nearest sides. Returns the
// path plus its midpoint (for the label).
function connect(a: FlowNode, b: FlowNode) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    const s = Math.sign(dx) || 1;
    const x1 = a.x + (s * W) / 2;
    const x2 = b.x - (s * W) / 2;
    const mx = (x1 + x2) / 2;
    return { d: `M ${x1} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${x2} ${b.y}`, mid: [mx, (a.y + b.y) / 2] };
  }
  const s = Math.sign(dy) || 1;
  const y1 = a.y + (s * H) / 2;
  const y2 = b.y - (s * H) / 2;
  const my = (y1 + y2) / 2;
  return { d: `M ${a.x} ${y1} C ${a.x} ${my}, ${b.x} ${my}, ${b.x} ${y2}`, mid: [(a.x + b.x) / 2, my] };
}

// Architecture diagram with data flowing along every connection. Pure SVG:
// dashes march with CSS and the dots ride the paths with SMIL, so it needs
// no JavaScript at all.
export function FlowDiagram({ project }: { project: Project }) {
  const flow = project.flow;
  if (!flow) return null;
  const byId = Object.fromEntries(flow.nodes.map((n) => [n.id, n]));

  return (
    <figure>
      <div className="-mx-5 overflow-x-auto px-5 pb-2 md:mx-0 md:overflow-visible md:px-0">
        <svg
          viewBox={`0 0 ${flow.width} ${flow.height}`}
          className="h-auto w-full min-w-[760px]"
          role="img"
          aria-label={`${project.name} architecture: ${flow.nodes.map((n) => n.label).join(", ")}`}
        >
          {flow.edges.map((edge: FlowEdge, i) => {
            const { d, mid } = connect(byId[edge.from], byId[edge.to]);
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
                <path
                  d={d}
                  fill="none"
                  stroke={project.color}
                  strokeOpacity={edge.dashed ? 0.55 : 0.8}
                  strokeWidth="2"
                  strokeDasharray={edge.dashed ? "3 9" : "10 14"}
                  className="animate-[flow-dash_1.6s_linear_infinite]"
                />
                <circle r="4.5" fill={project.color}>
                  <animateMotion dur={`${2.2 + (i % 3) * 0.5}s`} repeatCount="indefinite" path={d} begin={`${(i * 0.37) % 2}s`} />
                </circle>
                {edge.label && (
                  <text
                    x={mid[0]}
                    y={mid[1] - 10}
                    textAnchor="middle"
                    className="fill-paper/60 font-mono text-[13px]"
                    style={{ paintOrder: "stroke", stroke: "#0b0b0d", strokeWidth: 6 }}
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {flow.nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x - W / 2} ${n.y - H / 2})`}>
              <rect
                width={W}
                height={H}
                rx="18"
                fill={n.accent ? `${project.color}22` : "#141419"}
                stroke={n.accent ? project.color : "rgba(255,255,255,0.14)"}
                strokeWidth="1.5"
              />
              <text x={W / 2} y={29} textAnchor="middle" className="fill-paper text-[17px] font-bold">
                {n.label}
              </text>
              {n.sub && (
                <text x={W / 2} y={49} textAnchor="middle" className="fill-mute text-[12.5px]">
                  {n.sub}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
      <figcaption className="mt-5 max-w-2xl text-paper/60">{flow.caption}</figcaption>
      <p className="label mt-3 text-mute md:hidden">Swipe to see the whole diagram →</p>
    </figure>
  );
}
