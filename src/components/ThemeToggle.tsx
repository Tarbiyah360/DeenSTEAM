import { Moon, Sun, Monitor, Type, Accessibility, Contrast, ZapOff, BookOpen, RotateCcw } from "lucide-react";
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
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [dyslexiaFont, setDyslexiaFont] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const savedFontSize = localStorage.getItem("fontSize") || "normal";
    const savedHighContrast = localStorage.getItem("highContrast") === "true";
    const savedReducedMotion = localStorage.getItem("reducedMotion") === "true";
    const savedDyslexiaFont = localStorage.getItem("dyslexiaFont") === "true";
    
    setFontSize(savedFontSize);
    setHighContrast(savedHighContrast);
    setReducedMotion(savedReducedMotion);
    setDyslexiaFont(savedDyslexiaFont);
    
    document.documentElement.style.fontSize = getFontSizeValue(savedFontSize);
    applyAccessibilityClasses(savedHighContrast, savedReducedMotion, savedDyslexiaFont);
    
    // Detect system preference for reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion && !savedReducedMotion) {
      handleReducedMotionChange(true);
    }
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

  const applyAccessibilityClasses = (contrast: boolean, motion: boolean, font: boolean) => {
    if (contrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
    
    if (motion) {
      document.documentElement.classList.add("reduce-motion");
    } else {
      document.documentElement.classList.remove("reduce-motion");
    }
    
    if (font) {
      document.documentElement.classList.add("dyslexia-font");
    } else {
      document.documentElement.classList.remove("dyslexia-font");
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
    localStorage.setItem("fontSize", size);
    document.documentElement.style.fontSize = getFontSizeValue(size);
  };

  const handleHighContrastChange = (enabled: boolean) => {
    setHighContrast(enabled);
    localStorage.setItem("highContrast", enabled.toString());
    applyAccessibilityClasses(enabled, reducedMotion, dyslexiaFont);
  };

  const handleReducedMotionChange = (enabled: boolean) => {
    setReducedMotion(enabled);
    localStorage.setItem("reducedMotion", enabled.toString());
    applyAccessibilityClasses(highContrast, enabled, dyslexiaFont);
  };

  const handleDyslexiaFontChange = (enabled: boolean) => {
    setDyslexiaFont(enabled);
    localStorage.setItem("dyslexiaFont", enabled.toString());
    applyAccessibilityClasses(highContrast, reducedMotion, enabled);
  };

  const handleReset = () => {
    // Reset all settings to defaults
    setFontSize("normal");
    setHighContrast(false);
    setReducedMotion(false);
    setDyslexiaFont(false);
    setTheme("system");
    
    // Clear localStorage
    localStorage.removeItem("fontSize");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("reducedMotion");
    localStorage.removeItem("dyslexiaFont");
    
    // Reset DOM styles and classes
    document.documentElement.style.fontSize = "16px";
    document.documentElement.classList.remove("high-contrast", "reduce-motion", "dyslexia-font");
  };

  if (!mounted) {
    return (
      <Button variant="accessible" size="sm" aria-label="Accessibility settings">
        <Accessibility className="h-4 w-4" aria-hidden="true" />
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="accessible" 
          size="sm" 
          className="gap-2"
          aria-label="Accessibility and theme settings"
        >
          <Accessibility className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Accessibility settings</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64 bg-popover z-50">
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

        <DropdownMenuSeparator />
        
        <DropdownMenuLabel>Accessibility Features</DropdownMenuLabel>
        <DropdownMenuItem 
          onClick={() => handleHighContrastChange(!highContrast)}
          className="gap-2"
          aria-current={highContrast ? "true" : undefined}
        >
          <Contrast className="h-4 w-4" aria-hidden="true" />
          <span>High Contrast</span>
          {highContrast && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleReducedMotionChange(!reducedMotion)}
          className="gap-2"
          aria-current={reducedMotion ? "true" : undefined}
        >
          <ZapOff className="h-4 w-4" aria-hidden="true" />
          <span>Reduce Motion</span>
          {reducedMotion && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => handleDyslexiaFontChange(!dyslexiaFont)}
          className="gap-2"
          aria-current={dyslexiaFont ? "true" : undefined}
        >
          <BookOpen className="h-4 w-4" aria-hidden="true" />
          <span>Dyslexia-Friendly Font</span>
          {dyslexiaFont && <span className="ml-auto text-xs">✓</span>}
        </DropdownMenuItem>

        <DropdownMenuSeparator />
        
        <DropdownMenuItem 
          onClick={handleReset}
          className="gap-2 text-destructive focus:text-destructive"
          aria-label="Reset all accessibility settings to defaults"
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          <span>Reset All Settings</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
