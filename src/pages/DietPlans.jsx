import { useState } from "react";
import PageWrapper from "../components/PageWrapper";

function calcPlan(weight, goal) {
  const base = weight * 24;
  const protein = goal === "muscle" ? Math.round(weight * 2.2) : Math.round(weight * 1.8);
  const calories = goal === "muscle" ? Math.round(base * 1.15) : Math.round(base * 0.85);
  const carbs = Math.round((calories * 0.45) / 4);
  const fats = Math.round((calories * 0.25) / 9);
  const water = (weight * 0.033).toFixed(1);

  const meals = goal === "muscle"
    ? [
        { time: "7:00 AM",  name: "Breakfast",    items: "Oats + 4 eggs + banana + milk" },
        { time: "10:00 AM", name: "Snack",         items: "Protein shake + almonds" },
        { time: "1:00 PM",  name: "Lunch",         items: "Rice + chicken breast + vegetables" },
        { time: "4:00 PM",  name: "Pre-Workout",   items: "Banana + peanut butter" },
        { time: "7:00 PM",  name: "Post-Workout",  items: "Protein shake + rice cakes" },
        { time: "9:00 PM",  name: "Dinner",        items: "Grilled fish + sweet potato + salad" },
      ]
    : [
        { time: "7:00 AM",  name: "Breakfast",    items: "2 eggs + whole grain toast + black coffee" },
        { time: "10:00 AM", name: "Snack",         items: "Greek yogurt + berries" },
        { time: "1:00 PM",  name: "Lunch",         items: "Grilled chicken + salad + olive oil" },
        { time: "4:00 PM",  name: "Snack",         items: "Apple + cottage cheese" },
        { time: "7:00 PM",  name: "Dinner",        items: "Steamed fish + broccoli + brown rice" },
      ];

  return { calories, protein, carbs, fats, water, meals };
}

export default function DietPlans() {
  const [weight, setWeight] = useState("");
  const [goal, setGoal] = useState("muscle");
  const [plan, setPlan] = useState(null);

  const generate = () => {
    const w = parseFloat(weight);
    if (!w || w < 30 || w > 300) return;
    setPlan(calcPlan(w, goal));
  };

  return (
    <PageWrapper
      icon="🥗"
      title='DIET<span> PLANS</span>'
      subtitle="Get a personalized nutrition plan based on your weight and fitness goal"
      accentColor="#22c55e"
    >
      <style>{`
        .diet-form {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 14px;
          padding: 2rem;
          max-width: 500px;
          margin-bottom: 2.5rem;
        }
        .form-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          color: #777;
          margin-bottom: 0.5rem;
        }
        .form-input {
          width: 100%;
          background: #1a1a1a;
          border: 1px solid #2a2a2a;
          border-radius: 8px;
          color: #fff;
          padding: 11px 14px;
          font-family: 'Barlow', sans-serif;
          font-size: 1rem;
          outline: none;
          box-sizing: border-box;
          margin-bottom: 1.2rem;
          transition: border-color 0.2s;
        }
        .form-input:focus { border-color: #22c55e; }
        .goal-btns { display: flex; gap: 0.8rem; margin-bottom: 1.5rem; }
        .goal-btn {
          flex: 1;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          color: #888;
          padding: 12px;
          border-radius: 8px;
          cursor: pointer;
          font-family: 'Barlow', sans-serif;
          font-weight: 700;
          font-size: 0.9rem;
          transition: all 0.2s;
          text-align: center;
        }
        .goal-btn.active { border-color: #22c55e; color: #22c55e; background: rgba(34,197,94,0.08); }
        .generate-btn {
          width: 100%;
          background: #22c55e;
          border: none;
          color: #000;
          padding: 13px;
          border-radius: 8px;
          font-family: 'Barlow', sans-serif;
          font-weight: 900;
          font-size: 1rem;
          cursor: pointer;
          letter-spacing: 1px;
          transition: background 0.2s;
        }
        .generate-btn:hover { background: #16a34a; color: #fff; }
        .macro-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }
        .macro-card {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 12px;
          padding: 1.3rem;
          text-align: center;
        }
        .macro-value {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 2rem;
          color: #22c55e;
        }
        .macro-label { font-size: 0.75rem; color: #666; text-transform: uppercase; letter-spacing: 1px; margin-top: 2px; }
        .meal-title {
          font-family: 'Barlow Condensed', sans-serif;
          font-weight: 900;
          font-size: 1.3rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #22c55e;
          margin: 0 0 1rem;
        }
        .meal-list { display: grid; gap: 0.8rem; }
        .meal-item {
          background: #111;
          border: 1px solid #1e1e1e;
          border-radius: 10px;
          padding: 1rem 1.3rem;
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }
        .meal-time {
          font-size: 0.78rem;
          color: #22c55e;
          font-weight: 700;
          min-width: 70px;
          letter-spacing: 0.5px;
        }
        .meal-name { font-weight: 700; color: #fff; font-size: 0.9rem; min-width: 110px; }
        .meal-items { color: #777; font-size: 0.85rem; }
      `}</style>

      <div className="diet-form">
        <label className="form-label">Your Weight (kg)</label>
        <input
          className="form-input"
          type="number"
          placeholder="e.g. 70"
          value={weight}
          onChange={e => setWeight(e.target.value)}
        />
        <label className="form-label">Fitness Goal</label>
        <div className="goal-btns">
          <button className={`goal-btn ${goal === "muscle" ? "active" : ""}`} onClick={() => setGoal("muscle")}>
            💪 Muscle Gain
          </button>
          <button className={`goal-btn ${goal === "fat" ? "active" : ""}`} onClick={() => setGoal("fat")}>
            🔥 Fat Loss
          </button>
        </div>
        <button className="generate-btn" onClick={generate}>GENERATE MY PLAN →</button>
      </div>

      {plan && (
        <>
          <div className="macro-grid">
            <div className="macro-card"><div className="macro-value">{plan.calories}</div><div className="macro-label">Daily Calories</div></div>
            <div className="macro-card"><div className="macro-value">{plan.protein}g</div><div className="macro-label">Protein</div></div>
            <div className="macro-card"><div className="macro-value">{plan.carbs}g</div><div className="macro-label">Carbs</div></div>
            <div className="macro-card"><div className="macro-value">{plan.fats}g</div><div className="macro-label">Fats</div></div>
            <div className="macro-card"><div className="macro-value">{plan.water}L</div><div className="macro-label">Water</div></div>
          </div>

          <div className="meal-title">Meal Plan</div>
          <div className="meal-list">
            {plan.meals.map(m => (
              <div className="meal-item" key={m.time}>
                <span className="meal-time">{m.time}</span>
                <span className="meal-name">{m.name}</span>
                <span className="meal-items">{m.items}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </PageWrapper>
  );
}
