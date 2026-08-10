import { MapPin, ArrowUpRight } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="bg-[#eef7f0] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-green-700">
            M FRESH
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Find M Fresh Dairy
          </h2>
          <p className="mt-4 text-base leading-8 text-slate-600 sm:text-lg">
            Discover our premium contact section with polished green and white styling, clean modern typography, and a responsive map experience.
          </p>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-start">
          <div className="space-y-8 rounded-[2rem] border border-white bg-white/90 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur-sm">
            <div className="inline-flex items-center gap-3 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 shadow-sm">
              <MapPin className="h-5 w-5" />
              Premium location details
            </div>

            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-600">Contact</p>
              <h3 className="text-3xl font-semibold text-slate-900">M Fresh Dairy</h3>
              <p className="text-lg leading-8 text-slate-600">
                1/94, Gangai Amman Kovil Street,
                <br /> Kolathur,
                <br /> Chennai,
                <br /> Tamil Nadu - 600127.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#f2f9f2] p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Address</p>
                <p className="mt-3 text-base leading-7 text-slate-700">
                  1/94, Gangai Amman Kovil Street
                  <br /> Kolathur, Chennai
                  <br /> Tamil Nadu - 600127
                </p>
              </div>
              <div className="rounded-3xl bg-[#f2f9f2] p-6 shadow-sm">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-700">Location</p>
                <p className="mt-3 text-base leading-7 text-slate-700">Chennai city center near Gangai Amman Kovil</p>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-emerald-100 bg-emerald-50 p-6 shadow-sm">
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Need directions?</p>
              <a
                href="https://maps.app.goo.gl/24GMKXAUDjrMcchZA?g_st=ic"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-emerald-700 px-6 py-4 text-sm font-semibold text-white transition hover:bg-emerald-800"
              >
                Get Directions
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_28px_90px_rgba(15,23,42,0.09)]">
            <div className="border-b border-slate-100 bg-[#f8fcf6] px-6 py-5">
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-700">Google Maps</p>
            </div>
            <div className="relative h-[360px] sm:h-[420px]">
              <iframe
                title="M Fresh Dairy location"
                src="https://www.google.com/maps?q=1%2F94%20Gangai%20Amman%20Kovil%20Street%2C%20Kolathur%2C%20Chennai%2C%20Tamil%20Nadu%20600127&output=embed"
                className="h-full w-full rounded-b-[2rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
