"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/components/ui";
import { RenderIf } from "@/components/shared";
import { IconExternalLink } from "@/components/icons";
import { FAVOURITE_PROVIDERS_DATA } from "@/lib/mock";

export const FavouriteProvidersCard = () => {
  return (
    <div className="order-1 md:order-2 col-span-1 xl:col-span-4 content-start flex flex-col gap-y-4 rounded-2xl bg-white p-4 md:py-6 md:px-6">
      <h3 className="font-semibold text-sm text-text-2">Favourite Providers</h3>

      <div className="flex justify-between md:justify-end flex-row md:flex-col gap-y-3 md:gap-y-4">
        <div className="flex-col gap-y-1 flex-1 hidden md:flex">
          {FAVOURITE_PROVIDERS_DATA.map((provider, index) => (
            <Fragment key={provider.id}>
              <div className="py-3 flex justify-between items-center">
                <div className="flex gap-x-2 items-center">
                  <Image
                    className="h-11 rounded-lg object-cover"
                    src={provider.img}
                    alt="main"
                    width={44}
                    height={44}
                  />

                  <div>
                    <h3 className="font-medium text-sm text-text-1">
                      {provider.name}
                    </h3>
                    <p className="text-text-tertiary text-xs">
                      {provider.occupation}
                    </p>
                  </div>
                </div>

                <Link
                  href={`/providers${
                    provider.type.toLowerCase() === "organisation"
                      ? "/organisation"
                      : "/individual"
                  }/${provider.id}`}
                  className="underline text-button-primary text-xs"
                >
                  View
                </Link>
              </div>

              <RenderIf condition={index < FAVOURITE_PROVIDERS_DATA.length - 1}>
                <div className="border-t border-divider"></div>
              </RenderIf>
            </Fragment>
          ))}
        </div>

        <div className="md:hidden flex gap-x-1 items-center pl-3">
          <div className="flex items-center">
            {FAVOURITE_PROVIDERS_DATA.map((provider) => (
              <Avatar className="-ml-3 border border-white w-8 h-8">
                <AvatarImage
                  src={provider.img}
                  alt="provider"
                  className="object-cover"
                />
                <AvatarFallback>
                  {provider.name.split(" ")[0][0]}
                  {provider.name.split(" ")[1][0]}
                </AvatarFallback>
              </Avatar>
            ))}
          </div>
          <p className="text-xs text-brand-1 font-medium">+2 more</p>
        </div>

        <Button
          asChild
          variant="secondary"
          className="text-button-primary gap-x-1 w-fit"
        >
          <Link href="/providers">
            Favourite Providers
            <IconExternalLink className="stroke-button-primary" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
