import React from "react";

export default function Footer() {
  return (
    <footer className="py-10 text-center text-[#f5efe7b3] text-sm border-t border-[#6b5550]">
      © {new Date().getFullYear()} Joe Rey Photography
    </footer>
  );
}
