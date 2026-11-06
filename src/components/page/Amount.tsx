/** An amount like "€5,040/year": the figure leads, the unit after the slash rides small. textContent is unchanged. */
const Amount = ({ value }: { value: string }) => {
  const at = value.indexOf("/");
  if (at < 0) return <>{value}</>;
  return (
    <>
      {value.slice(0, at)}
      <span className="amount-unit">{value.slice(at)}</span>
    </>
  );
};

export default Amount;
