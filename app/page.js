// app/page.jsx
import HeaderSection from './HomePage/HeaderSection.jsx';

import AvailableGames from './HomePage/AvailableGames.jsx';
import AboutUs from './HomePage/AboutUs.jsx';
import News from './HomePage/News';

export const metadata = {
  title: 'منصة الألعاب - الرئيسية',
  description: 'اكتشف الألعاب الرائجة، تواصل مع اللاعبين، وابنِ مجتمع الألعاب الخاص بك.',
  keywords: 'ألعاب, ألعاب الفيديو, ألعاب أونلاين, مجتمع',
};

export default function Home() {
  return (
    <>
      <HeaderSection />
      <AvailableGames />
      <News/>
      <AboutUs/>
      
    </>
  );
}
