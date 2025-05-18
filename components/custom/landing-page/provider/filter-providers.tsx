"use client";

import { Fragment, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { format } from "date-fns";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconClose, IconFilter } from "@/components/icons";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerPortal,
  DrawerClose,
  DrawerTitle,
} from "@/components/ui";
import { SelectCmp } from "@/components/shared";
import { DatePickerField } from "@/components/shared/date-picker-field";
import { cn, createQueryString } from "@/lib/utils";

const FilterContent = (filter: {
  handleApplyMobile?: () => void;
  apptDate: string;
  setApptDate: (val: string) => void;
  providerType: string;
  setProviderType: (val: string) => void;
  specificService: string;
  setSpecificService: (val: string) => void;
  priceRange: string;
  setPriceRange: (val: string) => void;
  gender: string;
  setGender: (val: string) => void;
  language: string;
  setLanguage: (val: string) => void;
  religion: string;
  setReligion: (val: string) => void;
  communicationPreference: string;
  setCommunicationPreference: (val: string) => void;
  handleClose: () => void;
  handleApplyFilter: () => void;
  requestVariables: any;
}) => {
  return (
    <>
      <h4 className="font-bold mb-4 text-brand-1">Filter </h4>

      <div className="grid gap-y-4 w-full">
        <DatePickerField
          value={filter.apptDate === "" ? undefined : new Date(filter.apptDate)}
          onChange={(date: any) => {
            filter.setApptDate(format(date, "yyy-MM-dd"));
          }}
          label={"Available date"}
          disableDatesBeforeToday
        />

        <SelectCmp
          selectItems={[
            { id: 1, value: "Provider" },
            { id: 2, value: "Organization" },
          ]}
          value={filter.providerType}
          onSelect={(val) => filter.setProviderType(val)}
          placeholder={"Provider type"}
        />

        <SelectCmp
          selectItems={filter.requestVariables?.["service-offering"]?.map(
            (val: { service_offer_id: string; name: string }) => {
              return { id: val?.service_offer_id, value: val?.name };
            }
          )}
          value={filter.specificService}
          onSelect={(val) => filter.setSpecificService(val)}
          placeholder={"Specific service"}
        />

        <SelectCmp
          selectItems={filter.requestVariables?.["booking-prices"]?.map(
            (val: { name: string }, index: number) => {
              return {
                id: index,
                value: val?.name,
              };
            }
          )}
          value={filter.priceRange}
          onSelect={(val) => filter.setPriceRange(val)}
          placeholder={"Price range"}
        />

        <SelectCmp
          selectItems={[
            { id: 1, value: "Male" },
            { id: 2, value: "Female" },
          ]}
          value={filter.gender}
          onSelect={(val) => filter.setGender(val)}
          placeholder={"Gender"}
        />

        <SelectCmp
          selectItems={filter.requestVariables?.["preferred-lan"]?.map(
            (val: string) => {
              return {
                id: val,
                value: val,
              };
            }
          )}
          value={filter.language}
          onSelect={(val) => filter.setLanguage(val)}
          placeholder={"Language"}
        />

        <SelectCmp
          selectItems={filter.requestVariables?.["religion-list"]?.map(
            (val: string) => {
              return {
                id: val,
                value: val,
              };
            }
          )}
          value={filter.religion}
          onSelect={(val) => filter.setReligion(val)}
          placeholder={"Religion"}
        />

        <SelectCmp
          selectItems={[
            { id: 1, value: "Audio" },
            { id: 2, value: "Video" },
          ]}
          value={filter.communicationPreference}
          onSelect={(val) => filter.setCommunicationPreference(val)}
          placeholder={"Communication preference"}
        />
      </div>

      <div className="pt-8 gap-x-4 grid grid-cols-2">
        <Button variant="outline" onClick={filter.handleClose}>
          Close
        </Button>

        <Button
          onClick={() => {
            filter.handleApplyFilter();

            if (filter.handleApplyMobile) {
              filter.handleApplyMobile();
            }
          }}
        >
          Apply
        </Button>
      </div>
    </>
  );
};
export const FilterLandingPageProvidersPopover = ({
  requestVariables,
}: {
  requestVariables: any;
}) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [apptDate, setApptDate] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [specificService, setSpecificService] = useState("");
  const [providerType, setProviderType] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [religion, setReligion] = useState("");
  const [communicationPreference, setCommunicationPreference] = useState("");

  const applyFilter = () => {
    const data = {
      ...(apptDate ? { appt_date: format(apptDate, "yyyy-MM-dd") } : {}),
      ...(providerType ? { provider_type: providerType?.toLowerCase() } : {}),
      ...(specificService ? { service: specificService } : {}),
      ...(priceRange ? { amount: priceRange } : {}),
      ...(gender ? { gender } : {}),
      ...(language ? { language } : {}),
      ...(religion ? { religion } : {}),
      ...(communicationPreference
        ? { comm_mode: communicationPreference }
        : {}),
    };

    const search = searchParams.get("q");
    router.push(
      `${pathname}${createQueryString(data)}${search ? `&q=${search}` : ""}`
    );
    setOpenPopover(false);
  };

  return (
    <Fragment>
      <div className="hidden md:inline-flex">
        <Popover
          open={openPopover}
          onOpenChange={() => setOpenPopover(!openPopover)}
        >
          <PopoverTrigger asChild onClick={() => setOpenPopover(true)}>
            <Button className="!px-3 !py-5">
              <IconFilter className="stroke-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            className="w-94 h-160 overflow-y-scroll pb-10 relative border-none shadow-modal-shadow bg-white hidden md:grid p-4 right-0 "
          >
            <FilterContent
              handleClose={() => {
                console.log("I just clicked close......");
                // setOpenPopover(false);
              }}
              handleApplyFilter={applyFilter}
              apptDate={apptDate}
              setApptDate={setApptDate}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              language={language}
              setLanguage={setLanguage}
              gender={gender}
              setGender={setGender}
              providerType={providerType}
              setProviderType={setProviderType}
              specificService={specificService}
              setSpecificService={setSpecificService}
              religion={religion}
              setReligion={setReligion}
              communicationPreference={communicationPreference}
              setCommunicationPreference={setCommunicationPreference}
              requestVariables={requestVariables}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:hidden">
        <Button
          className="!px-3 !py-5"
          onClick={() => setOpenMobileDrawer(true)}
        >
          <IconFilter className="stroke-white" />
        </Button>

        <Drawer
          open={openMobileDrawer}
          onOpenChange={() => setOpenMobileDrawer(!openMobileDrawer)}
        >
          <DrawerPortal>
            <DrawerPrimitive.Content
              className={cn(
                "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
                "data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-none data-[vaul-drawer-direction=top]:border-b",
                "data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-none data-[vaul-drawer-direction=bottom]:border-t",
                "data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm",
                "data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm",
                "min-h-full md:hidden"
              )}
            >
              <DrawerTitle className="hidden"></DrawerTitle>

              <DrawerClose
                onClick={() => setOpenMobileDrawer(false)}
                className="stroke-text-tertiary hover:stroke-white hover:bg-button-primary hover:rounded-full hover:p-2 absolute top-2 right-2"
              >
                <IconClose />
              </DrawerClose>

              <div className="px-4 py-4">
                <FilterContent
                  handleClose={() => {
                    console.log("I am closing......");
                    // setOpenPopover(false);
                  }}
                  handleApplyFilter={applyFilter}
                  apptDate={apptDate}
                  setApptDate={setApptDate}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  language={language}
                  setLanguage={setLanguage}
                  gender={gender}
                  setGender={setGender}
                  providerType={providerType}
                  setProviderType={setProviderType}
                  specificService={specificService}
                  setSpecificService={setSpecificService}
                  religion={religion}
                  setReligion={setReligion}
                  communicationPreference={communicationPreference}
                  setCommunicationPreference={setCommunicationPreference}
                  requestVariables={requestVariables}
                />
              </div>
            </DrawerPrimitive.Content>
          </DrawerPortal>
        </Drawer>
      </div>
    </Fragment>
  );
};
