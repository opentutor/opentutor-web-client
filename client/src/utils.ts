export function isTesting(): boolean {
  return (
    window &&
    Boolean(new URLSearchParams(window.location.search).get("testing"))
  );
}
