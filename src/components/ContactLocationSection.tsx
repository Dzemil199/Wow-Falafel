import React, { useState } from 'react';
import { MapPin, Phone, Clock, Send, CheckCircle2, Navigation, AlertCircle } from 'lucide-react';
import { RestaurantInfo } from '../types/restaurant.ts';
import { api } from '../services/api.ts';

interface ContactLocationSectionProps {
  restaurant: RestaurantInfo;
}

export const ContactLocationSection: React.FC<ContactLocationSectionProps> = ({ restaurant }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [botField, setBotField] = useState(''); // Honeypot spam protection
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const cleanPhone = restaurant.phone.replace(/[^0-9+]/g, '');
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${restaurant.address}, ${restaurant.suite}, ${restaurant.city}, ${restaurant.state} ${restaurant.zip}`
  )}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!name.trim() || !message.trim()) {
      setErrorMsg('Please enter your name and message.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.submitContact({
        name: name.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        message: message.trim(),
        botField: botField || undefined
      });

      setSuccessMsg(res.message || 'Message sent! We will get back to you shortly.');
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to deliver message.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="location" className="py-16 lg:py-24 bg-[#FCFBF7] border-b border-[#E7E2D6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-[#1B432E] uppercase mb-2">
            Location & Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#162E20] tracking-tight [text-wrap:balance]">
            Find Us in California City
          </h2>
          <p className="mt-3 text-base text-[#475448] leading-relaxed">
            Conveniently situated on California City Boulevard. Connect with us for any questions regarding our menu, dietary requirements, or catering.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Column 1: Contact Details & Hours (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Address Card */}
              <div className="p-5 rounded-xl bg-white border border-[#E7E2D6] space-y-3">
                <div className="flex items-center gap-2.5 text-[#1B432E] font-semibold text-sm">
                  <MapPin className="w-4 h-4 shrink-0" />
                  <span>Restaurant Address</span>
                </div>
                <div className="text-xs text-[#3D4B3E] space-y-0.5">
                  <div className="font-semibold">{restaurant.address}</div>
                  <div>{restaurant.suite}</div>
                  <div>{restaurant.city}, {restaurant.state} {restaurant.zip}</div>
                  <div className="text-[#6E7B6F] pt-0.5">United States</div>
                </div>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-[#1B432E] text-white hover:bg-[#143424] transition-colors"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions</span>
                </a>
              </div>

              {/* Phone Card with Call Now */}
              <div className="p-5 rounded-xl bg-white border border-[#E7E2D6] space-y-3">
                <div className="flex items-center gap-2.5 text-[#1B432E] font-semibold text-sm">
                  <Phone className="w-4 h-4 shrink-0" />
                  <span>Direct Telephone</span>
                </div>
                <div className="text-xs text-[#3D4B3E] space-y-0.5">
                  <div className="font-semibold text-base text-[#162E20]">{restaurant.phone}</div>
                  <div className="text-[#6E7B6F]">Call us for immediate questions or inquiries.</div>
                </div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-emerald-800 text-white hover:bg-emerald-900 transition-colors"
                >
                  <Phone className="w-3 h-3" />
                  <span>Call Now</span>
                </a>
              </div>

            </div>

            {/* Business Hours Card */}
            <div className="p-5 rounded-xl bg-white border border-[#E7E2D6] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-[#162E20]">
                  <Clock className="w-4 h-4 text-[#1B432E]" />
                  <span>Standard Business Hours</span>
                </div>
                {restaurant.isTemporarilyClosed && (
                  <span className="text-xs px-2.5 py-0.5 rounded bg-amber-100 text-amber-900 font-medium">
                    Temporarily Closed
                  </span>
                )}
              </div>

              {restaurant.isTemporarilyClosed && (
                <div className="p-3 rounded-lg bg-amber-50/80 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-700 mt-0.5" />
                  <span>
                    Our regular operating schedule is listed below for reference. The restaurant will resume these hours upon completion of our kitchen update.
                  </span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs divide-y sm:divide-y-0 divide-[#F0ECE1]">
                {restaurant.businessHours.map((bh) => (
                  <div key={bh.day} className="flex justify-between py-1 border-b border-[#F5F2E9]">
                    <span className="font-medium text-[#162E20]">{bh.day}</span>
                    <span className="font-mono tabular-nums text-[#556356]">
                      {bh.isClosed ? 'Closed' : bh.hours}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Location Map */}
            <div className="rounded-xl overflow-hidden border border-[#E7E2D6] bg-[#EFECE3] shadow-xs">
              <div className="p-3 bg-[#FCFBF7] border-b border-[#E7E2D6] flex items-center justify-between text-xs">
                <span className="font-semibold text-[#162E20]">Location Map: California City Boulevard</span>
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1B432E] hover:underline font-medium"
                >
                  Open in Google Maps →
                </a>
              </div>
              <div className="relative aspect-[16/9] w-full bg-[#E5E1D4]">
                <iframe
                  title="Wow Falafel Location Map"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  referrerPolicy="no-referrer-when-downgrade"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-117.9890%2C35.1230%2C-117.9760%2C35.1325&amp;layer=mapnik&amp;marker=35.1278%2C-117.9825"
                />
              </div>
            </div>

          </div>

          {/* Column 2: Working Contact Form (5 cols) */}
          <div id="contact" className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-7 rounded-2xl border border-[#E7E2D6] shadow-xs space-y-5">
              <div className="space-y-1">
                <div className="text-xs font-semibold uppercase tracking-wider text-[#1B432E]">
                  Direct Inquiries
                </div>
                <h3 className="font-bold text-lg text-[#162E20]">Send Us a Message</h3>
                <p className="text-xs text-[#526053]">
                  Have a question about our ingredients, spices, or future reopening? Drop us a line.
                </p>
              </div>

              {successMsg && (
                <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Honeypot field for bot protection */}
                <div className="hidden" aria-hidden="true">
                  <input
                    type="text"
                    name="botField"
                    value={botField}
                    onChange={(e) => setBotField(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Jordan Miller"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g., (442) 555-0123"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g., jordan@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-semibold text-[#162E20] block mb-1">
                    Message / Question *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="How can we help you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[#DDD7C8] bg-white text-[#162E20] focus:ring-2 focus:ring-[#1B432E] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 px-4 rounded-lg bg-[#1B432E] hover:bg-[#143424] text-white font-semibold transition-colors flex items-center justify-center gap-2 disabled:opacity-60 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
