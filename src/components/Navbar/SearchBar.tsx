"use client";

import { AiOutlineSearch } from "react-icons/ai";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";

export default function SearchBox() {
    const router = useRouter();
    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
  
      const formData = new FormData(e.currentTarget);
      router.push("/search?q=" + formData.get("q"));
      e.currentTarget.reset();
    }
    return (
      <form
        onSubmit={handleSubmit}
        className="fixed z-10 w-full -top-14 focus-within:top-0 transition-all left-0 sm:relative sm:top-0 bg-popover py-2 sm:py-0 flex items-center flex-grow-[0.5] sm:w-fit gap-4 px-2"
      >
        <Input
          autoComplete="off"
          id="search-input"
          type="text"
          required
          name="q"
          placeholder="search products..."
        />
        <Button className="px-4" size="sm">
          <AiOutlineSearch className="h-5 w-5" />
        </Button>
      </form>
    );
  }
  