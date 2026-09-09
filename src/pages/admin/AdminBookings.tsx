import React, { useState } from "react";
import { Search, Eye, Trash2, ChevronDown, Mail, Phone, ExternalLink } from "lucide-react";
import AdminLayout from "@/components/layout/AdminLayout";
import { useAdminGuard } from "@/hooks/useAdmin";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";
import type { Enquiry } from "@/types";

const STATUSES: Enquiry["status"][] = ["NEW","IN_REVIEW","CONTACTED","BOOKED","COMPLETED","ARCHIVED"];

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-mint/10 text-mint",
  IN_REVIEW: "bg-blue-500/10 text-blue-400",
  CONTACTED: "bg-yellow-500/10 text-yellow-400",
  BOOKED: "bg-purple-500/10 text-purple-400",
  COMPLETED: "bg-green-500/10 text-green-400",
  ARCHIVED: "bg-elevated text-muted-slate border border-white/5",
};

export default function AdminBookings() {
  const isAuth = useAdminGuard();
  const { enquiries, updateEnquiryStatus, deleteEnquiry } = useStore();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  if (!isAuth) return null;

  const filtered = enquiries.filter(e => {
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || (e.organisation || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "ALL" || e.status === statusFilter;
    return matchSearch && matchStatus;
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const updateStatus = (id: string, status: Enquiry["status"]) => {
    updateEnquiryStatus(id, status, notes || undefined);
    if (selected?.id === id) setSelected(e => e ? { ...e, status, adminNotes: notes || e.adminNotes } : e);
  };

  return (
    <AdminLayout title="Enquiries & Bookings">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-slate" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, email or organisation..."
              className="w-full bg-elevated border border-white/8 rounded-xl pl-10 pr-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
            <option value="ALL">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="card-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Name", "Organisation", "Type", "Services", "Status", "Date", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-display font-bold tracking-wider text-muted-slate uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(enq => (
                  <tr key={enq.id} className="border-b border-white/5 hover:bg-elevated/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-off-white">{enq.name}</span>
                        {enq.status === "NEW" && <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse flex-shrink-0" />}
                      </div>
                      <div className="text-xs text-muted-slate">{enq.email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-slate text-xs">{enq.organisation || "—"}</td>
                    <td className="px-4 py-3 text-xs text-muted-slate">{enq.type === "PROJECT_ENQUIRY" ? "Enquiry" : "Call Request"}</td>
                    <td className="px-4 py-3 text-xs text-muted-slate">{enq.services.slice(0,2).join(", ") || "—"}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-display font-bold px-2 py-1 rounded-full ${STATUS_COLORS[enq.status]}`}>{enq.status}</span>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-slate">{formatDate(enq.timestamp)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => { setSelected(enq); setNotes(enq.adminNotes || ""); }} className="p-1.5 text-muted-slate hover:text-mint transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setConfirmDelete(enq.id)} className="p-1.5 text-muted-slate hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <div className="text-center py-12 text-muted-slate text-sm">No enquiries found.</div>}
          </div>
        </div>

        {/* Detail drawer */}
        {selected && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-end p-4" onClick={e => { if (e.target === e.currentTarget) setSelected(null); }}>
            <div className="glass-panel rounded-3xl p-8 w-full max-w-lg h-full max-h-[95vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-off-white tracking-wider uppercase">ENQUIRY DETAIL</h2>
                <button onClick={() => setSelected(null)} className="text-muted-slate hover:text-off-white text-xl">×</button>
              </div>

              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <InfoBlock label="Name" value={selected.name} />
                  <InfoBlock label="Organisation" value={selected.organisation || "—"} />
                  <InfoBlock label="Email" value={selected.email} />
                  <InfoBlock label="Phone" value={selected.phone || "—"} />
                  <InfoBlock label="Type" value={selected.type} />
                  <InfoBlock label="Date" value={formatDate(selected.timestamp)} />
                  {selected.bookingDate && <InfoBlock label="Requested Date" value={selected.bookingDate} />}
                  {selected.bookingTime && <InfoBlock label="Requested Time" value={selected.bookingTime} />}
                </div>

                {selected.services.length > 0 && (
                  <div>
                    <p className="section-label text-[10px] mb-2">SERVICES</p>
                    <div className="flex flex-wrap gap-2">
                      {selected.services.map(s => <span key={s} className="text-xs px-2 py-1 rounded-full bg-elevated border border-white/5 text-muted-slate">{s}</span>)}
                    </div>
                  </div>
                )}

                {selected.goals && <InfoBlock label="Goals" value={selected.goals} multiline />}
                {selected.targetDate && <InfoBlock label="Target Date" value={selected.targetDate} />}
                {selected.budget && <InfoBlock label="Budget" value={selected.budget} />}
                {selected.notes && <InfoBlock label="Notes" value={selected.notes} multiline />}

                {selected.configuratorChoices && (
                  <div className="bg-elevated rounded-xl p-4 border border-white/5">
                    <p className="section-label text-[10px] mb-2">CONFIGURATOR DATA</p>
                    <div className="text-xs text-muted-slate space-y-1">
                      <div>Type: {selected.configuratorChoices.businessType}</div>
                      <div>Priority: {selected.configuratorChoices.priority}</div>
                      <div>Needs: {selected.configuratorChoices.needs.join(", ")}</div>
                    </div>
                  </div>
                )}

                <div>
                  <p className="section-label text-[10px] mb-2">STATUS</p>
                  <select value={selected.status} onChange={e => { const s = e.target.value as Enquiry["status"]; setSelected(x => x ? { ...x, status: s } : x); updateStatus(selected.id, s); }}
                    className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none">
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="section-label text-[10px] block mb-2">ADMIN NOTES</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Internal notes..."
                    className="w-full bg-elevated border border-white/8 rounded-xl px-4 py-3 text-off-white text-sm focus:border-mint/30 focus:outline-none resize-none" />
                  <button onClick={() => updateStatus(selected.id, selected.status)} className="mt-2 btn-primary text-xs">SAVE NOTES</button>
                </div>

                <div className="flex gap-3 pt-2">
                  <a href={`mailto:${selected.email}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-elevated border border-white/8 rounded-xl text-xs text-muted-slate hover:text-mint hover:border-mint/20 transition-colors font-display font-bold tracking-wider">
                    <Mail className="w-3.5 h-3.5" /> EMAIL
                  </a>
                  {selected.phone && (
                    <a href={`tel:${selected.phone}`} className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-elevated border border-white/8 rounded-xl text-xs text-muted-slate hover:text-mint hover:border-mint/20 transition-colors font-display font-bold tracking-wider">
                      <Phone className="w-3.5 h-3.5" /> CALL
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-panel rounded-2xl p-8 max-w-sm w-full text-center">
              <Trash2 className="w-8 h-8 text-red-400 mx-auto mb-4" />
              <h3 className="font-heading font-bold text-off-white mb-3">Delete Enquiry?</h3>
              <p className="text-muted-slate text-sm mb-6">This cannot be undone.</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => setConfirmDelete(null)} className="btn-secondary text-xs">CANCEL</button>
                <button onClick={() => { deleteEnquiry(confirmDelete); setConfirmDelete(null); if (selected?.id === confirmDelete) setSelected(null); }}
                  className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-full text-xs font-display font-bold hover:bg-red-500/30 transition-colors">DELETE</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function InfoBlock({ label, value, multiline }: { label: string; value: string; multiline?: boolean }) {
  return (
    <div>
      <p className="section-label text-[10px] mb-1">{label}</p>
      <p className={`text-sm text-off-white/80 ${multiline ? "whitespace-pre-wrap" : "truncate"}`}>{value}</p>
    </div>
  );
}
