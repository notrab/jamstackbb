import Thread from "./Thread";

export default function ThreadList({ threads }) {
  if (!threads) return null;

  return <div className="py-3 md:divide-y">{threads.map(Thread)}</div>;
}
