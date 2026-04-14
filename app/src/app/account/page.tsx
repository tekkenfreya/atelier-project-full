"use client";

import { useCallback, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { getUser, signOut } from "@/lib/auth";
import Dashboard from "./Dashboard";
import LoginForm from "./LoginForm";

export default function AccountPage() {
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
    return <LoginForm onAuth={setUser} />;
  }

  return <Dashboard user={user} customerName={customerName} onSignOut={handleSignOut} />;
}
