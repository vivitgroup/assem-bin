'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, ShoppingCart, Scissors, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useCartStore } from '@/stores/cartStore';

/* ─── Brand colors ─────────────────────────────────── */
const BS = {
  deep:   '#8B1A1A',
  vivid:  '#D41E2F',
  silver: '#B8B8B8',
  pearl:  '#F7F5F2',
};

/* ─── Data ──────────────────────────────────────────── */
const SKIN_TONES = [
  { name: 'fair',   hex: '#FDDBB4', shadow: '#E8C49A', label: 'فاتح جداً',  lipHex: '#C0706A' },
  { name: 'light',  hex: '#F0C898', shadow: '#D4A870', label: 'فاتح',        lipHex: '#B8605A' },
  { name: 'wheat',  hex: '#D4956A', shadow: '#B87A50', label: 'قمحي',        lipHex: '#A04040' },
  { name: 'olive',  hex: '#C07850', shadow: '#9A5C35', label: 'زيتوني',      lipHex: '#8B3030' },
  { name: 'brown',  hex: '#8B5030', shadow: '#6A3A1A', label: 'بني',         lipHex: '#7A2020' },
  { name: 'dark',   hex: '#5A3020', shadow: '#3D1A0A', label: 'أسمر',        lipHex: '#4A1010' },
];

const FABRIC_COLORS = [
  /* ── ألوان أساسية ── */
  { id: '1',  name: 'أحمر ملكي',      hex: BS.vivid,   dark: BS.deep,    price: 85,  cat: 'جورجيت' },
  { id: '2',  name: 'ذهبي فاخر',      hex: '#D4AF37',  dark: '#A08020',  price: 250, cat: 'ساتان'  },
  { id: '6',  name: 'فضي لامع',       hex: BS.silver,  dark: '#888888',  price: 120, cat: 'ساتان'  },
  { id: '3',  name: 'كحلي',           hex: '#1E3A5F',  dark: '#0A1E3A',  price: 65,  cat: 'شيفون'  },
  { id: '7',  name: 'برغندي',         hex: '#800020',  dark: '#4A0010',  price: 180, cat: 'قطيفة'  },
  { id: '4',  name: 'أسود',           hex: '#2A2A2A',  dark: '#0A0A0A',  price: 65,  cat: 'شيفون'  },
  { id: '8',  name: 'وردي فوشيا',     hex: '#E91E8C',  dark: '#A0126A',  price: 95,  cat: 'جورجيت' },
  { id: '5',  name: 'زيتوني',         hex: '#556B2F',  dark: '#2F3D1A',  price: 95,  cat: 'كريب'   },
  /* ── ألوان جديدة تتناسب مع الأحمر ── */
  { id: '9',  name: 'وردي باستيل',    hex: '#E8A0B0',  dark: '#C0758A',  price: 85,  cat: 'جورجيت' },
  { id: '10', name: 'أزرق ملكي',      hex: '#2D6A9F',  dark: '#1A3D60',  price: 95,  cat: 'شيفون'  },
  { id: '11', name: 'بنفسجي',         hex: '#7B3F9E',  dark: '#4A1A6A',  price: 120, cat: 'ساتان'  },
  { id: '12', name: 'تيل زمردي',      hex: '#1B7B6B',  dark: '#0A4040',  price: 95,  cat: 'كريب'   },
  { id: '13', name: 'بيج ذهبي',       hex: '#D4A55A',  dark: '#9A6A1A',  price: 85,  cat: 'جورجيت' },
  { id: '14', name: 'أخضر زمردي',     hex: '#1B6B45',  dark: '#0A3A20',  price: 120, cat: 'قطيفة'  },
  { id: '15', name: 'بني دافئ',       hex: '#A0522D',  dark: '#6A2A0A',  price: 95,  cat: 'كريب'   },
  { id: '16', name: 'رمادي راقي',     hex: '#8C8C9A',  dark: '#4A4A5A',  price: 65,  cat: 'شيفون'  },
];

