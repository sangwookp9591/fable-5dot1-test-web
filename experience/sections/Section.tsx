import type { SectionId } from "@/experience/state/experience-store";
import { sectionLengthVh } from "@/experience/timeline/useScrollTimeline";

export function Section({
  id,
  className,
  children,
  label,
}: {
  id: SectionId;
  className?: string;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <section
      id={id}
      data-section={id}
      className={`section ${className ?? ""}`}
      style={{ height: `${sectionLengthVh(id)}svh` }}
      aria-label={label}
    >
      <div className="stage">
        <div className="stage-inner">{children}</div>
      </div>
    </section>
  );
}
