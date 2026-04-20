import { Metadata } from "next";

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
    <main className="max-w-3xl mx-auto px-6 py-20 text-foreground">
      <h1 className="text-3xl font-semibold mb-8">About</h1>

      <div className="mb-8 font-light leading-relaxed">
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

      <div className="mt-12 flex justify-end">
        <p className="text-2xl tracking-wide text-foreground font-pacifico">
          Joe Rey
        </p>
      </div>
    </main>
  );
}
