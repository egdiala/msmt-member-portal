import Image from "next/image"

interface ProviderInfoProps {
  name: string
  title: string
}

export default function ProviderInfo({ name, title }: ProviderInfoProps) {
  return (
    <div className="absolute top-4 left-4 bg-white/80 rounded-lg p-2 flex items-center gap-2">
      <Image
        src="/placeholder.svg?height=32&width=32"
        alt="Provider avatar"
        width={32}
        height={32}
        className="rounded-full"
      />
      <div className="text-xs">
        <div className="font-medium">{name}</div>
        <div className="text-gray-600">{title}</div>
      </div>
    </div>
  )
}

