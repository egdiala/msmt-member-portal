import Image from "next/image"

interface ProviderInfoProps {
  name: string
  title: string
  isMobile: boolean;
}

export default function ProviderInfo({ name, title, isMobile }: ProviderInfoProps) {
  return (
    <div className="absolute top-4 left-4 bg-[#F3F5F9] rounded-lg p-2 flex items-center gap-3">
      <Image
        src="/assets/provider.png"
        alt="Provider avatar"
        width={isMobile ? 32 : 44}
        height={isMobile ? 32 : 44}
        className="rounded-xl object-cover object-center"
      />
      <div className="text-sm gap-0.5">
        <div className="font-medium text-brand-1">{name}</div>
        <div className="text-xs text-brand-2">{title}</div>
      </div>
    </div>
  )
}

