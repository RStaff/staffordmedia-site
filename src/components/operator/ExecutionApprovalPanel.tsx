import ExecutionReviewCard, { ReviewBadge, ReviewField } from "./ExecutionReviewCard";

export type ExecutionApprovalPanelData = {
  approvalState: string;
  operatorApprovalRequired: boolean;
  merchantApprovalRequired: boolean;
  approvalCompatibilityValid: boolean;
  allowedNextTransitions: string[];
  taskApprovalState: string;
  packetRossApproval: string;
  packetMerchantApproval: string;
};

export default function ExecutionApprovalPanel({ approval }: { approval: ExecutionApprovalPanelData }) {
  return (
    <ExecutionReviewCard title="Approval Readiness" eyebrow="Explicit gates">
      <div className="flex flex-wrap gap-2">
        <ReviewBadge value={approval.approvalState} />
        <ReviewBadge value={approval.approvalCompatibilityValid} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <ReviewField label="Operator approval required" value={<ReviewBadge value={approval.operatorApprovalRequired} />} />
        <ReviewField label="Merchant approval required" value={<ReviewBadge value={approval.merchantApprovalRequired} />} />
        <ReviewField label="Task approval state" value={approval.taskApprovalState} />
        <ReviewField label="Packet Ross approval" value={approval.packetRossApproval} />
        <ReviewField label="Packet merchant approval" value={approval.packetMerchantApproval} />
        <ReviewField label="Allowed next transitions" value={approval.allowedNextTransitions.length ? approval.allowedNextTransitions.join(", ") : "None"} />
      </div>
    </ExecutionReviewCard>
  );
}

