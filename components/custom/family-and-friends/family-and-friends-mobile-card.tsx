import Link from "next/link";
import { FetchedFamilyAndFriendType } from "@/types/family-and-friends";
import { useFormatTableDate } from "@/hooks/use-format-table-info";

export const FamilyAndFriendsMobileCard = (
  person: FetchedFamilyAndFriendType
) => {
  return (
    <Link
      key={person.familyfriend_id}
      className="bg-input-field px-3 py-4 grid gap-y-2 rounded-sm"
      href={`/family-and-friends/${person.familyfriend_id}`}
    >
      <div className="flex items-center justify-between font-medium text-xs capitalize text-brand-1">
        <h3 className="capitalize">
          {person.first_name} {person.last_name}
        </h3>
        <p>{person.relationship}</p>
      </div>

      <div className="border-b border-divider"></div>

      <div className="grid gap-y-1 text-xs text-left">
        <p className="text-brand-2">{person.email}</p>
        <p className="text-brand-3">
          Added: {useFormatTableDate(person.createdAt)}
        </p>
      </div>
    </Link>
  );
};
