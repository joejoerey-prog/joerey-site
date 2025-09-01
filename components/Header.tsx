"use client";
import Image from "next/image";

export default function Header() {
  return (
    <header className="w-full flex items-center justify-start p-4">
      {/* Logo */}
      <div className="flex items-center">
        <Image
          src="/photos/logo.png" // 👈 make sure your logo file is in public/photos/logo.png
          alt="Joe Rey Photography logo"
          width={80}
          height={80}
          priority
        />
      </div>
    </header>
  );
}