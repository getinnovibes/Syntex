import React, { useState } from 'react';
import { submitInquiry } from '../../lib/supabase';

interface ContactSectionProps {
  contactEmail?: string;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  contactEmail = 'abdullah.graphics@syntax.design',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'brand-identity',
    budget: '$1,000 – $3,000',
    referenceUrl: '',
    brief: '',
    optionalNote: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      await submitInquiry({
        client_name: formData.name,
        email: formData.email,
        service_type: formData.serviceType,
        budget: formData.budget,
        reference_url: formData.referenceUrl,
        brief: formData.brief,
        notes: formData.optionalNote,
      });

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        serviceType: 'brand-identity',
        budget: '$1,000 – $3,000',
        referenceUrl: '',
        brief: '',
        optionalNote: '',
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit your request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-space-3xl px-6 md:px-margin-lg relative scroll-mt-20" id="contact-section">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-surface-container-lowest rounded-3xl p-6 md:p-space-xl lg:p-space-2xl shadow-[0_30px_70px_-15px_rgba(8,8,8,0.07)] border border-outline-variant/40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-space-2xl">
            {/* Column 1: Context & Working Process */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-space-xs mb-space-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-container" />
                  <span className="font-label-sm text-label-sm text-primary font-bold uppercase tracking-wider">
                    Start Collaboration
                  </span>
                </div>

                <h2 className="font-display-hero text-3xl md:text-headline-xl font-semibold text-on-surface tracking-tight mt-space-xs">
                  Let’s Work Together
                </h2>

                <p className="font-body-lg text-base md:text-body-lg text-on-surface-variant mt-space-md leading-relaxed">
                  Have a project in mind? Send the details and let’s turn your idea into a strong visual experience.
                </p>

                {/* Working Process Mini-Timeline */}
                <div className="mt-8 md:mt-space-xl space-y-space-md">
                  <div className="flex items-start gap-space-sm">
                    <span className="w-7 h-7 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">Brief & Scoping</h4>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Reviewing your requirements, timelines, and visual expectations within 24 hours.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-sm">
                    <span className="w-7 h-7 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">Creative Execution</h4>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Iterative prototyping, high-fidelity mockups, and structured feedback rounds.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-sm">
                    <span className="w-7 h-7 rounded-full bg-secondary-container text-primary font-label-sm text-label-sm font-bold flex items-center justify-center shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">Production Delivery</h4>
                      <p className="font-body-sm text-body-sm text-secondary">
                        Complete production-ready assets with full source files and brand guidelines.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Direct Contact Footer */}
              <div className="mt-8 pt-space-lg flex items-center gap-space-md border-t border-outline-variant/20">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary flex items-center justify-center shrink-0 shadow-md">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div className="min-w-0">
                  <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider">
                    Direct Inbox
                  </span>
                  <p className="font-headline-sm text-base md:text-headline-sm text-on-surface font-medium truncate">
                    {contactEmail}
                  </p>
                </div>
              </div>
            </div>

