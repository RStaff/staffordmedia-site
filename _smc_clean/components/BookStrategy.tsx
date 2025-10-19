"use client";
import LeadForm from "./LeadForm";

export default function BookStrategy() {
  const calendly = "https://calendly.com/your-handle/strategy-call"; // TODO: set your Calendly link
  return (
    <div className="space-y-4">
      <a href={calendly} target="_blank" rel="noopener noreferrer"
         className="inline-block px-4 py-2 rounded bg-indigo-600 text-white">
        Book a Strategy Call
      </a>
      <div className="text-sm text-gray-500">No time now? Drop your info and we’ll schedule it for you.</div>
      <LeadForm variant="compact" />
    </div>
  );
}
