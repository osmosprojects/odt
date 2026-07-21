export default function Footer() {
  return (
    <footer className="pb-16 lg:pb-0 pt-6 px-1 text-center text-xs text-brand-gray">
      <p>
        &copy; {new Date().getFullYear()} Castrol Limited. All rights
        reserved.
      </p>
      <p className="mt-1">
        <a href="#" className="hover:text-primary">
          Privacy Policy
        </a>{" "}
        &middot;{" "}
        <a href="#" className="hover:text-primary">
          Terms of Use
        </a>{" "}
        &middot;{" "}
        <a href="#" className="hover:text-primary">
          Support
        </a>
      </p>
    </footer>
  );
}
