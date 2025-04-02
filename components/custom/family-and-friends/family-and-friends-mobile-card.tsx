import Link from "next/link";

interface IFamilyAndFriendsMobileCard {
  id: number;
  date: string;
  time: string;
  name: string;
  email: string;
  relationship: string;
}
export const FamilyAndFriendsMobileCard = (
  person: IFamilyAndFriendsMobileCard
) => {
  return (
    <Link
      key={person.id}
      className="bg-input-field px-3 py-4 grid gap-y-2 rounded-sm"
      href={`/family-and-friends/${person.id}`}
    >
      <div className="flex items-center justify-between font-medium text-xs capitalize text-brand-1">
        <h3>{person.name}</h3>
        <p>{person.relationship}</p>
      </div>

      <div className="border-b border-divider"></div>

      <div className="grid gap-y-1 text-xs text-left">
        <p className="text-brand-2">{person.email}</p>
        <p className="text-brand-3">
          Added: {person.date} • {person.time}
        </p>
      </div>
    </Link>
  );
};
