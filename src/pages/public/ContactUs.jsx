import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, PhoneCall, Loader2 } from "lucide-react";
import { Button, Input } from "../../components/common";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import { contactApi, callbackApi } from "../../services/api";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@5pmnexus.com", detail: "We respond within 24 hours" },
  { icon: Phone, label: "Phone", value: "+2347033417802, +2347080897994", detail: "Mon–Fri, 8am–6pm (WAT)" },
  { icon: MapPin, label: "Office Address", value: "No. 52, Raymond Njoku St, Ikoyi, Lagos State, Nigeria.", detail: "By appointment only" },
  { icon: Clock, label: "Operating Hours", value: "Monday – Friday", detail: "8:00 AM – 6:00 PM (WAT)" },
];

const TIME_OPTIONS = [
  { value: 'anytime', label: 'Anytime' },
  { value: 'morning', label: 'Morning (8am–12pm)' },
  { value: 'afternoon', label: 'Afternoon (12pm–4pm)' },
  { value: 'evening', label: 'Evening (4pm–6pm)' },
];

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", preferredTime: "anytime", message: "" });
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [callbackSubmitting, setCallbackSubmitting] = useState(false);
  const [callbackError, setCallbackError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await contactApi.submitEnquiry(form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
    }
  };

  const handleCallbackSubmit = async (e) => {
    e.preventDefault();
    if (!callbackForm.name || !callbackForm.phone) {
      setCallbackError("Name and phone are required");
      return;
    }
    setCallbackSubmitting(true);
    setCallbackError("");
    try {
      await callbackApi.requestCallback(callbackForm);
      setCallbackSubmitted(true);
    } catch (err) {
      setCallbackError(err.response?.data?.message || "Failed to submit");
    } finally {
      setCallbackSubmitting(false);
    }
  };

  return (
    <div>
      {/* ───── HERO ───── */}
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Contact Us</span>
            <h1 className="text-3xl md:text-5xl font-black mt-4 mb-6 leading-tight">
              We're Here to Help
            </h1>
            <p className="text-lg text-gray-300 max-w-2xl leading-relaxed">
              Have a question about investing, need assistance with your account, or want to learn more about our products? Our team is ready to assist you.
            </p>
          </div>
        </div>
      </section>

      {/* ───── CONTACT INFO & FORM ───── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Get in Touch</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 mb-8">Contact Information</h2>
              <div className="space-y-6">
                {contactInfo.map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neon-tangerine/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-neon-tangerine" size={22} />
                    </div>
                    <div className="pt-1">
                      <p className="text-sm text-gray-500 font-medium">{item.label}</p>
                      <p className="font-semibold text-gray-900 mt-0.5">{item.value}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Send a Message</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 mb-8">Drop Us a Line</h2>
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                {submitted ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Message Sent Successfully!</h3>
                    <p className="text-gray-600">Thank you for reaching out. Our team will review your message and respond within 24 hours.</p>
                  </div>
                ) : (
                  <>
                    {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>)}
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input label="Full Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} required placeholder="John Doe" />
                      <Input label="Email Address" type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required placeholder="john@example.com" />
                      <Input label="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="+2348012345678 (optional)" />
                      <Input label="Subject" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} required placeholder="How can we help?" />
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                        <textarea value={form.message} onChange={(e) => setForm({...form, message: e.target.value})} required rows={5}
                          className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine"
                          placeholder="Tell us more about your inquiry..." />
                      </div>
                      <Button type="submit" className="w-full">
                        <Send size={16} /> Send Message
                      </Button>
                    </form>
                  </>
                )}
              </div>

              {/* ───── REQUEST A CALLBACK ───── */}
              <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 mt-8">
                <span className="text-neon-tangerine text-xs font-bold uppercase tracking-[0.2em]">Call Back</span>
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mt-3 mb-2">Request a Callback</h2>
                <p className="text-gray-600 text-sm mb-6">Prefer to speak with someone? Leave your details and we'll call you back.</p>
                {callbackSubmitted ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <PhoneCall className="text-green-600" size={28} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Request Submitted!</h3>
                    <p className="text-sm text-gray-600">Our team will call you back at your preferred time.</p>
                  </div>
                ) : (
                  <form onSubmit={handleCallbackSubmit} className="space-y-4">
                    {callbackError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{callbackError}</div>
                    )}
                    <Input label="Full Name" value={callbackForm.name} onChange={(e) => setCallbackForm({...callbackForm, name: e.target.value})} required placeholder="John Doe" />
                    <Input label="Phone Number" type="tel" value={callbackForm.phone} onChange={(e) => setCallbackForm({...callbackForm, phone: e.target.value})} required placeholder="+2348012345678" />
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                      <select value={callbackForm.preferredTime} onChange={(e) => setCallbackForm({...callbackForm, preferredTime: e.target.value})}
                        className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine"
                      >
                        {TIME_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-sm font-medium text-gray-700">Message (optional)</label>
                      <textarea value={callbackForm.message} onChange={(e) => setCallbackForm({...callbackForm, message: e.target.value})} rows={2}
                        className="block w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neon-tangerine focus:border-neon-tangerine"
                        placeholder="Anything specific you'd like to discuss..." />
                    </div>
                    <Button type="submit" disabled={callbackSubmitting} className="w-full">
                      {callbackSubmitting ? <Loader2 size={16} className="animate-spin" /> : <PhoneCall size={16} />}
                      {callbackSubmitting ? 'Submitting...' : 'Request Callback'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── CTA ───── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">Ready to Start Investing?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-lg mx-auto">Create your account in minutes and gain access to exclusive, asset-backed investment opportunities.</p>
          <Link to={ROUTES.REGISTER}>
            <Button className="bg-neon-tangerine hover:bg-neon-tangerine/80 text-white font-bold px-8 py-4 rounded-xl text-base">
              Create Free Account <Send size={16} />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;


