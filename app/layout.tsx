import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Realistic City Driving Simulator 3D - Clutch, Gears & Cockpit View',
  description: '3D Realistic Car Driving Game with Clutch, Manual Gear Shifter, Brake, Accelerator, Horn, Detailed 1st-Person Interior Cockpits, Car Progression, and Interactive City Map.',
  openGraph: {
    title: 'Realistic City Driving Simulator 3D',
    description: 'Master manual driving with realistic clutch control, gear shifting, interior cockpit view, city traffic, and unlockable cars.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Realistic City Driving Simulator 3D',
    description: 'Master manual driving with realistic clutch control, gear shifting, interior cockpit view, city traffic, and unlockable cars.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased overflow-hidden select-none" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
