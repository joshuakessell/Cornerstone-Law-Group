import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import { useEffect } from "react";

import Home from "@/pages/home";
import OurApproach from "@/pages/our-approach";
import OurTeam from "@/pages/our-team";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import ClientArea from "@/pages/client-area";
import ClientIntake from "@/pages/client-intake";
import Admin from "@/pages/admin";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function Router() {
  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-foreground bg-background">
      <ScrollToTop />
      <Header />
      <main className="flex-grow pt-[72px]"> {/* pt to account for fixed header */}
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/our-approach" component={OurApproach} />
          <Route path="/our-team" component={OurTeam} />
          <Route path="/services" component={Services} />
          <Route path="/contact" component={Contact} />
          <Route path="/client-area" component={ClientArea} />
          <Route path="/client-intake" component={ClientIntake} />
          <Route path="/admin" component={Admin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <Router />
    </QueryClientProvider>
  );
}

export default App;
