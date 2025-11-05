import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About – Joe Rey Photography",
  description: "Learn more about Joe Rey Photography and his creative journey.",
};

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-20 text-[#f5efe7]">
      <h1 className="text-3xl font-semibold mb-6">All About Me</h1>

      <div className="mb-8">
        <p className="text-lg mb-4">
          I’m Joe Rey, a photographer based in Cambridgeshire. I focus on capturing quiet moments in nature, shifting light across landscapes, and the character found in the everyday. 
        </p>
        <p className="text-lg mb-4">
          My work ranges from peaceful countryside scenes to the small, detailed world of macro photography. I love those seconds where everything lines up — the light, the colour, and the silence.
        </p>
        <p className="text-lg mb-4">
          When I’m not behind the camera, I’m usually walking the dogs, exploring, or tinkering with tech. Photography keeps me grounded, and I hope it gives others that same stillness.
        </p>
      </div>

      <div className="mb-12 flex justify-center">
        <Image
          src="/photos/me.jpg"
          alt="Portrait of Joe Rey"
          width={200}
          height={150}
          className="rounded-2xl shadow-lg border border-[#856c67]"
          unoptimized
        />
      </div>

      <div className="mt-12 flex justify-end">
        <p
          className="text-2xl tracking-wide"
          style={{ fontFamily: 'var(--font-pacifico)' }}
        >
          Joe Rey
        </p>
      </div>
    </main>
  );
}