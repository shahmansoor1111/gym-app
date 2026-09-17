import { useState, useEffect } from "react";
import heroAthlete   from '../images/gym2.jpg';
import gymTraining   from '../Images/gymTraining.avif';
import exChest1      from '../images/exChest1.avif';
import exBack1       from '../images/exback1.avif';
import exLegs1       from '../images/legs.avif';
import exShoulders1  from '../images/shoulder.avif';
import exArms1       from '../images/arm.avif';
import exAbs1        from '../images/abs.avif';
import dietImg       from '../images/deit.avif';
import gymImg        from '../images/gym.avif';
import trainer1      from '../images/trainer1.avif';
import trainer2      from '../images/sara.avif';
import trainer3      from '../images/trainer3.avif';
import transform1    from '../images/trans1.avif';
import transform2    from '../images/trans2.avif';
import transform3    from '../images/trans3.avif';

export default function Home({ navigate }) {
  // ── Hamburger menu state ──
  const [menuOpen, setMenuOpen] = useState(false);
useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [menuOpen]);
  // Wrapper: navigates AND always closes the mobile menu
  const go = (page, id) => {
    setMenuOpen(false);
    navigate(page, id);
  };

  const features = [
    { icon: "🥗", label: "Nutrition Guidance" },
    { icon: "👨‍🏫", label: "Expert Trainers" },
    { icon: "📈", label: "Progress Tracking" },
    { icon: "🏅", label: "Premium Membership" },
    { icon: "🤝", label: "Community Support" },
    { icon: "💪", label: "Next-Level Fitness" },
  ];

  const categories = [
    { id: "chest",     icon: "🏋️", label: "Chest Training",   page: "exercises", desc: "Bench Press, Incline, Fly & more" },
    { id: "back",      icon: "🔥", label: "Strength Build",   page: "exercises", desc: "Back, Deadlift, Rows & more" },
    { id: "shoulders", icon: "⚡", label: "Arms & Shoulders", page: "exercises", desc: "Curls, Press, Raises & more" },
    { id: "legs",      icon: "🦵", label: "Legs Workout",     page: "exercises", desc: "Squats, Lunges, Press & more" },
  ];

  const workouts = [
    { label: "Bench Press",    cat: "Chest",     img: exChest1,      id: "chest" },
    { label: "Deadlift",       cat: "Back",      img: exBack1,       id: "back" },
    { label: "Squats",         cat: "Legs",      img: exLegs1,       id: "legs" },
    { label: "Overhead Press", cat: "Shoulders", img: exShoulders1,  id: "shoulders" },
    { label: "Barbell Curl",   cat: "Arms",      img: exArms1,       id: "arms" },
    { label: "Plank",          cat: "Abs",       img: exAbs1,        id: "abs" },
  ];

  const trainers = [
    { name: "Ahmed Khan",   role: "Strength Coach",    img: trainer1 },
    { name: "Sara Malik",   role: "Nutrition Expert",  img: trainer2 },
    { name: "Bilal Sheikh", role: "Cardio Specialist", img: trainer3 },
  ];

  const testimonials = [
    { quote: "FlexGym changed my life completely. Lost 18kg in 4 months with the diet plans and workout guides.", name: "— Usman Ali",   stars: 5 },
    { quote: "The exercise guides are detailed and easy to follow. The trainers here are absolutely world-class.", name: "— Fatima Noor", stars: 5 },
  ];

  const navLinks = [
    ["Home",      "home"],
    ["Dashboard", "dashboard"],
    ["Members",   "members"],
    ["Exercises", "exercises"],
    ["Diet Plans","diet"],
    ["Gallery",   "gallery"],
    ["Contact",   "contact"],
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;900&family=Barlow+Condensed:wght@700;900&display=swap');

        .hp, .hp * { box-sizing: border-box; }
        .hp { background: #0d0d0d; color: #fff; font-family: 'Barlow', sans-serif; }
        .hp-section { padding: 90px 0; }
        .hp-inner   { max-width: 1180px; margin: 0 auto; padding: 0 2rem; }
        .hp-lbl {
          text-align: center; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 3px; text-transform: uppercase; color: #c8f500; margin-bottom: 0.5rem;
        }
        .hp-title {
          text-align: center;
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: clamp(2rem, 5vw, 3rem); line-height: 1.1; margin: 0 0 0.8rem;
        }
        .hp-sub {
          text-align: center; color: #888; font-size: 0.95rem;
          max-width: 560px; margin: 0 auto 3rem; line-height: 1.6;
        }
        .lime { color: #c8f500; }

        /* ── HAMBURGER NAV ── */
        .hp-nav {
          position: fixed; top: 0; left: 0; right: 0;
          height: 68px;
          background: rgba(10,10,10,0.96);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #191919;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 2rem;
          z-index: 500;
        }
        .hp-nav-logo {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 1.5rem; letter-spacing: 1px; color: #fff; cursor: pointer;
        }
        .hp-nav-logo span { color: #c8f500; }

        /* Desktop links */
        .hp-nav-links {
          display: flex; gap: 0.2rem; list-style: none; margin: 0; padding: 0;
        }
        .hp-nav-links li {
          color: #888; font-size: 0.85rem; font-weight: 600;
          padding: 6px 12px; border-radius: 6px;
          cursor: pointer; transition: color 0.2s, background 0.2s;
          white-space: nowrap;
        }
        .hp-nav-links li:hover { color: #c8f500; background: rgba(200,245,0,0.07); }

        /* Hamburger button */
        .hp-hamburger {
          display: none;
          background: none; border: none;
          cursor: pointer; padding: 6px;
          flex-direction: column; gap: 5px;
          z-index: 600;
        }
        .hp-hamburger span {
          display: block; width: 24px; height: 2px;
          background: #fff; border-radius: 2px;
          transition: all 0.3s ease;
          transform-origin: center;
        }
        /* Animate to X */
        .hp-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .hp-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .hp-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* Mobile drawer */
        .hp-mobile-menu {
          position: fixed; top: 68px; left: 0; right: 0;
          background: #0a0a0a;
          border-bottom: 1px solid #1e1e1e;
          padding: 1rem 0;
          z-index: 490;
          transform: translateY(-110%);
          opacity: 0;
          transition: transform 0.35s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease;
          pointer-events: none;
        }
        .hp-mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
          pointer-events: all;
        }
        .hp-mobile-menu li {
          list-style: none;
          color: #aaa; font-size: 1rem; font-weight: 600;
          padding: 13px 2rem; cursor: pointer;
          border-bottom: 1px solid #141414;
          transition: color 0.2s, background 0.2s;
        }
        .hp-mobile-menu li:last-child { border-bottom: none; }
        .hp-mobile-menu li:hover { color: #c8f500; background: rgba(200,245,0,0.05); }

        /* Overlay behind mobile menu */
        .hp-menu-overlay {
          display: none;
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 480;
        }
        .hp-menu-overlay.open { display: block; }

        @media (max-width: 768px) {
          .hp-nav-links { display: none; }
          .hp-hamburger { display: flex; }
        }

        /* ── HERO ── */
        .hp-hero {
  min-height: 100vh; /* Agar pura screen cover karna hai */
   /* Navbar ki height jitni padding top de dein taake content peeche na chala jaye */
  background: #0d0d0d;
  position: relative;
  display: flex; 
  align-items: center;
  overflow: hidden;
}
        .hp-hero-glow {
          position: absolute; top: -100px; right: -100px;
          width: 600px; height: 600px;
          background: radial-gradient(circle, rgba(200,245,0,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        .hp-hero-inner {
          max-width: 1180px; margin: 0 auto; padding: 4rem 2rem;
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 3rem; align-items: center; width: 100%; position: relative; z-index: 1;
        }
        .hp-hero-img-col {
          display: flex; justify-content: center;
          align-items: center; position: relative; min-height: 520px;
        }
        .hp-hero-img-col img {
          width: 380px; height: 500px;
          object-fit: cover; border-radius: 20px; display: block;
        }
        .hp-float {
          position: absolute;
          background: #1a1a1a; border: 1px solid #272727;
          border-radius: 12px; padding: 10px 14px;
          font-size: 0.78rem; font-weight: 700; white-space: nowrap;
        }
        .hp-float-top { top: 40px; right: -10px; color: #c8f500; border-color: rgba(200,245,0,0.25); }
        .hp-float-bot { bottom: 50px; left: -10px; color: #fff; }

        .hp-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(200,245,0,0.1); border: 1px solid rgba(200,245,0,0.25);
          color: #c8f500; font-size: 0.78rem; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          padding: 6px 16px; border-radius: 20px; margin-bottom: 1.4rem;
        }
        .hp-h1 {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: clamp(2rem, 4.5vw, 3.2rem); line-height: 1.05;
          letter-spacing: 1px; text-transform: uppercase; margin: 0 0 1.4rem;
        }
        .hp-hero-desc { color: #999; font-size: 1rem; line-height: 1.7; max-width: 420px; margin-bottom: 2rem; }
        .hp-stats { display: flex; gap: 2.5rem; margin-bottom: 2.5rem; flex-wrap: wrap; }
        .hp-stat-val {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 2rem; color: #c8f500; line-height: 1;
        }
        .hp-stat-lbl { font-size: 0.78rem; color: #777; letter-spacing: 0.5px; margin-top: 3px; }
        .hp-btns { display: flex; gap: 1rem; flex-wrap: wrap; }
        .btn-lime {
          background: #c8f500; color: #000; border: none;
          padding: 14px 32px; border-radius: 8px;
          font-family: 'Barlow', sans-serif; font-weight: 900;
          font-size: 0.9rem; letter-spacing: 1px; cursor: pointer;
          transition: all 0.2s; text-transform: uppercase;
        }
        .btn-lime:hover { background: #d9ff26; transform: translateY(-2px); }
        .btn-ghost {
          background: transparent; color: #fff; border: 2px solid #2a2a2a;
          padding: 14px 32px; border-radius: 8px;
          font-family: 'Barlow', sans-serif; font-weight: 700;
          font-size: 0.9rem; cursor: pointer; transition: all 0.2s; text-transform: uppercase;
        }
        .btn-ghost:hover { border-color: #c8f500; color: #c8f500; }

        /* ── BRANDS ── */
        .hp-brands {
          border-top: 1px solid #191919; border-bottom: 1px solid #191919;
          padding: 1.5rem 2rem; background: #0d0d0d; overflow: hidden;
        }
        .hp-brands-inner {
          max-width: 1180px; margin: 0 auto;
          display: flex; gap: 3rem; align-items: center;
          justify-content: center; flex-wrap: wrap;
        }
        .hp-brand {
          color: #333; font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900; font-size: 1.15rem;
          letter-spacing: 2px; text-transform: uppercase;
          transition: color 0.2s; cursor: default;
        }
        .hp-brand:hover { color: #c8f500; }

        /* ── FEATURES ── */
        .hp-feat-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
        .hp-feat-img { height: 440px; border-radius: 16px; overflow: hidden; }
        .hp-feat-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hp-feat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem; }
        .hp-feat-item {
          background: #141414; border: 1px solid #1e1e1e; border-radius: 10px;
          padding: 1rem 1.2rem; display: flex; align-items: center;
          gap: 10px; font-size: 0.88rem; font-weight: 600;
          transition: all 0.2s; cursor: default;
        }
        .hp-feat-item:hover { border-color: rgba(200,245,0,0.3); color: #c8f500; }

        /* ── APART ── */
        .hp-apart-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.2rem; }
        .hp-apart-card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 14px; padding: 2rem;
          cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden;
        }
        .hp-apart-card::after {
          content: ''; position: absolute; bottom: 0; left: 0; right: 0;
          height: 3px; background: #c8f500;
          transform: scaleX(0); transition: transform 0.25s;
        }
        .hp-apart-card:hover { transform: translateY(-5px); border-color: #252525; }
        .hp-apart-card:hover::after { transform: scaleX(1); }
        .hp-apart-icon {
          width: 48px; height: 48px; background: rgba(200,245,0,0.1);
          border-radius: 12px; display: flex; align-items: center;
          justify-content: center; font-size: 1.5rem; margin-bottom: 1rem;
        }
        .hp-apart-card h3 {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 1.2rem; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 0.5rem;
        }
        .hp-apart-card p { color: #777; font-size: 0.85rem; line-height: 1.6; margin: 0 0 1rem; }
        .hp-apart-link { color: #c8f500; font-size: 0.82rem; font-weight: 700; }

        /* ── WORKOUTS ── */
        .hp-workouts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .hp-workout-card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 14px; overflow: hidden;
          cursor: pointer; transition: all 0.25s;
        }
        .hp-workout-card:hover { transform: translateY(-4px); border-color: rgba(200,245,0,0.25); }
        .hp-workout-img { height: 180px; position: relative; overflow: hidden; }
        .hp-workout-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hp-workout-badge {
          position: absolute; top: 10px; left: 10px;
          background: #c8f500; color: #000;
          font-size: 0.68rem; font-weight: 900;
          letter-spacing: 1px; text-transform: uppercase;
          padding: 3px 9px; border-radius: 4px; z-index: 1;
        }
        .hp-workout-body { padding: 1rem 1.2rem 1.2rem; }
        .hp-workout-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 1.05rem; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 0.2rem;
        }
        .hp-workout-cat { color: #666; font-size: 0.78rem; }

        /* ── EXPERIENCE ── */
        .hp-exp-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem; }
        .hp-exp-card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 16px; padding: 2rem;
          display: flex; gap: 1.5rem; align-items: flex-start;
          transition: all 0.2s; cursor: pointer;
        }
        .hp-exp-card:hover { border-color: rgba(200,245,0,0.2); }
        .hp-exp-img-box { width: 90px; height: 90px; min-width: 90px; border-radius: 12px; overflow: hidden; }
        .hp-exp-img-box img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hp-exp-body h3 {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 1.15rem; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 0.4rem;
        }
        .hp-exp-body p { color: #777; font-size: 0.85rem; line-height: 1.6; margin: 0 0 0.8rem; }
        .hp-exp-link {
          color: #c8f500; font-size: 0.82rem; font-weight: 700;
          background: none; border: none; cursor: pointer; padding: 0;
        }

        /* ── TRAINERS ── */
        .hp-trainers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .hp-trainer-card {
          background: #111; border: 1px solid #1e1e1e;
          border-radius: 16px; overflow: hidden; transition: all 0.2s;
        }
        .hp-trainer-card:hover { border-color: rgba(200,245,0,0.25); transform: translateY(-3px); }
        .hp-trainer-img { height: 280px; overflow: hidden; }
        .hp-trainer-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .hp-trainer-body { padding: 1.3rem 1.5rem; }
        .hp-trainer-name {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 1.3rem; letter-spacing: 1px; text-transform: uppercase; margin: 0 0 0.2rem;
        }
        .hp-trainer-role { color: #c8f500; font-size: 0.8rem; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; }

        /* ── TESTIMONIALS ── */
        .hp-testi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 1.2rem; }
        .hp-testi-card { background: #111; border: 1px solid #1e1e1e; border-radius: 14px; padding: 2rem; }
        .hp-testi-stars { color: #c8f500; font-size: 1rem; margin-bottom: 0.8rem; letter-spacing: 2px; }
        .hp-testi-quote { color: #ccc; font-size: 0.95rem; line-height: 1.7; margin: 0 0 1rem; font-style: italic; }
        .hp-testi-name { color: #666; font-size: 0.82rem; font-weight: 700; letter-spacing: 1px; }
        .hp-transform-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .hp-transform-box { height: 180px; border-radius: 12px; overflow: hidden; }
        .hp-transform-box img { width: 100%; height: 100%; object-fit: cover; display: block; }

        /* ── CTA ── */
        .hp-cta { background: #c8f500; padding: 80px 2rem; text-align: center; }
        .hp-cta h2 {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: clamp(2.2rem, 5vw, 3.5rem); text-transform: uppercase;
          letter-spacing: 2px; color: #000; margin: 0 0 0.6rem;
        }
        .hp-cta p { color: #3a4a00; font-size: 1rem; margin: 0 auto 2rem; max-width: 480px; }
        .hp-cta-row {
          display: flex; gap: 0.8rem; max-width: 420px;
          margin: 0 auto; flex-wrap: wrap; justify-content: center;
        }
        .hp-cta-input {
          flex: 1; min-width: 200px;
          background: rgba(0,0,0,0.15); border: 1.5px solid rgba(0,0,0,0.2);
          border-radius: 8px; padding: 13px 16px;
          font-family: 'Barlow', sans-serif; font-size: 0.9rem; color: #000; outline: none;
        }
        .hp-cta-input::placeholder { color: #3a4a00; }
        .hp-cta-btn {
          background: #000; color: #c8f500; border: none;
          padding: 13px 28px; border-radius: 8px;
          font-family: 'Barlow', sans-serif; font-weight: 900;
          font-size: 0.9rem; cursor: pointer; letter-spacing: 1px;
          transition: opacity 0.2s; white-space: nowrap;
        }
        .hp-cta-btn:hover { opacity: 0.85; }

        /* ── FOOTER ── */
        .hp-footer { background: #080808; border-top: 1px solid #191919; padding: 3rem 2rem 2rem; }
        .hp-footer-inner {
          max-width: 1180px; margin: 0 auto;
          display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 3rem;
        }
        .hp-footer-logo {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 900;
          font-size: 1.8rem; letter-spacing: 1px; color: #fff; margin-bottom: 0.8rem;
        }
        .hp-footer-logo span { color: #c8f500; }
        .hp-footer-desc { color: #555; font-size: 0.85rem; line-height: 1.6; max-width: 240px; }
        .hp-footer-col h4 {
          font-family: 'Barlow Condensed', sans-serif; font-weight: 700;
          font-size: 0.9rem; letter-spacing: 2px; text-transform: uppercase;
          color: #fff; margin: 0 0 1rem;
        }
        .hp-footer-col ul { list-style: none; margin: 0; padding: 0; }
        .hp-footer-col ul li {
          margin-bottom: 0.6rem; color: #555; font-size: 0.85rem;
          cursor: pointer; transition: color 0.2s;
        }
        .hp-footer-col ul li:hover { color: #c8f500; }
        .hp-footer-bottom {
          max-width: 1180px; margin: 2rem auto 0;
          padding-top: 1.5rem; border-top: 1px solid #191919;
          display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 1rem;
        }
        .hp-footer-copy { color: #444; font-size: 0.8rem; }
        .hp-socials { display: flex; gap: 0.8rem; }
        .hp-social {
          width: 34px; height: 34px; background: #151515;
          border: 1px solid #252525; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.85rem; cursor: pointer; transition: all 0.2s;
        }
        .hp-social:hover { border-color: #c8f500; background: rgba(200,245,0,0.1); }

        /* ═══════════════════════════════════════
           RESPONSIVE BREAKPOINTS
        ═══════════════════════════════════════ */

        /* Tablet: ≤ 900px */
        @media (max-width: 900px) {
          .hp-workouts-grid  { grid-template-columns: repeat(2, 1fr); }
          .hp-trainers-grid  { grid-template-columns: repeat(2, 1fr); }
          .hp-footer-inner   { grid-template-columns: 1fr 1fr; gap: 2rem; }
        }
@media (max-width: 768px) {
  .hp-hero {
    min-height: auto; /* Mobile par height auto kar dein */
   /* Thoda mazeed upar lane ke liye */
    padding-bottom: 40px;
  }
}
        /* Mobile: ≤ 768px */
        @media (max-width: 768px) {
          .hp { padding-top: 68px; }
          .hp-section { padding: 60px 0; }
          .hp-inner   { padding: 0 1.2rem; }

          /* Hero: single column */
          .hp-hero-inner { grid-template-columns: 1fr; padding: 0.5rem 1.2rem; gap: 0; }
          .hp-hero-img-col { display: none; }
          .hp-h1 { font-size: clamp(1.9rem, 8vw, 2.8rem); }
          .hp-hero-desc { max-width: 100%; }
          .hp-stats { gap: 1.5rem; }

          /* Buttons full-width */
          .hp-btns { flex-direction: column; }
          .btn-lime, .btn-ghost { width: 100%; text-align: center; padding: 15px 20px; }

          /* Brands: scrollable row */
          .hp-brands { padding: 1.2rem; overflow-x: auto; }
          .hp-brands-inner { flex-wrap: nowrap; justify-content: flex-start; gap: 2rem; padding-bottom: 4px; }
          .hp-brand { font-size: 1rem; }

          /* Features: stack */
          .hp-feat-wrap { grid-template-columns: 1fr; gap: 2rem; }
          .hp-feat-img  { height: 260px; }
          .hp-feat-grid { grid-template-columns: 1fr; }
          .hp-lbl, .hp-title, .hp-sub { text-align: left !important; margin-left: 0; margin-right: 0; }
          .hp-sub.center-sub { text-align: center !important; }

          /* Apart: 1 col */
          .hp-apart-grid { grid-template-columns: 1fr; }

          /* Workouts: 1 col */
          .hp-workouts-grid { grid-template-columns: 1fr; }
          .hp-workout-img   { height: 200px; }

          /* Experience */
          .hp-exp-cards { grid-template-columns: 1fr; }
          .hp-exp-card  { flex-direction: column; gap: 1rem; padding: 1.4rem; }
          .hp-exp-img-box { width: 60px; height: 60px; min-width: 60px; }

          /* Trainers: 1 col */
          .hp-trainers-grid  { grid-template-columns: 1fr; }
          .hp-trainer-img    { height: 220px; }

          /* Testimonials */
          .hp-testi-grid     { grid-template-columns: 1fr; }
          .hp-transform-row  { grid-template-columns: 1fr 1fr; }
          .hp-transform-box  { height: 130px; }

          /* CTA */
          .hp-cta { padding: 60px 1.5rem; }
          .hp-cta-row { flex-direction: column; }
          .hp-cta-input { width: 100%; }
          .hp-cta-btn   { width: 100%; }

          /* Footer */
          .hp-footer-inner   { grid-template-columns: 1fr; gap: 1.5rem; }
          .hp-footer-desc    { max-width: 100%; }
          .hp-footer-bottom  { flex-direction: column; align-items: flex-start; gap: 0.75rem; }
        }

        /* Small mobile: ≤ 420px */
        @media (max-width: 420px) {
          .hp-h1 { font-size: clamp(1.6rem, 9vw, 2.2rem); }
          .hp-stats { gap: 1rem; }
          .hp-stat-val { font-size: 1.6rem; }
          .hp-feat-img { height: 200px; }
          .hp-transform-row { grid-template-columns: 1fr; }
          .hp-transform-box { height: 160px; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="hp-nav">
        <div className="hp-nav-logo" onClick={() => go("home")}>FLEX<span>GYM</span></div>

        {/* Desktop links */}
        <ul className="hp-nav-links">
          {navLinks.map(([label, page]) => (
            <li key={page} onClick={() => go(page)}>{label}</li>
          ))}
        </ul>

        {/* Hamburger toggle */}
        <button
          className={`hp-hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Overlay — clicking it closes menu */}
      <div
        className={`hp-menu-overlay${menuOpen ? " open" : ""}`}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile slide-down menu */}
      <ul className={`hp-mobile-menu${menuOpen ? " open" : ""}`}>
        {navLinks.map(([label, page]) => (
          <li key={page} onClick={() => go(page)}>{label}</li>
        ))}
      </ul>

      <div className="hp">

        {/* ══ HERO ══ */}
        <section className="hp-hero">
          <div className="hp-hero-glow" />
          <div className="hp-hero-inner">
            <div>
              <div className="hp-eyebrow">⚡ Rawalpindi's #1 Gym</div>
              <h1 className="hp-h1">
                SCULPT YOUR<br />
                <span className="lime">BODY,</span><br />
                ELEVATE YOUR<br />
                <span className="lime">SPIRIT</span>
              </h1>
              <p className="hp-hero-desc">
                Your complete gym management platform — track workouts, follow expert diet plans, and monitor your progress all in one place.
              </p>
              <div className="hp-stats">
                <div><div className="hp-stat-val">12K+</div><div className="hp-stat-lbl">Happy Members</div></div>
                <div><div className="hp-stat-val">50+</div><div className="hp-stat-lbl">Exercise Guides</div></div>
                <div><div className="hp-stat-val">6</div><div className="hp-stat-lbl">Muscle Groups</div></div>
              </div>
              <div className="hp-btns">
                <button className="btn-lime" onClick={() => go("members")}>Get Started →</button>
                <button className="btn-ghost" onClick={() => go("exercises")}>View Exercises</button>
              </div>
            </div>
            <div className="hp-hero-img-col">
              <img src={heroAthlete} alt="Hero Athlete" />
              <div className="hp-float hp-float-top">💪 30-Day Challenge Active</div>
              <div className="hp-float hp-float-bot">🔥 124 Members Training Today</div>
            </div>
          </div>
        </section>

        {/* ══ BRANDS ══ */}
        <div className="hp-brands">
          <div className="hp-brands-inner">
            {["FLEXGYM","PROTEIN CO.","IRON WEAR","FITPRO","GYMSHARK","UNDER ARMOUR"].map(b => (
              <span className="hp-brand" key={b}>{b}</span>
            ))}
          </div>
        </div>

        {/* ══ FEATURES ══ */}
        <section className="hp-section" style={{ background: "#0d0d0d" }}>
          <div className="hp-inner">
            <div className="hp-feat-wrap">
              <div className="hp-feat-img">
                <img src={gymTraining} alt="Gym Training" />
              </div>
              <div>
                <div className="hp-lbl" style={{ textAlign: "left" }}>Why FlexGym</div>
                <h2 className="hp-title" style={{ textAlign: "left", fontSize: "clamp(1.8rem,4vw,2.6rem)" }}>
                  Inspired to<br /><span className="lime">Inspire Your Best Self</span>
                </h2>
                <p className="hp-sub" style={{ textAlign: "left", margin: "0 0 2rem" }}>
                  We're your partner in building a healthier, stronger, and more confident you.
                </p>
                <div className="hp-feat-grid">
                  {features.map(f => (
                    <div className="hp-feat-item" key={f.label}>
                      <span style={{ fontSize: "1.1rem" }}>{f.icon}</span>
                      {f.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ WHAT SETS US APART ══ */}
        <section className="hp-section" style={{ background: "#0a0a0a" }}>
          <div className="hp-inner">
            <div className="hp-lbl">Our Edge</div>
            <h2 className="hp-title">Discover What<br /><span className="lime">Sets Us Apart</span></h2>
            <p className="hp-sub center-sub">We deliver a fitness experience that's truly end-to-end.</p>
            <div className="hp-apart-grid">
              {categories.map(c => (
                <div className="hp-apart-card" key={c.label} onClick={() => go(c.page, c.id)}>
                  <div className="hp-apart-icon">{c.icon}</div>
                  <h3>{c.label}</h3>
                  <p>{c.desc}</p>
                  <span className="hp-apart-link">Explore →</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ WORKOUTS ══ */}
        <section className="hp-section" style={{ background: "#0d0d0d" }}>
          <div className="hp-inner">
            <div className="hp-lbl">Exercise Library</div>
            <h2 className="hp-title">Train Smarter<br /><span className="lime">Unleash Your Potential</span></h2>
            <p className="hp-sub center-sub">Detailed guides for every movement — sets, reps, form tips, and video demonstrations.</p>
            <div className="hp-workouts-grid">
              {workouts.map((w, i) => (
                <div className="hp-workout-card" key={i} onClick={() => go("exercises", w.id)}>
                  <div className="hp-workout-img">
                    <span className="hp-workout-badge">{w.cat}</span>
                    <img src={w.img} alt={w.label} />
                  </div>
                  <div className="hp-workout-body">
                    <div className="hp-workout-name">{w.label}</div>
                    <div className="hp-workout-cat">{w.cat} · Exercise Guide</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <button className="btn-lime" onClick={() => go("exercises")}>View All Exercises →</button>
            </div>
          </div>
        </section>

        {/* ══ EXPERIENCE ══ */}
        <section className="hp-section" style={{ background: "#0a0a0a" }}>
          <div className="hp-inner">
            <div className="hp-lbl">Fitness Experience</div>
            <h2 className="hp-title">Experience Fitness<br /><span className="lime">Like Never Before</span></h2>
            <p className="hp-sub center-sub">Transform the way you train with smart workout tools, expert guidance, and state-of-the-art facilities.</p>
            <div className="hp-exp-cards">
              <div className="hp-exp-card" onClick={() => go("diet")}>
                <div className="hp-exp-img-box"><img src={dietImg} alt="Diet Plans" /></div>
                <div className="hp-exp-body">
                  <h3>Smart Diet Plans</h3>
                  <p>Enter your weight and goal — get your full daily meal plan, macros, and water intake instantly.</p>
                  <button className="hp-exp-link">Explore Diet Plans →</button>
                </div>
              </div>
              <div className="hp-exp-card" onClick={() => go("dashboard")}>
                <div className="hp-exp-img-box"><img src={gymImg} alt="Member Dashboard" /></div>
                <div className="hp-exp-body">
                  <h3>Member Dashboard</h3>
                  <p>Track memberships, payments, and dues in one streamlined dashboard designed for gym owners.</p>
                  <button className="hp-exp-link">View Dashboard →</button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TRAINERS ══ */}
        <section className="hp-section" style={{ background: "#0d0d0d" }}>
          <div className="hp-inner">
            <div className="hp-lbl">Our Team</div>
            <h2 className="hp-title">Your Fitness Goals,<br /><span className="lime">Their Expertise</span></h2>
            <p className="hp-sub center-sub">Our certified trainers bring unparalleled experience to help you achieve your fitness goals.</p>
            <div className="hp-trainers-grid">
              {trainers.map((t, i) => (
                <div className="hp-trainer-card" key={i}>
                  <div className="hp-trainer-img"><img src={t.img} alt={t.name} /></div>
                  <div className="hp-trainer-body">
                    <div className="hp-trainer-name">{t.name}</div>
                    <div className="hp-trainer-role">{t.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ TESTIMONIALS ══ */}
        <section className="hp-section" style={{ background: "#0a0a0a" }}>
          <div className="hp-inner">
            <div className="hp-lbl">Success Stories</div>
            <h2 className="hp-title">Your Success Stories,<br /><span className="lime">Our Inspiration</span></h2>
            <p className="hp-sub center-sub">See how our members achieved their goals — real results, real people.</p>
            <div className="hp-testi-grid">
              {testimonials.map((t, i) => (
                <div className="hp-testi-card" key={i}>
                  <div className="hp-testi-stars">{"★".repeat(t.stars)}</div>
                  <p className="hp-testi-quote">"{t.quote}"</p>
                  <div className="hp-testi-name">{t.name}</div>
                </div>
              ))}
            </div>
            <div className="hp-transform-row" style={{ marginTop: "1.2rem" }}>
              {[transform1, transform2, transform3].map((src, n) => (
                <div className="hp-transform-box" key={n}>
                  <img src={src} alt={`Transformation ${n + 1}`} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ CTA ══ */}
        <section className="hp-cta">
          <h2>Connect · Engage · Transform</h2>
          <p>Join FlexGym today and take the first step toward the strongest version of yourself.</p>
          <div className="hp-cta-row">
            <input className="hp-cta-input" placeholder="Enter your email address" />
            <button className="hp-cta-btn" onClick={() => go("contact")}>JOIN NOW</button>
          </div>
        </section>

        {/* ══ FOOTER ══ */}
        <footer className="hp-footer">
          <div className="hp-footer-inner">
            <div>
              <div className="hp-footer-logo">FLEX<span>GYM</span></div>
              <p className="hp-footer-desc">Your complete gym management platform. Track workouts, diet plans, members, and payments all in one place.</p>
            </div>
            <div className="hp-footer-col">
              <h4>Navigate</h4>
              <ul>
                {[["Home","home"],["Dashboard","dashboard"],["Members","members"],["Exercises","exercises"],["Diet Plans","diet"],["Alerts","alerts"]].map(([l,p]) => (
                  <li key={l} onClick={() => go(p)}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="hp-footer-col">
              <h4>Exercises</h4>
              <ul>
                {[["Chest","chest"],["Back","back"],["Shoulders","shoulders"],["Arms","arms"],["Legs","legs"],["Abs","abs"]].map(([l,id]) => (
                  <li key={l} onClick={() => go("exercises", id)}>{l}</li>
                ))}
              </ul>
            </div>
            <div className="hp-footer-col">
              <h4>Contact</h4>
              <ul>
                <li>📍 Rawalpindi, Punjab</li>
                <li>📞 +92 300 1234567</li>
                <li>✉️ info@flexgym.pk</li>
                <li>⏰ Mon–Sat 6am–10pm</li>
              </ul>
            </div>
          </div>
          <div className="hp-footer-bottom">
            <span className="hp-footer-copy">© 2025 FlexGym Manager. All rights reserved.</span>
            <div className="hp-socials">
              {["📘","📸","🐦","▶️"].map((s,i) => (
                <div className="hp-social" key={i}>{s}</div>
              ))}
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}