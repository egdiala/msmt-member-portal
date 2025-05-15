"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  Button,
} from "@/components/ui";
import { RenderIf } from "./render-if";
import { IconArrowLeft } from "../icons";

interface IBreadcrumbCmp {
  breadcrumbItems: { id: number; href?: string; name: string }[];
}

const BreadCrumbItem = ({ name, index }: { name: string; index: number }) => {
  return (
    <BreadcrumbItem className="text-text-1 flex items-center gap-1 capitalize cursor-pointer">
      <RenderIf condition={index === 0}>
        <IconArrowLeft className="stroke-text-2" />
      </RenderIf>

      {name}
    </BreadcrumbItem>
  );
};
export function BreadcrumbCmp({ breadcrumbItems }: IBreadcrumbCmp) {
  const router = useRouter();

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems?.map((item, index) => (
          <Fragment key={item.id}>
            <RenderIf condition={!!item.href}>
              <Link href={item.href!}>
                <BreadCrumbItem name={item.name} index={index} />
              </Link>
            </RenderIf>

            <RenderIf condition={!item.href}>
              <Button
                variant="ghost"
                className="hover:bg-unset p-0 hover:text-brand-1"
                onClick={() => router.back()}
              >
                <BreadCrumbItem name={item.name} index={index} />
              </Button>
            </RenderIf>
            <RenderIf condition={index !== breadcrumbItems.length - 1}>
              <BreadcrumbSeparator />
            </RenderIf>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
