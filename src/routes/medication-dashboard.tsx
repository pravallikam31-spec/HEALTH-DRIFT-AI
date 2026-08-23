import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { AuthGate } from "@/components/auth/AuthGate";
import { ProfileCheck } from "@/components/auth/ProfileCheck";
import { AuroraBackground } from "@/components/fx/AuroraBackground";
import { Card } from "@/components/ui/card";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Pill, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/medication-dashboard")({
  component: MedicationDashboardPage,
});

function MedicationDashboardPage() {
  return (
    <AuthGate>
      <ProfileCheck>
        <MedicationDashboard />
      </ProfileCheck>
    </AuthGate>
  );
}

interface MedicationSchedule {
  medicineName: string;
  morning: boolean;
  morningType: "before" | "after" | "";
  noon: boolean;
  noonType: "before" | "after" | "";
  night: boolean;
  nightType: "before" | "after" | "";
}

interface TemporaryMedicine {
  id: string;
  medicineName: string;
  morning: boolean;
  morningType: "before" | "after" | "";
  noon: boolean;
  noonType: "before" | "after" | "";
  night: boolean;
  nightType: "before" | "after" | "";
  startDate: string;
  endDate: string;
  beforeFood: boolean;
}

function MedicationDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = React.useState<any>(null);
  const [schedules, setSchedules] = React.useState<MedicationSchedule[]>([]);
  const [tempMedicines, setTempMedicines] = React.useState<TemporaryMedicine[]>([]);
  const [editingSchedule, setEditingSchedule] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [newTempMed, setNewTempMed] = React.useState({
    name: "",
    morning: false,
    morningType: "before" as "before" | "after" | "",
    noon: false,
    noonType: "before" as "before" | "after" | "",
    night: false,
    nightType: "before" as "before" | "after" | "",
    startDate: "",
    endDate: "",
    beforeFood: true,
  });

  React.useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        const profileRef = doc(db, "profiles", user.uid);
        const profileSnap = await getDoc(profileRef);
        if (profileSnap.exists()) {
          setProfile(profileSnap.data());
        }

        const schedulesRef = collection(db, "users", user.uid, "medication_schedules");
        const schedulesSnap = await getDocs(schedulesRef);
        const schedulesData: MedicationSchedule[] = [];
        schedulesSnap.forEach((doc) => {
          schedulesData.push(doc.data() as MedicationSchedule);
        });
        setSchedules(schedulesData);

        const tempMedsRef = collection(db, "users", user.uid, "temporary_medications");
        const tempMedsSnap = await getDocs(tempMedsRef);
        const tempMedsData: TemporaryMedicine[] = [];
        tempMedsSnap.forEach((doc) => {
          tempMedsData.push({ id: doc.id, ...doc.data() } as TemporaryMedicine);
        });
        setTempMedicines(tempMedsData);

        setLoading(false);
      } catch (err) {
        console.error("[Medication] Load error:", err);
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  const saveMedicineSchedule = async (med: string) => {
    if (!user) return;
    const schedule = schedules.find((s) => s.medicineName === med);
    if (!schedule) return;

    try {
      const ref = doc(db, "users", user.uid, "medication_schedules", med);
      await setDoc(ref, schedule);
      setEditingSchedule(null);
    } catch (err) {
      console.error("[Medication] Save error:", err);
    }
  };

  const addTemporaryMedicine = async () => {
    if (!user || !newTempMed.name.trim()) return;

    try {
      const id = `temp_${Date.now()}`;
      const ref = doc(db, "users", user.uid, "temporary_medications", id);
      const payload = {
        medicineName: newTempMed.name.trim(),
        morning: newTempMed.morning,
        morningType: newTempMed.morning ? newTempMed.morningType || "before" : "",
        noon: newTempMed.noon,
        noonType: newTempMed.noon ? newTempMed.noonType || "before" : "",
        night: newTempMed.night,
        nightType: newTempMed.night ? newTempMed.nightType || "before" : "",
        startDate: newTempMed.startDate,
        endDate: newTempMed.endDate,
        beforeFood: newTempMed.beforeFood,
      };

      await setDoc(ref, payload);

      setTempMedicines((prev) => [
        ...prev,
        {
          id,
          ...payload,
        },
      ]);

      setNewTempMed({
        name: "",
        morning: false,
        morningType: "before",
        noon: false,
        noonType: "before",
        night: false,
        nightType: "before",
        startDate: "",
        endDate: "",
        beforeFood: true,
      });
    } catch (err) {
      console.error("[Medication] Add error:", err);
    }
  };

  const deleteTempMedicine = async (id: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid, "temporary_medications", id));
      setTempMedicines((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error("[Medication] Delete error:", err);
    }
  };

  const updateSchedule = (med: string, field: string, value: any) => {
    setSchedules((prev) => {
      const idx = prev.findIndex((s) => s.medicineName === med);
      if (idx === -1) {
        const newSchedule: MedicationSchedule = {
          medicineName: med,
          morning: false,
          morningType: "",
          noon: false,
          noonType: "",
          night: false,
          nightType: "",
        };
        newSchedule[field as keyof MedicationSchedule] = value;
        return [...prev, newSchedule];
      }
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
  };

  const medicines = profile?.currentMedications || [];
  const today = new Date().toLocaleDateString("en-CA");

  const getTimeLabel = (enabled: boolean, type: "before" | "after" | "", label: string) => {
    if (!enabled) return null;
    const resolvedType = type === "before" || type === "after" ? type : "before";
    return `${label} • ${resolvedType === "before" ? "Before Food" : "After Food"}`;
  };

  const getTempTimeLabels = (med: TemporaryMedicine) => {
    const labels: string[] = [];
    const morningLabel = getTimeLabel(med.morning, med.morningType || (med.beforeFood ? "before" : "after"), "Morning");
    const noonLabel = getTimeLabel(med.noon, med.noonType || (med.beforeFood ? "before" : "after"), "Noon");
    const nightLabel = getTimeLabel(med.night, med.nightType || (med.beforeFood ? "before" : "after"), "Night");
    [morningLabel, noonLabel, nightLabel].forEach((label) => {
      if (label) labels.push(label);
    });
    return labels;
  };

  const getTodaysMedicines = () => {
    const result: { name: string; times: string[] }[] = [];

    schedules.forEach((schedule) => {
      const times: string[] = [];
      const morningLabel = getTimeLabel(schedule.morning, schedule.morningType, "Morning");
      const noonLabel = getTimeLabel(schedule.noon, schedule.noonType, "Noon");
      const nightLabel = getTimeLabel(schedule.night, schedule.nightType, "Night");
      [morningLabel, noonLabel, nightLabel].forEach((label) => {
        if (label) times.push(label);
      });
      if (times.length > 0) {
        result.push({ name: schedule.medicineName, times });
      }
    });

    tempMedicines.forEach((med) => {
      if (new Date(med.startDate) <= new Date(today) && new Date(med.endDate) >= new Date(today)) {
        const times = getTempTimeLabels(med);
        if (times.length > 0) {
          result.push({ name: med.medicineName, times });
        }
      }
    });

    return result;
  };

  if (loading) {
    return (
      <div className="relative min-h-screen bg-background text-foreground antialiased p-4 sm:p-8 pb-32">
        <AuroraBackground />
        <div className="relative z-10 flex items-center justify-center min-h-[80vh]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-background text-foreground antialiased p-4 sm:p-8 pb-32">
      <AuroraBackground />
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate({ to: "/dashboard" })}
            className="p-3 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-display text-4xl sm:text-5xl mb-2 text-aurora flex items-center gap-3">
              <Pill className="w-10 h-10 text-purple-400" /> Medication Dashboard
            </h1>
            <p className="text-muted-foreground">Manage medicines and reminder schedules.</p>
          </div>
        </div>

        {medicines.length === 0 && tempMedicines.length === 0 ? (
          <Card className="glass-strong rounded-3xl p-8 border border-white/10 bg-gradient-to-br from-white/5 to-transparent text-center">
            <p className="text-muted-foreground">No medications found in profile.</p>
          </Card>
        ) : (
          <>
            {getTodaysMedicines().length > 0 && (
              <div>
                <h2 className="text-2xl font-display text-aurora mb-4">Today's Active Medicines</h2>
                <div className="space-y-3">
                  {getTodaysMedicines().map((med, idx) => (
                    <Card key={idx} className="glass-strong rounded-2xl p-4 border border-white/10 bg-gradient-to-r from-purple-500/10 to-transparent flex items-center gap-4">
                      <Pill className="w-6 h-6 text-purple-400 flex-shrink-0" />
                      <div className="flex-grow">
                        <p className="font-medium text-lg">{med.name}</p>
                        <p className="text-sm text-muted-foreground">{med.times.join(" • ")}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {medicines.length > 0 && (
              <div>
                <h2 className="text-2xl font-display text-aurora mb-4">Medicine Schedules</h2>
                <div className="space-y-4">
                  {medicines.map((med) => {
                    const schedule = schedules.find((s) => s.medicineName === med);
                    const isEditing = editingSchedule === med;

                    return (
                      <Card key={med} className="glass-strong rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-medium flex items-center gap-2">
                            <Pill className="w-5 h-5 text-purple-400" /> {med}
                          </h3>
                          <button
                            onClick={() => setEditingSchedule(isEditing ? null : med)}
                            className="text-sm px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-400/30 rounded-lg transition-colors"
                          >
                            {isEditing ? "Done" : "Edit"}
                          </button>
                        </div>

                        {isEditing && (
                          <div className="space-y-4 mb-4">
                            {["morning", "noon", "night"].map((time) => (
                              <div key={time} className="bg-black/20 rounded-lg p-4">
                                <label className="flex items-center gap-3 mb-3">
                                  <input
                                    type="checkbox"
                                    checked={schedule?.[time as keyof MedicationSchedule] || false}
                                    onChange={(e) => updateSchedule(med, time, e.target.checked)}
                                    className="rounded border-white/20 bg-black/20"
                                  />
                                  <span className="capitalize font-medium">{time}</span>
                                </label>
                                {schedule?.[time as keyof MedicationSchedule] && (
                                  <div className="ml-6 space-y-2">
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="radio"
                                        name={`${med}-${time}`}
                                        checked={schedule?.[`${time}Type` as keyof MedicationSchedule] === "before"}
                                        onChange={() => updateSchedule(med, `${time}Type`, "before")}
                                      />
                                      Before Food
                                    </label>
                                    <label className="flex items-center gap-2 text-sm">
                                      <input
                                        type="radio"
                                        name={`${med}-${time}`}
                                        checked={schedule?.[`${time}Type` as keyof MedicationSchedule] === "after"}
                                        onChange={() => updateSchedule(med, `${time}Type`, "after")}
                                      />
                                      After Food
                                    </label>
                                  </div>
                                )}
                              </div>
                            ))}

                            <GlowButton
                              type="button"
                              onClick={() => saveMedicineSchedule(med)}
                              className="w-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-400/30"
                            >
                              Save Schedule
                            </GlowButton>
                          </div>
                        )}

                        {!isEditing && schedule && (
                          <div className="flex flex-wrap gap-2">
                            {schedule.morning && <span className="text-sm bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">Morning • {schedule.morningType === "before" ? "Before Food" : "After Food"}</span>}
                            {schedule.noon && <span className="text-sm bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">Noon • {schedule.noonType === "before" ? "Before Food" : "After Food"}</span>}
                            {schedule.night && <span className="text-sm bg-purple-500/20 border border-purple-400/30 rounded-full px-3 py-1">Night • {schedule.nightType === "before" ? "Before Food" : "After Food"}</span>}
                            {!schedule.morning && !schedule.noon && !schedule.night && <span className="text-sm text-muted-foreground">No schedule set</span>}
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl font-display text-aurora mb-4">Other Temporary Medicines</h2>

              <Card className="glass-strong rounded-2xl p-6 border border-white/10 bg-gradient-to-br from-white/5 to-transparent mb-4">
                <h3 className="text-lg font-medium mb-4">Add Temporary Medicine</h3>
                <div className="space-y-4">
                  <div>
                    <Label>Medicine Name</Label>
                    <Input
                      value={newTempMed.name}
                      onChange={(e) => setNewTempMed((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Cough Syrup"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {["morning", "noon", "night"].map((time) => (
                      <div key={time} className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={Boolean(newTempMed[time as keyof typeof newTempMed])}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setNewTempMed((prev) => ({
                                ...prev,
                                [time]: checked,
                                [`${time}Type`]: checked ? prev[`${time}Type` as keyof typeof prev] || "before" : "",
                              }));
                            }}
                            className="rounded border-white/20 bg-black/20"
                          />
                          {time.charAt(0).toUpperCase() + time.slice(1)}
                        </label>

                        {Boolean(newTempMed[time as keyof typeof newTempMed]) && (
                          <div className="ml-6 space-y-1 text-sm">
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`temp-${time}`}
                                checked={newTempMed[`${time}Type` as keyof typeof newTempMed] === "before"}
                                onChange={() => setNewTempMed((prev) => ({ ...prev, [`${time}Type`]: "before" }))}
                              />
                              Before Food
                            </label>
                            <label className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`temp-${time}`}
                                checked={newTempMed[`${time}Type` as keyof typeof newTempMed] === "after"}
                                onChange={() => setNewTempMed((prev) => ({ ...prev, [`${time}Type`]: "after" }))}
                              />
                              After Food
                            </label>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        value={newTempMed.startDate}
                        onChange={(e) => setNewTempMed((prev) => ({ ...prev, startDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        value={newTempMed.endDate}
                        onChange={(e) => setNewTempMed((prev) => ({ ...prev, endDate: e.target.value }))}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <GlowButton
                    type="button"
                    onClick={() => {
                      void addTemporaryMedicine();
                    }}
                    className="w-full bg-gradient-to-r from-blue-500/20 to-blue-600/20 border border-blue-400/30 flex items-center justify-center gap-2"
                  >
                    <Plus className="w-5 h-5" /> Add Temporary Medicine
                  </GlowButton>
                </div>
              </Card>

              {tempMedicines.length > 0 && (
                <div className="space-y-3">
                  {tempMedicines.map((med) => (
                    <Card key={med.id} className="glass-strong rounded-2xl p-4 border border-white/10 bg-gradient-to-r from-blue-500/10 to-transparent">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium">{med.medicineName}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.startDate} to {med.endDate}
                          </p>
                          {getTempTimeLabels(med).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {getTempTimeLabels(med).map((timeLabel, index) => (
                                <span key={`${med.id}-${timeLabel}-${index}`} className="text-xs bg-blue-500/20 border border-blue-400/30 rounded-full px-2 py-1">
                                  {timeLabel}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => deleteTempMedicine(med.id)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5 text-red-400" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
