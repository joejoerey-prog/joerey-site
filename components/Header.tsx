import JRLogo from "@/components/ui/JRLogo";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
      <JRLogo className="h-12 w-auto text-white" />
    </header>
  );
}