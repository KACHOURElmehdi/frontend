'use client';

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { 
  ArrowRight, 
  CheckCircle2, 
  Upload, 
  FileSearch, 
  Brain,
  Sparkles,
  Shield,
  Zap,
  BarChart3,
  Globe,
  Clock,
  Users,
  Star,
  ChevronRight,
  Play,
  FileText,
  Tag,
  Folder,
  LayoutDashboard
} from "lucide-react";

export default function Home() {
  const { isAuthenticated, user, loading } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">DocClassifier</span>
            </Link>
            
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                How it Works
              </Link>
              <Link href="#pricing" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                Pricing
              </Link>
              <Link href="#faq" className="text-sm text-foreground-secondary hover:text-foreground transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center gap-3">
              {loading ? (
                <div className="w-24 h-9 bg-secondary rounded-lg animate-pulse" />
              ) : isAuthenticated ? (
                <>
                  <span className="text-sm text-foreground-muted hidden sm:inline">
                    Welcome, <span className="text-foreground font-medium">{user?.fullName || 'User'}</span>
                  </span>
                  <Link href="/dashboard">
                    <Button variant="gradient" size="sm" rightIcon={<LayoutDashboard className="w-4 h-4" />}>
                      Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm">Sign In</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 mesh-gradient" />
        <div className="absolute inset-0 dot-pattern opacity-30" />
        
        {/* Floating Elements */}
        <div className="absolute top-40 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-down">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">AI-Powered Document Intelligence</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up">
              <span className="text-foreground">Transform Documents</span>
              <br />
              <span className="gradient-text">Into Organized Knowledge</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-foreground-secondary max-w-2xl mx-auto mb-10 animate-fade-up stagger-1">
              Automatically classify, extract, and organize your documents with cutting-edge AI. 
              Say goodbye to manual sorting and hello to intelligent document management.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-fade-up stagger-2">
              <Link href="/register">
                <Button size="xl" variant="gradient" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Start Free Trial
                </Button>
              </Link>
              <Button size="xl" variant="outline" leftIcon={<Play className="w-5 h-5" />}>
                Watch Demo
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 text-foreground-muted animate-fade-up stagger-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <span className="text-sm">Cancel anytime</span>
              </div>
            </div>
          </div>

          {/* Hero Image / Product Preview */}
          <div className="mt-20 relative animate-fade-up stagger-4">
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-5xl">
              <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
                {/* Browser Chrome */}
                <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-error/60" />
                    <div className="w-3 h-3 rounded-full bg-warning/60" />
                    <div className="w-3 h-3 rounded-full bg-success/60" />
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="px-4 py-1 rounded-md bg-background text-xs text-foreground-muted">
                      app.docclassifier.io/dashboard
                    </div>
                  </div>
                </div>
                {/* Dashboard Preview */}
                <div className="p-6 bg-background-secondary">
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Total Documents', value: '2,847', icon: FileText, color: 'primary' },
                      { label: 'Processed', value: '2,651', icon: CheckCircle2, color: 'success' },
                      { label: 'Categories', value: '12', icon: Folder, color: 'accent' },
                      { label: 'Tags Extracted', value: '8,432', icon: Tag, color: 'info' },
                    ].map((stat, i) => (
                      <div key={i} className="bg-card rounded-xl p-4 border border-border">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-foreground-muted">{stat.label}</span>
                          <stat.icon className={`w-4 h-4 text-${stat.color}`} />
                        </div>
                        <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 bg-card rounded-xl p-4 border border-border h-48" />
                    <div className="bg-card rounded-xl p-4 border border-border h-48" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos Section */}
      <section className="py-16 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-foreground-muted mb-8">
            Trusted by innovative teams worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-50">
            {['Acme Inc', 'Globex', 'Initech', 'Umbrella', 'Hooli', 'Pied Piper'].map((company) => (
              <div key={company} className="text-xl font-bold text-foreground-muted">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <span className="text-sm font-medium text-accent">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              From Upload to Insight in Seconds
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Our AI-powered pipeline processes your documents automatically, extracting valuable information and organizing them intelligently.
            </p>
          </div>

          {/* Process Steps */}
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                icon: Upload,
                title: 'Upload',
                description: 'Drag & drop your documents. We support PDF, images, and more.',
                color: 'primary'
              },
              {
                step: '02',
                icon: FileSearch,
                title: 'OCR Processing',
                description: 'Our OCR engine extracts text from any document format.',
                color: 'info'
              },
              {
                step: '03',
                icon: Brain,
                title: 'AI Classification',
                description: 'Machine learning models categorize and tag your documents.',
                color: 'accent'
              },
              {
                step: '04',
                icon: Sparkles,
                title: 'Results',
                description: 'Access organized documents with extracted metadata.',
                color: 'success'
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 3 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-border to-transparent" />
                )}
                
                <div className="relative z-10 text-center">
                  <div className={`inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-${item.color}/10 border border-${item.color}/20 mb-6`}>
                    <item.icon className={`w-10 h-10 text-${item.color}`} />
                  </div>
                  <div className="text-xs font-bold text-foreground-muted mb-2">STEP {item.step}</div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                  <p className="text-foreground-secondary">{item.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Animated Demo */}
          <div className="mt-20 relative">
            <div className="max-w-4xl mx-auto bg-card rounded-2xl border border-border p-8 shadow-xl">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0 w-32 h-40 bg-muted rounded-lg flex items-center justify-center border-2 border-dashed border-border">
                  <FileText className="w-12 h-12 text-foreground-muted" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-success rounded-full" />
                    </div>
                    <span className="text-sm text-success font-medium">OCR Complete</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-success/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-success rounded-full" />
                    </div>
                    <span className="text-sm text-success font-medium">Classified</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                    <div className="flex-1">
                      <div className="h-2 bg-primary/30 rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-primary rounded-full animate-pulse" />
                      </div>
                    </div>
                    <span className="text-sm text-primary font-medium">Extracting Tags...</span>
                  </div>
                </div>
                <div className="flex-shrink-0 space-y-2">
                  <div className="px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">Invoice</div>
                  <div className="px-3 py-1 bg-accent/10 text-accent text-xs font-medium rounded-full">Finance</div>
                  <div className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">98% Conf</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm font-medium text-primary">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Document Intelligence
            </h2>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto">
              Powerful features designed to streamline your document workflow and boost productivity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Classification',
                description: 'Advanced machine learning models automatically categorize documents with high accuracy.',
              },
              {
                icon: FileSearch,
                title: 'Smart OCR',
                description: 'Extract text from any document format including scanned PDFs and images.',
              },
              {
                icon: Tag,
                title: 'Auto Tagging',
                description: 'Automatically extract entities, dates, amounts, and key information.',
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Real-time insights into your document processing and classification metrics.',
              },
              {
                icon: Globe,
                title: 'API Access',
                description: 'RESTful API for seamless integration with your existing workflows.',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Bank-level encryption and compliance with GDPR, SOC 2, and HIPAA.',
              },
              {
                icon: Clock,
                title: 'Real-time Processing',
                description: 'Watch your documents get processed with live SSE updates.',
              },
              {
                icon: Users,
                title: 'Team Collaboration',
                description: 'Invite team members and manage permissions across your organization.',
              },
              {
                icon: Zap,
                title: 'Instant Search',
                description: 'Full-text search across all your documents and extracted content.',
              },
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group p-6 bg-card rounded-2xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-foreground-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 border border-success/20 mb-4">
              <Star className="w-4 h-4 text-success" />
              <span className="text-sm font-medium text-success">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Loved by Teams Worldwide
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "DocClassifier has completely transformed how we handle our invoice processing. What used to take hours now takes minutes.",
                author: "Sarah Chen",
                role: "CFO at TechStart",
                avatar: "SC"
              },
              {
                quote: "The accuracy of the AI classification is incredible. It correctly categorizes 98% of our documents without any training.",
                author: "Michael Rodriguez",
                role: "Operations Director",
                avatar: "MR"
              },
              {
                quote: "Finally, a document management solution that actually uses AI the right way. The real-time processing is a game-changer.",
                author: "Emily Watson",
                role: "Head of Legal",
                avatar: "EW"
              },
            ].map((testimonial, index) => (
              <div key={index} className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-foreground-secondary mb-6">"{testimonial.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{testimonial.author}</p>
                    <p className="text-sm text-foreground-muted">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 lg:py-32 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 mb-4">
              <span className="text-sm font-medium text-accent">Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-foreground-secondary">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                price: '$0',
                description: 'Perfect for trying out DocClassifier',
                features: ['100 documents/month', 'Basic OCR', '5 categories', 'Email support'],
                cta: 'Get Started',
                variant: 'outline' as const,
              },
              {
                name: 'Pro',
                price: '$49',
                description: 'For growing teams and businesses',
                features: ['5,000 documents/month', 'Advanced OCR', 'Unlimited categories', 'API access', 'Priority support'],
                cta: 'Start Free Trial',
                variant: 'gradient' as const,
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                description: 'For large organizations',
                features: ['Unlimited documents', 'Custom AI models', 'SSO & SAML', 'Dedicated support', 'SLA guarantee'],
                cta: 'Contact Sales',
                variant: 'outline' as const,
              },
            ].map((plan, index) => (
              <div 
                key={index} 
                className={`relative p-8 bg-card rounded-2xl border ${plan.popular ? 'border-primary shadow-lg shadow-primary/10' : 'border-border'}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                      Most Popular
                    </div>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    {plan.price !== 'Custom' && <span className="text-foreground-muted">/month</span>}
                  </div>
                  <p className="text-sm text-foreground-muted mt-2">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground-secondary">
                      <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant={plan.variant} className="w-full">
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: 'What document formats are supported?',
                a: 'We support PDF, JPEG, PNG, TIFF, and many other formats. Our OCR engine can extract text from scanned documents and images.'
              },
              {
                q: 'How accurate is the AI classification?',
                a: 'Our models achieve 95%+ accuracy on standard document types. Enterprise plans include custom model training for even higher accuracy.'
              },
              {
                q: 'Is my data secure?',
                a: 'Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. We\'re SOC 2 Type II certified and GDPR compliant.'
              },
              {
                q: 'Can I integrate with my existing tools?',
                a: 'Yes! We offer a RESTful API, webhooks, and native integrations with popular tools like Zapier, Slack, and Google Drive.'
              },
              {
                q: 'What happens if I exceed my document limit?',
                a: 'You\'ll receive a notification when you\'re close to your limit. You can upgrade anytime, and we never delete your documents.'
              },
            ].map((faq, index) => (
              <details key={index} className="group p-6 bg-card rounded-xl border border-border">
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <span className="font-medium text-foreground">{faq.q}</span>
                  <ChevronRight className="w-5 h-5 text-foreground-muted group-open:rotate-90 transition-transform" />
                </summary>
                <p className="mt-4 text-foreground-secondary">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-12 lg:p-20 text-center">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 grid-pattern" />
            </div>
            
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your<br />Document Workflow?
              </h2>
              <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                Join thousands of teams using DocClassifier to automate document processing and unlock insights.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/register">
                  <Button size="xl" className="bg-white text-primary hover:bg-white/90">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-5 gap-12">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">DocClassifier</span>
              </Link>
              <p className="text-foreground-secondary mb-4">
                AI-powered document classification and organization for modern teams.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-foreground-muted hover:text-foreground transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            {[
              {
                title: 'Product',
                links: ['Features', 'Pricing', 'API', 'Changelog']
              },
              {
                title: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact']
              },
              {
                title: 'Legal',
                links: ['Privacy', 'Terms', 'Security', 'GDPR']
              },
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold text-foreground mb-4">{section.title}</h4>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-foreground-secondary hover:text-foreground transition-colors">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-foreground-muted">
              © 2024 DocClassifier. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-sm text-foreground-muted">
              <a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
