import Image from "next/image";

interface OrganizationCardProps {
organization:{
  name: string;
  type: string;
}
}

export function OrganizationCard({
 organization
}: OrganizationCardProps) {
  return (
    <div className="bg-white p-3 md:p-4 grid gap-2">
      <p className="text-sm mb-2">Your organisation</p>
      <div className="bg-blue-400 p-3 rounded-lg md:rounded-xs flex flex-col gap-3">
        <Image src={'/assets/company-dummy.png'} alt="Organization Logo" width={44} height={44}/>
        <div>
          <h3 className="font-semibold text-brand-1">{organization.name}</h3>
          <p className="text-xs text-brand-2">{organization.type}</p>
        </div>
      </div>
    </div>
  );
}
