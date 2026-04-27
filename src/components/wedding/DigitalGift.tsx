"use client";

import { useToast } from "@/hooks/useToast";
import { Gift, Copy } from "lucide-react";

export function DigitalGift({ gifts, theme }: { gifts?: string, theme: string }) {
  const { toast } = useToast();

  if (!gifts) return null;

  let parsedGifts: any[] = [];
  try {
    if (gifts.trim().startsWith('[')) {
      parsedGifts = JSON.parse(gifts);
    } else {
      parsedGifts = gifts.split('|').map(g => {
        const parts = g.split('-').map(p => p.trim());
        return {
          bank: parts[0] || 'Bank',
          account_number: parts[1] || '-',
          account_name: parts[2] || '-'
        };
      });
    }
  } catch(e) {
    return null;
  }

  if (parsedGifts.length === 0) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast("No Rekening disalin ke clipboard", "success");
  };

  const isModern = theme === 'modern';

  return (
    <section className={`py-24 px-4 ${isModern ? 'bg-slate-50' : 'bg-rose-50/50'}`}>
      <div className="max-w-4xl mx-auto text-center space-y-12">
        <div className="space-y-4">
          <div className="w-16 h-16 rounded-full bg-current/10 flex items-center justify-center mx-auto text-current mb-6 mix-blend-multiply">
            <Gift className="w-8 h-8" />
          </div>
          <h2 className="text-4xl font-serif">Wedding Gift</h2>
          <p className="opacity-80 max-w-xl mx-auto leading-relaxed">
            Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
            Namun jika Anda bermaksud memberikan tanda kasih, kami menyediakan fitur amplop digital di bawah ini.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 justify-center">
          {parsedGifts.map((g, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-black/5 space-y-4 relative overflow-hidden group">
              <h3 className="font-bold text-xl uppercase tracking-wider">{g.bank}</h3>
              <p className="text-2xl font-serif tracking-widest my-2">{g.account_number}</p>
              <p className="text-sm opacity-60 uppercase tracking-widest">{g.account_name}</p>
              <button 
                onClick={() => handleCopy(g.account_number)}
                className="w-full flex items-center justify-center gap-2 py-3 mt-4 rounded-xl border border-current text-sm opacity-70 hover:opacity-100 hover:bg-current hover:text-white transition group-hover:opacity-100"
              >
                 <Copy className="w-4 h-4" /> Salin Rekening
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
