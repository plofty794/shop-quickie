"use client";

import { apiRoute } from "@/axios/apiRoute";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import Unauthorized from "@/components/Unauthorized";
import useMetadata from "@/hooks/use-metadata";
import { wait } from "@/lib/utils";
import { User } from "@/types";
import { useUserStore } from "@/zustand-store/store";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, CircleUserRound, LogOut, MapPin } from "lucide-react";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Page({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const logOut = useUserStore((state) => state.logOut);
  const [activeTab, setActiveTab] = useState<"details" | "address">("details");
  const user = useUserStore((state) => state.user);
  const [isClient, setIsClient] = useState<boolean>(false);
  const { data, isError, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      return await apiRoute.get<User>(`/users/${id}`);
    },
    enabled: id != null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useMetadata(
    "Your Profile - Shop Quickie",
    "Manage your profile at Shop Quickie. Update your personal information, view your order history, and customize your preferences for a personalized shopping experience. Keep your account details up-to-date and enjoy a seamless shopping journey with us."
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (isError || parseInt(id) > 10) {
    return notFound();
  }

  if (isLoading || data?.data == null || !isClient) {
    const circleVariants = {
      animate: {
        scale: [1, 1.5, 1],
        opacity: [1, 0.5, 1],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        },
      },
    };

    return (
      <div className="w-full flex flex-col gap-4 items-center justify-center h-screen">
        <motion.div
          className="w-20 h-20 rounded-full bg-primary/10"
          variants={circleVariants}
          animate="animate"
        ></motion.div>
        <Skeleton className="mt-4 w-32 h-4" />
        <Skeleton className="mt-2 w-48 h-3 " />
        <div className="mt-6 flex space-x-4">
          <Skeleton className="w-20 h-8 " />
          <Skeleton className="w-20 h-8 " />
        </div>
      </div>
    );
  }

  if (user == null || user.userId.toString() != id) {
    return <Unauthorized />;
  }

  return (
    <div className="py-12 md:py-14 lg:py-16">
      <MaxWidthWrapper className="max-w-screen-xl">
        <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-2 md:gap-4">
          <div className="h-full flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex flex-col gap-4">
                <div className="w-full flex md:hidden justify-between items-center">
                  <Button
                    size={"sm"}
                    onClick={() => router.back()}
                    variant={"link"}
                    className="gap-2"
                  >
                    <ArrowLeft /> Go back
                  </Button>
                  <Button
                    onClick={async () => {
                      localStorage.removeItem("user");
                      localStorage.removeItem("cart");
                      toast("👋 Goodbye! You’ve successfully logged out.", {
                        description: "See you next time!",
                        duration: 2000,
                      });
                      await wait(2000);
                      logOut();
                      document.location.reload();
                    }}
                    variant={"destructive"}
                    size={"sm"}
                    className="gap-2"
                  >
                    <LogOut /> Log out
                  </Button>
                </div>
                <Button
                  size={"sm"}
                  onClick={() => router.back()}
                  variant={"link"}
                  className="hidden md:flex w-full gap-2 p-0"
                >
                  <ArrowLeft /> Go back
                </Button>
                <h1 className="text-center text-2xl font-bold -tracking-tighter">
                  My Account
                </h1>
              </div>
              <div className="flex flex-row md:flex-col items-center gap-2 w-full">
                <Button
                  size={"sm"}
                  onClick={() => setActiveTab("details")}
                  variant={activeTab === "details" ? "secondary" : "ghost"}
                  className={"w-full gap-2"}
                >
                  <CircleUserRound /> My details
                </Button>
                <Button
                  size={"sm"}
                  onClick={() => setActiveTab("address")}
                  variant={activeTab === "address" ? "secondary" : "ghost"}
                  className="w-full gap-2"
                >
                  <MapPin /> My address
                </Button>
              </div>
            </div>
            <Button
              onClick={async () => {
                localStorage.removeItem("user");
                localStorage.removeItem("cart");
                toast("👋 Goodbye! You’ve successfully logged out.", {
                  description: "See you next time!",
                });
                await wait(500);
                logOut();
                document.location.reload();
              }}
              variant={"destructive"}
              size={"sm"}
              className="hidden md:flex gap-2"
            >
              <LogOut /> Log out
            </Button>
          </div>

          {activeTab === "details" && (
            <Card>
              <CardHeader className="space-y-8">
                <CardTitle className="text-xl capitalize -tracking-tighter">
                  My details
                </CardTitle>
                <div className="space-y-4">
                  <CardDescription className="!text-black font-medium text-muted-foreground -tracking-tighter">
                    Personal Information
                  </CardDescription>
                  <Separator />
                </div>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-3/5">
                    <p className="w-full text-xs md:text-sm text-muted-foreground -tracking-tighter">
                      Enhance your shopping experience by keeping Personal
                      Information up-to-date for faster checkout and tailored
                      recommendations
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <div className="flex gap-4">
                      <div className="space-y-1 md:space-y-2 w-full">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          First name
                        </Label>
                        <Input
                          className="capitalize text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.name.firstname}
                          readOnly
                        />
                      </div>
                      <div className="space-y-1 md:space-y-2 w-full">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          Last name
                        </Label>
                        <Input
                          className="capitalize text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.name.lastname}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full space-y-1 md:space-y-2">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          Phone number
                        </Label>
                        <Input
                          className="text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.phone}
                          readOnly
                        />
                      </div>
                      <div className="hidden md:block w-full" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="space-y-4">
                    <CardDescription className="!text-black font-medium text-muted-foreground -tracking-tighter">
                      Email address
                    </CardDescription>
                    <Separator />
                  </div>
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="w-full lg:w-3/5">
                      <p className="w-full text-xs md:text-sm text-muted-foreground -tracking-tighter">
                        Enhance your shopping experience by keeping Personal
                        Information up-to-date for faster checkout and tailored
                        recommendations
                      </p>
                    </div>
                    <div className="w-full flex gap-4">
                      <div className="w-full space-y-1 md:space-y-2">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          Email address
                        </Label>
                        <Input
                          className="text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.email}
                          readOnly
                        />
                      </div>
                      <div className="hidden md:block w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "address" && (
            <Card>
              <CardHeader className="space-y-6 md:space-y-8">
                <CardTitle className="text-xl capitalize -tracking-tighter">
                  My details
                </CardTitle>
                <div className="space-y-4">
                  <CardDescription className="!text-black font-medium text-muted-foreground -tracking-tighter">
                    Personal Address
                  </CardDescription>
                  <Separator />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="w-full lg:w-3/5">
                    <p className="w-full text-xs md:text-sm text-muted-foreground -tracking-tighter">
                      Enhance your shopping experience by keeping Personal
                      Information up-to-date for faster checkout and tailored
                      recommendations
                    </p>
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex gap-4">
                      <div className="space-y-1 md:space-y-2 w-full">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          City
                        </Label>
                        <Input
                          className="capitalize text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.address.city}
                          readOnly
                        />
                      </div>
                      <div className="space-y-1 md:space-y-2 w-full">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          Street
                        </Label>
                        <Input
                          className="capitalize text-xs md:text-sm -tracking-tighter"
                          defaultValue={`${data.data.address.street} ${data.data.address.number}`}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-full space-y-1 md:space-y-2">
                        <Label className="text-xs md:text-sm -tracking-tighter">
                          Zip code
                        </Label>
                        <Input
                          className="text-xs md:text-sm -tracking-tighter"
                          defaultValue={data.data.address.zipcode}
                          readOnly
                        />
                      </div>
                      <div className="hidden md:block w-full" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </MaxWidthWrapper>
    </div>
  );
}

export default Page;
