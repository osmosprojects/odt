import { ShieldCheck, Lock, HelpCircle } from "lucide-react";

const trustItems = [
  { icon: ShieldCheck, label: "Your security is our priority" },
  { icon: Lock, label: "Protected by Castrol Security" },
  { icon: HelpCircle, label: "Need help? Contact Support" },
];

export default function LoginFooter() {
  return (
    <footer>
      <div className="bg-primary text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-2 sm:gap-6 text-xs">
          {trustItems.map((item) => (
            <span key={item.label} className="flex items-center gap-2">
              <item.icon size={14} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white py-3 px-4 text-center text-[11px] text-brand-gray">
        <span>&copy; 2024 Castrol India Limited. All rights reserved.</span>{" "}
        <a href="#" className="hover:text-primary">
          Privacy Statement
        </a>{" "}
        &middot;{" "}
        <a href="#" className="hover:text-primary">
          Legal Notice
        </a>{" "}
        &middot;{" "}
        <a href="#" className="hover:text-primary">
          Contact Us
        </a>
      </div>
    </footer>
  );
}
