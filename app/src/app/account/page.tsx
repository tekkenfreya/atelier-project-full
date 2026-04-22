"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getUser, signOut } from "@/lib/auth";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";

function isSafeRedirect(value: string | null): value is string {
  return !!value && value.startsWith("/") && !value.startsWith("//");
}

function AccountPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const currentUser = await getUser();
      setUser(currentUser);
      setLoading(false);
      const storedName = sessionStorage.getItem("customerName");
      if (storedName) setCustomerName(storedName);
    }
    checkAuth();
  }, []);

  const handleAuth = useCallback(
    (authedUser: User) => {
      const redirect = searchParams.get("redirect");
      if (isSafeRedirect(redirect)) {
        router.replace(redirect);
        return;
      }
      setUser(authedUser);
    },
    [router, searchParams]
  );

  const handleSignOut = useCallback(async () => {
    await signOut();
    setUser(null);
  }, []);

  if (loading) {
    return (
      <div className="account-container">
        <div className="account-loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onAuth={handleAuth} />;
  }

  return <Dashboard user={user} customerName={customerName} onSignOut={handleSignOut} />;
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="account-container"><div className="account-loading">Loading...</div></div>}>
      <AccountPageInner />
    </Suspense>
  );
}
