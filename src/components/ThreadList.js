import Thread from "./Thread";

export default function ThreadList({ threads }) {
  if (!threads) return null;

  return <div className="py-6 md:py-12 divide-y">{threads.map(Thread)}</div>;
}
