import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AuthGate } from "@/components/auth/AuthGate";
import { ProfileCheck } from "@/components/auth/ProfileCheck";
import { useAuth } from "@/lib/auth-context";
import { AuroraBackground } from "@/components/fx/AuroraBackground";
import { GlowButton } from "@/components/ui/GlowButton";
import { useNavigate } from "@tanstack/react-router";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { ProfileData } from "@/components/profile/ProfileForm";
import { format } from "date-fns";
import { AlertCircle, HeartPulse, Activity, Droplets, Footprints, Utensils, Pill, BrainCircuit, LineChart, Sparkles, Bot, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  return (
    <AuthGate>
      <ProfileCheck>
        <DashboardContent />
      </ProfileCheck>
    </AuthGate>
  );
}

const MOTIVATIONAL_MESSAGES = [
  "Every healthy choice today builds a stronger tomorrow.",
  "Small daily habits create lifelong wellness.",
  "Drink water, stay active, and keep smiling.",
  "Consistency is more important than perfection.",
  "Today's efforts become tomorrow's strength.",
  "Your health is an investment, not an expense.",
  "Take care of your body. It's the only place you have to live.",
  "Wellness is the natural state of your body.",
  "Nourish to flourish.",
  "A healthy outside starts from the inside.",
  "Rest when you need to, but never quit.",
  "Make yourself a priority.",
  "Health is a state of body. Wellness is a state of being.",
  "Progress, not perfection.",
  "Your body hears everything your mind says.",
  "Movement is medicine.",
  "Focus on how far you've come, not how far you have to go.",
  "You are capable of amazing things.",
  "Energy flows where intention goes.",
  "Eat well. Move daily. Hydrate often. Sleep lots. Love your body.",
  "Be stronger than your excuses.",
  "Self-care is how you take your power back.",
  "Strive for progress, not perfection.",
  "A good laugh and a long sleep are the best cures in the doctor's book.",
  "Take it one day at a time.",
  "You don't have to be perfect to be healthy.",
  "Listen to your body.",
  "Breathe in strength, breathe out stress.",
  "Hydration is key to feeling energized.",
  "Invest in your health today for a brighter tomorrow.",
  "Wellness encompasses a healthy body, a sound mind, and a tranquil spirit."
];

function getDailyMessage() {
  const today = new Date();
  const index = (today.getFullYear() + today.getMonth() + today.getDate()) % MOTIVATIONAL_MESSAGES.length;
  return MOTIVATIONAL_MESSAGES[index];
}

function getGreeting(name: string) {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return `Good Morning, ${name} ☀️`;
  if (hour >= 12 && hour < 17) return `Good Afternoon, ${name} 🌤️`;
  if (hour >= 17 && hour < 21) return `Good Evening, ${name} 🌇`;
  return `Good Night, ${name} 🌙`;
}

