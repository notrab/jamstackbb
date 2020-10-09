import Thread from "./Thread";

export default function ThreadList({ threads }) {
  if (!threads) return null;

  return (
    <div className="py-3 md:divide-y md:divide-gray-200">
      {threads.map(Thread)}
    </div>
  );
}
