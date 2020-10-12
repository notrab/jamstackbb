import cc from "classcat";

import Thread from "./Thread";

export default function ThreadList({ threads, className }) {
  if (threads.length === 0) return null;

  return <div className={cc([["py-3"], className])}>{threads.map(Thread)}</div>;
}
