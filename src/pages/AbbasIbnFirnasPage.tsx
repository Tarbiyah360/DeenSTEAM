import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const AbbasIbnFirnasPage = () => {
  const scientistData = {
    name: "Abbas ibn Firnas",
    title: "The First Person to Attempt Human Flight",
    lifespan: "810–887 CE",
    biography: `Abbas ibn Firnas was an Andalusian polymath, inventor, physician, chemist, engineer, and Moorish poet who lived in Córdoba, Spain. He is considered one of the most creative minds of his time and is best known for his attempt at human flight—over 1,000 years before the Wright Brothers.

At the age of 65, Ibn Firnas constructed a pair of wings made of silk and eagle feathers, supported by a wooden frame. He launched himself from a mountain near Córdoba and successfully glided through the air for several minutes before crash-landing. While he broke some bones in the landing (he hadn't designed a proper tail for slowing down), this was the first recorded attempt at controlled flight in human history.

Beyond aviation, Ibn Firnas made significant contributions to various fields. He invented a water clock called Al-Maqata, designed a planetarium that simulated the sky and weather patterns including thunder and lightning, and was among the first to manufacture glass from sand and stones. He also developed techniques for cutting rock crystal that were previously unknown in Andalusia.`,
    funFacts: [
      "Made the first recorded attempt at controlled human flight in 875 CE—over 1,000 years before the Wright Brothers",
      "Created a planetarium in his house that simulated stars, clouds, thunder, and lightning",
      "Was the first person in Andalusia to develop a process for manufacturing glass",
      "Built a working water clock that was considered remarkably accurate for its time",
      "There's a crater on the Moon named after him, and Baghdad International Airport is also named in his honor",
      "Inspired later European inventors and influenced Leonardo da Vinci's flying machine designs",
    ],
    inventions: [
      {
        name: "Flying Machine (Wing Suit)",
        description: "Created wings made from silk fabric and eagle feathers stretched over a wooden frame. Successfully glided through the air for several minutes in what is considered the first controlled flight attempt in history.",
      },
      {
        name: "Planetarium",
        description: "Built a mechanical planetarium in his home that could simulate the movement of stars, planets, and weather phenomena including clouds, thunder, and lightning.",
      },
      {
        name: "Glass Manufacturing Process",
        description: "Developed innovative techniques for manufacturing clear glass from sand and stones, bringing this technology to Andalusia for the first time.",
      },
      {
        name: "Water Clock (Al-Maqata)",
        description: "Invented an accurate water-powered clock that improved upon earlier designs and helped with precise timekeeping for prayers and astronomical observations.",
      },
      {
        name: "Rock Crystal Cutting Technique",
        description: "Discovered methods for cutting and shaping rock crystal, a skill previously unknown in Andalusia, which was valuable for making lenses and decorative items.",
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <ScientistProfile {...scientistData} />
    </div>
  );
};

export default AbbasIbnFirnasPage;
