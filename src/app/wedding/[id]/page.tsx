import { Metadata } from 'next';
import { notFound } from "next/navigation";
import { weddingApi } from "@/lib/api";
import { HeroSection } from "@/components/wedding/HeroSection";
import { CountdownTimer } from "@/components/wedding/CountdownTimer";
import { RSVPForm } from "@/components/wedding/RSVPForm";
import { GuestBook } from "@/components/wedding/GuestBook";
import { CoverPage } from "@/components/wedding/CoverPage";
import { PhotoGallery } from "@/components/wedding/PhotoGallery";
import { DigitalGift } from "@/components/wedding/DigitalGift";
import { MapPin, CalendarHeart, AtSign } from "lucide-react";
import { getGoogleDriveDirectLink } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const res = await weddingApi.getWedding(id);
  
  if (!res.success || !res.data) {
    return { title: 'Undangan Pernikahan' };
  }

  const wedding = res.data;
  const title = `The Wedding of ${wedding.bride_name || 'Mempelai'} & ${wedding.groom_name || 'Kami'}`;
  const description = `Kami mengundang Anda untuk hadir di hari bahagia kami pada ${new Date(wedding.date).toLocaleDateString("id-ID")}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: wedding.cover_photo ? [getGoogleDriveDirectLink(wedding.cover_photo)] : [],
    }
  };
}

// For App Router dynamic page
export default async function WeddingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await weddingApi.getWedding(id);
  
  if (!res.success || !res.data) {
    return notFound();
  }

  const wedding = res.data;
  
  const THEMES = {
    classic: {
      bg: 'bg-rose-50 text-rose-950',
      card: 'bg-rose-100/50',
      fontHeading: 'font-serif',
      profileBg: 'bg-white/10'
    },
    modern: {
      bg: 'bg-slate-50 text-slate-900',
      card: 'bg-white',
      fontHeading: 'font-sans font-bold tracking-tight',
      profileBg: 'bg-white/50'
    },
    botanical: {
      bg: 'bg-emerald-50 text-emerald-950',
      card: 'bg-emerald-100/50 border border-emerald-200/50',
      fontHeading: 'font-serif italic text-emerald-900',
      profileBg: 'bg-emerald-100/20'
    },
    elegant: {
      bg: 'bg-zinc-900 text-zinc-100',
      card: 'bg-zinc-800/80 border border-zinc-700',
      fontHeading: 'font-serif uppercase tracking-widest text-amber-500',
      profileBg: 'bg-zinc-800/30'
    }
  };

  const themeKeys = THEMES as Record<string, any>;
  const activeTheme = themeKeys[wedding.template_theme] || THEMES.classic;

  return (
    <div className={`min-h-screen ${activeTheme.bg}`} suppressHydrationWarning>
      <CoverPage 
        brideName={wedding.bride_name || wedding.couple_name?.split('&')[0] || "Bride"} 
        groomName={wedding.groom_name || wedding.couple_name?.split('&')[1] || "Groom"} 
        date={wedding.date}
        musicUrl={wedding.music_url}
        bgClassName={activeTheme.bg}
        theme={wedding.template_theme}
      />

      <HeroSection 
        coupleName={wedding.bride_name && wedding.groom_name ? `${wedding.bride_name} & ${wedding.groom_name}` : wedding.couple_name} 
        date={wedding.date} 
        theme={wedding.template_theme} 
        coverPhoto={wedding.cover_photo} 
      />

      <section className="py-24 px-4 bg-white/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div>
            <h2 className={`text-4xl ${activeTheme.fontHeading} mb-6`}>Menghitung Hari</h2>
            <p className="text-lg opacity-80 font-light">Kami tidak sabar menunggu kehadiran Anda di hari bahagia kami.</p>
            <CountdownTimer targetDate={wedding.date} />
          </div>
          
          <div className="w-24 h-[1px] bg-current mx-auto opacity-20" />

          {wedding.story && (
            <div className="space-y-6">
              <h2 className={`text-4xl ${activeTheme.fontHeading}`}>Kisah Kami</h2>
              <p className="text-lg leading-relaxed whitespace-pre-wrap opacity-90 max-w-2xl mx-auto">
                {wedding.story}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Profil Mempelai */}
      <section className={`py-24 px-4 ${activeTheme.profileBg}`}>
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <p className="tracking-widest uppercase text-sm opacity-60">Mempelai Kami</p>
            <h2 className={`text-4xl ${activeTheme.fontHeading}`}>Sang Mempelai</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-16">
            <div className="space-y-6 flex flex-col items-center">
              {wedding.bride_photo && (
                <div className="w-48 h-64 rounded-[3rem] overflow-hidden shadow-2xl mb-4 border-4 border-white/50 rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                  <img src={getGoogleDriveDirectLink(wedding.bride_photo)} alt={wedding.bride_name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className={`text-3xl ${activeTheme.fontHeading}`}>{wedding.bride_name || "Mempelai Wanita"}</h3>
              <p className="opacity-80">{wedding.bride_parents}</p>
              {wedding.bride_ig && (
                <a href={`https://instagram.com/${wedding.bride_ig.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition">
                  <AtSign className="w-4 h-4" /> {wedding.bride_ig}
                </a>
              )}
            </div>
            <div className="space-y-6 flex flex-col items-center">
              {wedding.groom_photo && (
                <div className="w-48 h-64 rounded-[3rem] overflow-hidden shadow-2xl mb-4 border-4 border-white/50 rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                  <img src={getGoogleDriveDirectLink(wedding.groom_photo)} alt={wedding.groom_name} className="w-full h-full object-cover" />
                </div>
              )}
              <h3 className={`text-3xl ${activeTheme.fontHeading}`}>{wedding.groom_name || "Mempelai Pria"}</h3>
              <p className="opacity-80">{wedding.groom_parents}</p>
              {wedding.groom_ig && (
                <a href={`https://instagram.com/${wedding.groom_ig.replace('@','')}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm opacity-60 hover:opacity-100 transition">
                  <AtSign className="w-4 h-4" /> {wedding.groom_ig}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      <PhotoGallery photos={wedding.gallery_photos} />

      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className={`p-12 rounded-3xl text-center space-y-8 shadow-sm ${activeTheme.card}`}>
            <h2 className={`text-4xl ${activeTheme.fontHeading}`}>Informasi Acara</h2>
            
            <div className="grid md:grid-cols-2 gap-12 mt-12">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-current/5 flex items-center justify-center mx-auto text-current mb-6">
                  <CalendarHeart className="w-8 h-8" />
                </div>
                <h3 className={`text-xl ${activeTheme.fontHeading} font-bold`}>Waktu Acara</h3>
                <p className="opacity-80">
                  <span suppressHydrationWarning>{new Date(wedding.date).toLocaleDateString("id-ID", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span><br/>
                  Pukul 09.00 WIB - Selesai
                </p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-full bg-current/5 flex items-center justify-center mx-auto text-current mb-6">
                  <MapPin className="w-8 h-8" />
                </div>
                <h3 className={`text-xl ${activeTheme.fontHeading} font-bold`}>Lokasi</h3>
                <p className="opacity-80 whitespace-pre-wrap">{wedding.venue}</p>
                <a 
                  href={`https://maps.google.com/?q=${encodeURIComponent(wedding.venue)}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-4 px-6 py-2 rounded-full border border-current opacity-80 hover:opacity-100 hover:bg-current hover:text-white transition"
                >
                  Buka Google Maps
                </a>
                <div className="w-full mt-6 aspect-video rounded-xl overflow-hidden shadow-sm border border-black/10 relative">
                  <iframe
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    allowFullScreen
                    className="absolute inset-0"
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(wedding.venue)}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <DigitalGift gifts={wedding.digital_gifts} theme={wedding.template_theme} />

      <section className="py-24 px-4 bg-white/80 text-slate-900">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <h2 className={`text-4xl ${activeTheme.fontHeading} text-center lg:text-left`}>Konfirmasi Kehadiran</h2>
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
