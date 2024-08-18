import React from "react";
import categories from "../../../MyCategories.json";

export default function Filters({
  q,
  category,
}: {
  q?: string;
  category?: string;
}) {
  return (
    <form className="p-4 hidden md:relative col-span-1 md:flex flex-col bg-white shadow-md h-fit mt-4">
      {q && <input hidden type="text" value={q} name="q" />}
      {filters.map((filter) => (
        <Filter
          key={filter.title}
          title={filter.title}
          options={filter.options}
          category={category}
        />
      ))}
      <button className="bg-blue-600 text-white active:scale-95 transition-all px-3 py-1.5 rounded hover:bg-blue-700">
        Apply
      </button>
    </form>
  );
}

function Filter({
  title,
  options,
  category,
}: {
  title: string;
  options: {name: string}[];
  category?: string;
}) {
  return (
    <div className="px-4 py-2">
      <h1 className="py-2 capitalize text-xl w-fit">{title}</h1>
      <ul className="px-4">
        {options.map((option) => (
          <li key={option.name} className="flex gap-2 p-2">
            <input
              type="radio"
              value={option.name}
              readOnly
              defaultChecked={category === option.name}
              name={title}
              id={option.name}
            />
            <label htmlFor={option.name} className=" capitalize">
              {option.name}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

const filters = [
  {
    title: "category",
    options: categories,
  },
  // {
  //   title: "Color",
  //   options: ["black", "lavender", "pink", "red", "white", "blue"],
  // },
  // {
  //   title: "Size",
  //   options: ["S", "M", "L", "XL", "XXL"],
  // },
];
