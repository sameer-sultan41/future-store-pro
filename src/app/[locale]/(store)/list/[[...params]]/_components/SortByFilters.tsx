"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const sortDropdownData = [
  { text: "Newest", sortName: "date", sortType: "desc" },
  { text: "Oldest", sortName: "date", sortType: "asc" },
  { text: "Most Expensive", sortName: "price", sortType: "desc" },
  { text: "Cheapest", sortName: "price", sortType: "asc" },
  { text: "Name", sortName: "name", sortType: "asc" },
];

const SortByFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State to manage the search input value
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    // Sync the state with the search parameter
    setSearchValue(searchParams.get("search") || "");
  }, [searchParams]);

  // Get current sort from search params
  const currentSortName = searchParams.get("sortName") || "id";
  const currentSortType = searchParams.get("sortType") || "desc";

  const handleSort = (index: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortName", sortDropdownData[index].sortName);
    params.set("sortType", sortDropdownData[index].sortType);
    router.replace(`?${params.toString()}`);
  };

  return (
    <div className="w-full flex gap-2 items-center h-8">
      {sortDropdownData.map((item, index) => {
        const isActive = item.sortName === currentSortName && item.sortType === currentSortType;
        return (
          <Button variant={isActive ? "default" : "secondary"} key={index} onClick={() => handleSort(index)}>
            {item.text}
          </Button>
        );
      })}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const params = new URLSearchParams(searchParams.toString());
          if (searchValue.trim()) {
            params.set("search", searchValue.trim());
          } else {
            params.delete("search");
          }
          router.replace(`?${params.toString()}`);
        }}
        className="flex items-center gap-1 ml-2"
        autoComplete="off"
      >
        <div className="relative flex items-center">
          <Input
            name="search"
            placeholder="Search products..."
            className="h-8 px-2 text-sm pr-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            autoComplete="off"
          />
          {searchValue && (
            <Button
              type="button"
              variant={"link"}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              tabIndex={-1}
              aria-label="Clear search"
              onClick={() => {
                setSearchValue("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                router.replace(`?${params.toString()}`);
              }}
            >
              <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6L14 14M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </Button>
          )}
        </div>
        <button
          type="submit"
          className="flex items-center justify-center h-8 w-8 rounded bg-primary text-primary-foreground hover:bg-primary/90 transition"
          aria-label="Search"
        >
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default SortByFilters;
