// components/Header.tsx
export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/60 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 py-3 flex items-center justify-between">
        {/* Logo (PNG in public/photos/logo.png) */}
        <a href="#hero" aria-label="Back to top" className="shrink-0">
          <img
            src="/photos/logo.png"
            alt="Joe Rey Photography logo"
            className="h-10 w-auto"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Nav */}
        <nav aria-label="Primary" className="hidden sm:block">
          <ul className="flex items-center gap-6 text-sm">
            <li><a href="#portfolio" className="text-white/90 hover:text-white">Portfolio</a></li>
            <li><a href="#about" className="text-white/90 hover:text-white">About</a></li>
            <li><a href="#contact" className="text-white/90 hover:text-white">Contact</a></li>
            <li>
              <a
                href="https://www.clickasnap.com/profile/joereyphotos"
                target="_blank"
                rel="noreferrer"
                className="text-white/90 hover:text-white"
              >
                Shop
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}