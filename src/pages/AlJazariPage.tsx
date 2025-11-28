import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const AlJazariPage = () => {
  const scientistData = {
    name: "Al-Jazari",
    title: "The Father of Robotics and Mechanical Engineering",
    lifespan: "1136–1206 CE",
    biography: `Ismail al-Jazari was a brilliant Muslim engineer, inventor, mathematician, and artist from Mesopotamia (modern-day Turkey). He is considered the father of robotics and mechanical engineering. His most famous work, "The Book of Knowledge of Ingenious Mechanical Devices," written in 1206, describes over 100 mechanical devices, complete with detailed instructions on how to construct them.

Al-Jazari served as chief engineer at the Artuqid Palace in Diyarbakır, where he spent 25 years designing and building remarkable machines. His inventions ranged from water clocks and musical automata to machines for raising water and complex locking mechanisms.

What made Al-Jazari's work revolutionary was his use of mechanisms like the crankshaft, camshaft, and segmental gears—inventions that would later become fundamental to modern machines. His work demonstrated an advanced understanding of hydrostatics, control systems, and mechanical engineering principles that were centuries ahead of his time.`,
    funFacts: [
      "Invented the crankshaft—one of the most important mechanisms in modern engines",
      "Created programmable humanoid robots (automata) that could serve drinks and play music",
      "Designed the first water-powered elephant clock that showed the hour using mechanical figures",
      "His book contained detailed engineering drawings—some of the earliest technical illustrations",
      "Built machines with camshafts, valves, and pistons—principles used in modern cars",
      "Created a hand-washing automaton that dispensed water, soap, and towels—an early 'robot'",
    ],
    inventions: [
      {
        name: "Crankshaft",
        description: "Invented the crankshaft mechanism, which converts rotary motion to reciprocating motion. This invention is fundamental to modern engines and machinery.",
      },
      {
        name: "Elephant Water Clock",
        description: "Designed an ornate water-powered clock featuring an elephant, a phoenix, dragons, and human figures that moved to mark the hours. It combined aesthetics with precise timekeeping.",
      },
      {
        name: "Programmable Automata (Robots)",
        description: "Created humanoid robots (automata) that could be programmed to perform tasks like serving drinks, playing music, and washing hands. These are considered early examples of robotics.",
      },
      {
        name: "Water-Raising Machines",
        description: "Invented various machines for raising water from rivers and wells, including reciprocating pumps with suction pipes, valve systems, and crankshaft mechanisms.",
      },
      {
        name: "Combination Lock",
        description: "Designed sophisticated locking mechanisms with multiple combination settings, similar to modern combination locks.",
      },
      {
        name: "Mechanical Musical Instruments",
        description: "Built automatic musical devices powered by water, including a programmable musical band of robotic musicians on a boat.",
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

export default AlJazariPage;
