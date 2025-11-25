import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const FatimaAlFihriPage = () => {
  const scientistData = {
    name: "Fatima al-Fihri",
    title: "Founder of the World's Oldest University",
    lifespan: "800–880 CE",
    biography: `Fatima al-Fihri was an Arab Muslim woman who founded the University of al-Qarawiyyin in Fez, Morocco, in 859 CE. This institution is recognized by UNESCO and Guinness World Records as the oldest existing, continuously operating, and first degree-awarding educational institution in the world.

Born in Tunisia, Fatima's family moved to Fez when she was young. After inheriting wealth from her father, a successful merchant, she used her entire inheritance to build a mosque with an associated school (madrasa) that would grow into a full university.

The University of al-Qarawiyyin became a leading spiritual and educational center in the Muslim world and a major intellectual hub that attracted scholars from across the Islamic world and Europe. It played a crucial role in the cultural and academic exchange between the Islamic world and Europe during the Middle Ages, teaching astronomy, mathematics, science, philosophy, and Islamic studies.`,
    funFacts: [
      "Founded the world's oldest continuously operating university in 859 CE",
      "Used her entire inheritance to build the university and mosque",
      "The university's library houses some of the world's oldest manuscripts, including a 9th-century Quran",
      "The university influenced European universities like Bologna and Oxford",
      "Notable scholars who studied there include Ibn Khaldun and Maimonides",
      "The institution is still operating today, over 1,160 years later",
    ],
    inventions: [
      {
        name: "University of al-Qarawiyyin",
        description: "Established the world's first and oldest degree-granting university, which became a center of learning in mathematics, astronomy, medicine, chemistry, and religious studies.",
      },
      {
        name: "Educational System",
        description: "Created a structured educational model with set curricula, examinations, and degree certifications that influenced later European universities.",
      },
      {
        name: "Library and Manuscript Collection",
        description: "Built a library that preserved countless ancient manuscripts and texts, serving as a repository of knowledge for centuries.",
      },
      {
        name: "Scholarly Community",
        description: "Fostered an international community of scholars and students that facilitated the exchange of knowledge between different cultures and civilizations.",
      },
      {
        name: "Scientific Research Center",
        description: "Established facilities where scholars could conduct research in various fields including astronomy, mathematics, and natural sciences.",
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

export default FatimaAlFihriPage;
