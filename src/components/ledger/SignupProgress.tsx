/** A rule with four ticks, one per line of the form. It reports what the form knows and never blocks submit. */
const SignupProgress = ({ lines }: { lines: boolean[] }) => {
  const written = lines.filter(Boolean).length;

  return (
    <div className="max-w-md">
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={lines.length}
        aria-valuenow={written}
        aria-labelledby="signup-progress-label"
        className="flex"
      >
        {lines.map((done, i) => (
          <span key={i} data-done={done} className="signup-line" />
        ))}
      </div>
      <p id="signup-progress-label" className="t-meta tnum mt-2 text-ink-2">
        {written} of {lines.length} lines written
      </p>
    </div>
  );
};

export default SignupProgress;
