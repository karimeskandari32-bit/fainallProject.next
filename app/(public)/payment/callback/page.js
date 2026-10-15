import { Suspense } from "react";
import CallbackContent from "./CallbackContent";

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<p>در حال بررسی پرداخت...</p>}>
      <CallbackContent />
    </Suspense>
  );
}