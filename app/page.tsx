'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Calculator, Sparkles, Star, Truck, Shield, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import { useBannersStore } from '@/stores/bannersStore';
import { useProductsStore } from '@/stores/productsStore';

const ChatWidget     = dynamic(() => import('@/components/chat/ChatWidget'),     { ssr:false });
const WhatsAppButton = dynamic(() => import('@/components/ui/WhatsAppButton'),   { ssr:false });
const CookieConsent  = dynamic(() => import('@/components/ui/CookieConsent'),    { ssr:false });

// ── Fabric texture SVG for backgrounds ──
const FABRIC_PATTERN = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const TRUST = [
  { icon:Truck,     text:'شحن مجاني +200 ر.س',   sub:'لجميع مناطق المملكة' },
  { icon:Shield,    text:'ضمان جودة 100%',         sub:'أو استرداد كامل' },
  { icon:RefreshCw, text:'إرجاع مجاني 14 يوم',    sub:'سياسة مرنة' },
  { icon:Star,      text:'+500 نوع قماش',          sub:'يتجدد أسبوعياً' },
];

const FEATURES = [
  { icon:'🧮', title:'حاسبة القماش',    desc:'احسبي الكمية بدقة بدون خبرة', color:'var(--bs-primary)', href:'/ai-measure'   },
  { icon:'👗', title:'مصمم الفستان',    desc:'جربي الألوان على موديل واقعي', color:'var(--bs-navy)',    href:'/dress-viewer' },
  { icon:'🤖', title:'المساعد الذكي',   desc:'سدى — خبيرتك الشخصية دائماً', color:'var(--bs-primary)', href:'/chat'         },
  { icon:'🧵', title:'تشكيلة الأقمشة', desc:'+500 نوع من أفضل المصانع',    color:'var(--bs-navy)',    href:'/products'     },
];

// ── Horizontal scroll section items ──
const HORIZONTAL_ITEMS = [
  { emoji:'✂️', title:'قص احترافي',   sub:'بيد الحرفية المتمرسة',    bg:'linear-gradient(135deg,#1E2B45,#2D4070)' },
  { emoji:'🧵', title:'خيوط فاخرة',   sub:'من أجود المواد العالمية', bg:'linear-gradient(135deg,#F5A623,#D4880A)' },
  { emoji:'👗', title:'تصاميم 2025',   sub:'أحدث صيحات الموضة',      bg:'linear-gradient(135deg,#1B6B45,#0A3A20)' },
  { emoji:'🌟', title:'جودة ملكية',   sub:'لا تُضاهى في المملكة',   bg:'linear-gradient(135deg,#5C1A7A,#3A0060)' },
  { emoji:'🚚', title:'توصيل سريع',   sub:'لجميع مناطق المملكة',    bg:'linear-gradient(135deg,#1E2B45,#3D5A9A)' },
  { emoji:'💎', title:'حرير طبيعي',   sub:'الفخامة الحقيقية',       bg:'linear-gradient(135deg,#C9922A,#8B6000)' },
];

// ── Banner display component ──
function BannerBlock({ position }: { position: string }) {
  const getActive = useBannersStore(s => s.getActive);
  const bans = getActive(position as any);
  if (!bans.length) return null;
  const b = bans[0];
  return (
    <Link href={b.href}
      className="relative flex items-center w-full h-full rounded-2xl overflow-hidden group cursor-pointer"
      style={{ background: b.image ? 'transparent' : b.bg, minHeight:'inherit' }}>
      {b.image && <img src={b.image} alt={b.title} className="absolute inset-0 w-full h-full object-cover"/>}
      {b.image && <div className="absolute inset-0" style={{ background:'rgba(15,22,32,0.5)' }}/>}
      <div className="relative z-10 p-6 sm:p-8">
        {b.badge && <span className="inline-block px-3 py-1 rounded-full text-xs font-black mb-3 bg-white/20 text-white backdrop-blur-sm">{b.badge}</span>}
        <h2 className="font-black text-white leading-tight mb-2" style={{ fontSize:'clamp(1.1rem,2.5vw,1.6rem)' }}>{b.title}</h2>
        {b.sub && <p className="text-white/75 text-sm mb-4">{b.sub}</p>}
        {b.cta && (
          <span className="inline-flex items-center gap-1 text-sm font-bold px-4 py-2 rounded-lg bg-white/15 text-white border border-white/20 group-hover:bg-white/25 transition-all">
            {b.cta} <ChevronLeft className="w-3.5 h-3.5"/>
          </span>
        )}
      </div>
    </Link>
  );
}

