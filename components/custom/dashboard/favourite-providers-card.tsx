"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui";
import { RenderIf } from "@/components/shared";
import { IconExternalLink } from "@/components/icons";
import { FAVOURITE_PROVIDERS_DATA } from "@/lib/mock";

export const FavouriteProvidersCard = () => {
  return (
    <div className="col-span-1 xl:col-span-4 content-start flex flex-col gap-y-4 rounded-2xl bg-white p-4 md:py-6 md:px-6">
      <h3 className="font-semibold text-sm text-text-2">Favourite Providers</h3>

      <div className="flex flex-col gap-y-1 flex-1">
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
  );
};
