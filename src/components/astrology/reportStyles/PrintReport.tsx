import { ReportHeader } from "../ReportHeader";
import type { ReportViewData } from "../reportTypes";

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

/** The structured, table-heavy voice — also the universal template used for every printed/PDF report. */
export function PrintReport({ data }: { data: ReportViewData }) {
  const { narrative, chart, profile, depth } = data;
  const birthDate = new Date(profile.birthDate);

  return (
    <article className="mx-auto flex max-w-[800px] flex-col gap-6 bg-white p-8 text-[#1a1a2e]">
      <ReportHeader subtitle={`Horoscope report for ${profile.fullName}`} />

      <section className="astro-report-section grid grid-cols-2 gap-4 rounded-xl border border-border-soft p-4 text-sm sm:grid-cols-4">
        <Fact label="Name" value={profile.fullName} />
        <Fact label="Born" value={birthDate.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })} />
        <Fact label="Birthplace" value={profile.birthPlace} />
        <Fact label="Ascendant" value={`${chart.ascendant.rashi.english} (${chart.ascendant.rashi.name})`} />
      </section>

      <h1 className="astro-report-section text-2xl font-bold">{narrative.headline}</h1>

      {narrative.sections.map((section) => (
        <section key={section.heading} className="astro-report-section flex flex-col gap-2">
          <h2 className="text-base font-semibold brand-gradient-text">{section.heading}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-[#2a2a3d]">{section.body}</p>
        </section>
      ))}

      {depth === "FULL" && (
        <>
          <section className="astro-report-section astro-page-break flex flex-col gap-3">
            <h2 className="text-base font-semibold brand-gradient-text">Planetary Positions</h2>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="py-1.5 pr-2 font-semibold">Planet</th>
                  <th className="py-1.5 pr-2 font-semibold">Rashi</th>
                  <th className="py-1.5 pr-2 font-semibold">Nakshatra</th>
                  <th className="py-1.5 font-semibold">Pada</th>
                </tr>
              </thead>
              <tbody>
                {chart.planets.map((p) => (
                  <tr key={p.planet} className="border-b border-border-soft/60">
                    <td className="py-1.5 pr-2">{p.planet}</td>
                    <td className="py-1.5 pr-2">
                      {p.rashi.english} ({p.rashi.name})
                    </td>
                    <td className="py-1.5 pr-2">{p.nakshatra.name}</td>
                    <td className="py-1.5">{p.nakshatra.pada}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section className="astro-report-section flex flex-col gap-3">
            <h2 className="text-base font-semibold brand-gradient-text">Age-Based Life Timeline</h2>
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border-soft">
                  <th className="py-1.5 pr-2 font-semibold">Age range</th>
                  <th className="py-1.5 pr-2 font-semibold">Ruling planet</th>
                  <th className="py-1.5 font-semibold">Life themes</th>
                </tr>
              </thead>
              <tbody>
                {chart.ageBands.map((band) => (
                  <tr key={band.fromAge} className="border-b border-border-soft/60">
                    <td className="py-1.5 pr-2 whitespace-nowrap">
                      {band.fromAge}–{band.toAge}
                    </td>
                    <td className="py-1.5 pr-2">{band.lord}</td>
                    <td className="py-1.5">{band.theme}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </>
      )}

      <footer className="astro-report-section mt-auto flex items-center justify-between border-t border-border-soft pt-3 text-[10px] text-muted">
        <span>MyLoginn Astrology — for self-reflection and entertainment purposes.</span>
        <span>Ayanamsa: Lahiri ({chart.ayanamsaUsed.toFixed(2)}°)</span>
      </footer>
    </article>
  );
}
