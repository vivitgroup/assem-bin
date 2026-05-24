import dynamic from 'next/dynamic';
import type { Metadata } from 'next';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'مصمم الفستان التفاعلي | Bin Siddiq Fabric',
  description: 'صممي فستانك قبل الشراء — اختاري اللون والموديل وشوفي النتيجة على موديل تفاعلي.',
};

// Lazy load the heavy SVG component — saves ~30KB from initial bundle
const DressViewer = dynamic(() => import('@/components/dress-viewer/DressViewer'), {
  loading: () => (
    <div className="flex items-center justify-center py-32">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full border-4 border-t-transparent mx-auto mb-4 animate-spin"
             style={{ borderColor: 'var(--bs-silver)', borderTopColor: 'var(--bs-vivid)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--bs-deep)' }}>جاري تحميل المصمم...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default function DressViewerPage() {
  return (
    <div className="min-h-screen flex flex-col bg-pearl">
      <Navbar />
      <main className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4 mb-8 text-center">
          <p className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: 'var(--bs-vivid)' }}>
            تجربة تفاعلية
          </p>
          <h1 className="font-playfair font-black mb-3" style={{ fontSize: 'clamp(1.8rem,5vw,2.8rem)', color: 'var(--bs-deep)' }}>
            مصمم الفستان
          </h1>
          <p className="text-gray-500 max-w-md mx-auto text-base">
            اختاري لون بشرتك وقماشك وموديل فستانك — وشوفي النتيجة فوراً على موديل واقعي
          </p>
        </div>
        <DressViewer />
      </main>
      <Footer />
    </div>
  );
}
