import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";
//import mosqueDomeImg from "@/assets/inventions/mosque-dome.png";

const MimarSinanPage = () => {
  const scientistData = {
    name: "Mimar Sinan",
    title: "Master Architect of the Ottoman Empire",
    lifespan: "1489-1588 CE",
    biography: "Mimar Sinan, meaning 'Sinan the Architect,' is widely considered the greatest architect of the classical Islamic period and one of the world's most accomplished builders. Born in the Ottoman Empire (modern-day Turkey), he initially served as a military engineer in the Janissary corps before becoming the chief royal architect (Mimar-ı Haseki) to three sultans: Suleiman the Magnificent, Selim II, and Murad III. Over his extraordinary 50-year career, Sinan designed and supervised the construction of more than 300 structures, including mosques, schools, hospitals, bridges, and aqueducts. His mastery of structural engineering, innovative use of space and light, and harmonious proportions revolutionized Islamic architecture. His masterpiece, the Selimiye Mosque in Edirne, features a dome even larger than that of the Hagia Sophia, demonstrating his supreme engineering genius.",
    funFacts: [
      "He served as chief architect for an unprecedented 50 years, longer than any other royal architect in history",
      "He designed over 300 buildings, including 92 large mosques, 52 small mosques, 55 schools, 7 Quranic schools, 22 tombs, and 17 public kitchens",
      "His Selimiye Mosque dome spans 31.25 meters, larger than the Hagia Sophia's dome, and is perfectly proportioned",
      "He continued working and designing until just a few months before his death at age 99",
      "He pioneered earthquake-resistant building techniques still studied by modern engineers",
      "Many of his buildings are UNESCO World Heritage Sites and remain in daily use after 450+ years"
    ],
    inventions: [
      {
        name: "Advanced Dome Engineering",
        description: "Perfected techniques for building massive domes with minimal supporting structures, using precise geometric calculations and innovative weight distribution. His methods created vast open prayer spaces filled with natural light.",
        //imageUrl: mosqueDomeImg,
      },
      {
        name: "Earthquake-Resistant Design",
        description: "Developed building techniques incorporating flexible joints and strategic weight distribution that allowed structures to withstand earthquakes. Many of his buildings have survived major quakes over five centuries."
      },
      {
        name: "Acoustic Architecture",
        description: "Designed mosques with sophisticated acoustic properties using strategically placed hollow chambers in walls and domes, allowing voices to carry clearly without echo—crucial for the call to prayer and sermons."
      },
      {
        name: "Innovative Water Systems",
        description: "Created complex aqueduct and fountain systems bringing fresh water to cities, including the beautiful Kırkçeşme water supply system for Istanbul, demonstrating mastery of hydraulic engineering and urban planning."
      }
    ],
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <ScientistProfile {...scientistData} />
    </div>
  );
};

export default MimarSinanPage;