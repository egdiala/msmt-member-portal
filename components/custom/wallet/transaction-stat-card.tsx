import { RenderIf } from "@/components/shared";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ITransactionStatCard {
  title: string;
  value: string;
  className: string;
  href?: string;
}

const CardContent = ({ title, value }: { title: string; value: string }) => {
  return (
    <>
      <h4 className="text-xs md:text-sm text-brand-2">{title}</h4>
      <p className="text-sm md:text-2xl text-text-bg-1 font-medium md:font-normal">
        ₦{value}
      </p>
    </>
  );
};

export const TransactionStatCard = ({
  title,
  value,
  className,
  href,
}: ITransactionStatCard) => {
  const cardStyle =
    "justify-center items-center py-5 flex flex-col gap-y-1 rounded-sm md:rounded-lg";
  return (
    <>
      <RenderIf condition={!href}>
        <div className={cn(cardStyle, className)}>
          <CardContent title={title} value={value} />
        </div>
      </RenderIf>

      <RenderIf condition={!!href}>
        <Link
          href={href as string}
          className={cn("cursor-pointer", cardStyle, className)}
        >
          <CardContent title={title} value={value} />
        </Link>
      </RenderIf>
    </>
  );
};
