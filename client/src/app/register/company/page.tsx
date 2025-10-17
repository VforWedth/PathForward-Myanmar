// app/register/company/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import Link from 'next/link';
import { Building2, Sparkles } from 'lucide-react';

interface RegistrationForm {
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  industry: string;
  size: string;
  website: string;
  description: string;
  address: string;
  phone: string;
}

export default function CompanyRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegistrationForm>({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    industry: '',
    size: '',
    website: '',
    description: '',
    address: '',
    phone: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }


    setIsLoading(true);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/company/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(data.message || 'Registration submitted for verification!');
        setVerificationStep(2);
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Success / verification screen — themed
  if (verificationStep === 2) {
    return (
      <div className="min-h-screen bg-[#F5EFEB] flex items-center justify-center px-4">
        <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/80 shadow-xl backdrop-blur-sm">
          {/* subtle background glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(1000px_300px_at_0%_-10%,rgba(86,124,141,0.12),transparent),radial-gradient(700px_250px_at_100%_120%,rgba(16,44,36,0.10),transparent)]" />
          <div className="relative z-10 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 ring-1 ring-emerald-600/20">
              <svg className="h-8 w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-[#2F4156]">Verification Pending</h2>
            <p className="mx-auto mt-2 max-w-prose text-[#567C8D]">
              Your company registration has been submitted for verification. You’ll receive an email once your account is approved.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#2F4156] px-5 py-2.5 text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Registration form — themed to match student UI
  return (
    <div className="min-h-screen bg-[#F5EFEB] px-4 py-12">
      <div className="mx-auto w-full max-w-2xl">
        {/* Header / Hero */}
        <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#C8D9E6] bg-gradient-to-r from-[#2F4156] via-[#2F4156] to-[#567C8D] p-6 text-white shadow-lg">
          {/* soft blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-16 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 right-10 h-48 w-48 rounded-full bg-emerald-300/10 blur-3xl" />
          </div>

          <div className="relative z-10 flex items-center gap-3">
            <Building2 className="h-6 w-6" />
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
                <Sparkles className="h-4 w-4" /> Company Portal
              </p>
              <h1 className="mt-2 text-2xl font-bold leading-tight">Register your company</h1>
              <p className="text-white/80">Create your account to post jobs and manage applicants.</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="relative overflow-hidden rounded-2xl border border-[#C8D9E6] bg-white/80 shadow-sm backdrop-blur-sm">
          <div className="absolute inset-0 bg-[radial-gradient(900px_250px_at_100%_-10%,rgba(86,124,141,0.08),transparent)]" />
          <form onSubmit={handleSubmit} className="relative z-10 space-y-6 p-6 sm:p-8">
            {/* Row 1 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Company Name *"
                required
                value={formData.companyName}
                onChange={(v) => setFormData((s) => ({ ...s, companyName: v }))}
              />
              <SelectField
                label="Industry *"
                required
                value={formData.industry}
                onChange={(v) => setFormData((s) => ({ ...s, industry: v }))}
                options={[
                  { value: '', label: 'Select Industry' },
                  { value: 'technology', label: 'Technology' },
                  { value: 'finance', label: 'Finance' },
                  { value: 'healthcare', label: 'Healthcare' },
                  { value: 'education', label: 'Education' },
                  { value: 'manufacturing', label: 'Manufacturing' },
                ]}
              />
            </div>

            <Field
              label="Email *"
              type="email"
              required
              value={formData.email}
              onChange={(v) => setFormData((s) => ({ ...s, email: v }))}
            />

            {/* Row 2 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field
                label="Password *"
                type="password"
                required
                value={formData.password}
                onChange={(v) => setFormData((s) => ({ ...s, password: v }))}
              />
              <Field
                label="Confirm Password *"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(v) => setFormData((s) => ({ ...s, confirmPassword: v }))}
              />
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <SelectField
                label="Company Size"
                value={formData.size}
                onChange={(v) => setFormData((s) => ({ ...s, size: v }))}
                options={[
                  { value: '', label: 'Select Size' },
                  { value: '1-10', label: '1-10 employees' },
                  { value: '11-50', label: '11-50 employees' },
                  { value: '51-200', label: '51-200 employees' },
                  { value: '201-500', label: '201-500 employees' },
                  { value: '501+', label: '501+ employees' },
                ]}
              />
              <Field
                label="Phone"
                type="tel"
                value={formData.phone}
                onChange={(v) => setFormData((s) => ({ ...s, phone: v }))}
              />
            </div>

            <Field
              label="Website"
              type="url"
              placeholder="https://yourcompany.com"
              value={formData.website}
              onChange={(v) => setFormData((s) => ({ ...s, website: v }))}
            />

            <Field
              label="Address"
              value={formData.address}
              onChange={(v) => setFormData((s) => ({ ...s, address: v }))}
            />

            <TextArea
              label="Company Description"
              rows={4}
              value={formData.description}
              onChange={(v) => setFormData((s) => ({ ...s, description: v }))}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full rounded-xl bg-[#2F4156] px-4 py-3 font-medium text-white shadow-sm ring-1 ring-black/10 transition hover:translate-y-[-1px] hover:bg-[#243447] focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 disabled:translate-y-0 disabled:bg-[#9BA7B0]"
            >
              {isLoading ? 'Submitting…' : 'Register Company'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Themed Inputs ---------- */

function Field({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#2F4156]">{label}</label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#C8D9E6] bg-white/90 px-4 py-2 text-[#2F4156] shadow-sm outline-none transition placeholder:text-[#9AAFC0] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/60"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#2F4156]">{label}</label>
      <select
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#C8D9E6] bg-white/90 px-4 py-2 text-[#2F4156] shadow-sm outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/60"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextArea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-[#2F4156]">{label}</label>
      <textarea
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-[#C8D9E6] bg-white/90 px-4 py-2 text-[#2F4156] shadow-sm outline-none transition placeholder:text-[#9AAFC0] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-300/60"
      />
    </div>
  );
}
