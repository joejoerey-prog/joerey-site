import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About | Joe Rey Photography",
  description: "Learn more about Joe Rey Photography and his creative journey capturing landscapes and quiet moments.",
  openGraph: {
    title: "About | Joe Rey Photography",
    description: "Learn more about Joe Rey Photography and his creative journey capturing landscapes and quiet moments.",
    type: "website",
  }
};

export default function AboutPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-20 text-foreground">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Portrait Section */}
        <div className="relative aspect-[2/3] w-full max-w-sm mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/5">
          <Image
            src="/photos/me.jpg"
            alt="Joe Rey Portrait"
            fill
            className="object-cover grayscale hover:grayscale-0 transition-all duration-700"
            priority
            sizes="(max-width: 768px) 100vw, 400px"
          />
        </div>

        {/* Text Content */}
        <div>
          <h1 className="text-4xl font-black mb-8 tracking-tighter">About</h1>

          <div className="space-y-6 font-light leading-relaxed text-lg">
            <p>
              I’m Joe Rey, a photographer based in Cambridgeshire. I focus on capturing quiet moments in nature, shifting light across landscapes, and the character found in the everyday.
            </p>
            <p>
              My work ranges from peaceful countryside scenes to the small, detailed world of macro photography. I love those seconds where everything lines up — the light, the colour, and the silence.
            </p>
            <p>
              When I’m not behind the camera, I’m usually walking the dogs, exploring, or tinkering with tech. Photography keeps me grounded, and I hope it gives others that same stillness.
            </p>
          </div>

          <div className="mt-12 flex justify-end md:justify-start">
            <p className="text-3xl tracking-wide text-foreground" style={{ fontFamily: 'var(--font-pacifico)' }}>
              Joe Rey
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
