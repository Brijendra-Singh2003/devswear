import { ItemCardSkeleton } from "@/components/ItemCard";

export default function Loading() {
  return (
    <main className="max-w-[1440px] mx-auto">
      <h1 className="capitalize w-fill mx-auto px-4 my-8 text-3xl text-center font-bold">
        <div className="h-9 w-1/2 mx-auto rounded-lg bg-gray-200 animate-pulse" />
      </h1>
      <div className="grid grid-cols-2 sm:flex flex-wrap sm:gap-2 justify-center mx-auto">
        {ItemCardSkeleton}
        {ItemCardSkeleton}
        {ItemCardSkeleton}
        {ItemCardSkeleton}
        {ItemCardSkeleton}
      </div>
    </main>
  );
}
