import { Logo } from "./_components/logo";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-6">
      <Logo />
      {children}
    </div>
  );
}
