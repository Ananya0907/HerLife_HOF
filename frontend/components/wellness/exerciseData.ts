export interface Exercise {
  exerciseName: string;
  description: string;
  intensity: string;
}

export interface PhaseData {
  phaseName: string;
  blurb: string;
  proTip: string;
  exercises: Exercise[];
}

export const exerciseData: Record<string, PhaseData> = {
  menstrual: {
    phaseName: "Menstrual",
    blurb: "Energy is low and your body needs rest — focus on gentle movement and recovery.",
    proTip: "Listen to your body. Avoid strenuous activities and focus on stretching to relieve lower back pain.",
    exercises: [
      { "exerciseName": "Gentle Yoga", "description": "Poses like child's pose or cat-cow to relieve lower back pain.", "intensity": "Low" },
      { "exerciseName": "Walking", "description": "Low-intensity cardio to release endorphins without straining.", "intensity": "Low" },
      { "exerciseName": "Pilates", "description": "Mat-based core movements to promote circulation.", "intensity": "Low" },
      { "exerciseName": "Swimming", "description": "Buoyancy relieves joint tension and supports the body.", "intensity": "Low" },
      { "exerciseName": "Stretching", "description": "Light static stretching to release muscle tension.", "intensity": "Low" }
    ]
  },
  follicular: {
    phaseName: "Follicular",
    blurb: "Estrogen levels are rising, boosting your energy and stamina — ideal for building strength.",
    proTip: "Take advantage of increased energy levels! This is your power week to try new intense workouts.",
    exercises: [
      { "exerciseName": "Heavy Strength Training", "description": "Heavy lifting as muscles recover faster during this phase.", "intensity": "High" },
      { "exerciseName": "HIIT", "description": "Explosive cardio workouts to capitalize on high energy.", "intensity": "High" },
      { "exerciseName": "Circuit Training", "description": "Fast-paced dynamic movements building muscular endurance.", "intensity": "Moderate-High" },
      { "exerciseName": "Running/Sprinting", "description": "Ideal for longer cardio sessions or interval runs.", "intensity": "High" },
      { "exerciseName": "Powerlifting", "description": "Focus on building strength and achieving personal records.", "intensity": "High" }
    ]
  },
  ovulation: {
    phaseName: "Ovulation",
    blurb: "Estrogen and testosterone peak, providing maximum strength, power, and confidence.",
    proTip: "This is your peak physical performance window. Ideal for high-energy group fitness or pushing weight limits.",
    exercises: [
      { "exerciseName": "Group Fitness Classes", "description": "High-energy spinning, aerobics, or Zumba classes.", "intensity": "High" },
      { "exerciseName": "Dance Fitness", "description": "Rhythm-based workouts utilizing peak coordination.", "intensity": "Moderate-High" },
      { "exerciseName": "Plyometrics", "description": "Box jumps, jump squats, and agility drills.", "intensity": "High" },
      { "exerciseName": "Moderate to Heavy Weights", "description": "Focus on power and explosive strength.", "intensity": "High" },
      { "exerciseName": "Outdoor Cardio", "description": "Hiking, cycling, or long-distance outdoor runs.", "intensity": "Moderate-High" }
    ]
  },
  luteal: {
    phaseName: "Luteal",
    blurb: "Progesterone rises, increasing body temperature and heart rate — switch to moderate-intensity workouts.",
    proTip: "Transition to steady-state exercise. Keep workouts moderate to manage PMS and support active recovery.",
    exercises: [
      { "exerciseName": "Moderate Weight Training", "description": "Lower weights with higher repetitions.", "intensity": "Moderate" },
      { "exerciseName": "Brisk Walking/Hiking", "description": "Steady-state cardio without excessive exertion.", "intensity": "Moderate" },
      { "exerciseName": "Barre", "description": "Low-impact isometric movements focusing on stability.", "intensity": "Low-Moderate" },
      { "exerciseName": "Yin Yoga", "description": "Slow-paced yoga for relaxation and mobility.", "intensity": "Low" },
      { "exerciseName": "Mat Pilates", "description": "Controlled core-focused movements without overtaxing the body.", "intensity": "Moderate" }
    ]
  }
};