const DRESS_STYLES = [
  { id: 'aline',    label: 'A-Line',      desc: 'كلاسيكي ومناسب للجميع' },
  { id: 'fitted',   label: 'ضيق',         desc: 'يبرز القوام' },
  { id: 'mermaid',  label: 'حورية',       desc: 'رومانسي وجريء' },
  { id: 'balloon',  label: 'بالونة',      desc: 'عصري ومريح' },
];

/* ─── SVG Model paths ───────────────────────────────── */
// Each style: { dress, body, head, hair, arms, legs }
const MODEL_PATHS = {
  aline: {
    dress: 'M72,115 Q100,108 128,115 L132,145 Q136,175 138,210 Q142,245 148,280 Q156,315 162,355 L38,355 Q44,315 52,280 Q58,245 62,210 Q64,175 68,145 Z',
    bodice: 'M72,115 Q100,108 128,115 L132,145 Q136,170 132,185 Q116,190 100,191 Q84,190 68,185 Q64,170 68,145 Z',
    neckline: 'M85,115 Q100,122 115,115',
  },
  fitted: {
    dress: 'M76,115 Q100,108 124,115 L127,145 Q130,175 128,210 Q126,245 124,280 Q122,315 120,355 L80,355 Q78,315 76,280 Q74,245 72,210 Q70,175 73,145 Z',
    bodice: 'M76,115 Q100,108 124,115 L127,145 Q130,170 126,185 Q113,190 100,191 Q87,190 74,185 Q70,170 73,145 Z',
    neckline: 'M86,115 Q100,122 114,115',
  },
  mermaid: {
    dress: 'M76,115 Q100,108 124,115 L127,145 Q130,175 128,220 Q126,255 122,280 Q128,310 148,340 Q158,352 162,355 L38,355 Q42,352 52,340 Q72,310 78,280 Q74,255 72,220 Q70,175 73,145 Z',
    bodice: 'M76,115 Q100,108 124,115 L127,145 Q130,170 126,185 Q113,190 100,191 Q87,190 74,185 Q70,170 73,145 Z',
    neckline: 'M86,115 Q100,122 114,115',
  },
  balloon: {
    dress: 'M76,115 Q100,108 124,115 L130,145 Q140,175 148,210 Q158,250 155,280 Q150,310 140,335 Q120,355 100,358 Q80,355 60,335 Q50,310 45,280 Q42,250 52,210 Q60,175 70,145 Z',
    bodice: 'M76,115 Q100,108 124,115 L130,145 Q134,170 128,185 Q114,190 100,191 Q86,190 72,185 Q66,170 70,145 Z',
    neckline: 'M87,115 Q100,122 113,115',
  },
};

/* ─── Fabric texture overlay ────────────────────────── */
function FabricTexture({ fabricHex }: { fabricHex: string }) {
  const isSatin = ['#D4AF37', BS.silver].includes(fabricHex);
  const isLace  = fabricHex === '#FFFFF0';
  if (isSatin) return (
    <defs>
      <linearGradient id="satin" x1="0%" y1="0%" x2="60%" y2="100%">
        <stop offset="0%"   stopColor="white" stopOpacity="0.35" />
        <stop offset="30%"  stopColor="white" stopOpacity="0.05" />
        <stop offset="60%"  stopColor="white" stopOpacity="0.25" />
        <stop offset="100%" stopColor="black" stopOpacity="0.1" />
      </linearGradient>
    </defs>
  );
  return (
    <defs>
      <linearGradient id="fabric-shade" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%"   stopColor="white"  stopOpacity="0.15" />
        <stop offset="100%" stopColor="black"  stopOpacity="0.15" />
      </linearGradient>
    </defs>
  );
}

