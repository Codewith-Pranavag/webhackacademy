import Image from "next/image";
import { partners } from "@/constants/data";

export function PartnersStrip() {
  const loop = [...partners, ...partners];
  return (
    <section className="border-y border-line bg-white py-12">
      <div className="container-page flex flex-col items-center gap-8">
        <p className="max-w-2xl text-center text-lg text-body">
          Develop skills with online courses from{" "}
          <span className="font-semibold text-violet-deep">200+</span> renowned
          universities &amp; institutions.
        </p>

        <div className="marquee-paused relative w-full overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
          <div className="marquee-track marquee-left gap-14">
            {loop.map((logo, i) => (
              <div
                key={i}
                className="flex h-12 w-32 shrink-0 items-center justify-center opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
              >
                <Image
                  src={logo}
                  alt="Partner institution"
                  width={128}
                  height={40}
                  className="max-h-10 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
