/** Logo tinh linh lửa: ngọn lửa có lõi sáng và đôi mắt than, một nét tối giản. */
export function Logo({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Tinh linh lửa FireGuard">
      <path
        d="M16 2c1 5-6 8-6 14a6 6 0 0 0 12 0c0-3-2-5-2-8 3 2 6 5 6 10a10 10 0 0 1-20 0C6 10 13 7 16 2z"
        fill="var(--flame)"
      />
      <path
        d="M16 11c.7 3-3 4.4-3 7.6a3 3 0 0 0 6 0c0-2.7-2.3-4-3-7.6z"
        fill="var(--ember)"
      />
      <circle cx="14.6" cy="19.4" r="0.9" fill="var(--coal)" />
      <circle cx="17.4" cy="19.4" r="0.9" fill="var(--coal)" />
    </svg>
  );
}
