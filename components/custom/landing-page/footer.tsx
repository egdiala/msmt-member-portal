import { IconDoubleArrow } from "@/components/icons";
import Link from "next/link";
import { LANDING_PAGE_LINKS } from "@/lib/constants";
import { RenderIf } from "@/components/shared";

const FooterHeading = ({ header }: { header: string }) => {
  return (
    <div className="grid gap-y-0.5">
      <h3 className="text-white font-bold text-lg md:text-xl">{header}</h3>

      <div className="flex items-center gap-x-1">
        <div className="w-10.5 h-1 rounded-xs bg-button-primary" />
        <div className="w-3 h-1 rounded-xs bg-button-primary" />
      </div>
    </div>
  );
};
export const Footer = () => {
  return (
    <footer className="bg-brand-bkg-1 pt-5 md:pt-10 lg:pt-25 pb-5 md:pb-6 grid gap-16 w-full">
      <div className="px-5 md:px-10 lg:px-25 grid md:flex grid-cols-2 gap-x-5 gap-y-8 justify-between">
        {LANDING_PAGE_LINKS.map((pageLink) => (
          <div className="grid gap-y-8 place-content-start" key={pageLink.id}>
            <div className="grid gap-y-6">
              <FooterHeading header={pageLink.header} />

              <div className="grid gap-y-4">
                {pageLink.links.map((actualLink) => (
                  <Link
                    key={actualLink.id}
                    className="flex gap-x-1 hover:underline hover:decoration-white hover:decoration-dotted"
                    href={actualLink.href}
                    target="_blank"
                  >
                    <IconDoubleArrow className="stroke-button-primary" />
                    <p className="text-white">{actualLink.name}</p>
                  </Link>
                ))}
              </div>
            </div>

            <RenderIf condition={!!pageLink.sub_section}>
              <div className="grid gap-y-6">
                <FooterHeading
                  header={pageLink?.sub_section?.header as string}
                />

                <div className="flex items-center gap-x-6">
                  {pageLink.sub_section?.links?.map((social) => (
                    <Link href={social.href} key={social.id}>
                      <social.icon className="stroke-brand-bkg-2" />
                    </Link>
                  ))}
                </div>
              </div>
            </RenderIf>
          </div>
        ))}
      </div>

      <div className="border-t border-blue-dark-100 pt-6 flex justify-center items-center flex-wrap px-5 text-white gap-x-1 text-xs">
        <p>
          Copyright (C) {new Date().getFullYear()} | All right reversed. Powered
          by
        </p>
        <Link
          href="https://nexenno.com"
          className="underline text-button-primary"
        >
          NEXENNO.COM
        </Link>
      </div>
    </footer>
  );
};
