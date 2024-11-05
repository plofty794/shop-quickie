"use client";

import { apiRoute } from "@/axios/apiRoute";
import { MaxWidthWrapper } from "@/components/MaxWidthWrapper";
import { NavLoader } from "@/components/nav-loader";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { priceFormatter } from "@/lib/utils";
import { Product } from "@/types";
import { Cart, useCartStore } from "@/zustand-store/store";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LogIn } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Navigation = dynamic(() => import("@/components/Navigation"), {
  ssr: false,
  loading: ({ isLoading }) => {
    if (isLoading) {
      return <NavLoader />;
    } else {
      return null;
    }
  },
});

function Page() {
  const [isClient, setIsClient] = useState<boolean>(false);
  const updateCart = useCartStore((state) => state.updateCart);
  const cart = useCartStore((state) => state.cart);
  const products = cart.flatMap((items) => items.products);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const _cart = JSON.parse(localStorage.getItem("cart") ?? "[]");
    updateCart(_cart);
  }, [updateCart]);

  if (!isClient) {
    return (
      <>
        <Navigation />
        <div className="flex-1 py-12 md:py-14 lg:py-16">
          <MaxWidthWrapper className="max-w-screen-xl">
            <Skeleton className="w-full h-96" />
          </MaxWidthWrapper>
        </div>
      </>
    );
  }

  console.log(cart);
  console.log(products);

  return (
    <>
      <Navigation />
      <div className="flex-1 py-12 md:py-14 lg:py-16">
        <MaxWidthWrapper className="max-w-screen-lg">
          <AnimatePresence>
            {products.length > 0 && (
              <motion.div
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
                className="space-y-6 md:space-y-10"
              >
                <h1 className="text-center text-4xl -tracking-tighter font-bold">
                  You cart
                </h1>
                {products.map((product, index) => (
                  <CartItem
                    key={index}
                    id={product.productId}
                    quantity={product.quantity}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          {products.length == 0 || cart.length == 0 ? <EmptyCart /> : null}
        </MaxWidthWrapper>
      </div>
    </>
  );
}

function CartItem({ id, quantity }: { id?: string; quantity: number }) {
  const router = useRouter();
  const updateCart = useCartStore((state) => state.updateCart);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      return await apiRoute.get<Product>(`/products/${id}`);
    },
    enabled: id != null,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  if (isError) {
    return notFound();
  }

  if (isLoading || data?.data == null) {
    return <h1>Loading...</h1>;
  }

  return (
    <motion.div layout className="flex gap-8">
      <Image
        className="object-contain"
        src={data.data.image}
        width={100}
        height={100}
        alt={data.data.description}
      />
      <div className="w-full flex flex-col gap-4 py-4">
        <div className="w-full flex items-center justify-between">
          <p className="text-xl font-bold -tracking-tighter w-[400px] text-balance">
            {data.data.title}
          </p>

          <p className="text-sm -tracking-tighter text-muted-foreground">
            Qty: <span className="font-bold text-black">{quantity}</span>
          </p>
          <p className="text-lg font-bold -tracking-tighter">
            {priceFormatter(data.data.price * quantity)}
          </p>
        </div>
        <Separator />
        <div className="ml-auto w-max flex items-center gap-4">
          <Button
            onClick={() => {
              const cart: Cart[] = JSON.parse(
                localStorage.getItem("cart") ?? "[]"
              );
              console.log(cart);
              const updatedCart = cart.flatMap((items) => {
                const products = items.products;
                const cart = products.filter(
                  (product) =>
                    product.productId != id && product.quantity != quantity
                );

                console.log(cart);
                return [{ ...items, products: cart }];
              });

              localStorage.removeItem("cart");
              updateCart(updatedCart);
              localStorage.setItem("cart", JSON.stringify(updatedCart));
            }}
            size={"lg"}
            className="rounded-full"
            variant={"destructive"}
          >
            Remove
          </Button>
          <Button
            onClick={() =>
              router.push(`/checkout?productId=${id}&quantity=${quantity}`)
            }
            size={"lg"}
            className="rounded-full"
          >
            Checkout
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold -tracking-tighter">
          Your cart is empty
        </h1>
        <p className="text-muted-foreground -tracking-tighter font-bold">
          Log in to check if you have any saved items, or simply keep shopping.
        </p>
      </div>
      <div className="flex gap-4 max-w-md">
        <Button
          onClick={() => router.push("/login")}
          size={"lg"}
          className="rounded-full w-full gap-2"
        >
          Sign in <LogIn />
        </Button>
        <Button
          onClick={() => router.push("/store")}
          size={"lg"}
          className="rounded-full w-full"
          variant={"secondary"}
        >
          Continue Shopping
          <ArrowRight />
        </Button>
      </div>
    </div>
  );
}

export default Page;