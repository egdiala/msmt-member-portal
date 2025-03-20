import { Fragment } from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui";
import { RenderIf } from "./render-if";
import { IconArrowLeft } from "../icons";

interface IBreadcrumbCmp {
  breadcrumbItems: { id: number; href?: string; name: string }[];
}
export function BreadcrumbCmp({ breadcrumbItems }: IBreadcrumbCmp) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems?.map((item, index) => (
          <Fragment key={item.id}>
            <BreadcrumbItem>
              <BreadcrumbLink
                href={item.href ?? undefined}
                className="text-text-1 flex items-center gap-1 tracking-[0%] leading-[140%]"
              >
                <RenderIf condition={index === 0}>
                  <IconArrowLeft className="stroke-text-2" />
                </RenderIf>

                {item.name}
              </BreadcrumbLink>
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
