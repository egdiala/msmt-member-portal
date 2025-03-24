"use client";

import { Fragment } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { RenderIf } from "@/components/shared";
import { IconExternalLink } from "@/components/icons";
import { FAVOURITE_PROVIDERS_DATA } from "@/lib/mock";
import { PROVIDERS } from "@/lib/routes";

export const FavouriteProvidersCard = () => {
  const router = useRouter();
  return (
    <div className="w-full md:w-[48%] xl:w-[32%] content-start 3xl:!w-[413px] h-[349px] max-w-full md:max-w-[48%] xl:max-w-[32%] 3xl:!max-w-[413px] grid gap-y-4 rounded-2xl bg-white py-[24.48px] px-6">
      <h3 className="font-semibold text-sm text-text-2">Favourite Providers</h3>

      <div className="grid gap-y-1">
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
                  <p className="text-text-tertiary text-xs tracking-[-2%]">
                    {provider.occupation}
                  </p>
                </div>
              </div>

              <Link
                href={`/providers/${provider.id}`}
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
        variant="secondary"
        className="rounded-[100px] text-button-primary gap-x-1 w-fit"
        onClick={() => router.push(PROVIDERS)}
      >
        Favourite Providers
        <IconExternalLink className="stroke-button-primary" />
      </Button>
    </div>
  );
};
