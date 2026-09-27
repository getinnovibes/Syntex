import React, { useEffect, useState, useMemo } from 'react';
import { fetchInquiries, updateInquiryStatus, deleteInquiry } from '../../lib/supabase';
import { Inquiry } from '../../types';
import { formatDate } from '../../lib/utils';
import { Modal } from '../../components/common/Modal';
import { Toast } from '../../components/common/Toast';

export const AdminInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'new' | 'in_progress' | 'completed'>('all');
  const [search, setSearch] = useState('');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [deletingInquiry, setDeletingInquiry] = useState<Inquiry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadInquiries = async () => {
    try {
      const data = await fetchInquiries();
      setInquiries(data);
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleStatusChange = async (id: string, newStatus: Inquiry['status']) => {
    await updateInquiryStatus(id, newStatus);
    setInquiries((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: newStatus } : i))
    );
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    setToastMessage(`Inquiry status updated to ${newStatus.replace('_', ' ')}.`);
  };

  const confirmDelete = async () => {
    if (!deletingInquiry) return;
    try {
      await deleteInquiry(deletingInquiry.id);
      setInquiries((prev) => prev.filter((i) => i.id !== deletingInquiry.id));
      if (selectedInquiry?.id === deletingInquiry.id) {
        setSelectedInquiry(null);
      }
      setToastMessage('Inquiry deleted.');
    } catch (err: any) {
      setToastMessage(`Delete failed: ${err.message}`);
    } finally {
      setDeletingInquiry(null);
    }
  };

  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const matchFilter = filter === 'all' || inq.status === filter;
      const matchSearch =
        search.trim() === '' ||
        inq.client_name.toLowerCase().includes(search.toLowerCase()) ||
        inq.email?.toLowerCase().includes(search.toLowerCase()) ||
        inq.service_type.toLowerCase().includes(search.toLowerCase()) ||
        inq.brief.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [inquiries, filter, search]);

  return (
    <div className="w-full max-w-[1440px] mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in pb-24">
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={Boolean(deletingInquiry)}
        title="Delete client inquiry?"
        description={`Are you sure you want to delete inquiry from "${deletingInquiry?.client_name}"?`}
        confirmText="Delete"
        isDestructive
        onConfirm={confirmDelete}
        onCancel={() => setDeletingInquiry(null)}
      />

      {/* Detail Drawer Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-surface-container-lowest p-6 md:p-8 shadow-2xl border border-outline-variant/40 flex flex-col gap-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-4">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary">
                  Client Brief Casefile
                </span>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                  {selectedInquiry.client_name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-1 rounded-full text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[24px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-surface-container-low p-4 rounded-2xl">
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary block">
                  Email
                </span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="font-medium text-primary hover:underline"
                >
                  {selectedInquiry.email || 'None provided'}
                </a>
              </div>
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary block">
                  Service Requested
                </span>
                <span className="font-medium text-on-surface">
                  {selectedInquiry.service_type}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary block">
                  Budget Estimate
                </span>
                <span className="font-mono text-on-surface font-semibold">
                  {selectedInquiry.budget || 'Custom'}
                </span>
              </div>
              <div>
                <span className="font-label-sm text-[11px] uppercase tracking-wider text-secondary block">
                  Received On
                </span>
                <span className="font-label-sm text-secondary">
                  {formatDate(selectedInquiry.created_at)}
                </span>
              </div>
            </div>

            {selectedInquiry.reference_url && (
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-1">
                  Reference / Moodboard URL
                </span>
                <a
                  href={selectedInquiry.reference_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-surface-container font-mono text-xs text-primary hover:underline"
                >
                  <span>{selectedInquiry.reference_url}</span>
                  <span className="material-symbols-outlined text-[14px]">north_east</span>
                </a>
              </div>
            )}

            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-1">
                Project Scope & Brief
              </span>
              <div className="p-4 rounded-2xl bg-surface-container-low text-on-surface font-body-md text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {selectedInquiry.brief}
              </div>
            </div>

            {selectedInquiry.notes && (
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary block mb-1">
                  Additional Notes
                </span>
                <div className="p-3 rounded-xl bg-surface-container-low text-secondary font-body-sm text-sm">
                  {selectedInquiry.notes}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-label-sm text-label-sm text-secondary">Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) =>
                    handleStatusChange(
                      selectedInquiry.id,
                      e.target.value as Inquiry['status']
                    )
                  }
                  className="px-3 py-1.5 rounded-full bg-surface-container font-label-sm text-xs font-semibold border border-outline-variant/40"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedInquiry(null)}
                className="px-5 py-2 rounded-full bg-primary-container text-white font-label-md text-label-sm font-semibold hover:bg-primary"
              >
                Close Casefile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-outline-variant/30">
        <div>
          <h1 className="font-headline-xl text-2xl md:text-3xl font-semibold text-on-surface tracking-tight">
            Client Inquiries & Briefs
          </h1>
          <p className="font-body-md text-sm md:text-base text-secondary mt-1">
            Review and manage client requests sent from your public website contact form.
          </p>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 my-6">
        <div className="flex items-center gap-1.5 p-1 bg-surface-container-low rounded-full overflow-x-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              filter === 'all'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            All ({inquiries.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              filter === 'new'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            New ({inquiries.filter((i) => i.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              filter === 'in_progress'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-4 py-1.5 rounded-full font-label-sm text-label-sm transition-all ${
              filter === 'completed'
                ? 'bg-surface-container-lowest text-primary font-semibold shadow-sm'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            Completed
          </button>
        </div>

        <div className="relative min-w-[260px]">
          <input
            type="text"
            placeholder="Search inquiries..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-surface-container-lowest pl-10 pr-4 py-2.5 rounded-full font-body-sm text-body-sm text-on-surface placeholder:text-outline border border-outline-variant/40 focus:outline-none focus:border-primary shadow-sm"
          />
          <span className="material-symbols-outlined absolute left-3.5 top-2.5 text-outline text-[18px]">
            search
          </span>
        </div>
      </div>

      {/* Inquiries Table */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-[0_12px_32px_-16px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant/20 bg-surface-container-low/40 text-outline font-label-sm text-label-sm">
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Client</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Service</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Budget</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Status</th>
                <th className="py-4 px-4 font-medium uppercase tracking-wider">Date</th>
                <th className="py-4 px-4 text-right font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm text-body-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary">
                    Loading inquiries...
                  </td>
                </tr>
              ) : filteredInquiries.length > 0 ? (
                filteredInquiries.map((inq) => (
                  <tr
                    key={inq.id}
                    onClick={() => setSelectedInquiry(inq)}
                    className="hover:bg-surface-container-low/50 transition-colors cursor-pointer"
                  >
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary-container text-primary font-bold text-xs flex items-center justify-center">
                          {inq.client_name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-on-surface">
                            {inq.client_name}
                          </span>
                          <span className="font-label-sm text-[11px] text-outline">
                            {inq.email || 'No email provided'}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant font-label-sm text-[11px]">
                        {inq.service_type}
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-mono font-medium text-on-surface">
                      {inq.budget || 'Custom'}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-label-sm text-[11px] font-semibold ${
                          inq.status === 'new'
                            ? 'bg-secondary-container text-primary'
                            : inq.status === 'in_progress'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            inq.status === 'new'
                              ? 'bg-primary'
                              : inq.status === 'in_progress'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        />
                        <span className="capitalize">{inq.status.replace('_', ' ')}</span>
                      </span>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap font-label-sm text-[11px] text-outline">
                      {formatDate(inq.created_at)}
                    </td>

                    <td
                      className="py-4 px-4 text-right whitespace-nowrap"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="px-3 py-1 rounded-full bg-surface-container hover:bg-primary hover:text-white transition-colors font-label-sm text-xs"
                        >
                          View
                        </button>
                        <button
                          onClick={() => setDeletingInquiry(inq)}
                          className="p-1 rounded-full text-outline hover:text-error transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-secondary">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
