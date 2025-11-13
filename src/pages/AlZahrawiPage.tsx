import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const AlZahrawiPage = () => {
  const scientistData = {
    name: "Al-Zahrawi",
    title: "The Father of Modern Surgery",
    lifespan: "936–1013 CE",
    biography: `Abu al-Qasim Khalaf ibn al-Abbas al-Zahrawi, known in the West as Abulcasis, was an Andalusian physician and surgeon who lived in Córdoba, Spain. He is considered the greatest surgeon of the medieval Islamic world and has been described as the father of modern surgery.

Al-Zahrawi's greatest contribution to medicine is his 30-volume medical encyclopedia, Al-Tasrif, which was used as a reference in European medical schools for centuries. The surgical volume of this work contains detailed descriptions of over 200 surgical instruments, many of which he designed himself.

His innovative techniques included the use of catgut for internal stitches, the creation of the first pair of forceps for use in childbirth, and pioneering work in dental surgery. He emphasized the importance of a positive doctor-patient relationship and believed in thorough medical training.`,
    funFacts: [
      "He invented over 200 surgical instruments, many still used today in modern surgery",
      "Performed the first thyroidectomy (removal of thyroid gland)",
      "His book Al-Tasrif was translated into Latin and used in European universities for over 500 years",
      "He was the first to describe an ectopic pregnancy and advocated for its surgical treatment",
      "Introduced the use of cotton and animal gut in surgery for internal stitches",
      "Created specialized instruments for ear, nose, and throat surgery",
    ],
    inventions: [
      {
        name: "Surgical Instruments",
        description: "Designed over 200 surgical instruments including scalpels, forceps, scissors, and needles. Many of his designs are still used in modern surgery with minimal modifications.",
      },
      {
        name: "Catgut Sutures",
        description: "Pioneered the use of catgut (absorbable material made from animal intestines) for internal stitches, which dissolve naturally in the body after healing.",
      },
      {
        name: "Obstetric Forceps",
        description: "Invented forceps for use during childbirth to safely deliver babies, reducing maternal and infant mortality rates.",
      },
      {
        name: "Dental Tools",
        description: "Created specialized instruments for dental surgery and tooth extraction, laying the foundation for modern dental practices.",
      },
      {
        name: "Cauterization Tools",
        description: "Developed various cautery instruments for controlling bleeding during surgery and treating wounds.",
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

export default AlZahrawiPage;
