"use client";

import { apiRoute } from "@/axios/apiRoute";
import LearnMore from "@/components/cta/learn-more";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getActualProductArray } from "@/lib/utils";
import { TProducts } from "@/types";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useMemo } from "react";
import { useIntersectionObserver } from "usehooks-ts";

function Page() {
  const { data, fetchNextPage, isLoading, isFetchingNextPage, isError } =
    useInfiniteQuery({
      queryKey: ["products"],
      queryFn: async ({ pageParam }) => {
        return await apiRoute.get<TProducts>(`/products?limit=${pageParam}`);
      },
      initialPageParam: 4,
      getNextPageParam: (_, __, lastPageParam) => {
        return lastPageParam + 4;
      },
      maxPages: 5,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    });

  const { isIntersecting, ref } = useIntersectionObserver({
    threshold: 1,
  });

  const actualProductArray = useMemo(() => {
    if (data?.pages == null) return;

    const { pages, pageParams } = data;

    const actualProductArray = getActualProductArray(pages, pageParams);

    return actualProductArray;
  }, [data]);

  if (isError) {
    return notFound();
  }

  if (isLoading || actualProductArray == null || data == null) {
    return (
      <MaxWidthWrapper className="flex-1 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-none w-80 h-80">
              <Skeleton className="h-full w-full" />
            </Card>
          ))}
        </div>
      </MaxWidthWrapper>
    );
  }

  if (isIntersecting) {
    fetchNextPage();
  }

  return (
    <MaxWidthWrapper className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {actualProductArray.map(
          ({ id, title, category, description, image }) => (
            <Card
              key={id}
              className="flex-1 h-full rounded-none shadow-none hover:shadow-lg hover:scale-[1.01] transition-transform"
            >
              <CardContent className="flex flex-col w-full h-full py-4">
                <CardHeader className="space-y-4 px-2">
                  <CardTitle className="text-center text-xl -tracking-tighter text-balance font-bold">
                    {title}
                  </CardTitle>
                  <Badge
                    className=" capitalize rounded-full w-max mx-auto text-[0.7rem] font-normal"
                    variant={"secondary"}
                  >
                    {category}
                  </Badge>

                  <LearnMore id={id} />
                </CardHeader>
                <div className="flex-1 flex items-center justify-center mb-4">
                  <Image
                    className="object-cover mx-auto"
                    width={120}
                    height={120}
                    src={image}
                    alt={description}
                  />
                </div>
              </CardContent>
            </Card>
          )
        )}
      </div>
      {isFetchingNextPage && (
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index} className="rounded-none">
              <Skeleton className="aspect-[4/5]" />
            </Card>
          ))}
        </div>
      )}
      {data.pages.length === 5 ? (
        <div className="py-16 w-max mx-auto">
          <p className="text-base font-extrabold -tracking-tighter text-muted-foreground">
            That&apos;s all! Nothing more to load.
          </p>
        </div>
      ) : (
        <div ref={ref} className="py-8 inset-x-0 h-4 w-full" />
      )}
    </MaxWidthWrapper>
  );
}

export default Page;
