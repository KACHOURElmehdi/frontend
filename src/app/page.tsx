import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ArrowRight, CheckCircle2, Layout, Shield } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40 bg-gradient-to-b from-background to-secondary/20">
        <div className="container flex flex-col items-center gap-4 text-center">
          <div className="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">
            🚀 The Future of Task Management
          </div>
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
            Master Your Workflow <br className="hidden sm:inline" />
            with TaskFlow
          </h1>
          <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
            Streamline your projects, collaborate with your team, and achieve your goals with our premium task management solution.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container space-y-12 py-12 md:py-24 lg:py-32">
        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Layout className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Intuitive Dashboard</h3>
                <p className="text-sm text-muted-foreground">
                  Manage everything from a single, beautiful view.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <CheckCircle2 className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Smart Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of progress with real-time updates.
                </p>
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
              <Shield className="h-12 w-12 text-primary" />
              <div className="space-y-2">
                <h3 className="font-bold">Secure & Reliable</h3>
                <p className="text-sm text-muted-foreground">
                  Your data is safe with our enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
