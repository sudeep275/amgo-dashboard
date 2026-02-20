import { useEffect, useState } from "react";

interface CampaignForm {
  name: string;
  budget: number;
}

export default function OverviewTab() {
  const [form, setForm] = useState<CampaignForm>({
    name: "Summer Campaign",
    budget: 5000,
  });

  const [originalForm, setOriginalForm] = useState<CampaignForm>(form);
  const [errors, setErrors] = useState<{ name?: string; budget?: string }>({});
  const [saved, setSaved] = useState(false);

  // Detect unsaved changes
  const hasUnsavedChanges =
    form.name !== originalForm.name || form.budget !== originalForm.budget;

  // Browser refresh / tab close warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!form.name.trim()) {
      newErrors.name = "Campaign name is required.";
    }

    if (form.budget <= 0) {
      newErrors.budget = "Budget must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    setOriginalForm(form);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <div style={{ marginBottom: "15px" }}>
        <label>Campaign Name</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          style={{ width: "100%", padding: "5px" }}
        />
        {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label>Budget</label>
        <input
          type="number"
          value={form.budget}
          onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
          style={{ width: "100%", padding: "5px" }}
        />
        {errors.budget && <p style={{ color: "red" }}>{errors.budget}</p>}
      </div>

      <button onClick={handleSave}>Save Changes</button>

      {saved && (
        <p style={{ color: "green", marginTop: "10px" }}>
          Changes saved successfully!
        </p>
      )}

      {hasUnsavedChanges && (
        <p style={{ color: "orange", marginTop: "10px" }}>
          You have unsaved changes.
        </p>
      )}
    </div>
  );
}
