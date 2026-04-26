'use client';

import React, { useEffect, useState } from "react";
import { account } from "@/lib/appwrite";
import { LogOut, Instagram, Facebook, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <footer className="py-12 text-center flex flex-col items-center gap-6 border-t border-border bg-background">
      {/* Social Links */}
      <div className="flex items-center gap-6">
        <Link
          href="https://instagram.com/joe.rey.photography"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </Link>
        <Link
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </Link>
        <Link
          href="mailto:joereyphotography@hotmail.com"
          className="text-foreground-muted hover:text-accent transition-colors"
          aria-label="Email"
        >
          <Mail size={20} />
        </Link>
      </div>

      <div className="text-foreground-muted text-sm">
        © {new Date().getFullYear()} Joe Rey Photography. All rights reserved.
      </div>
      <div className="text-foreground-muted text-xs">
        Built with passion for nature and light.
      </div>

      {isLoggedIn && (
        <button
          onClick={handleLogout}
          aria-label="Sign out of admin dashboard"
          className="flex items-center gap-2 text-[10px] uppercase font-black tracking-widest text-foreground-muted hover:text-red-400 transition-colors"
        >
          <LogOut size={12} />
          Sign Out Admin
        </button>
      )}
    </footer>
  );
}
