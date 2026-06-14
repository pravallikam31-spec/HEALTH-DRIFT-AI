import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth/AuthGate";
import { ProfileCheck } from "@/components/auth/ProfileCheck";
import { AuroraBackground } from "@/components/fx/AuroraBackground";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/sleep-dashboard")({
  component: SleepDashboardPage,
});

function SleepDashboardPage() {
  return (
    <AuthGate>
      <ProfileCheck>
        <SleepDashboard />
      </ProfileCheck>
    </AuthGate>
  );
}

function SleepDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased p-4 sm:p-8 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate({ to: "/dashboard" })}
              className="p-3 rounded-full hover:bg-white/10 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display text-4xl sm:text-5xl mb-2 text-aurora">😴 Sleep Dashboard</h1>
              <p className="text-muted-foreground">Track sleep duration, sleep quality, and sleep patterns.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sleep Overview</CardTitle>
              <CardDescription>Daily sleep status and goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Total Sleep</span>
                  <span>0 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Sleep Goal</span>
                  <span>8 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Sleep Quality</span>
                  <span>--</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                Ready for Integration
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sleep Insights</CardTitle>
              <CardDescription>Sleep analysis and trends.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-5xl font-semibold">--</div>
              <div className="text-lg text-muted-foreground">Status: --</div>
              <p className="text-sm text-muted-foreground">Sleep insights will be available after tracking sleep patterns.</p>
              <div className="text-sm text-muted-foreground">
                Ready for Integration
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-2xl">Sleep Statistics</CardTitle>
              <CardDescription>Weekly sleep metrics.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Sleep</span>
                <span className="text-lg font-semibold">-- hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Best Night</span>
                <span className="text-lg font-semibold">-- hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Worst Night</span>
                <span className="text-lg font-semibold">-- hours</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Ready for Integration
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sleep Log</CardTitle>
            <CardDescription>Track your sleep entries.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-muted-foreground text-center">
              No sleep entries yet. Ready for Integration
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
            <CardDescription>Manage your sleep tracking.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row flex-wrap gap-3">
            <Button type="button" disabled>Log Sleep</Button>
            <Button type="button" variant="outline" disabled>View History</Button>
            <Button type="button" variant="outline" disabled>Sleep Report</Button>
            <span className="text-sm text-muted-foreground self-center">Ready for Integration</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
