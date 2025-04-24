"use client";

import { Dispatch, Fragment, SetStateAction, useState } from "react";
import { Drawer as DrawerPrimitive } from "vaul";
import { format } from "date-fns";
import {
  IconAudioLines,
  IconClose,
  IconListFilter,
  IconVideo,
} from "@/components/icons";
import {
  Button,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Drawer,
  DrawerPortal,
  DrawerClose,
  DrawerTitle,
  RadioGroup,
} from "@/components/ui";
import { RadioButton, RenderIf, SelectCmp } from "@/components/shared";
import { cn } from "@/lib/utils";
import { CalendarInput } from "../wallet/calendar-input";

const FilterContent = ({
  handleCloseFilter,
  setFilters,
  requestVariables,
  selectedService,
  setSelectedService,
  selectedCommunicationPreference,
  setSelectedCommunicationPreference,
  selectedProviderType,
  setSelectedProviderType,
  selectedApptDate,
  setSelectedApptDate,
}: {
  handleCloseFilter: () => void;
  setFilters: Dispatch<SetStateAction<any>>;
  requestVariables: any;
  selectedService: string;
  selectedCommunicationPreference: string;
  selectedProviderType: string;
  selectedApptDate: string;
  setSelectedService: Dispatch<SetStateAction<string>>;
  setSelectedCommunicationPreference: Dispatch<SetStateAction<string>>;
  setSelectedProviderType: Dispatch<SetStateAction<string>>;
  setSelectedApptDate: Dispatch<SetStateAction<string>>;
}) => {
  const communicationPreferences = ["Video", "Audio"];

  const handleApplyFilter = () => {
    setFilters({
      ...(selectedService
        ? {
            service_offer_id: requestVariables["service-offering"]?.filter(
              (val: { name: string }) => val?.name === selectedService
            )[0]?.service_offer_id,
          }
        : {}),
      ...(selectedProviderType
        ? {
            service_cat_id: requestVariables["service-category"]?.filter(
              (val: { name: string }) => val?.name === selectedProviderType
            )[0]?._id,
          }
        : {}),
      ...(selectedApptDate ? { appt_date: selectedApptDate } : {}),
      ...(selectedApptDate
        ? { time_zone: new Date().getTimezoneOffset()?.toString() }
        : {}),
      ...(selectedCommunicationPreference
        ? { comm_mode: selectedCommunicationPreference?.toLowerCase() }
        : {}),
    });
  };

  return (
    <div className="p-6 grid gap-y-5 w-full rounded-2xl">
      <h3 className="font-bold text-xl text-brand-1">Filter</h3>

      <div className="grid gap-y-8">
        <div className="grid gap-y-2">
          <h4 className="font-semibold text-sm text-brand-1">Services</h4>
          <SelectCmp
            value={selectedService}
            selectItems={requestVariables["service-offering"]?.map(
              (val: { service_offer_id: string; name: string }) => {
                return { id: val?.service_offer_id, value: val?.name };
              }
            )}
            onSelect={(val) => setSelectedService(val)}
            placeholder="Select Service"
          />
        </div>

        <div className="grid gap-y-2">
          <h4 className="font-semibold text-sm text-brand-1">Provider Type</h4>
          <RadioGroup className="flex items-center gap-2 flex-wrap">
            {requestVariables["service-category"]
              ?.map((val: { _id: string; name: string }) => {
                return { id: val?._id, value: val?.name };
              })
              ?.map((type: { id: string; value: string }) => (
                <div role="button"
                  key={type?.id}
                  onClick={() => setSelectedProviderType(type?.value)}
                >
                  <RadioButton
                    isActive={selectedProviderType === type?.value}
                    option={{
                      id: type?.id,
                      value: type?.value,
                      name: type?.value,
                    }}
                    className={cn(
                      "border rounded-full md:py-2 md:px-3 capitalize",
                      selectedProviderType === type?.value
                        ? "border-button-primary text-button-primary"
                        : "border-divider"
                    )}
                  />
                </div>
              ))}
          </RadioGroup>
        </div>

        <div className="grid gap-y-2">
          <h4 className="font-semibold text-sm text-brand-1">Date</h4>
          <CalendarInput
            value={
              selectedApptDate === "" ? undefined : new Date(selectedApptDate)
            }
            onChange={(date: any) => {
              setSelectedApptDate(format(date, "yyy-MM-dd"));
            }}
            label="Available date"
          />
        </div>

        <div className="grid gap-y-2">
          <h4 className="font-semibold text-sm text-brand-1">
            Communication Preference
          </h4>

          <div className="flex items-center gap-2 flex-wrap">
            {communicationPreferences.map((preference) => (
              <Button
                key={preference}
                variant="outline"
                className={cn(
                  "w-fit",
                  selectedCommunicationPreference === preference
                    ? "text-button-primary hover:text-button-primary border-button-primary bg-blue-400"
                    : "text-brand-2 hover:text-brand-2 border-divider bg-white"
                )}
                onClick={() => setSelectedCommunicationPreference(preference)}
                type="button"
              >
                <RenderIf condition={preference === "Video"}>
                  <IconVideo
                    className={
                      selectedCommunicationPreference === preference
                        ? "stroke-button-primary"
                        : "stroke-brand-3"
                    }
                  />
                </RenderIf>

                <RenderIf condition={preference === "Audio"}>
                  <IconAudioLines
                    className={
                      selectedCommunicationPreference === "Audio"
                        ? "stroke-button-primary"
                        : "stroke-brand-3"
                    }
                  />
                </RenderIf>

                {preference}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-8 grid grid-cols-2 gap-x-4">
        <Button
          variant="outline"
          className="border-blue-400 shadow-none"
          onClick={handleCloseFilter}
        >
          Close
        </Button>
        <Button onClick={handleApplyFilter}>Apply</Button>
      </div>
    </div>
  );
};

interface IFilterOrganisationsProvidersPopover {
  setFilters: Dispatch<SetStateAction<any>>;
  requestVariables: any;
  selectedService: string;
  selectedCommunicationPreference: string;
  selectedProviderType: string;
  selectedApptDate: string;
  setSelectedService: Dispatch<SetStateAction<string>>;
  setSelectedCommunicationPreference: Dispatch<SetStateAction<string>>;
  setSelectedProviderType: Dispatch<SetStateAction<string>>;
  setSelectedApptDate: Dispatch<SetStateAction<string>>;
}

export const FilterOrganisationsProvidersPopover = ({
  setFilters,
  requestVariables,
  selectedService,
  setSelectedService,
  selectedCommunicationPreference,
  setSelectedCommunicationPreference,
  selectedProviderType,
  setSelectedProviderType,
  selectedApptDate,
  setSelectedApptDate,
}: IFilterOrganisationsProvidersPopover) => {
  const [openPopover, setOpenPopover] = useState(false);
  const [openMobileDrawer, setOpenMobileDrawer] = useState(false);

  return (
    <Fragment>
      <div className="hidden md:inline-flex">
        <Popover
          open={openPopover}
          onOpenChange={() => setOpenPopover(!openPopover)}
        >
          <PopoverTrigger asChild onClick={() => setOpenPopover(true)}>
            <Button
              variant="secondary"
              className="px-2 md:px-3 py-2 shadow-none"
            >
              <IconListFilter className="stroke-brand-btn-secondary" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            sideOffset={10}
            className="md:w-100 xl:w-144 relative right-45 xl:right-18 border-none shadow-modal-shadow bg-white hidden md:flex p-0"
          >
            <FilterContent
              handleCloseFilter={() => setOpenPopover(false)}
              setFilters={setFilters}
              requestVariables={requestVariables}
              selectedService={selectedService}
              selectedCommunicationPreference={selectedCommunicationPreference}
              selectedProviderType={selectedProviderType}
              selectedApptDate={selectedApptDate}
              setSelectedService={setSelectedService}
              setSelectedCommunicationPreference={
                setSelectedCommunicationPreference
              }
              setSelectedProviderType={setSelectedProviderType}
              setSelectedApptDate={setSelectedApptDate}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="md:hidden">
        <Button
          variant="secondary"
          className="px-2 md:px-3 py-2 shadow-none"
          onClick={() => setOpenMobileDrawer(true)}
        >
          <IconListFilter className="stroke-brand-btn-secondary" />
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
                className="stroke-text-tertiary hover:stroke-white hover:bg-button-primary hover:rounded-full hover: p-2 absolute top-2 right-2"
              >
                <IconClose />
              </DrawerClose>

              <FilterContent
                handleCloseFilter={() => setOpenMobileDrawer(false)}
                setFilters={setFilters}
                requestVariables={requestVariables}
                selectedService={selectedService}
                selectedCommunicationPreference={
                  selectedCommunicationPreference
                }
                selectedProviderType={selectedProviderType}
                selectedApptDate={selectedApptDate}
                setSelectedService={setSelectedService}
                setSelectedCommunicationPreference={
                  setSelectedCommunicationPreference
                }
                setSelectedProviderType={setSelectedProviderType}
                setSelectedApptDate={setSelectedApptDate}
              />
            </DrawerPrimitive.Content>
          </DrawerPortal>
        </Drawer>
      </div>
    </Fragment>
  );
};
