import type { ReactNode } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnchorReturn } from "@/components/ui/anchor-return";
import type { AnchorReturnControls } from "@/hooks/useSpaLinkInterceptor";

type AppShellProps = {
  children: ReactNode;
  anchorReturn?: AnchorReturnControls;
};

export function AppShell({ children, anchorReturn }: AppShellProps) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 app-texture" aria-hidden="true" />
      <Header />
      <main id="main-content" className="relative flex-1 pt-[90px] lg:pt-[130px] pb-0">
        {children}
      </main>
      <Footer />
      {anchorReturn ? (
        <AnchorReturn active={anchorReturn.state.active} onReturn={anchorReturn.returnToPrevious} />
      ) : null}
    </div>
  );
}
