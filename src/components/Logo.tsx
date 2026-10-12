/** Logo PenguHealth: siluet penguin di dalam perisai bundar (sesuai Design Brief). */
export function Logo({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Logo PenguHealth">
      <path d="M24 3 42 10v13c0 11-7.6 19.6-18 22C13.6 42.6 6 34 6 23V10L24 3Z" fill="#1E3A5F" />
      <ellipse cx="24" cy="27" rx="9.5" ry="12" fill="#FFFFFF" />
      <ellipse cx="24" cy="17" rx="7" ry="6.5" fill="#1E3A5F" />
      <circle cx="21.3" cy="16.4" r="1.4" fill="#FFFFFF" />
      <circle cx="26.7" cy="16.4" r="1.4" fill="#FFFFFF" />
      <path d="M22 19.6h4l-2 2.4-2-2.4Z" fill="#F2B705" />
      <path d="M15 25c-2 3-2.4 6-1.6 8.6M33 25c2 3 2.4 6 1.6 8.6" stroke="#7FB8E6" strokeWidth="2.4" strokeLinecap="round" fill="none" />
    </svg>
  );
}