function calculateAge(dob: string) {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function DashboardContent() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<ProfileData | null>(null);

  React.useEffect(() => {
    async function loadProfile() {
      if (!user) return;
      try {
        const docRef = doc(db, "profiles", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as ProfileData);
        }
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    }
    loadProfile();
  }, [user]);

  const greetingName = profile?.fullName?.split(" ")[0] || "User";
  const greeting = getGreeting(greetingName);
  const dailyMessage = React.useMemo(() => getDailyMessage(), []);
  const todayStr = format(new Date(), "EEEE, MMMM do, yyyy");

  if (!profile) {
    return (
      <div className="min-h-screen bg-background text-muted-foreground grid place-items-center">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased p-4 sm:p-8 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-7xl mx-auto space-y-12">
        
        {/* TOP WELCOME SECTION */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl mb-3 text-aurora">{greeting}</h1>
            <div className="flex flex-wrap items-center gap-6 mt-3 text-lg text-muted-foreground">
              <div className="flex items-center gap-2"><Clock className="w-5 h-5" /> {todayStr}</div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse-soft" />
                <span className="uppercase tracking-[0.2em] text-sm">Profile Status: Completed</span>
              </div>
            </div>
          </div>
          <GlowButton variant="ghost" onClick={() => navigate({ to: '/edit-profile' })} className="shrink-0 border border-white/10 text-lg py-3 px-6 h-auto">
            Edit Profile
          </GlowButton>
        </div>

        {/* DAILY MOTIVATIONAL MESSAGE */}
        <div className="glass-strong rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-lg text-center mx-auto my-12">
          <p className="text-2xl sm:text-3xl font-serif italic text-foreground/90 leading-relaxed">"{dailyMessage}"</p>
        </div>

        {/* PROFILE SUMMARY CARD */}
        <div className="glass-strong rounded-3xl p-8 border border-white/10 shadow-lg">
          <h2 className="text-2xl font-display text-aurora mb-6 border-b border-white/10 pb-4">Profile Summary</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Full Name</div><div className="font-medium text-xl">{profile.fullName}</div></div>
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Age</div><div className="font-medium text-xl">{calculateAge(profile.dob)}</div></div>
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Gender</div><div className="font-medium text-xl">{profile.gender}</div></div>
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Blood Group</div><div className="font-medium text-xl">N/A</div></div>
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Height</div><div className="font-medium text-xl">{profile.height} cm</div></div>
            <div><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Weight</div><div className="font-medium text-xl">{profile.weight} kg</div></div>
            <div className="col-span-2"><div className="text-sm uppercase tracking-wider text-muted-foreground mb-2">Health Conditions</div><div className="font-medium text-xl">{profile.medicalConditions?.length > 0 ? profile.medicalConditions.join(", ") : "None specified"}</div></div>
          </div>
        </div>

        {/* PERSONALIZED HEALTH BADGES */}
        <div className="flex flex-wrap gap-4">
          {profile.medicalConditions?.includes("Diabetes") && <span className="glass-strong px-5 py-3 rounded-full text-base font-medium border border-blue-500/30 text-blue-100 flex items-center gap-2 shadow-sm"><Activity className="w-5 h-5 text-blue-400"/> Diabetes Monitoring Active</span>}
          {profile.medicalConditions?.includes("Hypertension") && <span className="glass-strong px-5 py-3 rounded-full text-base font-medium border border-rose-500/30 text-rose-100 flex items-center gap-2 shadow-sm"><HeartPulse className="w-5 h-5 text-rose-400"/> Blood Pressure Monitoring Active</span>}
          {profile.currentMedications && profile.currentMedications.trim().length > 0 && <span className="glass-strong px-5 py-3 rounded-full text-base font-medium border border-purple-500/30 text-purple-100 flex items-center gap-2 shadow-sm"><Pill className="w-5 h-5 text-purple-400"/> Medication Reminders Active</span>}
          {profile.dailyWaterGoal && <span className="glass-strong px-5 py-3 rounded-full text-base font-medium border border-cyan-500/30 text-cyan-100 flex items-center gap-2 shadow-sm"><Droplets className="w-5 h-5 text-cyan-400"/> Hydration Goal Set</span>}
        </div>

        {/* HEALTH OVERVIEW SECTION */}
        <h2 className="text-3xl font-display mt-16 mb-6">Health Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:bg-white/5 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-6"><HeartPulse className="w-8 h-8 text-rose-400" /><h3 className="text-xl font-medium">Health Score</h3></div>
            <p className="text-base text-muted-foreground mb-4">Overall wellness indicator.</p>
            <p className="text-2xl font-display text-white/50">Calculating...</p>
          </div>
          <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:bg-white/5 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-6"><Sparkles className="w-8 h-8 text-purple-400" /><h3 className="text-xl font-medium">Daily Prediction</h3></div>
            <p className="text-base text-muted-foreground mb-4">AI-powered wellness prediction.</p>
            <p className="text-xl font-medium text-white/50">Preparing prediction...</p>
          </div>
          <div className="glass-strong rounded-3xl p-8 border border-white/10 hover:bg-white/5 transition-colors shadow-sm">
            <div className="flex items-center gap-3 mb-6"><LineChart className="w-8 h-8 text-indigo-400" /><h3 className="text-xl font-medium">Weekly Report</h3></div>
            <p className="text-base text-muted-foreground mb-4">View weekly health insights.</p>
            <p className="text-xl font-medium text-white/50">Report ready...</p>
          </div>
        </div>

        {/* MAIN FEATURES SECTION */}
        <h2 className="text-3xl font-display mt-16 mb-6">Main Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Steps Tracking", icon: <Footprints className="w-10 h-10 text-emerald-400 mb-6" />, subtitle: "Track daily movement and walking goals.", onClick: () => navigate({ to: '/steps-dashboard' }) },
            { title: "Food Intake", icon: <Utensils className="w-10 h-10 text-orange-400 mb-6" />, subtitle: "Scan meals and track nutrition.", onClick: () => navigate({ to: '/food-dashboard' }) },
            { title: "Water Intake", icon: <Droplets className="w-10 h-10 text-cyan-400 mb-6" />, subtitle: "Monitor hydration and water goals.", onClick: () => navigate({ to: '/water-dashboard' }) },
            { title: "Medication Reminders", icon: <Pill className="w-10 h-10 text-purple-400 mb-6" />, subtitle: "Receive medicine reminders on time.", onClick: null },
            { title: "Activities", icon: <BrainCircuit className="w-10 h-10 text-blue-400 mb-6" />, subtitle: "Brain exercises and wellness activities.", onClick: null },
            { title: "AI Assistant", icon: <Bot className="w-10 h-10 text-rose-400 mb-6" />, subtitle: "Ask health-related questions and get guidance.", onClick: null },
          ].map((feature, idx) => (
            <div key={idx} onClick={feature.onClick} className={`glass-strong rounded-3xl p-8 border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all group flex flex-col h-full bg-gradient-to-b from-white/5 to-transparent shadow-sm ${feature.onClick ? 'cursor-pointer' : ''}`}>
              {feature.icon}
              <h3 className="text-2xl font-medium mb-3">{feature.title}</h3>
              <p className="text-base text-muted-foreground flex-grow mb-8 leading-relaxed">{feature.subtitle}</p>
              <div className="inline-flex items-center gap-2 self-start bg-black/40 px-4 py-2 rounded-full text-sm font-medium uppercase tracking-wider text-white/60">
                <div className="w-2 h-2 rounded-full bg-amber-400"></div> Ready for Integration
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* FLOATING SOS BUTTON */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="fixed bottom-10 right-10 z-50 w-20 h-20 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-[0_0_30px_rgba(220,38,38,0.6)] flex flex-col items-center justify-center transition-transform hover:scale-105 border-2 border-red-400/50">
            <AlertCircle className="w-8 h-8 mb-1" />
            <span className="text-[11px] font-bold tracking-widest">SOS</span>
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-zinc-950 border-white/10 text-foreground glass-strong sm:rounded-2xl max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-400 flex items-center gap-3 text-3xl font-display"><AlertCircle className="w-8 h-8" /> Emergency Alert</AlertDialogTitle>
            <AlertDialogDescription className="text-xl text-white/80 py-6 leading-relaxed">
              Are you sure you want to send an emergency alert?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-4 sm:gap-0 mt-6">
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10 hover:text-white text-white text-xl py-7 px-8 rounded-xl font-medium transition-colors">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700 text-white text-xl py-7 px-8 rounded-xl font-medium border border-red-500/50 transition-colors shadow-[0_0_15px_rgba(220,38,38,0.4)]">Send SOS</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
