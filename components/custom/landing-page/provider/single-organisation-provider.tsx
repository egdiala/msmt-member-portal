"use client";

import { useMemo } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { IconStarFull } from "@/components/icons";
import { BreadcrumbCmp, RenderIf } from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";
import { Loader } from "@/components/shared/loader";
import { formatNumberWithCommas } from "@/hooks/use-format-currency";
import { cn } from "@/lib/utils";
import { useGetServiceProviders } from "@/services/hooks/queries/use-providers";
import {
  useAddFavouriteProvider,
  useRemoveFavouriteProvider,
} from "@/services/hooks/mutations/use-providers";
import { FetchOrganizationProvider } from "@/types/providers";

export const SingleOrganisationProviderContent = () => {
  const { id } = useParams();

  const searchParams = useSearchParams();
  const user_type = searchParams.get("type") as "provider" | "org";
  const account_type = searchParams.get("service_type") as "provider" | "payer";

  const { data, isLoading: isLoadingServiceProviderInfo } =
    useGetServiceProviders<FetchOrganizationProvider>({
      user_id: id?.toString(),
      user_type: user_type,
      account_service_type: account_type,
    });

  const cardStats = [
    {
      id: 1,
      title: account_type === "provider" ? "Charge" : "Total Members",
      value:
        account_type === "provider"
          ? `From ${formatNumberWithCommas(data?.charge_from ?? 0)}/hr`
          : data?.total_member ?? 0,
    },
    { id: 2, title: "Providers", value: data?.total_provider ?? 0 },
  ];

  const { mutate: addFavourite, isPending } = useAddFavouriteProvider();
  const { mutate: removeFavourite, isPending: isRemovingFavourite } =
    useRemoveFavouriteProvider();

  const handleMarkAsFavourite = () => {
    if (data?.isfav_provider) {
      removeFavourite(id!.toString());
    } else {
      addFavourite(id!.toString());
    }
  };

  const buttonCopy = {
    idle: (
      <div className="flex items-center justify-between gap-x-2 px-3 py-2">
        <IconStarFull className="size-4" />
        <p>
          {data?.isfav_provider ? "Remove from Favourite" : "Mark as Favourite"}
        </p>
      </div>
    ),
    loading: <Loader className="spinner size-4" />,
  };

  const buttonState = useMemo(() => {
    return isPending || isRemovingFavourite ? "loading" : "idle";
  }, [isPending, isRemovingFavourite]);

  return (
    <>
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers" },
          { id: 2, name: data?.name ?? "" },
        ]}
      />

      <div className="p-3 md:p-4 grid gap-y-5">
        <RenderIf condition={isLoadingServiceProviderInfo}>
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        </RenderIf>

        <RenderIf condition={!isLoadingServiceProviderInfo}>
          <div className="rounded-lg bg-blue-400 p-3 flex gap-3 flex-col md:flex-row">
            <Avatar className="w-full md:w-39 h-39 rounded-sm">
              <AvatarImage
                className="object-cover"
                src={data?.avatar || "/assets/blank-profile-picture.png"}
              />
            </Avatar>

            <div className="grid gap-y-3 w-full items-center">
              <div className="grid gap-y-1">
                <h3 className="text-lg md:text-xl font-bold text-brand-1">
                  {data?.name}
                </h3>
                <p className="text-brand-2">{data?.industry_name}</p>
              </div>

              <RenderIf condition={account_type === "provider"}>
                <div className="border-t border-divider"></div>

                <div className="flex items-center justify-between">
                  <Button
                    variant={data?.isfav_provider ? "default" : "ghost"}
                    className={cn(
                      "p-0 font-semibold min-w-42",
                      data?.isfav_provider
                        ? "stroke-white"
                        : "stroke-brand-btn-secondary hover:stroke-white"
                    )}
                    disabled={isPending || isRemovingFavourite}
                    onClick={handleMarkAsFavourite}
                  >
                    <AnimatePresence mode="popLayout" initial={false}>
                      <motion.span
                        transition={{
                          type: "spring",
                          duration: 0.3,
                          bounce: 0,
                        }}
                        initial={{ opacity: 0, y: -25 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 25 }}
                        key={buttonState}
                      >
                        {buttonCopy[buttonState]}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </div>
              </RenderIf>
            </div>
          </div>

          <div className="border border-divider rounded-lg px-4 md:px-5 py-4 grid gap-y-2">
            <p className="text-sm text-brand-2">About</p>
            <p className="text-brand-1">{data?.description ?? "N/A"}</p>
          </div>

          <div className="border border-divider rounded-lg px-3 md:px-5 py-4 grid gap-y-2">
            <p className="text-brand-2 text-sm">Services</p>

            <div className="flex gap-4 flex-wrap">
              {data?.service_data?.map((service) => (
                <div
                  key={service?.service_offer_id}
                  className="rounded-full bg-grey-400 px-4 py-2.5 capitalize"
                >
                  {service?.name}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cardStats.map((stat) => (
              <div
                key={stat.id}
                className="grid gap-2 border border-divider rounded-lg px-5 py-4"
              >
                <p className="text-brand-2 text-sm">{stat.title}</p>
                <p className="text-lg text-brand-1 font-medium">{stat.value}</p>
              </div>
            ))}
          </div>
        </RenderIf>
      </div>
    </>
  );
};
