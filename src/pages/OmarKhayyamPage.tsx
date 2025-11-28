import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";
//import geometricToolsImg from "@/assets/inventions/geometric-tools.png";

const OmarKhayyamPage = () => {
  const scientistData = {
    name: "Omar Khayyam",
    title: "Mathematician, Astronomer, and Poet",
    lifespan: "1048-1131 CE",
    biography: "Omar Khayyam was a Persian polymath whose contributions spanned mathematics, astronomy, philosophy, and poetry. Born in Nishapur (in modern-day Iran), he made groundbreaking advances in algebra and developed an accurate solar calendar that required only minor corrections over centuries. His mathematical treatise 'On Demonstration of Problems of Algebra' was revolutionary, containing the first general treatment of cubic equations and geometric solutions to algebraic problems. As an astronomer, he led the team that created the Jalali calendar, which is more accurate than the Gregorian calendar used today. Though renowned in the East as a brilliant scholar, he became famous in the West primarily for his poetry collection 'Rubaiyat' (quatrains), which explores themes of mortality, love, and the meaning of existence. His work bridged science, mathematics, and the humanities in a way few scholars have achieved.",
    funFacts: [
      "His Jalali calendar (1079 CE) has an error of only 1 day in 3,770 years, more accurate than the Gregorian calendar's 1 day in 3,226 years",
      "He wrote one of the most influential works on algebra, 'Treatise on Demonstration of Problems of Algebra'",
      "His poetry wasn't widely known in the West until Edward FitzGerald translated the Rubaiyat in 1859",
      "He was one of the first to solve certain types of cubic equations using geometric methods",
      "An asteroid (3095 Omarkhayyam) and a lunar crater are named in his honor",
      "He contributed to the understanding of parallel lines, influencing the development of non-Euclidean geometry centuries later"
    ],
    inventions: [
      {
        name: "Geometric Algebra",
        description: "Pioneered the use of geometric methods to solve cubic equations, finding intersection points of conic sections to determine algebraic solutions. This approach bridged geometry and algebra in revolutionary ways.",
        //imageUrl: geometricToolsImg,
      },
      {
        name: "Jalali Calendar",
        description: "Led the creation of one of the most accurate solar calendars ever devised, with sophisticated astronomical calculations determining the exact length of the solar year. Still used in Iran and Afghanistan today."
      },
      {
        name: "Theory of Parallels",
        description: "Made significant advances in understanding parallel lines and the parallel postulate in geometry, work that contributed to the eventual development of non-Euclidean geometry five centuries later."
      },
      {
        name: "Binomial Theorem",
        description: "Developed an early version of the binomial theorem and Pascal's triangle (known as Khayyam's triangle in Iran), which later became fundamental to probability theory and combinatorics."
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

export default OmarKhayyamPage;