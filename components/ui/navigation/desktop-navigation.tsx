"use client";

import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { NAV_LINKS } from "@/constants";
import { wait } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";
import { buttonVariants } from "../button";
import { ShoppingCartIcon } from "lucide-react";
import { OramaSearch } from "@/services/OramaSearch";
import { useUserStore } from "@/zustand-store/store";
import { UserDropdown } from "@/components/UserDropdown";

const staticLinks = NAV_LINKS.slice(1);

export function DesktopNavigation({
  isActiveLink,
  setIsActiveLink,
}: {
  isActiveLink: string | null;
  setIsActiveLink: Dispatch<SetStateAction<string | null>>;
}) {
  const user =
    useUserStore((state) => state.user) ??
    JSON.parse(localStorage.getItem("user") ?? "null");
  const router = useRouter();

  return (
    <nav className={"sticky z-20 inset-x-0 p-4 md:p-6"}>
      <MaxWidthWrapper>
        <motion.div
          className={
            "w-full flex items-center justify-between backdrop-blur-md bg-white/70"
          }
        >
          <div className={"flex items-center gap-10"}>
            <Link
              onClick={() => {
                setIsActiveLink(null);
              }}
              className={"relative size-14"}
              href={"/"}
            >
              <Image src={"/logo.png"} fill className="object-cover" alt="" />
            </Link>

            <div className="hidden md:flex items-center justify-center">
              {NAV_LINKS.map(({ label, href, elementId }) =>
                elementId != null ? (
                  <Link
                    key={label}
                    href={href}
                    onClick={async (e) => {
                      e.preventDefault();
                      if (
                        staticLinks.some(({ label }) => label === isActiveLink)
                      ) {
                        setIsActiveLink(label);
                        document
                          .getElementById(elementId)!
                          .scrollIntoView({ behavior: "smooth" });
                      } else {
                        router.push("/");
                        setIsActiveLink(label);
                        await wait(1500);
                        document
                          .getElementById(elementId)!
                          .scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={buttonVariants({
                      className:
                        isActiveLink === label
                          ? "!text-[#FBA328] !font-semibold"
                          : "!text-black",
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    {label}
                  </Link>
                ) : (
                  <Link
                    key={label}
                    href={href}
                    onClick={() => {
                      setIsActiveLink(label);
                    }}
                    className={buttonVariants({
                      className:
                        isActiveLink === label
                          ? "!text-[#FBA328] !font-semibold"
                          : "!text-black",
                      variant: "ghost",
                      size: "sm",
                    })}
                  >
                    {label}
                  </Link>
                )
              )}
            </div>
          </div>
          <div className="w-full flex justify-end items-center gap-4">
            <OramaSearch />
            {user ? <UserDropdown /> : null}
            <div className="hidden md:block">
              <Link
                href={"/cart"}
                className={buttonVariants({
                  className: "!py-5",
                  variant: "ghost",
                  size: "sm",
                })}
              >
                <ShoppingCartIcon className="!size-6" />
              </Link>
            </div>
          </div>
        </motion.div>
      </MaxWidthWrapper>
    </nav>
  );
}
