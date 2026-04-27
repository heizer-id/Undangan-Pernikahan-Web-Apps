import { notFound } from "next/navigation";
import { weddingApi } from "@/lib/api";
import { HeroSection } from "@/components/wedding/HeroSection";
import { CountdownTimer } from "@/components/wedding/CountdownTimer";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { GuestBook } from "@/components/wedding/GuestBook";
import { MapPin, CalendarHeart } from "lucide-react";

// For App Router dynamic page
export default async function WeddingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await weddingApi.getWedding(id);
  
  if (!res.success || !res.data) {
    return notFound();
  }

  const wedding = res.data;
  
  // Basic theme logic
  const bgClass = wedding.template_theme === 'modern' ? 'bg-slate-50 text-slate-900' : 'bg-rose-50 text-rose-950';
  const cardClass = wedding.template_theme === 'modern' ? 'bg-white' : 'bg-rose-100/50';

  return (
    <div className={`min-h-screen ${bgClass}`} suppressHydrationWarning>
      <HeroSection 
        coupleName={wedding.couple_name} 
        date={wedding.date} 
        theme={wedding.template_theme} 
        coverPhoto={wedding.cover_photo} 
      />

      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className="text-4xl font-serif mb-6">Menghitung Hari</h2>
            <p className="text-lg opacity-80 font-light">Kami tidak sabar menunggu kehadiran Anda di hari bahagia kami.</p>
            <CountdownTimer targetDate={wedding.date} />
          </div>
          
          <div className="w-24 h-[1px] bg-current mx-auto opacity-20" />

          {wedding.story && (
            <div className="space-y-6">
              <h2 className="text-4xl font-serif">Kisah Kami</h2>
              <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90 max-w-2xl mx-auto">
                {wedding.story}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`p-12 rounded-3xl text-center space-y-8 shadow-sm ${cardClass}`}>
            <h2 className="text-4xl font-serif">Informasi Acara</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-current/5 flex items-center justify-center mx-auto text-current mb-6">
                  <CalendarHeart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif">Waktu Acara</h3>
                <p className="opacity-80">
                  <span suppressHydrationWarning>{new Date(wedding.date).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span><br/>
                  Pukul 09.00 WIB - Selesai
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-current/5 flex items-center justify-center mx-auto text-current mb-6">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold font-serif">Lokasi</h3>
                <p className="opacity-80 whitespace-pre-wrap">{wedding.venue}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(wedding.venue)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-4 px-6 py-2 rounded-full border border-current opacity-80 hover:opacity-100 hover:bg-current hover:text-white transition"
                >
                  Buka Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white/80">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className="text-4xl font-serif text-center lg:text-left">Konfirmasi Kehadiran</h2>
            <p className="opacity-80 text-center lg:text-left">Kehadiran dan doa restu Bapak/Ibu/Saudara/i sangat kami nantikan.</p>
            <RSVPForm weddingId={id} />
          </div>
          <div className="space-y-8">
            <GuestBook weddingId={id} />
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm opacity-60">
        <p suppressHydrationWarning>Built with Eternity © {new Date().getFullYear()} - {wedding.couple_name}</p>
      </footer>
    </div>
  );
}
