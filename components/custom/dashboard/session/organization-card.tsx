import Image from "next/image";

interface OrganizationCardProps {
organization:{
  name: string;
  type: string;
  avatar?: string;
}
}

export function OrganizationCard({
 organization
}: OrganizationCardProps) {
  return (
    <div className="bg-white p-3 md:p-4 grid gap-2 rounded-xl">
      <p className="text-sm md:text-base text-brand-1 font-medium md:font-semibold ">Your organisation</p>
      <div className="bg-blue-400 p-3 rounded-lg md:rounded-xs flex flex-row gap-3">
        <Image src={organization.avatar || '/assets/company-dummy.png'} alt="Organization Logo" width={48} height={48} className="object-cover"/>
        <div>
          <h3 className="font-semibold text-brand-1 capitalize">{organization.name}</h3>
          <p className="text-xs text-brand-2 capitalize">{organization.type}</p>
        </div>
      </div>
    </div>
  );
}
