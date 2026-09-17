import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";

// ── CHEST (5) ────────────────────────────────────────────────────────────────
import benchPress     from "../assets/chest1.mp4";       // ✅ already working
import inclinePress  from "../assets/chest2.mp4";
import dumbbellFly   from "../assets/chest3.mp4";
import cableFly      from "../assets/chest4.mp4";
import pushUps       from "../assets/chest5.mp4";


import pullUps          from "../assets/back1.mp4";
import deadlift         from "../assets/back2.mp4";
import bentOverRow      from "../assets/back3.mp4";
import latPulldown      from "../assets/back4.mp4";
import seatedCableRow   from "../assets/back5.mp4";


import overheadPress    from "../assets/shoulder1.mp4";
import lateralRaises    from "../assets/shoulder2.mp4";
import frontRaises      from "../assets/shoulder3.mp4";
import arnoldPress      from "../assets/shoulder4.mp4";
import facePulls        from "../assets/shoulder5.mp4";


import barbellCurl        from "../assets/arm1.mp4";
import tricepDips         from "../assets/arm2.mp4";
import hammerCurl         from "../assets/arm3.mp4";
import skullCrushers      from "../assets/arm4.mp4";
import concentrationCurl  from "../assets/arm5.mp4";


import squats      from "../assets/legs1.mp4";
import legPress    from "../assets/legs2.mp4";
import lunges      from "../assets/legs3.mp4";
import legCurl     from "../assets/legs4.mp4";
import calfRaises  from "../assets/legs5.mp4";


import crunches       from "../assets/abs1.mp4";
import plank          from "../assets/abs2.mp4";
import legRaises      from "../assets/abs3.mp4";
import russianTwist   from "../assets/abs4.mp4";
import cableCrunch    from "../assets/abs5.mp4";


const exerciseVideos = {
  // CHEST
  "Bench Press":    benchPress,
  "Incline Press":  inclinePress,
  "Dumbbell Fly":   dumbbellFly,
  "Cable Fly":      cableFly,
  "Push Ups":       pushUps,


  "Pull Ups":         pullUps,
  "Deadlift":         deadlift,
  "Bent-Over Row":    bentOverRow,
  "Lat Pulldown":     latPulldown,
  "Seated Cable Row": seatedCableRow,

  "Overhead Press":  overheadPress,
  "Lateral Raises":  lateralRaises,
  "Front Raises":    frontRaises,
  "Arnold Press":    arnoldPress,
  "Face Pulls":      facePulls,

 
  "Barbell Curl":        barbellCurl,
  "Tricep Dips":         tricepDips,
  "Hammer Curl":         hammerCurl,
  "Skull Crushers":      skullCrushers,
  "Concentration Curl":  concentrationCurl,


  "Squats":      squats,
  "Leg Press":   legPress,
  "Lunges":      lunges,
  "Leg Curl":    legCurl,
  "Calf Raises": calfRaises,

 
  "Crunches":      crunches,
  "Plank":         plank,
  "Leg Raises":    legRaises,
  "Russian Twist": russianTwist,
  "Cable Crunch":  cableCrunch,
};

const categories = [
  {
    id: "chest", label: "Chest", icon: "🫁", color: "#e53e00",
    exercises: ["Bench Press", "Incline Press", "Dumbbell Fly", "Cable Fly", "Push Ups"],
  },
  {
    id: "back", label: "Back", icon: "🦵", color: "#3b82f6",
    exercises: ["Pull Ups", "Deadlift", "Bent-Over Row", "Lat Pulldown", "Seated Cable Row"],
  },
  {
    id: "shoulders", label: "Shoulders", icon: "💪", color: "#f59e0b",
    exercises: ["Overhead Press", "Lateral Raises", "Front Raises", "Arnold Press", "Face Pulls"],
  },
  {
    id: "arms", label: "Arms", icon: "🦾", color: "#22c55e",
    exercises: ["Barbell Curl", "Tricep Dips", "Hammer Curl", "Skull Crushers", "Concentration Curl"],
  },
  {
    id: "legs", label: "Legs", icon: "🦿", color: "#a855f7",
    exercises: ["Squats", "Leg Press", "Lunges", "Leg Curl", "Calf Raises"],
  },
  {
    id: "abs", label: "Abs", icon: "⚡", color: "#06b6d4",
    exercises: ["Crunches", "Plank", "Leg Raises", "Russian Twist", "Cable Crunch"],
  },
];

