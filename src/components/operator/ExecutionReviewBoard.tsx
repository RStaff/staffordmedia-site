import ExecutionApprovalPanel, { type ExecutionApprovalPanelData } from "./ExecutionApprovalPanel";
import ExecutionAttachmentPanel, { type ExecutionAttachmentPanelData } from "./ExecutionAttachmentPanel";
import ExecutionReviewCard, { ReviewBadge, ReviewField } from "./ExecutionReviewCard";
import ExecutionRiskPanel, { type ExecutionRiskPanelData } from "./ExecutionRiskPanel";

export type ExecutionReviewData = {
  attachment: ExecutionAttachmentPanelData;
  runtime: {
    merchantId: string;
    storeDomain: string;
    lifecycleState: string;
    runtimeOwner: string;
    riskLevel: string;
    mutationDepth: string;
    replayable: boolean;
    rollbackReady: boolean;
  };
  task: {
    taskId: string;
    executionScope: string;
    allowedExecutor: string;
    executionStatus: string;
    operatorApprovalRequired: boolean;
    merchantApprovalRequired: boolean;
  };
  packet: {
    packetId: string;
    scope: string;
    mutationDepth: string;
    allowedFiles: string[];
    prohibitedFiles: string[];
  };
  proof: {
    proofPath: string;
    status: string;
    validationReference: string;
    replayable: boolean;
    rollbackReference?: string;
    warnings: string[];
  };
  risk: ExecutionRiskPanelData;
  approval: ExecutionApprovalPanelData;
};

function FileList({ files }: { files: string[] }) {
  if (!files.length) return <p className="text-sm text-slate-500">None recorded.</p>;
  return (
    <ul className="grid gap-1">
      {files.map((file) => (
        <li key={file} className="break-words rounded border border-slate-800 bg-slate-900/45 px-2 py-1 text-xs text-slate-300">
          {file}
        </li>
      ))}
    </ul>
  );
}

export default function ExecutionReviewBoard({ reviews }: { reviews: ExecutionReviewData[] }) {
  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-slate-800 bg-slate-950/70 p-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-200">Fulfillment Execution Review</p>
            <h1 className="mt-2 text-xl font-semibold text-white">Pre-execution operator cockpit</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
              Read-only review of runtime truth, execution task boundaries, mutation packet scope, QA/proof evidence, approvals, rollback, and replayability.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ReviewBadge value="READ ONLY" />
            <ReviewBadge value="NO EXECUTION ACTIVE" />
            <ReviewBadge value="NO SHOPIFY MUTATION" />
            <ReviewBadge value="MANUAL EXECUTION REQUIRED" />
          </div>
        </div>
      </section>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <article key={review.attachment.attachmentId} className="space-y-5 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
            <ExecutionAttachmentPanel attachment={review.attachment} />

            <div className="grid gap-5 xl:grid-cols-2">
              <ExecutionReviewCard title="Merchant Runtime State" eyebrow="Runtime truth">
                <div className="flex flex-wrap gap-2">
                  <ReviewBadge value={review.runtime.lifecycleState} />
                  <ReviewBadge value={review.runtime.riskLevel} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ReviewField label="Merchant" value={review.runtime.merchantId} />
                  <ReviewField label="Store" value={review.runtime.storeDomain} />
                  <ReviewField label="Runtime owner" value={review.runtime.runtimeOwner} />
                  <ReviewField label="Mutation depth" value={review.runtime.mutationDepth} />
                  <ReviewField label="Replayable" value={<ReviewBadge value={review.runtime.replayable} />} />
                  <ReviewField label="Rollback readiness" value={<ReviewBadge value={review.runtime.rollbackReady} />} />
                </div>
              </ExecutionReviewCard>

              <ExecutionReviewCard title="Execution Task" eyebrow="Governed request">
                <div className="flex flex-wrap gap-2">
                  <ReviewBadge value={review.task.executionStatus} />
                  <ReviewBadge value={review.task.allowedExecutor} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <ReviewField label="Task" value={review.task.taskId} />
                  <ReviewField label="Scope" value={review.task.executionScope} />
                  <ReviewField label="Operator approval" value={<ReviewBadge value={review.task.operatorApprovalRequired} />} />
                  <ReviewField label="Merchant approval" value={<ReviewBadge value={review.task.merchantApprovalRequired} />} />
                </div>
              </ExecutionReviewCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
              <ExecutionReviewCard title="Mutation Packet" eyebrow="Bounded work">
                <div className="flex flex-wrap gap-2">
                  <ReviewBadge value={review.packet.mutationDepth} />
                  <ReviewBadge value={review.packet.scope} />
                </div>
                <ReviewField label="Packet" value={review.packet.packetId} />
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Allowed files</p>
                    <div className="mt-2">
                      <FileList files={review.packet.allowedFiles} />
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Prohibited files</p>
                    <div className="mt-2">
                      <FileList files={review.packet.prohibitedFiles} />
                    </div>
                  </div>
                </div>
              </ExecutionReviewCard>

              <ExecutionReviewCard title="QA / Proof Visibility" eyebrow="Evidence">
                <div className="flex flex-wrap gap-2">
                  <ReviewBadge value={review.proof.status} />
                  <ReviewBadge value={review.proof.replayable} />
                </div>
                <ReviewField label="Proof reference" value={review.proof.proofPath} />
                <ReviewField label="Validation reference" value={review.proof.validationReference} />
                <ReviewField label="Rollback reference" value={review.proof.rollbackReference || "Not attached"} />
                <ReviewField label="Warnings" value={review.proof.warnings.length ? review.proof.warnings.join("; ") : "None"} />
              </ExecutionReviewCard>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <ExecutionRiskPanel risk={review.risk} />
              <ExecutionApprovalPanel approval={review.approval} />
            </div>
          </article>
        ))
      ) : (
        <section className="rounded-lg border border-dashed border-slate-800 bg-slate-950/70 p-6">
          <p className="text-sm font-semibold text-slate-300">No fulfillment attachments registered.</p>
          <p className="mt-2 text-sm text-slate-500">The review cockpit waits for canonical attachment artifacts before showing execution readiness.</p>
        </section>
      )}
    </div>
  );
}

