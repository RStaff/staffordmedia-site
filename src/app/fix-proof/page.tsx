import Link from "next/link";
import { lookupPacket, packetHref } from "@/lib/minimumStateContinuity";
import SystemProgressRail from "@/components/commerce/SystemProgressRail";
import RuntimeContinuityStrip from "@/components/commerce/RuntimeContinuityStrip";
import { BrowserEvidenceFrame } from "@/components/commerce/VisualEvidence";
import { getStorefrontScreenshot } from "../../../lib/storefrontScreenshot";
import EvidenceViewport from "@/components/commerce/EvidenceViewport";
import { buildPlaceholderEvidencePacket, primaryEvidenceSurface } from "@/lib/evidence/evidencePacket";

export const metadata = {
  title: "Fix Proof - Stafford Media Consulting",
  description: "ShopiFixer implementation proof review continuity.",
};

type PageProps = {
  searchParams?: Promise<{ store?: string; packet?: string }>;
};

function cleanStoreDomain(value: string) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
}

function withStore(path: string, store: string) {
  return store ? `${path}?store=${encodeURIComponent(store)}` : path;
}

export default async function FixProofPage({ searchParams }: PageProps) {
  const params = (await searchParams) || {};
  const store = cleanStoreDomain(params.store || "");
  const packetResult = await lookupPacket({ packetId: params.packet || "", store });
  const packet = packetResult.status === "found" ? packetResult.packet : null;
  const proofReady = packet?.proof_state === "ready" || packet?.proof_state === "delivered";
  const evidenceStore = packet?.store_url || store;
  const screenshotUrl = evidenceStore ? getStorefrontScreenshot(evidenceStore) : null;
  const evidencePacket = buildPlaceholderEvidencePacket({
    packetId: packet?.packet_id || params.packet || null,
    store: evidenceStore || "Store confirmation required",
    evidenceState: proofReady ? "captured" : "awaiting_review",
  });
  const desktopEvidence = primaryEvidenceSurface(evidencePacket, "desktop");

  return (
    <main className="min-h-screen bg-slate-950 px-5 py-8 text-slate-100 md:px-6 md:py-10">
      <SystemProgressRail currentStage="fix" stateLabel={proofReady ? "Visible proof ready" : "Approval required"} className="px-0 pt-0" />
      <RuntimeContinuityStrip
        className="px-0"
        items={[
          { label: "Now", value: proofReady ? "Visible updates ready." : "Changed-state proof unavailable." },
          { label: "Next", value: proofReady ? "Review changed state." : "Return to approval path." },
          { label: "Safe", value: "Completion needs confirmation." },
        ]}
      />
      <div className="mx-auto max-w-5xl space-y-5 md:space-y-7">
        <section className="rounded-[28px] border border-slate-800 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.98),rgba(2,6,23,0.94))] p-6 shadow-xl shadow-black/25 md:p-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Fix Proof</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-white md:text-4xl">
            {proofReady ? "Review visible implementation proof." : "Changed-state evidence appears after approval."}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
            Updated buying-path evidence stays tied to the approved fix.
          </p>

          <div className="mt-5 rounded-2xl border border-cyan-400/20 bg-cyan-950/10 p-4 md:p-5">
            <p className="text-sm font-semibold text-cyan-100">Every storefront change is reviewed before launch.</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              {proofReady ? "Visible implementation proof is ready for review." : "No storefront change proof exists before approval."}
            </p>
          </div>
        </section>

        <BrowserEvidenceFrame
          title={proofReady ? "Updated buying-path evidence." : "Changed-state evidence is not available yet."}
          subtitle="Review the updated buying path before completion."
          screenshotUrl={screenshotUrl}
          state={proofReady ? "Proof attached" : null}
          callouts={[
            {
              label: "Original buying path",
              note: "Original storefront reference remains visible.",
              tone: "cyan",
            },
            {
              label: "Updated storefront path",
              note: proofReady
                ? "Updated storefront evidence is attached."
                : "Implementation proof appears only after approval.",
              tone: "cyan",
            },
            {
              label: "Merchant confirmation",
              note: "You review visible changes before completion.",
              tone: "slate",
            },
          ]}
        />

        {desktopEvidence ? (
          <EvidenceViewport
            packet={evidencePacket}
            surface={desktopEvidence}
            title="Review the same buying path."
            copy="Original and updated references stay connected."
            showState={false}
          />
        ) : null}

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ["Before", "Original reference."],
            ["Scope", "Approved issue and surface."],
            ["After", "Updated reference when ready."],
            ["Completion", "Accept, revise, or ask."],
          ].map(([title, copy]) => (
            <div key={title} className="border-l border-slate-800 pl-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">{copy}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 border-y border-slate-800/70 py-6 md:grid-cols-2 md:gap-10">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Store</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              {packet?.store_url || store || "Store confirmation required."}
            </p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Boundary</p>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              Visible updates only. No outcome claim.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-slate-800 bg-[linear-gradient(180deg,rgba(8,47,73,0.48),rgba(15,23,42,0.95))] p-5 shadow-lg shadow-black/10 md:p-6">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">Closeout</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Ready for closeout review?</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300">
            Confirm the work, request a revision, or ask a question.
          </p>
          <div className="mt-5 flex flex-wrap gap-3 md:gap-4">
            <Link
              href={
                proofReady
                  ? packet
                    ? packetHref("/fix-complete", packet)
                    : withStore("/fix-complete", store)
                  : packet
                    ? packetHref("/fix-review", packet)
                    : withStore("/fix-review", store)
              }
              className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              {proofReady ? "Review Changed-State Evidence" : "Back to Approval"}
            </Link>
            <Link
              href={packet ? packetHref("/fix-status", packet) : withStore("/fix-status", store)}
              className="rounded-full border border-slate-600 px-5 py-3 text-sm font-semibold text-white transition hover:border-cyan-300 hover:text-cyan-200"
            >
              Back to Status
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
