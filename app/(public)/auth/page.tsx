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
      Auth
    </section>
  );
}
