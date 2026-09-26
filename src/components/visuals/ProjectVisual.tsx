import Image from "next/image";
import type { Project } from "@/data/projects";
import { HookSendMock } from "./HookSendMock";
import { FleetMock } from "./FleetMock";
import { CrmMock } from "./CrmMock";
import { TelecomMock } from "./TelecomMock";

const MOCKS = {
  hooksend: HookSendMock,
  fleet: FleetMock,
  crm: CrmMock,
  telecom: TelecomMock,
};

// The picture for a project: its real screenshots when it has them,
// otherwise an animated illustration of what it does.
export function ProjectVisual({ project, sizes, preload = false }: { project: Project; sizes: string; preload?: boolean }) {
  const visual = project.visual;
  if (visual.kind === "image") {
    return (
      <Image
        src={visual.src}
        alt={visual.alt}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover object-[72%_50%]"
      />
    );
  }
  const Mock = MOCKS[visual.mock];
  return <Mock />;
}

// Dark panel lit with the project's colour, behind every visual.
export function visualBackdrop(color: string) {
  return {
    background: `radial-gradient(90% 80% at 75% 20%, ${color}38, transparent 60%), radial-gradient(70% 60% at 10% 100%, ${color}1f, transparent 60%), #111116`,
  };
}
