"use client";

import Link from "next/link";
import { RenderIf } from "@/components/shared";
import { Loader } from "@/components/shared/loader";
import { Avatar, AvatarImage } from "@/components/ui";
import { useGetProfile } from "@/services/hooks/queries/use-profile";

export const MyOrganisationsContent = () => {
  const { data, isLoading } = useGetProfile();

  return (
    <div>
      <RenderIf condition={isLoading}>
        <div className="w-full h-full min-h-[300px] flex justify-center items-center">
          <Loader />
        </div>
      </RenderIf>

      <RenderIf condition={!isLoading}>
        <div className="grid gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.org_data?.map((provider) => (
            <Link
              key={provider?.org_id}
              href={`/providers/organisation/${provider?.org_id}?type=org&service_type=payer`}
              className="border border-divider rounded-lg p-1 grid gap-y-2"
            >
              <Avatar className="rounded-sm w-full h-20 md:h-32">
                <AvatarImage
                  src={provider?.avatar || "/assets/blank-profile-picture.png"}
                  className="w-full object-cover hover:scale-150 transition-transform transform duration-200"
                  alt="provider"
                />
              </Avatar>

              <div className="px-0.5">
                <h2 className="font-medium text-brand-1 text-[10px] md:text-base capitalize">
                  {provider?.name}
                </h2>

                <p className="text-[8px] md:text-xs text-brand-2 capitalize">
                  {provider?.industry_name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </RenderIf>
    </div>
  );
};
