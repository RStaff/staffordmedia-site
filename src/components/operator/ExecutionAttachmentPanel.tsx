import ExecutionReviewCard, { ReviewBadge, ReviewField } from "./ExecutionReviewCard";

export type ExecutionAttachmentPanelData = {
  attachmentId: string;
  merchantId: string;
  currentFulfillmentState: string;
  surfaceOrigin: string;
  createdAt: string;
  allowedNextTransitions: string[];
  runtimeStateReference: string;
  executionTaskReference: string;
  mutationPacketReference: string;
  qaProofReference: string;
};

export default function ExecutionAttachmentPanel({ attachment }: { attachment: ExecutionAttachmentPanelData }) {
  return (
    <ExecutionReviewCard title="Fulfillment Attachment" eyebrow="Canonical chain">
      <div className="flex flex-wrap gap-2">
        <ReviewBadge value={attachment.currentFulfillmentState} />
        <ReviewBadge value={attachment.surfaceOrigin} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewField label="Attachment" value={attachment.attachmentId} />
        <ReviewField label="Merchant" value={attachment.merchantId} />
        <ReviewField label="Created" value={attachment.createdAt} />
        <ReviewField label="Allowed next" value={attachment.allowedNextTransitions.length ? attachment.allowedNextTransitions.join(", ") : "None"} />
      </div>
      <div className="grid gap-3">
        <ReviewField label="Runtime state" value={attachment.runtimeStateReference} />
        <ReviewField label="Execution task" value={attachment.executionTaskReference} />
        <ReviewField label="Mutation packet" value={attachment.mutationPacketReference} />
        <ReviewField label="QA / proof" value={attachment.qaProofReference} />
      </div>
    </ExecutionReviewCard>
  );
}

