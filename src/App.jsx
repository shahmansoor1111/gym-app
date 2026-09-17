import { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Exercises from "./pages/Exercises";
import DietPlans from "./pages/DietPlans";
import Alerts from "./pages/Alerts";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
// FIX 1: Import name mein hyphen nahi, CamelCase use karein
import ContactList from "./pages/ContactList"; 

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [initialCategory, setInitialCategory] = useState(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, [currentPage]);

  const navigate = (page, categoryId = null) => {
    setAnimate(false); 
    setTimeout(() => {
      setCurrentPage(page);
      if (categoryId) {
        setInitialCategory(categoryId);
      } else if (page !== "exercises") {
        setInitialCategory(null);
      }
    }, 50); 
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":       return <Home navigate={navigate} />;
      case "dashboard":  return <Dashboard navigate={navigate} />;
      case "members":    return <Members navigate={navigate} />;
      case "exercises":  
        return (
          <Exercises 
            navigate={navigate} 
            initialCategoryId={initialCategory} 
            clearInitialCategory={() => setInitialCategory(null)} 
          />
        );
      case "diet":       return <DietPlans navigate={navigate} />;
      case "alerts":     return <Alerts navigate={navigate} />;
      case "gallery":    return <Gallery navigate={navigate} />;
      case "contact":    return <Contact navigate={navigate} />;
      // FIX 2: Case ka naam string hona chahiye
      case "contact-list": return <ContactList />;
      default:           return <Home navigate={navigate} />;
    }
  };

  return (
    <>
      <style>{`
        .page-transition-container {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.35s ease-out, transform 0.35s ease-out;
          will-change: opacity, transform;
        }
        .page-transition-container.slide-fade-up {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div style={{ minHeight: "100vh", background: "#0a0a0a", color: "#fff", fontFamily: "'Barlow', sans-serif" }}>
        <Navbar currentPage={currentPage} navigate={navigate} />
        
        <main className={`page-transition-container ${animate ? "slide-fade-up" : ""}`} style={{ paddingTop: "80px" }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}