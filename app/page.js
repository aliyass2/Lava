// app/page.jsx
import HeaderSection from './components/HeaderSection';
import AvailableGames from './components/AvailableGames';
import AboutUs from './components/AboutUs';
import Gallery from './components/gallery';

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
      <AboutUs/>
      <Gallery/>
    </>
  );
}
