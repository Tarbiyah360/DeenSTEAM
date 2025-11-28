import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";
//import waterClockImg from "@/assets/inventions/water-clock.png";

const BanuMusaPage = () => {
  const scientistData = {
    name: "Banu Musa Brothers",
    title: "Pioneers of Automatic Control and Engineering",
    lifespan: "9th Century CE (800s)",
    biography: "The three Banu Musa brothers—Muhammad, Ahmad, and al-Hasan—were Persian scholars who lived during the Islamic Golden Age in Baghdad. Sons of Musa ibn Shakir, an astronomer and robber-turned-scholar, they became prominent figures in the House of Wisdom (Bayt al-Hikma), the great intellectual center of Baghdad under Caliph al-Ma'mun. The brothers made extraordinary contributions to mathematics, engineering, and mechanics. They supervised the translation of Greek scientific works into Arabic and conducted original research that advanced human knowledge significantly. Their most famous work, 'The Book of Ingenious Devices' (Kitab al-Hiyal), described over 100 mechanical devices and is considered one of the most important engineering texts of the medieval period. They pioneered automatic control systems and created devices that could be considered precursors to robotics.",
    funFacts: [
      "They employed the famous mathematician and translator Hunayn ibn Ishaq to translate Greek scientific texts",
      "Their 'Book of Ingenious Devices' contained designs for the first automatic controls and feedback mechanisms",
      "They calculated the circumference of the Earth with remarkable accuracy",
      "Each brother specialized in different areas: Muhammad in astronomy and mathematics, Ahmad in mechanics, and al-Hasan in geometry",
      "They created a fountain that changed shape at regular intervals using automatic control—one of the first programmable machines",
      "Their work influenced Leonardo da Vinci and other Renaissance inventors centuries later"
    ],
    inventions: [
      {
        name: "Automatic Control Systems",
        description: "Invented the first known automatic control mechanisms using feedback systems, including water level controls and self-regulating oil lamps. These principles are fundamental to modern automation and robotics.",
        //imageUrl: waterClockImg,
      },
      {
        name: "Trick Vessels and Fountains",
        description: "Designed ingenious vessels that could control liquid flow using air pressure and valves, including fountains with programmable patterns. These demonstrated sophisticated understanding of fluid dynamics and pneumatics."
      },
      {
        name: "Mechanical Grabber",
        description: "Created an automatic mechanical grabber operated by steam power, capable of picking up objects. This invention showed early understanding of pneumatic and hydraulic systems used in modern machinery."
      },
      {
        name: "Musical Automata",
        description: "Designed self-playing musical instruments using automatic control mechanisms, including a device that played flute-like sounds using water pressure—an early form of programmable entertainment technology."
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

export default BanuMusaPage;