// ── Product Card ──
function ProductCard({ product }: { product: any }) {
  return (
    <Link href={`/products/${product.id}`}
      className="card overflow-hidden group block hover:no-underline flex-shrink-0"
      style={{ width:240 }}>
      <div className="h-36 relative overflow-hidden"
           style={{ background:`linear-gradient(135deg, ${product.colors?.[0]?.hex||'#F5A623'}, ${product.colors?.[1]?.hex||'#D4880A'})` }}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: FABRIC_PATTERN }}/>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"/>
        <span className="absolute bottom-2 right-2 badge badge-orange text-[10px]">{product.category}</span>
      </div>
      <div className="p-4">
        <h3 className="font-black text-sm mb-1 truncate" style={{ color:'var(--bs-navy)' }}>{product.name}</h3>
        <div className="flex items-center justify-between">
          <span className="font-black text-lg" style={{ color:'var(--bs-primary)' }}>
            {product.price_per_meter}<span className="text-xs font-normal text-gray-400 mr-0.5">ر.س/م</span>
          </span>
          <span className="badge badge-green text-[10px]">متوفر</span>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const products   = useProductsStore(s => s.getActive());
  const stripBanners = useBannersStore(s => s.getActive('strip'));
  const scrollRef  = useRef<HTMLDivElement>(null);

  // Horizontal scroll handler
  const scrollH = (dir: 'left'|'right') => {
    scrollRef.current?.scrollBy({ left: dir==='left' ? -280 : 280, behavior:'smooth' });
  };

  return (
    <div className="flex flex-col min-h-screen" style={{ background:'var(--bs-pearl)' }}>
      <Navbar />

      {/* ── STRIP BANNER ── */}
      {stripBanners.length > 0 && (
        <div className="py-2.5 px-4 text-center text-sm font-bold text-white" style={{ background:'var(--bs-grad)' }}>
          {stripBanners[0].title}
          {stripBanners[0].cta && (
            <Link href={stripBanners[0].href} className="mr-3 underline underline-offset-2 hover:no-underline">
              {stripBanners[0].cta}
            </Link>
          )}
        </div>
      )}

      <main className="flex-1">

        {/* ═══ SECTION 1: HERO — Vertical scroll ═══ */}
        <section className="relative overflow-hidden" style={{ minHeight:'90vh', display:'flex', flexDirection:'column' }}>
          {/* Fabric texture BG */}
          <div className="absolute inset-0" style={{ background:'var(--bs-grad-hero)', backgroundImage: FABRIC_PATTERN }}/>
          {/* Glow */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20"
                 style={{ background:'radial-gradient(circle, var(--bs-primary), transparent)' }}/>
            <div className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full opacity-10"
                 style={{ background:'radial-gradient(circle, var(--bs-primary-l), transparent)' }}/>
          </div>

          <div className="relative flex-1 flex flex-col">
            {/* Main hero content */}
            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-16 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

                {/* Left: Text + CTA */}
                <div className="lg:col-span-3 fade-up">
                  <div className="inline-block mb-6">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white/95 p-1.5 shadow-2xl"
                         style={{ border:'2px solid rgba(245,166,35,0.4)' }}>
                      <Image src="/logo.jpg" alt="Bin Siddiq Fabrics" width={96} height={96}
                             className="w-full h-full object-contain" priority/>
                    </div>
                  </div>
                  <p className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-5 fade-up-1"
                     style={{ background:'rgba(245,166,35,0.15)', color:'var(--bs-primary-l)', border:'1px solid rgba(245,166,35,0.25)' }}>
                    <Star className="w-3.5 h-3.5 fill-current"/> أفضل محل أقمشة في ينبع والمملكة
                  </p>
                  <h1 className="font-black text-white leading-none mb-3 fade-up-2"
                      style={{ fontSize:'clamp(2.8rem,8vw,5rem)', fontFamily:'Georgia,serif' }}>
                    BIN SIDDIQ<br/>
                    <span style={{ color:'var(--bs-primary)' }}>FABRICS</span>
                  </h1>
                  <p className="text-white/70 mb-8 max-w-lg fade-up-3"
                     style={{ fontSize:'clamp(0.95rem,2vw,1.1rem)', lineHeight:1.8 }}>
                    أفضل الأقمشة الفاخرة في ينبع والمملكة — جورجيت، ساتان، شيفون، حرير وأكثر
                  </p>
                  <div className="flex flex-wrap gap-3 fade-up-4">
                    <Link href="/products" className="btn-primary text-base px-8 py-4 font-black">
                      تسوق الآن <ChevronLeft className="w-4 h-4"/>
                    </Link>
                    <Link href="/dress-viewer"
                      className="flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-base text-white transition-all hover:bg-white/20"
                      style={{ background:'rgba(255,255,255,0.1)', border:'1.5px solid rgba(255,255,255,0.25)' }}>
                      ✨ صممي فستانك
                    </Link>
                  </div>
                </div>

                {/* Right: Banner sections grid */}
                <div className="lg:col-span-2 grid grid-cols-1 gap-4 fade-up-2">
                  <div style={{ minHeight:180 }}><BannerBlock position="hero"/></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div style={{ minHeight:120 }}><BannerBlock position="sub1"/></div>
                    <div style={{ minHeight:120 }}><BannerBlock position="sub2"/></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust bar */}
            <div style={{ background:'rgba(15,22,32,0.7)', backdropFilter:'blur(8px)', borderTop:'1px solid rgba(245,166,35,0.2)' }}>
              <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TRUST.map(t => (
                  <div key={t.text} className="flex items-center gap-2.5 px-2">
                    <t.icon className="w-4 h-4 flex-shrink-0" style={{ color:'var(--bs-primary)' }}/>
                    <div>
                      <p className="text-white text-xs font-bold">{t.text}</p>
                      <p className="text-white/50 text-[10px]">{t.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: HORIZONTAL SCROLL ═══ */}
        <section className="py-12 overflow-hidden" style={{ background:'white' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--bs-primary)' }}>
                اكتشفي
              </p>
              <h2 className="section-title">عالم الأقمشة</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => scrollH('right')}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:shadow"
                style={{ borderColor:'var(--bs-primary)', color:'var(--bs-primary)' }}>
                <ChevronRight className="w-4 h-4"/>
              </button>
              <button onClick={() => scrollH('left')}
                className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow text-white"
                style={{ background:'var(--bs-grad)' }}>
                <ChevronLeft className="w-4 h-4"/>
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 px-4 sm:px-6 overflow-x-auto pb-4 snap-x snap-mandatory"
            style={{ scrollbarWidth:'none', msOverflowStyle:'none', maxWidth:'100vw' }}
          >
            {HORIZONTAL_ITEMS.map((item, i) => (
              <div key={i}
                className="flex-shrink-0 rounded-2xl overflow-hidden relative snap-start cursor-pointer group"
                style={{ width:220, height:280, background:item.bg }}>
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage:FABRIC_PATTERN }}/>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all"/>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                  <div className="text-5xl mb-4">{item.emoji}</div>
                  <h3 className="font-black text-white text-lg mb-1">{item.title}</h3>
                  <p className="text-white/70 text-sm">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SECTION 3: FEATURES — Vertical (clickable) ═══ */}
        <section className="py-16 sm:py-20" style={{ background:'var(--bs-pearl)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color:'var(--bs-primary)' }}>
                خدماتنا
              </p>
              <h2 className="section-title mb-2">كل ما تحتاجينه</h2>
              <div className="brand-divider mx-auto"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {FEATURES.map((f) => (
                <Link key={f.href} href={f.href}
                  className="card p-8 text-center group block hover:no-underline"
                  style={{ '--hover-color': f.color } as any}>
                  <div className="text-4xl mb-4 transition-transform duration-300 group-hover:scale-110 inline-block">{f.icon}</div>
                  <h3 className="font-black text-lg mb-2" style={{ color:'var(--bs-navy)' }}>{f.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 text-sm font-bold transition-all group-hover:gap-2"
                        style={{ color:f.color }}>
                    ابدئي الآن ←
                  </span>
                  <div className="mt-4 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 mx-6"
                       style={{ background:`linear-gradient(to right, transparent, ${f.color}, transparent)` }}/>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ SECTION 4: PRODUCTS HORIZONTAL SCROLL ═══ */}
        <section className="py-16 sm:py-20 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'var(--bs-primary)' }}>الأكثر مبيعاً</p>
              <h2 className="section-title">منتجات مميزة</h2>
            </div>
            <Link href="/products" className="hidden sm:flex items-center gap-1 text-sm font-bold hover:opacity-70"
                  style={{ color:'var(--bs-navy)' }}>
              عرض الكل <ChevronLeft className="w-3.5 h-3.5"/>
            </Link>
          </div>
          <div className="flex gap-4 px-4 sm:px-6 overflow-x-auto pb-4 snap-x"
               style={{ scrollbarWidth:'none' }}>
            {products.slice(0, 8).map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </section>

        {/* ═══ SECTION 5: CTA ═══ */}
        <section className="py-20 relative overflow-hidden"
                 style={{ background:'var(--bs-grad-warm)' }}>
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage:FABRIC_PATTERN }}/>
          <div className="relative max-w-2xl mx-auto px-4 text-center text-white">
            <Image src="/logo.jpg" alt="Bin Siddiq" width={72} height={72}
                   className="mx-auto mb-6 rounded-xl object-contain bg-white/10 p-1.5"/>
            <h2 className="font-black mb-4" style={{ fontSize:'clamp(1.8rem,5vw,3rem)', fontFamily:'Georgia,serif' }}>
              صممي فستانك قبل الشراء
            </h2>
            <p className="text-white/70 mb-8">جربي الألوان والموديلات على موديل واقعي — مجاناً</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/dress-viewer" className="btn-primary px-8 py-4 font-black text-base flex items-center gap-2">
                <Sparkles className="w-5 h-5"/> مصمم الفستان
              </Link>
              <Link href="/ai-measure" className="btn-navy px-8 py-4 font-black text-base flex items-center gap-2">
                <Calculator className="w-5 h-5"/> حاسبة القماش
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ChatWidget/>
      <WhatsAppButton/>
      <CookieConsent/>
    </div>
  );
}
