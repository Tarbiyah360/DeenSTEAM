import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LessonGeneratorPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard since lesson generator is now part of dashboard
    navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};

export default LessonGeneratorPage;
