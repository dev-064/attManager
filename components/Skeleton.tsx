export default function Skeleton({
  width = "100%",
  height = "1rem",
  borderRadius = "var(--radius)",
  style,
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        width,
        height,
        borderRadius,
        background: "linear-gradient(90deg, #EDE9FE 25%, #DDD6FE 50%, #EDE9FE 75%)",
        backgroundSize: "200% 100%",
        animation: "pulse 1.5s ease-in-out infinite",
        ...style,
      }}
    />
  );
}
