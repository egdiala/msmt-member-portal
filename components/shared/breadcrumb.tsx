"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui";
import { RenderIf } from "./render-if";
import { IconArrowLeft } from "../icons";

interface IBreadcrumbCmp {
  breadcrumbItems: { id: number; href?: string; name: string }[];
}
export function BreadcrumbCmp({ breadcrumbItems }: IBreadcrumbCmp) {
  const router = useRouter();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems?.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbItem
              className="text-text-1 flex items-center gap-1 capitalize cursor-pointer"
              onClick={() => router.back()}
            >
              <RenderIf condition={index === 0}>
                <IconArrowLeft className="stroke-text-2" />
              </RenderIf>

              {item.name}
            </BreadcrumbItem>

            <RenderIf condition={index !== breadcrumbItems.length - 1}>
              <BreadcrumbSeparator />
            </RenderIf>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
