// app/page.jsx
import HeaderSection from './HomePage/HeaderSection.jsx';



import AvailableGames from './HomePage/AvailableGames.jsx';

import AboutUs from './HomePage/AboutUs.jsx';


import News from './HomePage/News.jsx';

export const metadata = {
  title: 'Lava gaming center',
  description: 'gaming cafe ',
  keywords: 'ألعاب, ألعاب الفيديو, مقهى العاب, بليارد , بطولات , العاب الكترونية',
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
