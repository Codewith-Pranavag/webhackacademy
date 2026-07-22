export function LegalContent({
  updated,
  sections,
}: {
  updated: string;
  sections: { heading: string; body: string[] }[];
}) {
  return (
    <section className="py-16 lg:py-20">
      <div className="container-page max-w-3xl">
        <p className="mb-10 text-sm text-muted">Last updated: {updated}</p>
        <div className="flex flex-col gap-10">
          {sections.map((s) => (
            <div key={s.heading} className="flex flex-col gap-3">
              <h2 className="text-2xl font-semibold">{s.heading}</h2>
              {s.body.map((p, i) => (
                <p key={i} className="text-body">
                  {p}
                </p>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
