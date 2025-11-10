import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const AlBattaniPage = () => {
  const scientistData = {
    name: "Al-Battani",
    title: "The Master Astronomer",
    lifespan: "858 - 929 CE",
    biography: `Al-Battani was one of the greatest astronomers of all time! Born in what is now Turkey, he spent his life looking up at the stars and planets, trying to understand how they moved.

Imagine you're trying to predict where a shooting star will be tomorrow - that's what Al-Battani did with planets! He was so good at math and observation that his calculations were more accurate than anyone before him.

He worked in a beautiful observatory (a special building for studying stars) in Syria, where he used special tools to measure the positions of stars and planets. His work was so amazing that scientists in Europe used his discoveries for over 600 years!

Al-Battani proved that science and faith could work together beautifully. He believed that studying the universe was a way to understand Allah's magnificent creation.`,
    funFacts: [
      "His real name was Abu Abdullah Muhammad ibn Jabir ibn Sinan al-Battani - quite a mouthful!",
      "He calculated the length of a year to be 365 days, 5 hours, 46 minutes, and 24 seconds - super close to what we know today!",
      "He discovered that the distance between Earth and the Sun changes throughout the year",
      "There's a crater on the Moon named after him - it's called 'Albategnius'",
      "His book 'Kitab al-Zij' was translated into Latin and used by European astronomers for centuries",
    ],
    inventions: [
      {
        name: "Precise Planetary Calculations",
        description:
          "Al-Battani made incredibly accurate calculations of how planets move through space. His measurements were so precise that they helped sailors navigate the seas and helped create better calendars.",
      },
      {
        name: "Improved Astronomical Tables",
        description:
          "He created detailed charts showing where stars and planets would be at different times. These tables were like a GPS system for the ancient world!",
      },
      {
        name: "Trigonometry Advances",
        description:
          "He improved the math used to calculate angles and distances in space. This math is still used today in building construction, video games, and smartphone GPS!",
      },
      {
        name: "Solar Year Measurement",
        description:
          "He calculated how long it takes Earth to go around the Sun with amazing accuracy - he was only off by 2 minutes and 22 seconds!",
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

export default AlBattaniPage;