/* ─── Main Component ────────────────────────────────── */
export default function DressViewer() {
  const [skin,        setSkin]        = useState(SKIN_TONES[2]);
  const [fabric,      setFabric]      = useState(FABRIC_COLORS[0]);
  const [style,       setStyle]       = useState(DRESS_STYLES[0]);
  const [meters,      setMeters]      = useState(3);
  const [morphKey,    setMorphKey]    = useState(0);
  const [rippleKey,   setRippleKey]   = useState('');
  const [justAdded,   setJustAdded]   = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  // Trigger dress morph animation on any change
  useEffect(() => { setMorphKey((k) => k + 1); }, [fabric, style]);

  const handleSkinChange = (t: typeof SKIN_TONES[0]) => {
    setSkin(t);
    setRippleKey(t.name + Date.now());
  };

  const handleAddToCart = () => {
    addItem({
      id: fabric.id, name: `قماش ${fabric.name} — ${fabric.cat}`,
      description: '', price: fabric.price, price_per_meter: fabric.price,
      category: fabric.cat, colors: [{ name: fabric.name, hex: fabric.hex }],
      images: [], stock_quantity: 100, is_active: true,
    }, meters, { name: fabric.name, hex: fabric.hex });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2200);
  };

  const paths = MODEL_PATHS[style.id as keyof typeof MODEL_PATHS];

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

        {/* ══════════════════ MODEL PREVIEW ══════════════════ */}
        <div className="flex flex-col items-center sticky top-24">
          <div
            className="relative w-full max-w-xs aspect-[3/5] rounded-3xl overflow-hidden shadow-2xl"
            style={{ background: `linear-gradient(160deg, ${BS.pearl} 0%, #ede8e0 100%)` }}
          >
            {/* Background cross-hatch hint */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke={BS.deep} strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Glow behind model */}
            <div
              className="absolute inset-x-0 bottom-0 h-2/3 opacity-20 transition-all duration-700"
              style={{ background: `radial-gradient(ellipse at 50% 80%, ${fabric.hex}, transparent 70%)` }}
            />

            {/* ─── SVG Human Model ─── */}
            <svg
              viewBox="0 0 200 440"
              className="w-full h-full"
              style={{ filter: 'drop-shadow(2px 6px 16px rgba(0,0,0,0.18))' }}
            >
              <defs>
                {/* Fabric gradient */}
                <linearGradient id="dressGrad" x1="20%" y1="0%" x2="80%" y2="100%">
                  <stop offset="0%"   stopColor={fabric.hex} stopOpacity="1" />
                  <stop offset="45%"  stopColor={fabric.dark} stopOpacity="1" />
                  <stop offset="100%" stopColor={fabric.hex}  stopOpacity="0.9" />
                </linearGradient>
                {/* Skin gradient */}
                <linearGradient id="skinGrad" x1="30%" y1="0%" x2="70%" y2="100%">
                  <stop offset="0%"   stopColor={skin.hex}    stopOpacity="1" />
                  <stop offset="100%" stopColor={skin.shadow}  stopOpacity="1" />
                </linearGradient>
                {/* Hair gradient */}
                <linearGradient id="hairGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#3D2008" />
                  <stop offset="60%"  stopColor="#5C3010" />
                  <stop offset="100%" stopColor="#2A1505" />
                </linearGradient>
                {/* Shine overlay */}
                <linearGradient id="shine" x1="0%" y1="0%" x2="60%" y2="100%">
                  <stop offset="0%"   stopColor="white" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="white" stopOpacity="0"    />
                </linearGradient>
                {/* Deep shadow */}
                <linearGradient id="deepShade" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="black" stopOpacity="0" />
                  <stop offset="100%" stopColor="black" stopOpacity="0.18" />
                </linearGradient>
                <filter id="soft-shadow" x="-10%" y="-5%" width="120%" height="115%">
                  <feDropShadow dx="1" dy="3" stdDeviation="3" floodColor="#0004" />
                </filter>
              </defs>

              {/* ── Hair back ── */}
              <ellipse cx="100" cy="40" rx="28" ry="35" fill="url(#hairGrad)" />
              {/* Long flowing hair */}
              <path d="M72,55 Q55,90 58,140 Q60,160 68,170 Q62,145 65,115 Q67,90 72,75 Z"
                    fill="url(#hairGrad)" opacity="0.9" />
              <path d="M128,55 Q145,90 142,140 Q140,160 132,170 Q138,145 135,115 Q133,90 128,75 Z"
                    fill="url(#hairGrad)" opacity="0.9" />

              {/* ── Neck ── */}
              <rect x="93" y="68" width="14" height="22" rx="6" fill="url(#skinGrad)" />

              {/* ── Head ── */}
              <ellipse cx="100" cy="52" rx="22" ry="25" fill="url(#skinGrad)" />
              {/* Cheeks blush */}
              <ellipse cx="82"  cy="56" rx="7" ry="5" fill={skin.hex} opacity="0.35" />
              <ellipse cx="118" cy="56" rx="7" ry="5" fill={skin.hex} opacity="0.35" />
              {/* Eyes */}
              <ellipse cx="92"  cy="50" rx="4" ry="4.5" fill="#2A1A10" />
              <ellipse cx="108" cy="50" rx="4" ry="4.5" fill="#2A1A10" />
              <circle  cx="93"  cy="49" r="1.5" fill="white" opacity="0.7" />
              <circle  cx="109" cy="49" r="1.5" fill="white" opacity="0.7" />
              {/* Lashes */}
              <path d="M88,46.5 Q90,44 92,46" stroke="#1A1008" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              <path d="M104,46.5 Q106,44 108,46" stroke="#1A1008" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
              {/* Nose */}
              <path d="M98,56 Q100,59 102,56" stroke={skin.shadow} strokeWidth="1" fill="none" opacity="0.6"/>
              {/* Lips */}
              <path d="M93,63 Q100,68 107,63 Q103,60 100,61 Q97,60 93,63 Z" fill={skin.lipHex} />
              <path d="M93,63 Q100,65 107,63" stroke={skin.lipHex} strokeWidth="0.5" fill="none" opacity="0.6"/>
              {/* Eyebrows */}
              <path d="M87,44.5 Q92,42 96,44" stroke="#3D2008" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
              <path d="M104,44 Q108,42 113,44.5" stroke="#3D2008" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

              {/* ── Hair front ── */}
              <path d="M78,30 Q85,18 100,16 Q115,18 122,30 Q116,22 100,20 Q84,22 78,30 Z"
                    fill="url(#hairGrad)" />
              {/* Side parting */}
              <path d="M90,18 Q92,25 90,38" stroke="#2A1505" strokeWidth="1.5" fill="none" opacity="0.4"/>

              {/* ── Shoulders / arms ── */}
              {/* Left arm */}
              <path d="M72,115 Q55,125 48,155 Q44,170 46,185 Q50,180 54,170 Q58,155 64,140 Q68,130 72,125 Z"
                    fill="url(#skinGrad)" />
              {/* Right arm */}
              <path d="M128,115 Q145,125 152,155 Q156,170 154,185 Q150,180 146,170 Q142,155 136,140 Q132,130 128,125 Z"
                    fill="url(#skinGrad)" />
              {/* Hands */}
              <ellipse cx="46"  cy="188" rx="7" ry="9" fill="url(#skinGrad)" />
              <ellipse cx="154" cy="188" rx="7" ry="9" fill="url(#skinGrad)" />

              {/* ── Dress ── */}
              <g key={`dress-${morphKey}`} className="animate-dress-morph">
                {/* Main dress fill */}
                <path d={paths.dress} fill="url(#dressGrad)" filter="url(#soft-shadow)" />
                {/* Shine overlay */}
                <path d={paths.dress} fill="url(#shine)" />
                {/* Deep shade overlay */}
                <path d={paths.dress} fill="url(#deepShade)" />
                {/* Bodice detail */}
                <path d={paths.bodice} fill={fabric.dark} opacity="0.25" />
                {/* Neckline detail */}
                <path d={paths.neckline} stroke={fabric.hex} strokeWidth="1.5" fill="none" opacity="0.6" />
                {/* Fabric fold lines */}
                <path
                  d={
                    style.id === 'mermaid'
                      ? 'M88,230 Q94,250 88,270 M112,230 Q106,250 112,270'
                      : style.id === 'balloon'
                      ? 'M75,200 Q80,230 78,260 M125,200 Q120,230 122,260'
                      : 'M88,195 Q90,240 88,285 M112,195 Q110,240 112,285'
                  }
                  stroke={fabric.dark} strokeWidth="0.8" fill="none" opacity="0.3"
                />
                {/* Waist seam */}
                <line x1="68" y1="185" x2="132" y2="185" stroke={fabric.dark} strokeWidth="0.8" opacity="0.3" strokeDasharray="3,3"/>
              </g>

              {/* ── Legs (showing below dress hem) ── */}
              <rect x="87" y="352" width="12" height="28" rx="5" fill="url(#skinGrad)" />
              <rect x="101" y="352" width="12" height="28" rx="5" fill="url(#skinGrad)" />
              {/* Shoes */}
              <ellipse cx="93"  cy="383" rx="9" ry="5" fill={BS.deep} />
              <ellipse cx="107" cy="383" rx="9" ry="5" fill={BS.deep} />
              {/* Heel */}
              <rect x="86" y="381" width="3" height="6" rx="1.5" fill={BS.deep} opacity="0.7" />
              <rect x="110" y="381" width="3" height="6" rx="1.5" fill={BS.deep} opacity="0.7" />

              {/* ── Scissors logo badge ── */}
              <g transform="translate(152, 18)" className="animate-scissors opacity-70">
                <circle r="14" fill={BS.vivid} opacity="0.9" />
                <text x="0" y="5" textAnchor="middle" fontSize="10" fontWeight="900" fill="white">✂</text>
              </g>
            </svg>

            {/* Skin tone label */}
            <div
              key={rippleKey}
              className="absolute bottom-4 inset-x-4 flex items-center justify-between
                         bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-md"
              style={{ borderTop: `3px solid ${BS.vivid}` }}
            >
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full border-2 border-white shadow-md transition-all duration-300"
                  style={{ backgroundColor: skin.hex }}
                />
                <div>
                  <p className="text-xs text-gray-500 leading-none">لون البشرة</p>
                  <p className="text-sm font-bold text-gray-800">{skin.label}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">القماش</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: fabric.hex }} />
                  <p className="text-sm font-bold" style={{ color: BS.deep }}>{fabric.name}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">{meters} متر من {fabric.name}</p>
            <p className="text-4xl font-black mt-1" style={{ color: BS.deep }}>
              {(fabric.price * meters).toFixed(0)}
              <span className="text-lg font-normal text-gray-500 mr-1">ر.س</span>
            </p>
            <p className="text-xs text-gray-400">{fabric.price} ر.س للمتر · {fabric.cat}</p>
          </div>
        </div>

        {/* ══════════════════ CONTROLS ══════════════════ */}
        <div className="space-y-8">

          {/* ── Skin Tones ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ background: `linear-gradient(to bottom, ${BS.vivid}, ${BS.deep})` }} />
              <h3 className="font-bold text-lg">لون البشرة</h3>
            </div>
            <div className="flex gap-4 flex-wrap">
              {SKIN_TONES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => handleSkinChange(t)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <div
                    className="relative w-12 h-12 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: t.hex,
                      transform: skin.name === t.name ? 'scale(1.2)' : 'scale(1)',
                      boxShadow: skin.name === t.name
                        ? `0 0 0 3px white, 0 0 0 5px ${BS.vivid}, 0 6px 16px ${t.hex}88`
                        : `0 2px 8px ${t.hex}66`,
                    }}
                  >
                    {skin.name === t.name && (
                      <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/10">
                        <Check className="w-5 h-5 text-white drop-shadow" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className={`text-xs transition-all ${skin.name === t.name ? 'font-bold' : 'text-gray-500'}`}
                        style={{ color: skin.name === t.name ? BS.deep : undefined }}>
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Fabric Colors ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BS.silver }} />
              <h3 className="font-bold text-lg">لون القماش</h3>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {FABRIC_COLORS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setFabric(c)}
                  className="group flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-full aspect-square rounded-xl transition-all duration-300 relative overflow-hidden"
                    style={{
                      background: `linear-gradient(135deg, ${c.hex}, ${c.dark})`,
                      transform: fabric.id === c.id ? 'scale(1.08)' : 'scale(1)',
                      boxShadow: fabric.id === c.id
                        ? `0 0 0 3px white, 0 0 0 5px ${BS.vivid}, 0 8px 20px ${c.hex}66`
                        : `0 2px 6px ${c.hex}44`,
                    }}
                  >
                    {/* Satin shimmer effect for silver/gold */}
                    {(c.hex === BS.silver || c.hex === '#D4AF37') && (
                      <div className="absolute inset-0 opacity-30"
                           style={{ background: 'linear-gradient(45deg, transparent 30%, white 50%, transparent 70%)', backgroundSize: '200%', animation: 'shimmer 2s infinite' }} />
                    )}
                    {fabric.id === c.id && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/15">
                        <Check className="w-5 h-5 text-white drop-shadow-lg" strokeWidth={3} />
                      </div>
                    )}
                  </div>
                  <span className="text-xs text-center leading-tight"
                        style={{ color: fabric.id === c.id ? BS.deep : '#666', fontWeight: fabric.id === c.id ? 700 : 400 }}>
                    {c.name}
                  </span>
                  <span className="text-xs" style={{ color: BS.silver }}>{c.price} ر.س</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Dress Style ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BS.vivid }} />
              <h3 className="font-bold text-lg">موديل الفستان</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DRESS_STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s)}
                  className="p-4 rounded-xl border-2 text-right transition-all duration-200"
                  style={{
                    borderColor:      style.id === s.id ? BS.vivid : '#e5e7eb',
                    backgroundColor:  style.id === s.id ? `${BS.vivid}10` : 'white',
                    transform:        style.id === s.id ? 'scale(1.02)' : 'scale(1)',
                    boxShadow:        style.id === s.id ? `0 4px 12px ${BS.vivid}25` : 'none',
                  }}
                >
                  <p className="font-bold" style={{ color: style.id === s.id ? BS.deep : '#1f2937' }}>{s.label}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* ── Meters ── */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 rounded-full" style={{ backgroundColor: BS.silver }} />
              <h3 className="font-bold text-lg">الكمية (متر)</h3>
            </div>
            <div className="card-pearl p-4 rounded-xl">
              <input
                type="range" min={1} max={10} step={0.5}
                value={meters}
                onChange={(e) => setMeters(Number(e.target.value))}
                className="w-full mb-3"
                style={{ accentColor: BS.vivid }}
              />
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">1 متر</span>
                <span className="text-3xl font-black" style={{ color: BS.deep }}>{meters}م</span>
                <span className="text-gray-500 text-sm">10 متر</span>
              </div>
              <Link
                href="/ai-measure"
                className="block text-center text-sm mt-3 py-2 rounded-lg font-medium transition-colors hover:opacity-80"
                style={{ color: BS.vivid, backgroundColor: `${BS.vivid}10` }}
              >
                <Sparkles className="w-4 h-4 inline ml-1" />
                مش عارفة كم متر؟ استخدمي الحاسبة الذكية
              </Link>
            </div>
          </div>

          {/* ── Actions ── */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-lg font-bold transition-all duration-300"
              style={{
                background: justAdded ? '#16a34a' : `linear-gradient(135deg, ${BS.deep}, ${BS.vivid})`,
                color: 'white',
                boxShadow: justAdded ? '0 4px 15px rgba(22,163,74,0.4)' : `0 4px 15px ${BS.vivid}55`,
                transform: justAdded ? 'scale(0.97)' : 'scale(1)',
              }}
            >
              {justAdded
                ? <><Check className="w-5 h-5" strokeWidth={3} /> تمت الإضافة!</>
                : <><ShoppingCart className="w-5 h-5" /> أضف للسلة</>
              }
            </button>
            <Link
              href="/cart"
              className="px-6 py-4 rounded-xl font-bold text-lg border-2 transition-all hover:opacity-80"
              style={{ borderColor: BS.silver, color: '#555', backgroundColor: `${BS.silver}15` }}
            >
              السلة
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
