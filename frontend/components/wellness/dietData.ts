export interface DietPlan {
  prioritizeFoods: string[];
  foodsToAvoid: string[];
}

export interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  howToMake: string;
}

export const dietData: Record<string, DietPlan> = {
  menstrualPhase: {
    prioritizeFoods: [
      "Iron-rich foods (spinach, lentils, beans)",
      "Vitamin C-rich fruits (oranges, kiwi, berries)",
      "Omega-3 sources (salmon, walnuts, flaxseeds)",
      "Hydrating foods (cucumber, watermelon, soups)",
      "Magnesium-rich foods (dark chocolate, nuts, seeds)"
    ],
    foodsToAvoid: ["Excess caffeine", "Highly processed foods", "Sugary snacks and drinks", "Salty foods"]
  },
  follicularPhase: {
    prioritizeFoods: [
      "Lean proteins (chicken, tofu, eggs)",
      "Fresh fruits and vegetables",
      "Whole grains (brown rice, oats, quinoa)",
      "Fermented foods (yogurt, kefir, kimchi)",
      "Healthy fats (avocado, nuts, olive oil)"
    ],
    foodsToAvoid: ["Deep-fried foods", "Refined carbohydrates", "Excess alcohol", "Highly processed snacks"]
  },
  ovulationPhase: {
    prioritizeFoods: [
      "Antioxidant-rich fruits (berries, cherries, citrus fruits)",
      "Cruciferous vegetables (broccoli, cauliflower, kale)",
      "Lean proteins (fish, chicken, legumes)",
      "Fiber-rich foods (whole grains, vegetables)",
      "Healthy fats (nuts, seeds, olive oil)"
    ],
    foodsToAvoid: ["Sugary beverages", "Processed meats", "Excess caffeine", "Highly processed foods"]
  },
  lutealPhase: {
    prioritizeFoods: [
      "Complex carbohydrates (sweet potatoes, oats, brown rice)",
      "Magnesium-rich foods (pumpkin seeds, almonds, dark chocolate)",
      "Vitamin B6 sources (bananas, chickpeas, potatoes)",
      "Calcium-rich foods (milk, yogurt, leafy greens)",
      "Protein-rich foods (eggs, fish, beans)"
    ],
    foodsToAvoid: ["Excess salt", "Sugary desserts", "Alcohol", "Excess caffeine"]
  }
};

export const recipeData: Record<string, Recipe[]> = {
  menstrualPhase: [
    {
      recipeName: "Spinach and Lentil Stew",
      description: "A warm bowl packed with plant-based iron and fiber.",
      ingredients: ["Red lentils", "Spinach", "Onion", "Garlic", "Turmeric", "Tomatoes", "Vegetable broth"],
      howToMake: "Sauté onions, garlic, and turmeric. Add rinsed red lentils, chopped tomatoes, and vegetable broth. Simmer until the lentils are soft, then stir in fresh spinach until wilted."
    },
    {
      recipeName: "Citrus & Berry Iron-Boosting Smoothie",
      description: "Vitamin C-rich fruits paired with leafy greens to support iron absorption.",
      ingredients: ["Spinach", "Orange or Kiwi", "Strawberries", "Water or Coconut Water"],
      howToMake: "Blend spinach, orange or kiwi, strawberries, and water or coconut water until smooth. Serve chilled."
    },
    { recipeName: "", description: "", ingredients: [], howToMake: "" }
  ],
  follicularPhase: [
    {
      recipeName: "Zucchini & Pumpkin Seed Pesto Quinoa Bowl",
      description: "A nutrient-dense bowl rich in complex carbs and healthy fats.",
      ingredients: ["Quinoa", "Zucchini", "Pumpkin Seeds", "Olive Oil"],
      howToMake: "Cook quinoa according to package instructions. Sauté or roast zucchini until tender. Combine with quinoa, top with roasted pumpkin seeds, and drizzle with olive oil."
    },
    {
      recipeName: "Chicken (or Tofu) & Broccoli Stir-fry",
      description: "Lean protein and cruciferous vegetables to support rising energy levels.",
      ingredients: ["Chicken Breast or Tofu", "Broccoli", "Soy Sauce", "Fresh Ginger", "Sesame Oil"],
      howToMake: "Stir-fry cubed chicken or tofu and broccoli in a pan. Add soy sauce, grated ginger, and a small amount of sesame oil. Cook until everything is well coated and tender."
    },
    { recipeName: "", description: "", ingredients: [], howToMake: "" }
  ],
  ovulationPhase: [
    {
      recipeName: "Avocado & Salmon (or Paneer) Nori Wraps",
      description: "A nutrient-packed wrap rich in omega-3s, folate, and healthy fats.",
      ingredients: ["Nori Sheets", "Salmon or Paneer", "Avocado", "Carrots", "Spinach"],
      howToMake: "Lay a nori sheet flat. Add salmon or paneer, sliced avocado, shredded carrots, and spinach. Roll tightly and slice into bite-sized pieces."
    },
    {
      recipeName: "Fruity Green Salad",
      description: "An antioxidant-rich salad packed with vitamin C and fiber.",
      ingredients: ["Mixed Greens", "Strawberries", "Blueberries", "Walnuts", "Olive Oil", "Lemon Juice", "Sea Salt"],
      howToMake: "Combine mixed greens, strawberries, blueberries, and walnuts in a bowl. Toss with olive oil, lemon juice, and a pinch of sea salt before serving."
    },
    { recipeName: "", description: "", ingredients: [], howToMake: "" }
  ],
  lutealPhase: [
    {
      recipeName: "Sweet Potato & Black Bean Bowl",
      description: "A fiber-rich meal that helps stabilize energy and reduce cravings.",
      ingredients: ["Sweet Potato", "Black Beans", "Cumin", "Avocado"],
      howToMake: "Roast cubed sweet potatoes until tender. Mix with warmed black beans and cumin. Top with mashed avocado and serve warm."
    },
    {
      recipeName: "Luteal PMS Bites",
      description: "A healthy magnesium-rich snack for managing PMS cravings.",
      ingredients: ["Dates", "Almond Butter", "Oats", "Chia Seeds", "Unsweetened Cocoa Powder"],
      howToMake: "Blend dates, almond butter, oats, and chia seeds in a food processor. Roll into small balls and coat with unsweetened cocoa powder."
    },
    { recipeName: "", description: "", ingredients: [], howToMake: "" }
  ]
};
