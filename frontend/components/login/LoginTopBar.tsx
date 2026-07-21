import { Globe, LifeBuoy } from "lucide-react";
import Image from "next/image";

export default function LoginTopBar() {
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-8 bg-white border-b border-gray-100">
      <Image
        src="/icons/castrol_logo.png"
        alt="Castrol Logo"
        width={120}
        height={32}
        className="h-8 w-auto object-contain"
        priority
      />
      <div className="flex items-center gap-4 sm:gap-6 text-sm text-brand-gray">
        <button className="hidden sm:flex items-center gap-1.5 hover:text-brand-dark">
          <Globe size={16} />
          English
        </button>
        <button className="flex items-center gap-1.5 hover:text-brand-dark">
          <LifeBuoy size={16} />
          <span className="hidden sm:inline">Help &amp; Support</span>
        </button>
      </div>
    </header>
  );
}
