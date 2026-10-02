import type { ReactNode } from "react";
import OperatorSidebar from "./OperatorSidebar";
import OperatorTopbar from "./OperatorTopbar";

type OperatorShellProps = {
  activeId: string;
  title: string;
  description: string;
  eyebrow?: string;
  children: ReactNode;
};

export default function OperatorShell({ activeId, title, description, eyebrow, children }: OperatorShellProps) {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <OperatorSidebar activeId={activeId} />
        <div className="min-w-0 space-y-5">
          <OperatorTopbar title={title} description={description} eyebrow={eyebrow} />
          {children}
        </div>
      </div>
    </main>
  );
}
