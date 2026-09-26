import AutomateClient from "./AutomateClient";
import {
  resolveAutomationBlueprintPaymentUrl,
  type AutomationBlueprintPaymentEnvironment,
} from "@/lib/automationIntake";

function paymentEnvironment(): AutomationBlueprintPaymentEnvironment {
  return process.env.VERCEL_ENV === "preview" ? "preview" : "production";
}

export default function AutomatePage() {
  const environment = paymentEnvironment();
  const paymentUrl = resolveAutomationBlueprintPaymentUrl(
    process.env.NEXT_PUBLIC_AUTOMATION_BLUEPRINT_PAYMENT_URL,
    environment,
  );

  return (
    <AutomateClient
      paymentUrl={paymentUrl}
      paymentEnvironment={environment}
    />
  );
}
