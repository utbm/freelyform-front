"use client";

import { Button } from "@nextui-org/react";
import { Link } from "@nextui-org/link";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import TypingAnimation from "@/components/ui/typing-animation";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/ui/dot-pattern";

export default function Home() {
  return (
    <section className="relative flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <DotPattern
        className={cn(
          "absolute	inset-0 z-0",
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]",
        )}
      />
      <TypingAnimation
        className="relative text-8xl font-bold text-black dark:text-white z-10"
        duration={100}
        text={siteConfig.name}
      />
      <div className="inline-block text-center justify-center z-10">
        <span className={title()}>Create&nbsp;</span>
        <span className={title({ color: "blue" })}>custom forms&nbsp;</span>
        <br />
        <span className={title()}>quickly and effortlessly.</span>
        <div className={subtitle({ class: "mt-4" })}>
          Design powerful forms with ease using our intuitive drag-and-drop
          interface.
        </div>
      </div>

      <Button as={Link} color="secondary" href={siteConfig.links.github}>
        <GithubIcon /> Check our GitHub
      </Button>
    </section>
  );
}
