import { IconPlus, IconStarFull } from "@/components/icons";
import { BreadcrumbCmp } from "@/components/shared";
import { Avatar, AvatarImage, Button } from "@/components/ui";

const SingleIndividualProvider = () => {
  const providerInfo = [
    {
      id: 1,
      title: "About",
      value:
        "Has 0 years of professional experience with 3 publications and 3 certifications",
    },
    {
      id: 2,
      title: "Special Training",
      value: "Psychotherapy (Cognitive Behavioural Therapy)",
    },
    {
      id: 3,
      title: "Diagnosis Preference",
      value: "Mood problems and emotional distress",
    },
  ];

  return (
    <div className="grid gap-y-2">
      <BreadcrumbCmp
        breadcrumbItems={[
          { id: 1, name: "Providers", href: "/providers" },
          { id: 2, name: "Jide Kosoko" },
        ]}
      />

      <div className="bg-white rounded-2xl p-6 gap-y-5">
        <div className="rounded-lg bg-blue-400 p-3 flex gap-x-3">
          <Avatar className="w-39 h-39 rounded-sm">
            <AvatarImage
              className="object-cover"
              src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            />
          </Avatar>

          <div className="grid gap-y-3 w-full">
            <div className="grid gap-y-1">
              <h3 className="text-xl font-bold text-brand-1">Jide Kosoko</h3>
              <p className="text-brand-2">Psychologist</p>
              <div className="flex items-center gap-x-1 text-sm text-brand-1">
                <IconStarFull className="fill-actions-amber size-5" />
                4.5
              </div>
            </div>

            <div className="border-t border-divider"></div>

            <div className="flex items-center justify-between">
              <Button variant="ghost" className="p-0 font-semibold">
                <IconStarFull className="stroke-brand-btn-secondary size-4" />
                Mark as Favourite
              </Button>

              <Button>
                <IconPlus className="stroke-white" />
                Book An Appointment
              </Button>
            </div>
          </div>
        </div>

        <div className="border border-divider rounded-lg px-5 py-4 grid gap-y-5">
          {providerInfo.map((info) => (
            <div key={info.id} className="grid gap-y-2">
              <p className="text-sm text-brand-2">{info.title}</p>
              <p className="text-brand-1">{info.value}</p>
            </div>
          ))}
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default SingleIndividualProvider;
