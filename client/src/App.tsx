import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import NotFound from "@/pages/not-found";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroSlideshow } from "@/components/intro/IntroSlideshow";

import Home from "@/pages/home";
import OurApproach from "@/pages/our-approach";
import OurTeam from "@/pages/our-team";
import Services from "@/pages/services";
import Contact from "@/pages/contact";
import ClientArea from "@/pages/client-area";
import ClientIntake from "@/pages/client-intake";
import IntakeBasic from "@/pages/intake/intake-basic";
import IntakeDivorce from "@/pages/intake/intake-divorce";
import Admin from "@/pages/admin";
import IntakeSubmissions from "@/pages/admin/intake-submissions";

function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const pageTransition = {
  duration: 0.3,
  ease: [0.4, 0, 0.2, 1] as const
};

function AnimatedRoutes() {
  const [location] = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        <Switch location={location}>
          <Route path="/" component={Home} />
          <Route path="/our-approach" component={OurApproach} />
          <Route path="/our-team" component={OurTeam} />
          <Route path="/services" component={Services} />
          <Route path="/contact" component={Contact} />
          <Route path="/client-area" component={ClientArea} />
          <Route path="/client-intake" component={ClientIntake} />
          <Route path="/intake/basic" component={IntakeBasic} />
          <Route path="/intake/divorce" component={IntakeDivorce} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/intake-submissions" component={IntakeSubmissions} />
          <Route component={NotFound} />
        </Switch>
      </motion.div>
    </AnimatePresence>
  );
}

function Router() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <div className="flex flex-col min-h-screen font-sans antialiased text-foreground bg-background">
      {!introDone && (
        <IntroSlideshow
          logoSrc="/brand/logo-black.png"
          onComplete={() => setIntroDone(true)}
          showOncePerSession={true}
        />
      )}

      {introDone && (
        <>
          <ScrollToTop />
          <Header />
          <main className="flex-grow pt-[72px]">
            <AnimatedRoutes />
          </main>
          <Footer />
        </>
      )}
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
