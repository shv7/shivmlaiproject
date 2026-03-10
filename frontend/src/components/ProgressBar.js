/**
 * ProgressBar — reusable animated progress bar
 * Props: pct (0-100), color, label, showPct, height
 */
export default function ProgressBar({
  pct = 0, color = "#00d4ff", label = "", showPct = true, height = 8,
  background = "#1e2d47",
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div style={{ width: "100%" }}>
      {(label || showPct) && (
        <div style={{
          display: "flex", justifyContent: "space-between",
          marginBottom: 4, fontSize: 12, fontWeight: 600,
        }}>
          {label && <span style={{ color: "#e2e8f0" }}>{label}</span>}
          {showPct && <span style={{ color: color, fontFamily: "monospace" }}>{clamped}%</span>}
        </div>
      )}
      <div style={{
        background, borderRadius: 99, height,
        overflow: "hidden", position: "relative",
      }}>
        <div style={{
          height: "100%", borderRadius: 99,
          width: `${clamped}%`,
          background: clamped === 100
            ? `linear-gradient(90deg,${color},#10b981)`
            : `linear-gradient(90deg,${color}88,${color})`,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          boxShadow: clamped > 0 ? `0 0 8px ${color}66` : "none",
        }} />
      </div>
    </div>
  );
}
