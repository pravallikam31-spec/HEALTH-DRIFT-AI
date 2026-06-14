import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth/AuthGate";
import { ProfileCheck } from "@/components/auth/ProfileCheck";
import { useAuth } from "@/lib/auth-context";
import { FoodDashboard } from "@/components/sections/FoodDashboard";

export const Route = createFileRoute("/food-dashboard")({
  component: FoodDashboardPage,
});

function FoodDashboardPage() {
  return (
    <AuthGate>
      <ProfileCheck>
        <FoodDashboard />
      </ProfileCheck>
    </AuthGate>
  );
}
