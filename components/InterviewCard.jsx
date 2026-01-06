"use client";

export default function InterviewCard({ children }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow">
        {children}
      </div>
    </div>
  );
}
