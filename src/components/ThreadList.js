import Thread from "./Thread";

export default function ThreadList({ threads }) {
  if (!threads) return null;

  return <div className="py-3">{threads.map(Thread)}</div>;
}
