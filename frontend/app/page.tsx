import LoginTopBar from "@/components/login/LoginTopBar";
import LoginHero from "@/components/login/LoginHero";
import LoginForm from "@/components/login/LoginForm";
import LoginFooter from "@/components/login/LoginFooter";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LoginTopBar />

        <main className="flex-1 min-h-[50vh] grid grid-cols-1 lg:grid-cols-[4fr_2fr] ">
           <LoginHero />

        <div className="flex items-center justify-center px-4 sm:px-8 py-10 lg:py-16 bg-[#f4f6f8] lg:bg-white">
          <LoginForm />
        </div>
      </main>

      <LoginFooter />
    </div>
  );
}
