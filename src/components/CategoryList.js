import cc from "classcat";

import Category from "./Category";

export default function CategoryList({ categories, className }) {
  if (categories.length === 0) return null;

  return (
    <div className={cc([["py-3"], className])}>{categories.map(Category)}</div>
  );
}
