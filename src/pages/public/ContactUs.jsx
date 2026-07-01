import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from "lucide-react";
import { Button, Input } from "../../components/common";
import { Link } from "react-router-dom";
import { ROUTES } from "../../constants";
import api from "../../services/api";

const contactInfo = [
  { icon: Mail, label: "Email", value: "support@5pmnexus.com", detail: "We respond within 24 hours" },
  { icon: Phone, label: "Phone", value: "+234 800 5PM NEXUS", detail: "Mon–Fri, 8am–6pm (WAT)" },
  { icon: MapPin, label: "Office Address", value: "Lagos, Nigeria", detail: "By appointment only" },
  { icon: Clock, label: "Operating Hours", value: "Monday – Friday", detail: "8:00 AM – 6:00 PM (WAT)" },
];

function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/contact", form);
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message");
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


