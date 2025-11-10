import { Moon, Sun, Monitor, Type, Accessibility } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [fontSize, setFontSize] = useState<string>("normal");
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedFontSize = localStorage.getItem("fontSize") || "normal";
    setFontSize(savedFontSize);
    document.documentElement.style.fontSize = getFontSizeValue(savedFontSize);
  }, []);

  const getFontSizeValue = (size: string) => {
    switch (size) {
      case "small":
        return "14px";
      case "large":
        return "18px";
      default:
        return "16px";
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.fontSize = getFontSizeValue(size);
  };

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" aria-label="Theme settings">
        <Accessibility className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          aria-label="Accessibility and theme settings"
        >
          <Accessibility className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="gap-2"
          aria-current={theme === "light" ? "true" : undefined}
        >
          <Sun className="h-4 w-4" aria-hidden="true" />
          <span>Light mode</span>
          {theme === "light" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="gap-2"
          aria-current={theme === "dark" ? "true" : undefined}
        >
          <Moon className="h-4 w-4" aria-hidden="true" />
          <span>Dark mode</span>
          {theme === "dark" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="gap-2"
          aria-current={theme === "system" ? "true" : undefined}
        >
          <Monitor className="h-4 w-4" aria-hidden="true" />
          <span>System preference</span>
          {theme === "system" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        
        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Text Size</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleFontSizeChange("small")}
          className="gap-2"
          aria-current={fontSize === "small" ? "true" : undefined}
        >
          <Type className="h-3 w-3" aria-hidden="true" />
          <span>Small</span>
          {fontSize === "small" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleFontSizeChange("normal")}
          className="gap-2"
          aria-current={fontSize === "normal" ? "true" : undefined}
        >
          <Type className="h-4 w-4" aria-hidden="true" />
          <span>Normal</span>
          {fontSize === "normal" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleFontSizeChange("large")}
          className="gap-2"
          aria-current={fontSize === "large" ? "true" : undefined}
        >
          <Type className="h-5 w-5" aria-hidden="true" />
          <span>Large</span>
          {fontSize === "large" && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
