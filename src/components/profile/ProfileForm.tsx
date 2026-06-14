import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { markProfileCompleteLocally } from "@/components/auth/ProfileCheck";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export interface ProfileData {
  fullName: string;
  dob: string;
  gender: string;
  height: string;
  weight: string;
  medicalConditions: string[];
  otherCondition: string;
  currentMedications: string;
  allergies: string;
  emergencyContactName: string;
  emergencyContactNumber: string;
  emergencyContactRelationship: string;
  activityLevel: string;
  dailyWaterGoal: string;
}

const MEDICAL_CONDITIONS = ["Diabetes", "Hypertension", "Heart Disease", "Arthritis", "Other"];
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];
const RELATIONSHIP_OPTIONS = ["Son", "Daughter", "Spouse", "Parent", "Sibling", "Friend", "Caregiver", "Other"];
const ACTIVITY_LEVELS = ["Low", "Moderate", "Active"];

export function ProfileForm({ initialData }: { initialData?: ProfileData | null }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = React.useState(false);

  const [formData, setFormData] = React.useState<ProfileData>(
    initialData || {
      fullName: "",
      dob: "",
      gender: "",
      height: "",
      weight: "",
      medicalConditions: [],
      otherCondition: "",
      currentMedications: "",
      allergies: "",
      emergencyContactName: "",
      emergencyContactNumber: "",
      emergencyContactRelationship: "",
      activityLevel: "",
      dailyWaterGoal: "",
    }
  );

  // Auto-calculate water goal
  React.useEffect(() => {
    // Only auto-calculate if weight is valid and water goal hasn't been manually set differently
    // Actually, we'll just auto-update it if weight changes unless user manually edited it.
    // To keep it simple per requirements: auto-calculate, but user can edit.
    if (formData.weight) {
      const weightNum = parseFloat(formData.weight);
      if (!isNaN(weightNum)) {
        setFormData((prev) => ({
          ...prev,
          dailyWaterGoal: String(Math.round(weightNum * 35)),
        }));
      }
    }
  }, [formData.weight]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (condition: string, checked: boolean) => {
    setFormData((prev) => {
      if (checked) {
        return { ...prev, medicalConditions: [...prev.medicalConditions, condition] };
      } else {
        return { ...prev, medicalConditions: prev.medicalConditions.filter((c) => c !== condition) };
      }
    });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setBusy(true);
    console.log("[Profile] Profile save started");
    try {
      const docRef = doc(db, "profiles", user.uid);
      await setDoc(docRef, formData, { merge: true });
      console.log("[Profile] Firestore write success");
      
      // Mark as completed locally to avoid duplicate reads and slow navigation
      markProfileCompleteLocally(user.uid);
      
      console.log("[Profile] Dashboard navigation");
      navigate({ to: "/dashboard" });
    } catch (err) {
      console.error("[Profile] Firestore write failure:", err);
      alert("Failed to save profile. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const inputClass = "flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      {/* PERSONAL INFO */}
      <div className="space-y-4">
        <h2 className="text-xl font-display text-aurora border-b border-white/10 pb-2">Personal Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" required value={formData.fullName} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input id="dob" name="dob" type="date" required value={formData.dob} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select id="gender" name="gender" required className={inputClass} value={formData.gender} onChange={handleChange}>
              <option value="" disabled>Select gender</option>
              {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="height">Height (cm)</Label>
            <Input id="height" name="height" type="number" required value={formData.height} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg)</Label>
            <Input id="weight" name="weight" type="number" required value={formData.weight} onChange={handleChange} />
          </div>
        </div>
      </div>

      {/* HEALTH INFO */}
      <div className="space-y-4">
        <h2 className="text-xl font-display text-aurora border-b border-white/10 pb-2">Health Information</h2>
        
        <div className="space-y-2">
          <Label>Existing Medical Conditions</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {MEDICAL_CONDITIONS.map((condition) => (
              <label key={condition} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="rounded border-white/20 bg-black/20"
                  checked={formData.medicalConditions.includes(condition)}
                  onChange={(e) => handleCheckboxChange(condition, e.target.checked)}
                />
                {condition}
              </label>
            ))}
          </div>
          {formData.medicalConditions.includes("Other") && (
            <div className="mt-3">
              <Label htmlFor="otherCondition" className="text-xs">Please specify your condition</Label>
              <Input id="otherCondition" name="otherCondition" value={formData.otherCondition} onChange={handleChange} className="mt-1" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="currentMedications">Current Medications</Label>
          <Textarea id="currentMedications" name="currentMedications" value={formData.currentMedications} onChange={handleChange} placeholder="List any medications you are currently taking..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies">Allergies</Label>
          <Textarea id="allergies" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="List any known allergies..." />
        </div>
      </div>

      {/* EMERGENCY INFO */}
      <div className="space-y-4">
        <h2 className="text-xl font-display text-aurora border-b border-white/10 pb-2">Emergency Information</h2>
        
        <div className="space-y-2">
          <Label htmlFor="emergencyContactName">Emergency Contact Name</Label>
          <Input id="emergencyContactName" name="emergencyContactName" required value={formData.emergencyContactName} onChange={handleChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="emergencyContactNumber">Contact Number</Label>
            <Input id="emergencyContactNumber" name="emergencyContactNumber" required value={formData.emergencyContactNumber} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyContactRelationship">Relationship</Label>
            <select id="emergencyContactRelationship" name="emergencyContactRelationship" required className={inputClass} value={formData.emergencyContactRelationship} onChange={handleChange}>
              <option value="" disabled>Select relationship</option>
              {RELATIONSHIP_OPTIONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* LIFESTYLE INFO */}
      <div className="space-y-4">
        <h2 className="text-xl font-display text-aurora border-b border-white/10 pb-2">Lifestyle Information</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activityLevel">Activity Level</Label>
            <select id="activityLevel" name="activityLevel" required className={inputClass} value={formData.activityLevel} onChange={handleChange}>
              <option value="" disabled>Select activity level</option>
              {ACTIVITY_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="dailyWaterGoal">Daily Water Goal (ml)</Label>
            <Input id="dailyWaterGoal" name="dailyWaterGoal" type="number" required value={formData.dailyWaterGoal} onChange={handleChange} />
          </div>
        </div>
      </div>

      <div className="pt-6">
        <GlowButton type="submit" disabled={busy} className="w-full justify-center">
          {busy ? "Saving Profile... Please wait..." : "Save Profile"}
        </GlowButton>
      </div>
    </form>
  );
}
