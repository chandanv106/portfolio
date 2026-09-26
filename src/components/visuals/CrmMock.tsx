import { FitBox } from "./FitBox";

const LEADS = [
  { name: "Harbour Bakery", field: "Outlets: 3", status: "Won", tone: "bg-[#2fd9a6]/15 text-[#5ff0c0]" },
  { name: "Northside Pharma", field: "POS: Yes", status: "Contacted", tone: "bg-[#ffc21a]/15 text-[#ffd35c]" },
  { name: "Lotus Salon", field: "Chairs: 8", status: "New", tone: "bg-[#9b8cff]/20 text-[#c2b8ff]" },
  { name: "Metro Hardware", field: "Sq ft: 2,400", status: "New", tone: "bg-[#9b8cff]/20 text-[#c2b8ff]" },
];

// Illustration of the CRM: leads with custom per-vertical fields, attendance
// and an encrypted banking field. Invented data; the real app is private.
export function CrmMock() {
  return (
    <FitBox width={600} height={480}>
      <div className="relative h-full w-full text-white">
        <div className="absolute inset-x-[18px] top-[18px] bottom-[18px] overflow-hidden rounded-[22px] border border-white/10 bg-[#0e0d18] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5 border-b border-white/[0.07] px-4 py-3">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="ml-3 text-[11px] text-white/45">sleek · admin</span>
          </div>
          <div className="flex h-full">
            <div className="flex w-[54px] flex-col items-center gap-4 border-r border-white/[0.07] pt-5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={`size-7 rounded-lg ${i === 0 ? "bg-[#9b8cff]" : "bg-white/[0.07]"}`} />
              ))}
            </div>
            <div className="flex-1 p-5">
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-[10.5px] uppercase tracking-[0.14em] text-white/45">Leads · Retail vertical</div>
                  <div className="mt-1 font-display text-[22px] font-extrabold">Pipeline</div>
                </div>
                <span className="rounded-full border border-dashed border-[#9b8cff]/60 px-3 py-1.5 text-[11px] font-semibold text-[#c2b8ff]">
                  + Custom field
                </span>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2.5">
                {[
                  ["Leads", "128"],
                  ["On shift", "24"],
                  ["Won", "31%"],
                ].map(([k, v]) => (
                  <div key={k} className="rounded-2xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5">
                    <div className="text-[10px] text-white/45">{k}</div>
                    <div className="font-display text-[20px] font-extrabold">{v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {LEADS.map((lead, i) => (
                  <div
                    key={lead.name}
                    className="flex animate-[crm-row_7s_var(--ease-expo)_infinite] items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.025] px-3 py-2.5"
                    style={{ animationDelay: `${i * 0.35}s` }}
                  >
                    <div>
                      <div className="text-[12px] font-bold">{lead.name}</div>
                      <div className="mt-0.5 inline-block rounded-md bg-white/[0.06] px-1.5 py-0.5 font-mono text-[9.5px] text-white/55">{lead.field}</div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-[10.5px] font-bold ${lead.tone}`}>{lead.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="absolute -right-2 top-[118px] w-[196px] animate-[float-y_6s_ease-in-out_infinite] rounded-2xl border border-white/12 bg-[#17152a] p-3.5 shadow-2xl">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/45">Bank details</div>
          <div className="mt-1.5 font-mono text-[13px] font-bold tracking-widest">•••• •••• 4821</div>
          <div className="mt-2 flex items-center gap-1.5 text-[10.5px] font-semibold text-[#5ff0c0]">🔒 AES-256-GCM</div>
        </div>
        <div className="absolute -left-2 bottom-[40px] w-[190px] animate-[float-y_7s_ease-in-out_infinite_reverse] rounded-2xl border border-white/12 bg-[#17152a] p-3.5 shadow-2xl">
          <div className="text-[10px] uppercase tracking-[0.14em] text-white/45">Attendance</div>
          <div className="mt-1.5 text-[13px] font-bold">Clocked in · 09:02</div>
          <div className="mt-1 text-[10.5px] text-white/55">Office network ✓</div>
        </div>
      </div>
    </FitBox>
  );
}
