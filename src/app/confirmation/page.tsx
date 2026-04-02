"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

interface VerifiedLineItem {
  name: string;
  quantity: number;
  amountTotal: number;
}

interface VerifiedSession {
  status: string;
  customerEmail: string | null;
  customerName: string | null;
  amountTotal: number | null;
  currency: string | null;
  lineItems: VerifiedLineItem[];
  mode: string;
  shippingName: string | null;
  shippingCity: string | null;
}

const MODE_LABELS: Record<string, string> = {
  payment: "One-Time Purchase",
  subscription: "Subscription",
};

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [session, setSession] = useState<VerifiedSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      router.push("/");
      return;
    }

    async function verifySession(id: string) {
      try {
        const response = await fetch(`/api/verify-session?session_id=${encodeURIComponent(id)}`);

        if (!response.ok) {
          throw new Error("Failed to verify payment");
        }

        const data: VerifiedSession = await response.json();

        if (data.status !== "complete") {
          throw new Error("Payment was not completed");
        }

        setSession(data);

        sessionStorage.removeItem("cartItems");
        sessionStorage.removeItem("subscriptionPlan");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Verification failed");
      } finally {
        setLoading(false);
      }
    }

    verifySession(sessionId);
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-loading">Verifying your payment...</div>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="confirmation-container">
        <div className="confirmation-header">
          <h1 className="confirmation-title">Something went wrong</h1>
          <p className="confirmation-subtitle">{error ?? "Unable to verify payment."}</p>
        </div>
        <div className="confirmation-actions">
          <button
            type="button"
            className="confirmation-btn"
            onClick={() => router.push("/")}
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const totalEuros = session.amountTotal !== null ? (session.amountTotal / 100).toFixed(2) : "0.00";

  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">
        <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="23" stroke="var(--accent)" strokeWidth="1.5" />
          <path
            d="M14 24L21 31L34 17"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="confirmation-header">
        <span className="confirmation-label">Thank You</span>
        <h1 className="confirmation-title">Order Confirmed</h1>
        {session.customerEmail && (
          <p className="confirmation-subtitle">
            A confirmation email will be sent to {session.customerEmail}
          </p>
        )}
      </div>

      <div className="confirmation-summary">
        <h2 className="confirmation-summary-title">Order Summary</h2>

        <div className="confirmation-items">
          {session.lineItems.map((item, index) => (
            <div key={index} className="confirmation-item">
              <div>
                <span className="confirmation-item-name">{item.name}</span>
              </div>
              <span className="confirmation-item-price">
                €{(item.amountTotal / 100).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="confirmation-divider" />

        <div className="confirmation-detail-row">
          <span>Plan</span>
          <span>{MODE_LABELS[session.mode] ?? session.mode}</span>
        </div>

        {session.shippingName && (
          <div className="confirmation-detail-row">
            <span>Shipping to</span>
            <span>
              {session.shippingName}
              {session.shippingCity ? `, ${session.shippingCity}` : ""}
            </span>
          </div>
        )}

        <div className="confirmation-divider" />

        <div className="confirmation-totals">
          <div className="confirmation-detail-row confirmation-total">
            <span>Total</span>
            <span>€{totalEuros}</span>
          </div>
        </div>
      </div>

      <div className="confirmation-actions">
        <button
          type="button"
          className="confirmation-btn"
          onClick={() => router.push("/")}
        >
          Return Home
        </button>
      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="confirmation-container">
          <div className="confirmation-loading">Loading...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
