// app/components/HeaderSection.jsx
import controler from './../../public/temp/controler.webp';
import fifa from './../../public/temp/fifa.jpg';
import guy from './../../public/temp/guy.webp';
import ImageCarousel from './../components/images-components/ImageCarousel.jsx';
export default function HeaderSection() {
  // Define images data with Arabic titles and descriptions
  const carouselImages = [
    {
      url: guy,
      title: "رجل",
      description: "الصورة الأولى في المعرض"
    },
    {
      url: fifa,
      title: "الرحلات المستقبلية",
      description: "استكشف شوارع المستقبل"
    },
    {
      url: controler,
      title: "أحلام النيون",
      description: "حيث تلتقي التكنولوجيا بالليل"
    }
  ];

  return (
    <header>
      <ImageCarousel images={carouselImages} />
    </header>
  );
}
