"use client";

const MODELS = ["Model 1", "Model 2", "Model 3"];

export default function ModelSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full border rounded px-3 py-2 text-sm"
    >
      {MODELS.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}