            {/* Column 2: Studio Project Request Form */}
            <div className="lg:col-span-7 bg-surface-container-low p-6 md:p-space-lg lg:p-space-xl rounded-2xl border border-outline-variant/30">
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg shadow-primary-container/30">
                    <span className="material-symbols-outlined text-[32px]">check</span>
                  </div>
                  <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                    Inquiry Dispatched Successfully
                  </h3>
                  <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
                    Thank you. Your project request has been logged in the studio CMS. Abdullah will review your brief and respond within 24 business hours.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-surface-container-lowest text-primary border border-primary/30 font-label-md text-label-md font-semibold hover:bg-secondary-container transition-colors"
                  >
                    Send Another Request
                  </button>
                </div>
              ) : (
                <form className="space-y-space-md" onSubmit={handleSubmit} id="project-request-form">
                  {errorMsg && (
                    <div className="p-4 rounded-xl bg-error-container text-on-error-container font-body-sm text-body-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Name */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                        htmlFor="client-name"
                      >
                        Your Name / Brand *
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest px-space-md py-3 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30"
                        id="client-name"
                        placeholder="e.g. Elena Rostova"
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                        htmlFor="client-email"
                      >
                        Email Address *
                      </label>
                      <input
                        className="w-full bg-surface-container-lowest px-space-md py-3 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30"
                        id="client-email"
                        placeholder="elena@company.com"
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                    {/* Service Selection */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                        htmlFor="service-type"
                      >
                        Required Service *
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-surface-container-lowest px-space-md py-3 pr-10 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30 appearance-none cursor-pointer"
                          id="service-type"
                          required
                          value={formData.serviceType}
                          onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                        >
                          <option value="Brand Identity">Brand Identity</option>
                          <option value="Social Media Poster Design">Social Media Poster Design</option>
                          <option value="Banner Design">Banner Design</option>
                          <option value="Thumbnail Design">Thumbnail Design</option>
                          <option value="Full Retainer / Creative Direction">Full Retainer / Creative Direction</option>
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-secondary text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>

                    {/* Budget */}
                    <div className="flex flex-col gap-1.5">
                      <label
                        className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                        htmlFor="budget"
                      >
                        Estimated Budget *
                      </label>
                      <div className="relative">
                        <select
                          className="w-full bg-surface-container-lowest px-space-md py-3 pr-10 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30 appearance-none cursor-pointer"
                          id="budget"
                          required
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        >
                          <option value="$500 – $1,000">$500 – $1,000</option>
                          <option value="$1,000 – $3,000">$1,000 – $3,000</option>
                          <option value="$3,000 – $5,000">$3,000 – $5,000</option>
                          <option value="$5,000+">$5,000+</option>
                        </select>
                        <span className="material-symbols-outlined pointer-events-none absolute right-3 top-3 text-secondary text-[20px]">
                          expand_more
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Reference Link */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                      htmlFor="reference"
                    >
                      Reference or Moodboard URL
                    </label>
                    <input
                      className="w-full bg-surface-container-lowest px-space-md py-3 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30"
                      id="reference"
                      placeholder="Figma / Drive / Website URL"
                      type="url"
                      value={formData.referenceUrl}
                      onChange={(e) => setFormData({ ...formData, referenceUrl: e.target.value })}
                    />
                  </div>

                  {/* Project Brief */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                      htmlFor="brief"
                    >
                      Project Brief *
                    </label>
                    <textarea
                      className="w-full bg-surface-container-lowest px-space-md py-3 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30 resize-none"
                      id="brief"
                      placeholder="Tell me about the goals, scope, and key deliverables for this engagement..."
                      required
                      rows={3}
                      value={formData.brief}
                      onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    />
                  </div>

                  {/* Optional Message */}
                  <div className="flex flex-col gap-1.5">
                    <label
                      className="font-label-sm text-label-sm text-secondary uppercase tracking-wider"
                      htmlFor="optional-note"
                    >
                      Optional Notes / Deadlines
                    </label>
                    <textarea
                      className="w-full bg-surface-container-lowest px-space-md py-3 rounded-xl font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary-container transition-all shadow-sm border border-outline-variant/30 resize-none"
                      id="optional-note"
                      placeholder="Deadlines, timezone considerations, or specific artistic preferences..."
                      rows={2}
                      value={formData.optionalNote}
                      onChange={(e) => setFormData({ ...formData, optionalNote: e.target.value })}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-space-xs">
                    <button
                      disabled={loading}
                      className="w-full py-space-sm px-space-xl bg-primary-container hover:bg-primary text-on-primary font-headline-sm text-headline-sm font-semibold rounded-full shadow-[0_12px_28px_-6px_rgba(108,59,255,0.36)] transition-all duration-300 flex items-center justify-center gap-space-xs cursor-pointer active:scale-98 disabled:opacity-50"
                      type="submit"
                    >
                      <span>{loading ? 'Logging Request...' : 'Send Project Request'}</span>
                      <span className="material-symbols-outlined text-[20px]">
                        {loading ? 'hourglass_top' : 'send'}
                      </span>
                    </button>
                    <span className="block font-label-sm text-[10px] text-center text-secondary pt-2">
                      Guaranteed confidentiality • NDA available upon request
                    </span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
