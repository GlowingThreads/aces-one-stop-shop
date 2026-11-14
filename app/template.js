// A template wraps every page and, unlike a layout, is created afresh on each navigation.
// That lets each new page fade in softly (see .page-in in globals.css) instead of cutting in.
export default function Template({ children }) {
  return <div className="page-in">{children}</div>;
}
