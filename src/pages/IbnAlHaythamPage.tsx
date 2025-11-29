import Navigation from "@/components/Navigation";
import ScientistProfile from "@/components/ScientistProfile";

const IbnAlHaythamPage = () => {
  const scientistData = {
    name: "Ibn al-Haytham (Alhazen)",
    title: "Father of Optics and Scientific Method",
    lifespan: "965-1040 CE",
    biography: "Ibn al-Haytham, known in the West as Alhazen, was a polymath who made revolutionary contributions to science, particularly in optics, mathematics, and astronomy. Born in Basra (modern-day Iraq), he spent much of his productive life in Cairo, Egypt. His groundbreaking work 'Book of Optics' (Kitab al-Manazir) revolutionized the understanding of light and vision, correcting ancient Greek theories and establishing the foundation for modern optics. He was the first to explain that vision occurs when light reflects from an object into the eye, rather than the eye emitting light. Ibn al-Haytham also pioneered the scientific method, emphasizing systematic experimentation and the use of controlled testing to verify hypotheses—centuries before this approach became standard in Western science.",
    funFacts: [
      "He performed the first experiments with the camera obscura, leading to the invention of the pinhole camera",
      "His 'Book of Optics' was translated into Latin and influenced European scientists for centuries, including Roger Bacon and Johannes Kepler",
      "He solved the famous 'Alhazen's problem': finding the point on a spherical mirror where light will be reflected to an observer",
      "Legend says he feigned madness to escape punishment from a powerful ruler in Cairo",
      "He wrote over 200 works on various subjects including mathematics, astronomy, and philosophy",
      "His experimental method of observation, experimentation, and verification is considered a precursor to the modern scientific method"
    ],
    inventions: [
      {
        name: "Theory of Vision",
        description: "Revolutionary explanation that light enters the eye from external sources, disproving the ancient 'emission theory' that eyes emit light. This fundamental understanding laid the groundwork for all modern optics."
      },
      {
        name: "Camera Obscura Studies",
        description: "Conducted the first systematic experiments with the camera obscura (pinhole camera), explaining how images are formed and inverted. His work led directly to the development of photography centuries later.",
  
      },
      {
        name: "Scientific Method",
        description: "Pioneered experimental methodology requiring systematic observation, experimentation, and mathematical verification of hypotheses—establishing principles that became the foundation of modern scientific inquiry."
      },
      {
        name: "Laws of Refraction",
        description: "Discovered and documented how light bends when passing through different mediums, contributing to our understanding of lenses and the development of eyeglasses, telescopes, and microscopes."
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

export default IbnAlHaythamPage;