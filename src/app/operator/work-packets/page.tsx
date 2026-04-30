async function getPackets() {
  const res = await fetch("http://localhost:3010/api/operator/work-packets", {
    cache: "no-store",
  });
  const data = await res.json();
  return data.packets || [];
}

export default async function WorkPacketsPage() {
  const packets = await getPackets();
  const active = packets[0];

  return (
    <main className="min-h-screen bg-black px-8 py-12 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-yellow-300">
            OPERATOR // COMMAND CENTER
          </p>
          <h1 className="mt-3 text-4xl font-black">ACTIVE EXECUTION PACKET</h1>
        </div>

        {!active ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8">
            No active work packet found.
          </div>
        ) : (
          <section className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Objective</p>
                <h2 className="mt-2 text-2xl font-bold">{active.objective}</h2>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Status</p>
                <p className="mt-2 text-lg font-semibold text-yellow-300">{active.status}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Current Issue</p>
                <p className="mt-2 text-slate-200">{active.current_issue}</p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">Next Action</p>
                <p className="mt-2 text-slate-200">{active.next_action}</p>
              </div>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Owner Files</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {active.owner_files?.map((file: string) => <li key={file}>{file}</li>)}
                </ul>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-red-300">Blocked Areas</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  {active.blocked_areas?.map((area: string) => <li key={area}>{area}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
              <p className="text-xs uppercase tracking-[0.25em] text-green-300">Definition of Done</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-200">
                {active.definition_of_done?.map((item: string) => <li key={item}>✓ {item}</li>)}
              </ul>
            </div>
          

<form action="/api/operator/work-packets/generate-patch" method="post" className="mt-4">
  <button className="rounded-xl border border-cyan-300/40 bg-cyan-300/10 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-cyan-200 hover:bg-cyan-300/20">
    Generate Patch
  </button>
</form>

<form action="/api/operator/work-packets/execute" method="post" className="mt-8">
  <button className="rounded-xl bg-yellow-300 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-black hover:bg-yellow-200">
    Execute Next Action
  </button>
</form>

          </section>
        )}
      </div>
    </main>
  );
}
