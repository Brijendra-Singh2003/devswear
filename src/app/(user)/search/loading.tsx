import Filters from "@/components/category/Filter";
import { ItemCardSkeleton } from "@/components/ItemCard";

export default function Loading() {
  return (
    <main className="flex gap-4 mx-auto sm:px-4">
      <Filters />
      <div className="col-span-3 mx-auto sm:mx-0 sm:p-4">
        <div className="grid grid-cols-2 sm:flex flex-wrap sm:gap-4 max-w-7xl">
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
          {ItemCardSkeleton}
        </div>
      </div>
    </main>
  );
}
