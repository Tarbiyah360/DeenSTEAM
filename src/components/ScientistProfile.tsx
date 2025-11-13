import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Invention {
  name: string;
  description: string;
  imageUrl?: string;
}

interface ScientistProfileProps {
  name: string;
  title: string;
  lifespan: string;
  biography: string;
  funFacts: string[];
  inventions: Invention[];
  portraitUrl?: string;
}

const ScientistProfile = ({
  name,
  title,
  lifespan,
  biography,
  funFacts,
  inventions,
  portraitUrl,
}: ScientistProfileProps) => {
  const navigate = useNavigate();

  const handleDownloadProfile = () => {
    window.print();
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => navigate("/steam-explorer")}
            variant="ghost"
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to STEAM Explorer
          </Button>
          <Button
            onClick={handleDownloadProfile}
            variant="outline"
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download Profile
          </Button>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          {portraitUrl && (
            <div className="w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden border-4 border-primary/20">
              <img
                src={portraitUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
            {name}
          </h1>
          <p className="text-xl text-primary font-semibold mb-2">{title}</p>
          <p className="text-muted-foreground">{lifespan}</p>
        </div>

        {/* Biography */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-3xl">📖</span>
            Who Was {name.split(" ")[0]}?
          </h2>
          <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {biography}
          </p>
        </Card>

        {/* Fun Facts */}
        <Card className="p-6 mb-8 bg-card/50 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <span className="text-3xl">⭐</span>
            Fun Facts
          </h2>
          <ul className="space-y-3">
            {funFacts.map((fact, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-muted-foreground"
              >
                <span className="text-primary text-xl flex-shrink-0">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Inventions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <span className="text-3xl">🔬</span>
            Amazing Discoveries & Inventions
          </h2>
          <div className="grid gap-4">
            {inventions.map((invention, index) => (
              <Card
                key={index}
                className="p-5 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-all"
              >
                {invention.imageUrl && (
                  <div className="w-full h-48 mb-4 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={invention.imageUrl}
                      alt={invention.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-bold text-foreground mb-2">
                  {invention.name}
                </h3>
                <p className="text-muted-foreground">{invention.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScientistProfile;
