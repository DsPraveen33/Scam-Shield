import { Shield, CheckCircle, Search, AlertTriangle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl font-display">
            <Shield className="h-6 w-6 fill-primary/20" />
            <span>FAKE JOBS DETECTOR</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => window.location.href = "/api/login"}>Sign In</Button>
            <Button onClick={() => window.location.href = "/api/login"}>Get Started</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 -z-10" />
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8 border border-primary/20">
            <Shield className="w-4 h-4" />
            <span>Advanced AI Fraud Detection</span>
          </div>
          
          <h1 className="font-display text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
            Is that job offer <span className="text-gradient">real or fake?</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            Protect yourself from recruitment scams. Scan job links and offer letters instantly with our AI-powered detection engine.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="h-14 px-8 text-lg rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-transform" onClick={() => window.location.href = "/api/login"}>
              Start Scanning Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="h-14 px-8 text-lg rounded-full bg-white/50 backdrop-blur-sm">
              View Live Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">URL Analysis</h3>
              <p className="text-muted-foreground">Instantly checks domains against known blacklists and suspicious patterns to detect fake career sites.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Keyword Detection</h3>
              <p className="text-muted-foreground">Scans offer letters for high-risk language, payment requests, and urgency tactics used by scammers.</p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3 font-display">Risk Scoring</h3>
              <p className="text-muted-foreground">Get a comprehensive 0-100 safety score with detailed reasoning so you can apply with confidence.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section (Unsplash Image) */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Abstract security background */}
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
          alt="Cybersecurity background"
          className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay"
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold font-display mb-8">Trusted by Job Seekers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
            {/* Logos represented by text for simplicity */}
            <div className="text-xl font-bold font-mono">LOCKED.INC</div>
            <div className="text-xl font-bold font-mono">SECURE.JOBS</div>
            <div className="text-xl font-bold font-mono">VERIFIED</div>
            <div className="text-xl font-bold font-mono">SAFE.HIRE</div>
          </div>
        </div>
      </section>

      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">© 2026 FAKE JOBS DETECTOR. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#" className="hover:text-primary">Privacy</a>
            <a href="#" className="hover:text-primary">Terms</a>
            <a href="#" className="hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
