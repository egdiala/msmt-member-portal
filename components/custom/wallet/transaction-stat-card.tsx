import { RenderIf } from "@/components/shared";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ITransactionStatCard {
  title: string;
  value: string;
  className: string;
  href?: string;
  hideCurrency?: boolean;
}

const CardContent = ({
  title,
  value,
  hideCurrency = false,
}: {
  title: string;
  value: string;
  hideCurrency?: boolean;
}) => {
  return (
    <>
      <h4 className="text-sm text-brand-2">{title}</h4>
      <p className="text-2xl text-text-bg-1 font-medium md:font-normal">
        <RenderIf condition={!hideCurrency}>₦</RenderIf>
        {value}
      </p>
    </>
  );
};

export const TransactionStatCard = ({
  title,
  value,
  className,
  href,
  hideCurrency,
}: ITransactionStatCard) => {
  const cardStyle =
    "justify-center items-center py-5 flex flex-col gap-y-1 rounded-lg";
  return (
    <>
      <RenderIf condition={!href}>
        <div className={cn(cardStyle, className)}>
          <CardContent
            title={title}
            value={value}
            hideCurrency={hideCurrency}
          />
        </div>
      </RenderIf>

      <RenderIf condition={!!href}>
        <Link
          href={href as string}
          className={cn("cursor-pointer", cardStyle, className)}
        >
          <CardContent
            title={title}
            value={value}
            hideCurrency={hideCurrency}
          />
        </Link>
      </RenderIf>
    </>
  );
};
