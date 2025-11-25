import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const IbnSinaPage = () => {
  const scientistData = {
    name: "Ibn Sina (Avicenna)",
    title: "The Prince of Physicians",
    lifespan: "980 - 1037 CE",
    biography: `Ibn Sina was a super genius who knew almost everything! By the time he was just 10 years old, he had memorized the entire Quran. By 16, he was already treating patients as a doctor. Can you imagine being a doctor at 16?

Born in Uzbekistan, Ibn Sina didn't just study medicine - he also learned philosophy, astronomy, physics, poetry, and music. He was so smart that he once said he learned something new from every book he read!

His most famous book, "The Canon of Medicine," was like the medical encyclopedia of its time. It had everything doctors needed to know about diseases, treatments, and how the human body works. This amazing book was used in medical schools in Europe for over 600 years!

Ibn Sina believed that keeping healthy wasn't just about medicine - it was also about eating right, exercising, and having a happy mind. He was one of the first doctors to understand that our feelings can affect our health. He saw his medical knowledge as a gift from Allah to help people.`,
    funFacts: [
      "By age 18, he had already learned everything his teachers knew!",
      "He wrote over 450 books on many different subjects",
      "He discovered that diseases could spread through water and air",
      "He was the first to describe meningitis (a brain illness) correctly",
      "He wrote books about music, math, and even how to write poetry",
      "In the West, they called him 'Avicenna' - a Latin version of his name",
    ],
    inventions: [
      {
        name: "The Canon of Medicine",
        description:
          "This five-volume medical encyclopedia organized all known medical knowledge of the time. It included treatments for diseases, descriptions of medicines, and even surgical techniques. It was used as the main medical textbook in Europe until the 1600s!",
      },
      {
        name: "Understanding Contagious Diseases",
        description:
          "Ibn Sina was one of the first to understand that some diseases could spread from person to person through tiny organisms we can't see. This was discovered 800 years before microscopes were invented!",
      },
      {
        name: "Clinical Trials for Medicine",
        description:
          "He created rules for testing new medicines to make sure they were safe and effective. These rules are similar to how we test medicines today!",
      },
      {
        name: "Psychology and Mental Health",
        description:
          "He understood that the mind and body are connected. He studied how emotions like sadness or worry could make people physically sick, and he found ways to treat both the mind and body together.",
      },
      {
        name: "Pharmacology (Medicine Science)",
        description:
          "He wrote detailed books about over 800 different medicines and drugs, describing what they were made from, how to prepare them, and what illnesses they could treat.",
      },
    ],
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <ScientistProfile {...scientistData} />
      </main>
    </div>
  );
};

export default IbnSinaPage;
