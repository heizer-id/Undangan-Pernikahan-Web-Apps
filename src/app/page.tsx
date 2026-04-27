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
        
        <header className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-sm font-medium mb-4">
            <Heart className="w-4 h-4 text-pink-500" fill="currentColor" />
            Eternity Wedding Builder
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 tracking-tight">
            Bagikan Momen Bahagia <br className="hidden md:block"/> Tanpa Batas
          </h1>
          <p className="text-lg md:text-xl text-slate-600 font-sans leading-relaxed">
            Buat website undangan pernikahan digital yang elegan, interaktif, dan mudah dibagikan dalam hitungan menit. Gratis, tanpa coding.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link href="/admin">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-xl rounded-full bg-slate-900">
                Buat Website Anda <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Feature Cards Showcase */}
        <section className="grid md:grid-cols-3 gap-8 mt-24 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-pink-50 text-pink-600 flex items-center justify-center rounded-2xl mb-6">
              <Laptop className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Desain Premium</h3>
            <p className="text-slate-600 font-sans leading-relaxed">Pilih dari berbagai tema elegan mulai dari klasik hingga modern yang dirancang khusus untuk hari spesialmu.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 flex items-center justify-center rounded-2xl mb-6">
              <Gift className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">RSVP & Buku Tamu</h3>
            <p className="text-slate-600 font-sans leading-relaxed">Kelola kehadiran tamu secara real-time dan terima ucapan doa langsung di website pernikahanmu.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition duration-300">
            <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center rounded-2xl mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3 font-serif">Cerita Cinta</h3>
            <p className="text-slate-600 font-sans leading-relaxed">Bagikan perjalanan kisah cinta kalian dengan galeri foto dan cerita yang menyentuh hati tamu.</p>
          </div>
        </section>

      </div>
    </div>
  );
}
