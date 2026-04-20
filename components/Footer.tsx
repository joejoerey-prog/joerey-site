'use client';

import React, { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        await account.get();
        setIsLoggedIn(true);
      } catch (err) {
        setIsLoggedIn(false);
      }
    };
    checkSession();
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setIsLoggedIn(false);
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <footer className="py-10 text-center flex flex-col items-center gap-4 border-t border-border bg-background">
      <div className="text-foreground-muted text-sm opacity-70">
        © {new Date().getFullYear()} Joe Rey Photography
      </div>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-foreground-muted hover:text-red-400 transition-colors"
        >
          <LogOut size={12} />
          Sign Out Admin
        </button>
      )}
    </footer>
  );
}
