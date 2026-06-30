import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { Button, Input } from "../../components/common";
import api from "../../services/api";

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
      <section className="bg-dark-lavender text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Have a question or need assistance? We are here to help. Reach out to us through any of the channels below.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", value: "support@5pmnexus.com", detail: "We respond within 24 hours" },
                  { icon: Phone, label: "Phone", value: "+234 800 5PM NEXUS", detail: "Mon–Fri, 8am–6pm" },
                  { icon: MapPin, label: "Office Address", value: "Lagos, Nigeria", detail: "By appointment only" },
                  { icon: Clock, label: "Operating Hours", value: "Monday – Friday", detail: "8:00 AM – 6:00 PM (WAT)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-neon-tangerine/10 rounded-xl flex items-center justify-center shrink-0">
                      <item.icon className="text-neon-tangerine" size={22} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{item.label}</p>
                      <p className="font-semibold text-gray-900">{item.value}</p>
                      <p className="text-sm text-gray-500">{item.detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <Send className="text-green-600" size={28} />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">Thank you for reaching out. We will get back to you within 24 hours.</p>
                </div>
              ) : (
                <>
                  {error && (<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>)}
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
      </section>
    </div>
  );
}

export default ContactUs;


