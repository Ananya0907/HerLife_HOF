export type Option = {
  label: string;
  value: string;
};

export type Question = {
  id: string;
  text: string;
  type: 'select' | 'multi' | 'slider' | 'input' | 'date';
  options?: Option[];
  min?: number;
  max?: number;
  defaultValue?: any;
  unit?: string;
  placeholder?: string;
};

export const PHASES = [
  { label: 'Pre-Teens', value: 'preteen' },
  { label: 'Young Women', value: 'young_women' },
  { label: 'Pregnant', value: 'pregnant' },
  { label: 'Postpartum', value: 'postpartum' },
  { label: 'Menopause', value: 'menopause' },
];

export const PHASE_FLOWS: Record<string, Question[]> = {
  preteen: [
    { id: 'learned_periods', text: 'Have you learned about periods before?', type: 'select', options: [{label: 'Yes', value: 'yes'}, {label: 'A little', value: 'little'}, {label: 'No', value: 'no'}] },
    { id: 'body_changes', text: 'Have you noticed body changes?', type: 'select', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}, {label: 'Not sure', value: 'not_sure'}] },
    { id: 'energy', text: 'Energy level?', type: 'select', options: [{label: 'Energetic', value: 'energetic'}, {label: 'Normal', value: 'normal'}, {label: 'Tired', value: 'tired'}] },
    { id: 'sleep', text: 'Sleep duration?', type: 'select', options: [{label: '<6', value: '<6'}, {label: '6–8', value: '6-8'}, {label: '8+', value: '8+'}] },
    { id: 'activity', text: 'Physical activity?', type: 'select', options: [{label: 'Yes', value: 'yes'}, {label: 'Sometimes', value: 'sometimes'}, {label: 'No', value: 'no'}] },
    { id: 'mood', text: 'Mood?', type: 'select', options: [{label: 'Happy', value: 'happy'}, {label: 'Okay', value: 'okay'}, {label: 'Sometimes low', value: 'low'}] },
    { id: 'water_intake', text: 'Daily water intake?', type: 'select', options: [{label: '< 1 Liter', value: 'low'}, {label: '1-2 Liters', value: 'medium'}, {label: '2+ Liters', value: 'high'}] },
    { id: 'stress_anxiety', text: 'Do you feel stressed or anxious?', type: 'select', options: [{label: 'Rarely', value: 'rarely'}, {label: 'Sometimes', value: 'sometimes'}, {label: 'Often', value: 'often'}] }
  ],
  young_women: [
    { id: 'height_cm', text: 'What is your height? (cm)', type: 'input', unit: 'cm', placeholder: 'e.g. 165' },
    { id: 'Weight_kg', text: 'What is your weight? (kg)', type: 'input', unit: 'kg', placeholder: 'e.g. 60' },
    { id: 'Last_Period_Start', text: 'When did your last period start?', type: 'date' },
    { 
      id: 'Avg_Cycle_Length_days', 
      text: 'How long is your usual cycle?', 
      type: 'select', 
      options: [
        {label: '21 days', value: '21'}, 
        {label: '28 days', value: '28'}, 
        {label: '35 days', value: '35'}, 
        {label: 'Not sure', value: 'Not sure'}
      ] 
    },
    { 
      id: 'Bleeding_Duration_days', 
      text: 'How many days does your period last?', 
      type: 'select', 
      options: [
        {label: '1-3 days', value: '1-3'}, 
        {label: '4-5 days', value: '4-5'}, 
        {label: '6-7 days', value: '6-7'}, 
        {label: '8+ days', value: '8+'}
      ] 
    },
    { 
      id: 'Flow_Intensity', 
      text: 'How heavy is your flow?', 
      type: 'select', 
      options: [
        {label: 'Light', value: 'Light'}, 
        {label: 'Moderate', value: 'Moderate'}, 
        {label: 'Heavy', value: 'Heavy'}, 
        {label: 'Very Heavy', value: 'Very Heavy'}
      ] 
    },
    { 
      id: 'Periods_Regular', 
      text: 'Are your periods regular?', 
      type: 'select', 
      options: [
        {label: 'Yes', value: 'Yes'}, 
        {label: 'No', value: 'No'}, 
        {label: 'Sometimes', value: 'Sometimes'}
      ] 
    },
    { 
      id: 'Clotting', 
      text: 'Do you experience clotting?', 
      type: 'select', 
      options: [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}] 
    },
    { 
      id: 'Pain_Level_1to5', 
      text: 'How painful are your periods?', 
      type: 'slider', 
      min: 1, 
      max: 5, 
      defaultValue: 3 
    },
    { 
      id: 'pcos_diagnosis', 
      text: 'Have you been diagnosed with PCOS/PCOD?', 
      type: 'select', 
      options: [
        {label: 'Yes', value: 'Yes'}, 
        {label: 'No', value: 'No'}, 
        {label: 'Not sure', value: 'Not sure'}
      ] 
    },
    { 
      id: 'Missed_Periods_Frequency', 
      text: 'How often do you miss your period?', 
      type: 'select', 
      options: [
        {label: 'Never', value: 'Never'}, 
        {label: 'Occasionally', value: 'Occasionally'}, 
        {label: 'Frequently', value: 'Frequently'}
      ] 
    },
    { 
      id: 'Difficulty_Losing_Weight', 
      text: 'Do you find it hard to lose weight?', 
      type: 'select', 
      options: [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}] 
    },
    { 
      id: 'Hormonal_Contraceptive_Use', 
      text: 'Are you on hormonal contraceptives?', 
      type: 'select', 
      options: [{label: 'Yes', value: 'Yes'}, {label: 'No', value: 'No'}] 
    },
    { 
      id: 'Skin_Condition_During_Cycle', 
      text: 'How is your skin during your cycle?', 
      type: 'select', 
      options: [
        {label: 'Clear', value: 'Clear'}, 
        {label: 'Mild breakout', value: 'Mild breakout'}, 
        {label: 'Moderate breakout', value: 'Moderate breakout'}, 
        {label: 'Severe breakout', value: 'Severe breakout'}
      ] 
    },
    { 
      id: 'Hair_Fall_Level', 
      text: 'How much hair fall do you notice?', 
      type: 'select', 
      options: [
        {label: 'None', value: 'None'}, 
        {label: 'Mild', value: 'Mild'}, 
        {label: 'Moderate', value: 'Moderate'}, 
        {label: 'Severe', value: 'Severe'}
      ] 
    },
    { 
      id: 'Exercise_Frequency', 
      text: 'How often do you usually exercise?', 
      type: 'select', 
      options: [
        {label: 'Never', value: '0'}, 
        {label: 'Sometimes', value: '1'}, 
        {label: 'Regularly', value: '2'}
      ] 
    },
    { 
      id: 'Sleep_Duration', 
      text: 'How many hours of sleep do you get on average?', 
      type: 'select', 
      options: [
        {label: 'Less than 5 hours', value: '0'}, 
        {label: '5-7 hours', value: '1'}, 
        {label: '7-9 hours', value: '2'}, 
        {label: 'More than 9 hours', value: '3'}
      ] 
    },
    { 
      id: 'Stress_Level_1to5', 
      text: 'How would you rate your typical daily stress levels?', 
      type: 'slider', 
      min: 1, 
      max: 5, 
      defaultValue: 3 
    },
    { 
      id: 'Junk_Food_Frequency_1to5', 
      text: 'How often do you eat fast food or highly processed snacks?', 
      type: 'slider', 
      min: 1, 
      max: 5, 
      defaultValue: 3 
    },
    { 
      id: 'Sugar_Intake_Frequency_1to5', 
      text: 'How frequently do you crave or consume sugary foods?', 
      type: 'slider', 
      min: 1, 
      max: 5, 
      defaultValue: 3 
    },
    { 
      id: 'Caffeine_Intake', 
      text: 'How often do you consume caffeine (coffee, energy drinks, etc.)?', 
      type: 'select', 
      options: [
        {label: 'Never', value: '0'}, 
        {label: 'Rarely', value: '1'}, 
        {label: 'Sometimes', value: '2'}, 
        {label: 'Daily', value: '3'}
      ] 
    },
    { 
      id: 'Water_Intake_Litres', 
      text: 'Roughly how many liters of water do you drink a day?', 
      type: 'select', 
      options: [
        {label: 'Less than 1 Liter', value: '0.5'}, 
        {label: '1 to 2 Liters', value: '1.5'}, 
        {label: '2 to 3 Liters', value: '2.5'}, 
        {label: 'More than 3 Liters', value: '3.5'}
      ] 
    },
    { 
      id: 'Overall_Energy_Level', 
      text: 'How would you describe your overall daily energy?', 
      type: 'select', 
      options: [
        {label: 'Low Energy', value: '0'}, 
        {label: 'Medium Energy', value: '1'}, 
        {label: 'High Energy', value: '2'}
      ] 
    },
    {
      id: 'ML_SYM',
      text: 'Do you experience any of these general symptoms? (Select all that apply)',
      type: 'multi',
      options: [
        {label: 'Acne', value: 'SYM_Acne'},
        {label: 'Back pain', value: 'SYM_Back_pain'},
        {label: 'Bloating', value: 'SYM_Bloating'},
        {label: 'Breast tenderness', value: 'SYM_Breast_tenderness'},
        {label: 'Cramps', value: 'SYM_Cramps'},
        {label: 'Fatigue', value: 'SYM_Fatigue'},
        {label: 'Headaches', value: 'SYM_Headaches'},
        {label: 'Hot flashes', value: 'SYM_Hot_flashes'},
        {label: 'Joint pain', value: 'SYM_Joint_pain'},
        {label: 'Mood Swings', value: 'SYM_Mood_Swings'},
        {label: 'Nausea', value: 'SYM_Nausea'},
        {label: 'Night sweats', value: 'SYM_Night_sweats'}
      ]
    },
    {
      id: 'ML_PMS',
      text: 'Do you experience any of these PMS symptoms? (Select all that apply)',
      type: 'multi',
      options: [
        {label: 'Anxiety', value: 'PMS_Anxiety'},
        {label: 'Bloating', value: 'PMS_Bloating'},
        {label: 'Breast tenderness', value: 'PMS_Breast_tenderness'},
        {label: 'Depression', value: 'PMS_Depression'},
        {label: 'Food Cravings', value: 'PMS_Food_Cravings'},
        {label: 'Irritability', value: 'PMS_Irritability'},
        {label: 'Sleep Disturbances', value: 'PMS_Sleep_Disturbances'}
      ]
    },
    {
      id: 'ML_PCOS_S',
      text: 'Do you experience any of these PCOS-specific symptoms? (Select all that apply)',
      type: 'multi',
      options: [
        {label: 'Dark patches on skin', value: 'PCOS_S_Dark_patches_on_skin'},
        {label: 'Excess facial/body hair', value: 'PCOS_S_Excess_facial/body_hair'},
        {label: 'Hair thinning', value: 'PCOS_S_Hair_thinning'},
        {label: 'Irregular periods', value: 'PCOS_S_Irregular_periods'},
        {label: 'Persistent acne', value: 'PCOS_S_Persistent_acne'},
        {label: 'Sudden weight gain', value: 'PCOS_S_Sudden_weight_gain'}
      ]
    }
  ],
  pregnant: [
    { id: 'pregnancy_week', text: 'Which week of pregnancy are you in?', type: 'input', unit: 'weeks', placeholder: 'e.g. 18' },
    { id: 'height_cm', text: 'What is your height? (cm)', type: 'input', unit: 'cm', placeholder: 'e.g. 165' },
    { id: 'Weight_kg', text: 'What is your weight? (kg)', type: 'input', unit: 'kg', placeholder: 'e.g. 60' },
    { id: 'sleep', text: 'Sleep quality', type: 'select', options: [{label: 'Poor', value: 'poor'}, {label: 'Okay', value: 'okay'}, {label: 'Good', value: 'good'}] },
    { id: 'energy', text: 'Energy', type: 'select', options: [{label: 'Low', value: 'low'}, {label: 'Medium', value: 'medium'}, {label: 'High', value: 'high'}] },
    { id: 'symptoms', text: 'Symptoms', type: 'multi', options: [{label: 'Nausea', value: 'nausea'}, {label: 'Fatigue', value: 'fatigue'}, {label: 'Back pain', value: 'back_pain'}, {label: 'Heartburn', value: 'heartburn'}] },
    { id: 'activity', text: 'Physical activity', type: 'select', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] },
    { id: 'water_intake', text: 'Daily hydration', type: 'select', options: [{label: '< 2 Liters', value: 'low'}, {label: '2-3 Liters', value: 'medium'}, {label: '3+ Liters', value: 'high'}] },
    { id: 'emotional_wellbeing', text: 'Emotional well-being', type: 'select', options: [{label: 'Stable', value: 'stable'}, {label: 'Anxious', value: 'anxious'}, {label: 'Low mood', value: 'low_mood'}] }
  ],
  postpartum: [
    { id: 'weeks_postpartum', text: 'Weeks/months postpartum', type: 'input' },
    { id: 'sleep', text: 'Sleep quality', type: 'select', options: [{label: 'Poor', value: 'poor'}, {label: 'Okay', value: 'okay'}, {label: 'Good', value: 'good'}] },
    { id: 'energy', text: 'Energy', type: 'select', options: [{label: 'Low', value: 'low'}, {label: 'Medium', value: 'medium'}, {label: 'High', value: 'high'}] },
    { id: 'mood', text: 'Mood', type: 'select', options: [{label: 'Stable', value: 'stable'}, {label: 'Low', value: 'low'}, {label: 'Anxious', value: 'anxious'}] },
    { id: 'breastfeeding', text: 'Breastfeeding?', type: 'select', options: [{label: 'Yes', value: 'yes'}, {label: 'No', value: 'no'}] },
    { id: 'physical_recovery', text: 'Physical recovery', type: 'select', options: [{label: 'Slow', value: 'slow'}, {label: 'Expected', value: 'expected'}, {label: 'Fast', value: 'fast'}] },
    { id: 'support_system', text: 'Do you have support at home?', type: 'select', options: [{label: 'Yes, lots', value: 'lots'}, {label: 'Some', value: 'some'}, {label: 'Little to none', value: 'none'}] }
  ],
  menopause: [
    { id: 'last_period', text: 'When was your last period?', type: 'date' },
    { id: 'stage', text: 'Where are you in your journey?', type: 'select', options: [{label: 'Perimenopause', value: 'Perimenopause'}, {label: 'Menopause', value: 'Transitioning'}, {label: 'Postmenopause', value: 'Postmenopause'}] },
    { id: 'hot_flashes', text: 'Do you experience hot flashes?', type: 'select', options: [{label: 'Rarely', value: 'rarely'}, {label: 'Sometimes', value: 'sometimes'}, {label: 'Frequently', value: 'frequently'}] },
    { id: 'sleep', text: 'How has your sleep been?', type: 'select', options: [{label: 'Interrupted', value: 'interrupted'}, {label: 'Normal', value: 'normal'}, {label: 'Deep sleep', value: 'deep'}] },
    { id: 'mood_changes', text: 'Notice any mood swings?', type: 'select', options: [{label: 'Yes, often', value: 'yes'}, {label: 'Occasionally', value: 'occasionally'}, {label: 'No', value: 'no'}] },
    { id: 'energy', text: 'Energy level?', type: 'select', options: [{label: 'Low', value: 'low'}, {label: 'Moderate', value: 'moderate'}, {label: 'High', value: 'high'}] }
  ],
};
