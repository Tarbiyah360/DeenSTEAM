import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const AlKhwarizmiPage = () => {
  const scientistData = {
    name: "Al-Khwarizmi",
    title: "The Father of Algebra",
    lifespan: "780 - 850 CE",
    biography: `Al-Khwarizmi was the mathematical genius who gave us algebra! Whenever you solve for 'x' in math class, you can thank him. His name even gave us the word "algorithm" - those step-by-step instructions that computers use.

Born in Persia (modern-day Uzbekistan), he worked in the House of Wisdom in Baghdad, which was like a huge library and university combined. Imagine a place where the smartest people from all over the world came to share their knowledge - that's where Al-Khwarizmi worked!

He didn't just invent algebra - he also brought the number system we use today (0, 1, 2, 3, 4, 5, 6, 7, 8, 9) from India to the Islamic world and then to Europe. Before this, people used very complicated Roman numerals (I, II, III, IV, V...). Can you imagine doing math homework with Roman numerals? It would be so hard!

Al-Khwarizmi believed that mathematics was a beautiful language for understanding Allah's ordered universe. He used his knowledge to help people solve everyday problems like dividing land, calculating inheritance, and trade.`,
    funFacts: [
      "The word 'algorithm' comes from the Latin version of his name: 'Algoritmi'",
      "The word 'algebra' comes from his book title 'Al-Jabr'",
      "He created the first systematic solution to linear and quadratic equations",
      "His books were translated into Latin and used in European universities for centuries",
      "He made detailed maps that helped travelers and merchants navigate better",
      "The numbers we use today (0-9) are called 'Arabic numerals' because of his work spreading them",
    ],
    inventions: [
      {
        name: "Algebra",
        description:
          "Al-Khwarizmi created algebra as we know it today! He showed how to solve equations step-by-step using logical rules. His book 'Al-Kitab al-Mukhtasar fi Hisab al-Jabr wal-Muqabala' introduced the world to algebraic methods that are still taught in schools today.",
      },
      {
        name: "Arabic Numerals System",
        description:
          "He introduced the Hindu-Arabic numeral system (0-9) to the Islamic world and Europe. This system made math SO much easier than using letters! It's why we can do complex calculations today.",
      },
      {
        name: "Algorithms",
        description:
          "He wrote clear, step-by-step instructions for solving mathematical problems. These 'algorithms' are the basis of computer programming today! Every app on your phone uses algorithms.",
      },
      {
        name: "Astronomical Tables",
        description:
          "He created detailed tables that helped people figure out prayer times, the direction to Mecca, and when religious holidays would occur. These tables combined astronomy and mathematics.",
      },
      {
        name: "Geography and Mapmaking",
        description:
          "He improved world maps and wrote a book describing the known world. His maps were more accurate than previous ones and helped traders and explorers find their way.",
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

export default AlKhwarizmiPage;
