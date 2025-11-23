import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const JabirIbnHayyanPage = () => {
  const scientistData = {
    name: "Jabir ibn Hayyan",
    title: "The Father of Chemistry",
    lifespan: "721 - 815 CE",
    biography: `Jabir ibn Hayyan was like a real-life magical scientist! But instead of magic, he used real science and experiments to discover amazing things about chemicals and materials.

Born in Persia (modern-day Iran), Jabir loved mixing different substances to see what would happen. He was the first person to write down his experiments step-by-step, so other scientists could learn from him - just like following a recipe!

Before Jabir, people called 'alchemists' tried to turn regular metals into gold using magic. But Jabir said, "Let's use real science instead!" He created the first chemistry laboratory and invented tools that chemists still use today.

He wrote over 3,000 books and papers! His work was so important that the word "algebra" comes from Arabic, and many chemistry words we use today came from his discoveries. He believed that understanding how materials work was a way to appreciate Allah's creation.`,
    funFacts: [
      "He's known in the West as 'Geber' - that's the Latin version of his name",
      "He invented an early version of the laboratory and proper experimental methods",
      "He wrote so many books that people wondered if he had a team of writers!",
      "He discovered many acids and chemicals that are still important today",
      "He was the first to explain the difference between acids and bases",
      "He created early versions of perfume-making techniques still used today",
    ],
    inventions: [
      {
        name: "Laboratory Equipment",
        description:
          "Jabir invented many tools used in chemistry labs, including the alembic (for distilling liquids), retorts, and beakers. These tools are still used in modern science labs!",
      },
      {
        name: "Distillation Process",
        description:
          "He perfected the process of distillation - separating liquids by heating them. This is how we make perfumes, essential oils, and even purify water today!",
      },
      {
        name: "Discovery of Acids",
        description:
          "He was the first to discover and describe important acids like sulfuric acid, nitric acid, and hydrochloric acid. These are essential in modern chemistry, medicine, and manufacturing.",
      },
      {
        name: "Scientific Method in Chemistry",
        description:
          "He was the first chemist to write down experiments clearly so others could repeat them. This is the foundation of how science works today - test, record, repeat!",
      },
      {
        name: "Crystallization Techniques",
        description:
          "He discovered how to make crystals from liquids, which is important for making medicines, sugar, and even computer chips!",
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

export default JabirIbnHayyanPage;
