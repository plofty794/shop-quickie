"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { motion } from "framer-motion";
import { memo, useState } from "react";

export const SeeMore = memo(function SeeMore({
  productAssets,
}: {
  productAssets: {
    id: number;
    images: string[];
    details: string[];
  };
}) {
  const [seeMore, setSeeMore] = useState<boolean>(false);

  return (
    <div className="space-y-3 md:space-y-4">
      <p className="uppercase text-muted-foreground -tracking-tighter font-bold">
        Item details
      </p>
      {productAssets.details.map((detail, index) =>
        index < 3 ? (
          <div key={index} className="space-y-4">
            <p className="font-medium -tracking-tighter text-xs md:text-sm text-balance">
              - {detail}
            </p>
            <Separator />
          </div>
        ) : (
          <motion.div
            key={index}
            animate={{
              opacity: seeMore ? 1 : 0,
              display: seeMore ? "block" : "none",
            }}
            className={"space-y-4"}
          >
            <p className="font-medium -tracking-tighter text-xs md:text-sm text-balance">
              - {detail}
            </p>
            <Separator />
          </motion.div>
        )
      )}
      <Button
        size={"sm"}
        variant={"secondary"}
        onClick={() => setSeeMore((prev) => !prev)}
        className="gap-2"
      >
        {seeMore ? "See less" : "See more"}
        <motion.svg
          animate={{
            rotate: seeMore ? "-90deg" : "90deg",
          }}
          className={
            "bg-black/5 backdrop-blur-lg fill-muted-foreground rounded-full border "
          }
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 36 36"
        >
          <path d="M23.5587,16.916 C24.1447,17.4999987 24.1467,18.446 23.5647,19.034 L16.6077,26.056 C16.3147,26.352 15.9287,26.4999987 15.5427,26.4999987 C15.1607,26.4999987 14.7787,26.355 14.4867,26.065 C13.8977,25.482 13.8947,24.533 14.4777,23.944 L20.3818,17.984 L14.4408,12.062 C13.8548,11.478 13.8528,10.5279 14.4378,9.941 C15.0218,9.354 15.9738,9.353 16.5588,9.938 L23.5588,16.916 L23.5587,16.916 Z"></path>
        </motion.svg>
      </Button>
    </div>
  );
});
