import Image from "next/image";
import { useTranslations } from "next-intl";

interface Host {
  name: string;
  avatarUrl: string;
  joinDate: string;
  isSuperhost?: boolean;
}

interface HostProfileProps {
  host: Host;
}

export default function HostProfile({ host }: HostProfileProps) {
  const t = useTranslations("camperDetails");

  return (
    <div className="flex items-center gap-4 py-6 border-t">
      <div className="relative w-14 h-14 rounded-full overflow-hidden">
        <Image
          src={host.avatarUrl}
          alt={host.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg text-gray-900">{t("hostedBy", { hostName: host.name })}</span>
        <span className="text-sm text-gray-600">{t("joinedIn", { joinDate: host.joinDate })}</span>
        {host.isSuperhost && (
          <span className="text-xs text-indigo-600 font-semibold mt-1">{t("superhost")}</span>
        )}
      </div>
    </div>
  );
}
