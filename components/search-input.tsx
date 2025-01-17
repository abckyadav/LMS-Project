"use client";
import qs from "query-string";
import { Search } from "lucide-react";
import React, { Suspense, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debouncedValue,
        },
      },
      { skipEmptyString: true, skipNull: true }
    );

    router.push(url);
  }, [debouncedValue, currentCategoryId, router, pathname]);

  return (
    <div className="relative">
      <Suspense
        fallback={<div className="h-8 bg-slate-200 animate-pulse rounded" />}
      >
        <Search className="h-4 w-4 absolute top-[0.6rem] left-3 text-slate-600" />
      </Suspense>
      <Suspense
        fallback={<div className="h-8 bg-slate-200 animate-pulse rounded" />}
      >
        <Input
          onChange={(e) => setValue(e.target.value)}
          className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
          placeholder="Search for a course..."
        />
      </Suspense>
    </div>
  );
}
