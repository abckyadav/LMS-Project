import { db } from "@/lib/db";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import getCourses from "@/actions/get-courses";
import CoursesList from "@/components/courses-list";
import { Suspense } from "react";

type SearchPageProps = {
  searchParams: {
    title: string;
    categoryId: string;
  };
};

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({
    userId,
    ...searchParams,
  });

  return (
    <>
      <div className="min-h-screen">
        <div className="px-6 pt-6 md:hidden md:mb-0 block">
          <Suspense
            fallback={
              <div className="h-8 bg-slate-200 animate-pulse rounded" />
            }
          >
            <SearchInput />
          </Suspense>
        </div>

        <div className="p-6 space-y-4">
          <Suspense
            fallback={
              <div className="h-8 bg-slate-200 animate-pulse rounded" />
            }
          >
            <Categories items={categories} />
          </Suspense>

          <Suspense
            fallback={
              <div className="h-96 bg-slate-200 animate-pulse rounded" />
            }
          >
            <CoursesList items={courses} />
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default SearchPage;