function ExerciseDetail({ exercise, category, onBack }) {
  const videoSrc = exerciseVideos[exercise] || null;

  return (
    <>
      <style>{`
        .ex-detail { padding-top: 68px; min-height: 100vh; background: #0a0a0a; }
        .ex-hero {
          background: linear-gradient(135deg, #111, #1a1a1a);
          border-bottom: 3px solid ${category.color};
          padding: 3rem 2rem 2.5rem;
        }
        .back-btn {
          background: none;
          border: 1px solid #2a2a2a;
          color: #aaa;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .back-btn:hover { border-color: ${category.color}; color: ${category.color}; }
        .ex-hero h1 {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: clamp(2rem, 5vw, 3.5rem);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 0.4rem;
          color: #fff;
        }
        .ex-cat-tag {
          display: inline-block;
          background: ${category.color}22;
          border: 1px solid ${category.color}55;
          color: ${category.color};
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .ex-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          max-width: 1200px;
          margin: 2.5rem auto;
          padding: 0 2rem;
        }
        .ex-section {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 12px;
          padding: 1.5rem;
        }
        .ex-section-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: ${category.color};
          margin: 0 0 1rem;
          padding-bottom: 0.6rem;
          border-bottom: 1px solid #1e1e1e;
        }
        .ex-section p, .ex-section li {
          color: #999;
          font-size: 0.9rem;
          line-height: 1.7;
          margin: 0 0 0.5rem;
        }
        .ex-section ul { padding-left: 1.2rem; margin: 0; }
        .sets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .sets-item {
          background: #1a1a1a;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
        }
        .sets-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2rem;
          color: ${category.color};
        }
        .sets-label { font-size: 0.75rem; color: #555; text-transform: uppercase; letter-spacing: 1px; }
        .video-player {
          width: 100%;
          border-radius: 10px;
          display: block;
          background: #000;
          max-height: 340px;
          object-fit: cover;
        }
        .video-placeholder {
          background: #1a1a1a;
          border: 2px dashed #2a2a2a;
          border-radius: 10px;
          padding: 3rem;
          text-align: center;
          color: #555;
          font-size: 0.9rem;
        }
        .muscle-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .muscle-tag {
          background: ${category.color}18;
          border: 1px solid ${category.color}33;
          color: ${category.color};
          padding: 5px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
        }
        @media (max-width: 600px) {
          .ex-hero { padding: 2rem 1.2rem 1.8rem; }
          .ex-grid { padding: 0 1rem; margin: 1.5rem auto; gap: 1rem; }
          .ex-section { padding: 1.1rem; }
          .video-player { max-height: 220px; }
        }
      `}</style>
      <div className="ex-detail">
        <div className="ex-hero">
          <button className="back-btn" onClick={onBack}>← Back to {category.label}</button>
          <div className="ex-cat-tag">{category.icon} {category.label}</div>
          <h1>{exercise}</h1>
        </div>

        <div className="ex-grid">
          <div className="ex-section">
            <div className="ex-section-title">📋 Instructions</div>
            <p>This is the <strong style={{color:"#fff"}}>{exercise}</strong> exercise page.</p>
            <p>Step-by-step instructions for performing {exercise} with correct form and technique will be displayed here.</p>
            <ul>
              <li>Step 1: Set up your equipment properly</li>
              <li>Step 2: Position your body correctly</li>
              <li>Step 3: Perform the movement with control</li>
              <li>Step 4: Return to starting position</li>
            </ul>
          </div>

          <div className="ex-section">
            <div className="ex-section-title">🎥 Video Demonstration</div>
            {videoSrc ? (
              <video
                className="video-player"
                src={videoSrc}
                controls
                playsInline
                preload="metadata"
              />
            ) : (
              <div className="video-placeholder">
                ▶ Video for {exercise}<br />
                <small>Import the video and uncomment its entry above</small>
              </div>
            )}
          </div>

          <div className="ex-section">
            <div className="ex-section-title">🎯 Targeted Muscles</div>
            <div className="muscle-tags">
              <span className="muscle-tag">Primary Muscle</span>
              <span className="muscle-tag">Secondary Muscle</span>
              <span className="muscle-tag">Stabilizers</span>
            </div>
          </div>

          <div className="ex-section">
            <div className="ex-section-title">📊 Sets & Reps</div>
            <div className="sets-grid">
              <div className="sets-item"><div className="sets-value">4</div><div className="sets-label">Sets</div></div>
              <div className="sets-item"><div className="sets-value">10–12</div><div className="sets-label">Reps</div></div>
              <div className="sets-item"><div className="sets-value">60s</div><div className="sets-label">Rest</div></div>
              <div className="sets-item"><div className="sets-value">70%</div><div className="sets-label">1RM</div></div>
            </div>
          </div>

          <div className="ex-section">
            <div className="ex-section-title">💡 Tips</div>
            <ul>
              <li>Keep your core tight throughout the movement</li>
              <li>Control the negative (lowering) phase</li>
              <li>Breathe out on exertion</li>
              <li>Start with lighter weight to master form</li>
            </ul>
          </div>

          <div className="ex-section">
            <div className="ex-section-title">⚠️ Common Mistakes</div>
            <ul>
              <li>Using momentum instead of muscle</li>
              <li>Flaring elbows incorrectly</li>
              <li>Not using full range of motion</li>
              <li>Loading too much weight too soon</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function CategoryPage({ category, onBack, onSelectExercise }) {
  return (
    <PageWrapper
      icon={category.icon}
      title={`${category.label.slice(0,3)}<span>${category.label.slice(3)}</span>`}
      subtitle={`${category.exercises.length} exercises in the ${category.label} category`}
      accentColor={category.color}
    >
      <style>{`
        .cat-back-btn {
          background: none;
          border: 1px solid #2a2a2a;
          color: #aaa;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          transition: all 0.2s;
        }
        .cat-back-btn:hover { border-color: ${category.color}; color: ${category.color}; }
        .ex-list { display: grid; gap: 0.9rem; }
        .ex-list-item {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          padding: 1.3rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: all 0.2s;
        }
        .ex-list-item:hover {
          border-color: ${category.color}55;
          background: ${category.color}08;
          transform: translateX(4px);
        }
        .ex-list-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 700;
          font-size: 1.15rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #fff;
        }
        .ex-list-arrow { color: #333; font-size: 1.2rem; transition: color 0.2s; }
        .ex-list-item:hover .ex-list-arrow { color: ${category.color}; }
      `}</style>
      <button className="cat-back-btn" onClick={onBack}>← All Categories</button>
      <div className="ex-list">
        {category.exercises.map(ex => (
          <div className="ex-list-item" key={ex} onClick={() => onSelectExercise(ex)}>
            <span className="ex-list-name">{ex}</span>
            <span className="ex-list-arrow">→</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}

export default function Exercises({ initialCategoryId, clearInitialCategory }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Effect 1: Catching state dynamically passed down from App.js
  useEffect(() => {
    if (initialCategoryId) {
      const foundCategory = categories.find(cat => cat.id === initialCategoryId);
      if (foundCategory) {
        setSelectedCategory(foundCategory);
      }
      clearInitialCategory();
    }
  }, [initialCategoryId]);

  // Effect 2: Screen ko instantly har landing par top (0,0) par push karne ke liye
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [selectedCategory, selectedExercise]);

  if (selectedExercise && selectedCategory) {
    return (
      <ExerciseDetail
        exercise={selectedExercise}
        category={selectedCategory}
        onBack={() => setSelectedExercise(null)}
      />
    );
  }

  if (selectedCategory) {
    return (
      <CategoryPage
        category={selectedCategory}
        onBack={() => setSelectedCategory(null)}
        onSelectExercise={setSelectedExercise}
      />
    );
  }

  return (
    <PageWrapper
      icon="💪"
      title='EXER<span>CISES</span>'
      subtitle="Browse exercise categories and detailed guides for each movement"
    >
      <style>{`
        .cat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.2rem;
        }
        .cat-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
          padding: 2rem;
          cursor: pointer;
          transition: all 0.25s;
          position: relative;
          overflow: hidden;
        }
        .cat-card:hover { transform: translateY(-5px); }
        .cat-icon { font-size: 2.5rem; margin-bottom: 0.8rem; display: block; }
        .cat-name {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 0.4rem;
          color: #fff;
        }
        .cat-count { font-size: 0.82rem; color: #666; letter-spacing: 0.5px; }
        .cat-arrow {
          position: absolute;
          bottom: 1.5rem; right: 1.5rem;
          font-size: 1.3rem;
          color: #2a2a2a;
          transition: color 0.2s;
        }
        .cat-card:hover .cat-arrow { color: var(--cat-color); }
      `}</style>
      <div className="cat-grid">
        {categories.map(cat => (
          <div
            className="cat-card"
            key={cat.id}
            style={{ borderTop: `3px solid ${cat.color}`, "--cat-color": cat.color }}
            onClick={() => setSelectedCategory(cat)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <div className="cat-name">{cat.label}</div>
            <div className="cat-count">{cat.exercises.length} exercises</div>
            <span className="cat-arrow">→</span>
          </div>
        ))}
      </div>
    </PageWrapper>
  );
}