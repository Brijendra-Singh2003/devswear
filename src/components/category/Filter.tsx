"use client";

import React, { useState } from "react";
import categories from "../../../MyCategories.json";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Filters({
  q,
  options,
}: {
  q?: string;
  options?: any;
}) {
  const [activeFilters, setActiveFilters] = useState({ ...options, q });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <div className="p-4 hidden min-w-fit w-64 md:relative col-span-1 md:flex flex-col bg-popover shadow-md h-fit mt-4 space-y-2">
      <h1 className="font-semibold text-xl">Filters</h1>
      <hr />

      {filters.map((filter) => (
        <Filter
          key={filter.name}
          title={filter.label}
          name={filter.name}
          options={filter.options}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />
      ))}

      <Button asChild>
        <Link
          href={{
            pathname: "/search",
            query: {
              q: activeFilters.q,
              filters: JSON.stringify(activeFilters)
            },
          }}
        >
          Apply
        </Link>
      </Button>
    </div>
  );
}

function Filter({
  title,
  name,
  options,
  setActiveFilters,
  activeFilters,
}: {
  title: string;
  name: string;
  options: { value: string; label: string }[];
  category?: string;
  setActiveFilters: (
    value: React.SetStateAction<{
      q: string | undefined;
      category: string | undefined;
    }>
  ) => void;
  activeFilters: any;
}) {
  return (
    <div className="p-2">
      <h1 className="py-2 capitalize w-fit">{title}</h1>
      <ul className="ml-2 space-y-1">
        {options.map((option) => (
          <li key={option.label} className="flex gap-2 px-2">
            <input
              id={option.value}
              onChange={() => {
                setActiveFilters((p) => ({ ...p, [name]: option.value }));
              }}
              name={name}
              type="radio"
              checked={activeFilters[name] === option.value}
            />
            <label
              htmlFor={option.label}
              className="text-sm text-muted-foreground"
            >
              {option.label}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

const filters = [
  {
    label: "Category",
    name: "category",
    options: categories.map((c) => ({ label: c.name, value: c.name })),
  },
  // {
  //   label: "Color",
  //   name: "color",
  //   options: [
  //     {
  //       label: "black",
  //       value: "black",
  //     },
  //     {
  //       label: "lavender",
  //       value: "lavender",
  //     },
  //     {
  //       label: "pink",
  //       value: "pink",
  //     },
  //     {
  //       label: "red",
  //       value: "red",
  //     },
  //     {
  //       label: "blue",
  //       value: "blue",
  //     },
  //   ],
  // },
  // {
  //   label: "Size",
  //   name: "size",
  //   options: [
  //     {
  //       label: "S",
  //       value: "s",
  //     },
  //     {
  //       label: "M",
  //       value: "m",
  //     },
  //     {
  //       label: "L",
  //       value: "l",
  //     },
  //     {
  //       label: "XL",
  //       value: "xl",
  //     },
  //     {
  //       label: "XXL",
  //       value: "xxl",
  //     },
  //   ],
  // },
];
