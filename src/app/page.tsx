import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Heart, Laptop, Gift, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden" suppressHydrationWarning>
      {/* Decorative background shape */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-pink-100 blur-3xl opacity-50 z-0 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-100 blur-3xl opacity-50 z-0 pointer-events-none" />
      
      <div className="container mx-auto px-4 py-16 lg:py-32 relative z-10 flex flex-col items-center">
        
        <header className="text-center max-w-4xl mx-auto space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur-md text-slate-800 text-sm font-bold mb-4 shadow-sm border border-slate-100 uppercase tracking-widest">
            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
            Eternity Wedding 2.0
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-slate-900 tracking-tighter leading-tight">
            Undangan Digital <br className="hidden md:block"/><span className="italic text-slate-400">Paling Elegan.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-500 font-sans leading-relaxed max-w-3xl mx-auto">
            Platform pembuat undangan pernikahan digital dengan fitur premium: Google Maps, Musik Latar, hingga Galeri Foto Lightbox. Canggih, Cantik, dan Cepat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
            <Link href="/dashboard">
              <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg font-bold shadow-2xl rounded-2xl bg-slate-900 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
                Mulai Buat Sekarang <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Feature Cards Showcase */}
        <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-32 max-w-7xl mx-auto w-full">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-12 transition-transform">
              <Laptop className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif text-slate-800">Multi-Theme</h3>
            <p className="text-slate-500 font-sans leading-relaxed text-sm">Pilih tema eksklusif: Classic, Modern, Botanical, hingga Elegant Dark Mode.</p>
          </div>
          
          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-pink-50 text-pink-600 flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-12 transition-transform">
              <Gift className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif text-slate-800">Amplop Digital</h3>
            <p className="text-slate-500 font-sans leading-relaxed text-sm">Terima kado pernikahan tanpa ribet dengan fitur cashless gift dan salin rekening otomatis.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-12 transition-transform">
               <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif text-slate-800">Google Maps</h3>
            <p className="text-slate-500 font-sans leading-relaxed text-sm">Integrasi peta interaktif untuk memudahkan tamu menemukan lokasi pernikahan Anda.</p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 group hover:-translate-y-2 transition-all duration-500">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 flex items-center justify-center rounded-2xl mb-8 group-hover:rotate-12 transition-transform">
              <Heart className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold mb-4 font-serif text-slate-800">SEO & OG Share</h3>
            <p className="text-slate-500 font-sans leading-relaxed text-sm">Link undangan tampil cantik dengan foto dan judul otomatis saat dibagikan ke media sosial.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
