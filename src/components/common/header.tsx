"use client";

import {
  House,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  ShoppingBag,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Cart } from "./cart";

export const Header = () => {
  const { data: session } = authClient.useSession();
  const [open, setOpen] = useState(false);

  const categories = [
    { name: "Camisetas", slug: "camisetas" },
    { name: "Bermudas & Shorts", slug: "bermuda-shorts" },
    { name: "Calças", slug: "calcas" },
    { name: "Jaquetas & Moletons", slug: "jaquetas-moletons" },
    { name: "Tênis", slug: "tenis" },
    { name: "Acessórios", slug: "acessorios" },
  ];

  return (
    <header className="flex items-center justify-between p-5">
      <Link href="/">
        <Image src="/logo.svg" alt="BEWEAR" width={100} height={26.14} />
      </Link>

      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="px-5">
              {session?.user ? (
                <>
                  <div className="flex flex-col justify-start gap-2.5">
                    <div className="flex justify-between space-y-6">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={session?.user?.image as string | undefined}
                          />
                          <AvatarFallback>
                            {session?.user?.name?.split(" ")?.[0]?.[0]}
                            {session?.user?.name?.split(" ")?.[1]?.[0]}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <h3 className="font-semibold">
                            {session?.user?.name}
                          </h3>
                          <span className="text-muted-foreground block text-xs">
                            {session?.user?.email}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          authClient.signOut();
                          redirect("/");
                        }}
                      >
                        <LogOutIcon />
                      </Button>
                    </div>
                    <div className="px-5">
                      <Separator />
                    </div>
                    <Link
                      href="/"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-start justify-center transition hover:bg-gray-100"
                    >
                      <div className="flex flex-row items-center gap-3 px-4 py-3">
                        <House size="16px" />
                        <h3 className="text-sm font-medium">Início</h3>
                      </div>
                    </Link>
                    <Link
                      href="/my-orders"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-start justify-center transition hover:bg-gray-100"
                    >
                      <div className="flex flex-row items-center gap-3 px-4 py-3">
                        <Truck size="16px" />
                        <h3 className="text-sm font-medium">Meus Pedidos</h3>
                      </div>
                    </Link>
                    <Link
                      href="/cart/confirmation"
                      onClick={() => setOpen(false)}
                      className="flex flex-col items-start justify-center transition hover:bg-gray-100"
                    >
                      <div className="flex flex-row items-center gap-3 px-4 py-3">
                        <ShoppingBag size="16px" />
                        <h3 className="text-sm font-medium">Sacola</h3>
                      </div>
                    </Link>
                    <div className="px-5">
                      <Separator />
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold">Olá. Faça seu login!</h2>
                  <Button size="icon" asChild variant="outline">
                    <Link href="/authentication">
                      <LogInIcon />
                    </Link>
                  </Button>
                </div>
              )}
              <div className="space-y-1 py-2">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex flex-col items-start justify-center transition hover:bg-gray-100"
                  >
                    <div className="flex flex-row items-center gap-3 px-4 py-3">
                      <h3 className="text-sm font-medium">{category.name}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <Cart />
      </div>
    </header>
  );
};
