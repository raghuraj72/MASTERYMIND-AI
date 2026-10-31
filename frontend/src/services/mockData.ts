// Complete Client-Side Mock Data & Engine for Standalone GitHub Pages Deployment
import {
  ConceptGraphResponse,
  ConceptGraphNode,
  ConceptGraphEdge,
  StudentDashboardData,
  Question,
  PracticeSubmitResponse,
  MasteryEventHistoryItem,
  RevisionScheduleItem,
  TeacherClassOverview,
  HeatmapItem,
  MisconceptionFrequencyItem,
  InterventionItem
} from '../types';

export const MOCK_USERS = {
  student: {
    id: 'student-aarav-gupta',
    email: 'student@masterymind.ai',
    full_name: 'Aarav Gupta',
    role: 'student',
    class_grade: 'Class 10-A',
    target_exam_date: 'March 2026',
    preferred_language: 'English',
    learning_goals: 'Master CBSE Class 10 Physics for 95%+ in board examinations.',
    is_active: true
  },
  teacher: {
    id: 'teacher-radhika-sharma',
    email: 'teacher@masterymind.ai',
    full_name: 'Dr. Radhika Sharma',
    role: 'teacher',
    class_grade: 'Class 10',
    preferred_language: 'English',
    is_active: true
  }
};

export const MOCK_CHAPTERS = [
  { chapter_number: 9, code: 'CH09_LIGHT', title: 'Light: Reflection and Refraction' },
  { chapter_number: 10, code: 'CH10_HUMAN_EYE', title: 'The Human Eye and the Colourful World' },
  { chapter_number: 11, code: 'CH11_ELECTRICITY', title: 'Electricity' },
  { chapter_number: 12, code: 'CH12_MAGNETISM', title: 'Magnetic Effects of Electric Current' }
];

const rawNodes: ConceptGraphNode[] = [
  // Ch 9: Light (8)
  { id: 'c1', code: 'LGT_REFL_LAWS', label: 'Laws of Reflection & Spherical Mirrors', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 1, formula: 'i = r', description: 'Laws of reflection, concave and convex mirrors.', learning_objectives: 'Predict reflection and focus properties.', status: 'mastered', mastery_percentage: 86, uncertainty: 0.15, prerequisite_gap: false },
  { id: 'c2', code: 'LGT_RAY_DIAGRAMS_MIRROR', label: 'Ray Diagrams in Mirrors', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 2, formula: 'R = 2f', description: 'Ray diagrams across various object positions.', learning_objectives: 'Determine real and virtual images.', status: 'mastered', mastery_percentage: 82, uncertainty: 0.18, prerequisite_gap: false },
  { id: 'c3', code: 'LGT_SIGN_CONVENTION', label: 'Cartesian Sign Convention', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 2, formula: 'u < 0, f_c < 0', description: 'Sign conventions for mirrors and lenses.', learning_objectives: 'Apply coordinate conventions.', status: 'weak', mastery_percentage: 38, uncertainty: 0.35, prerequisite_gap: true },
  { id: 'c4', code: 'LGT_MIRROR_FORMULA', label: 'Mirror Formula & Magnification', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 3, formula: '1/f = 1/v + 1/u', description: 'Calculations using mirror formula.', learning_objectives: 'Solve optical distances and magnification.', status: 'developing', mastery_percentage: 55, uncertainty: 0.28, prerequisite_gap: false },
  { id: 'c5', code: 'LGT_REFR_SNELLS_LAW', label: 'Refraction & Snell\'s Law', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 1, formula: 'n₁ sin i = n₂ sin r', description: 'Bending of light across media.', learning_objectives: 'Apply Snell\'s law of refraction.', status: 'mastered', mastery_percentage: 78, uncertainty: 0.20, prerequisite_gap: false },
  { id: 'c6', code: 'LGT_REFR_INDEX', label: 'Absolute & Relative Refractive Index', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 2, formula: 'n = c/v', description: 'Speed of light in optical media.', learning_objectives: 'Compute refractive index and speed.', status: 'developing', mastery_percentage: 64, uncertainty: 0.25, prerequisite_gap: false },
  { id: 'c7', code: 'LGT_LENS_FORMULA', label: 'Lens Formula & Magnification', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 3, formula: '1/f = 1/v - 1/u', description: 'Convex and concave lens image calculations.', learning_objectives: 'Apply lens formula.', status: 'developing', mastery_percentage: 58, uncertainty: 0.29, prerequisite_gap: false },
  { id: 'c8', code: 'LGT_LENS_POWER', label: 'Power of a Lens & Combinations', chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection and Refraction', level: 2, formula: 'P = 1/f (m)', description: 'Power measured in dioptres.', learning_objectives: 'Calculate combined lens power.', status: 'mastered', mastery_percentage: 80, uncertainty: 0.16, prerequisite_gap: false },

  // Ch 10: Human Eye (6)
  { id: 'c9', code: 'EYE_STRUCTURE_ACCOMMODATION', label: 'Eye Structure & Accommodation', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 1, formula: 'Near Point = 25 cm', description: 'Ciliary muscles and focal adjustment.', learning_objectives: 'Explain accommodation.', status: 'mastered', mastery_percentage: 84, uncertainty: 0.15, prerequisite_gap: false },
  { id: 'c10', code: 'EYE_DEFECTS_MYOPIA_HYPER', label: 'Myopia & Hypermetropia Correction', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 2, formula: 'Concave / Convex', description: 'Vision defects and corrective lenses.', learning_objectives: 'Select corrective power.', status: 'developing', mastery_percentage: 62, uncertainty: 0.22, prerequisite_gap: false },
  { id: 'c11', code: 'EYE_DEFECTS_PRESBYOPIA_ASTIG', label: 'Presbyopia & Bifocal Lenses', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 2, formula: 'Bifocal Lens', description: 'Age-related vision changes.', learning_objectives: 'Distinguish presbyopia.', status: 'mastered', mastery_percentage: 76, uncertainty: 0.20, prerequisite_gap: false },
  { id: 'c12', code: 'EYE_PRISM_DISPERSION', label: 'Prism Refraction & Dispersion', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 2, formula: 'VIBGYOR Spectrum', description: 'Splitting of white light through glass prism.', learning_objectives: 'Explain dispersion.', status: 'developing', mastery_percentage: 54, uncertainty: 0.26, prerequisite_gap: false },
  { id: 'c13', code: 'EYE_ATMOSPHERIC_REFRACTION', label: 'Atmospheric Refraction & Twinkling', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 2, formula: 'Apparent Position', description: 'Star twinkling and advanced sunrise.', learning_objectives: 'Analyze optical density gradients.', status: 'mastered', mastery_percentage: 78, uncertainty: 0.18, prerequisite_gap: false },
  { id: 'c14', code: 'EYE_SCATTERING_TYNDALL', label: 'Tyndall Effect & Blue Sky', chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'The Human Eye and Colourful World', level: 2, formula: 'I ∝ 1/λ⁴', description: 'Wavelength scattering by small particles.', learning_objectives: 'Explain blue sky and red sunset.', status: 'mastered', mastery_percentage: 82, uncertainty: 0.17, prerequisite_gap: false },

  // Ch 11: Electricity (8)
  { id: 'c15', code: 'ELC_CHARGE_CURRENT', label: 'Electric Charge & Current', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 1, formula: 'I = Q / t', description: 'Flow of electrons and charge.', learning_objectives: 'Calculate current and charge.', status: 'mastered', mastery_percentage: 90, uncertainty: 0.12, prerequisite_gap: false },
  { id: 'c16', code: 'ELC_POTENTIAL_DIFF', label: 'Electric Potential Difference', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 1, formula: 'V = W / Q', description: 'Work done per unit charge.', learning_objectives: 'Define volt and potential difference.', status: 'developing', mastery_percentage: 60, uncertainty: 0.24, prerequisite_gap: false },
  { id: 'c17', code: 'ELC_OHMS_LAW', label: 'Ohm\'s Law & Resistance', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 2, formula: 'V = I · R', description: 'Linear relationship in ohmic conductors.', learning_objectives: 'Verify Ohm\'s law.', status: 'weak', mastery_percentage: 32, uncertainty: 0.42, prerequisite_gap: true },
  { id: 'c18', code: 'ELC_FACTORS_RESISTANCE', label: 'Factors Affecting Resistance & Resistivity', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 2, formula: 'R = ρ · (l / A)', description: 'Length, area, material, and temperature.', learning_objectives: 'Calculate resistance and resistivity.', status: 'weak', mastery_percentage: 28, uncertainty: 0.45, prerequisite_gap: false },
  { id: 'c19', code: 'ELC_RESISTORS_SERIES', label: 'Resistors in Series', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 2, formula: 'R_s = R₁ + R₂ + R₃', description: 'Current constancy and voltage division.', learning_objectives: 'Solve series circuits.', status: 'developing', mastery_percentage: 58, uncertainty: 0.28, prerequisite_gap: false },
  { id: 'c20', code: 'ELC_RESISTORS_PARALLEL', label: 'Resistors in Parallel', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 2, formula: '1/R_p = 1/R₁ + 1/R₂', description: 'Voltage constancy and current division.', learning_objectives: 'Solve parallel circuits.', status: 'weak', mastery_percentage: 35, uncertainty: 0.38, prerequisite_gap: false },
  { id: 'c21', code: 'ELC_JOULE_HEATING', label: 'Joule\'s Heating Effect', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 3, formula: 'H = I² · R · t', description: 'Thermal dissipation in resistors.', learning_objectives: 'Compute heat energy.', status: 'developing', mastery_percentage: 52, uncertainty: 0.30, prerequisite_gap: false },
  { id: 'c22', code: 'ELC_ELECTRIC_POWER', label: 'Electric Power & Commercial Energy', chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', level: 3, formula: 'P = V · I = I²R', description: 'Rate of electrical consumption (Watts and kWh).', learning_objectives: 'Calculate commercial electrical cost.', status: 'weak', mastery_percentage: 30, uncertainty: 0.40, prerequisite_gap: false },

  // Ch 12: Magnetism (6)
  { id: 'c23', code: 'MAG_FIELD_LINES', label: 'Magnetic Field & Field Lines', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 1, formula: 'N → S outside', description: 'Properties and trajectories of field lines.', learning_objectives: 'Draw magnetic fields.', status: 'mastered', mastery_percentage: 85, uncertainty: 0.14, prerequisite_gap: false },
  { id: 'c24', code: 'MAG_RIGHT_HAND_THUMB', label: 'Straight Conductor & Right-Hand Thumb Rule', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 2, formula: 'Concentric Rings', description: 'Field geometry around current-carrying wires.', learning_objectives: 'Determine field direction.', status: 'mastered', mastery_percentage: 80, uncertainty: 0.16, prerequisite_gap: false },
  { id: 'c25', code: 'MAG_SOLENOID', label: 'Magnetic Field in a Solenoid', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 2, formula: 'B ∝ n · I', description: 'Uniform field inside cylindrical coils.', learning_objectives: 'Design electromagnets.', status: 'developing', mastery_percentage: 65, uncertainty: 0.22, prerequisite_gap: false },
  { id: 'c26', code: 'MAG_FORCE_FLEMING_LEFT', label: 'Force on Conductor & Fleming\'s Left-Hand Rule', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 3, formula: 'F = B · I · L', description: 'Lorentz force on current in magnetic fields.', learning_objectives: 'Predict motor force direction.', status: 'developing', mastery_percentage: 48, uncertainty: 0.32, prerequisite_gap: false },
  { id: 'c27', code: 'MAG_ELECTROMAGNETIC_INDUCTION', label: 'Electromagnetic Induction', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 3, formula: 'Induced e.m.f.', description: 'Generating current via changing magnetic flux.', learning_objectives: 'Explain electromagnetic induction.', status: 'developing', mastery_percentage: 50, uncertainty: 0.30, prerequisite_gap: false },
  { id: 'c28', code: 'MAG_DOMESTIC_CIRCUITS', label: 'Domestic Circuits & Safety Earthing', chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', level: 2, formula: '220 V, 50 Hz', description: 'Live, neutral, earth wires, fuses, and breakers.', learning_objectives: 'Explain earthing protection.', status: 'mastered', mastery_percentage: 88, uncertainty: 0.12, prerequisite_gap: false }
];

const rawEdges: ConceptGraphEdge[] = [
  { id: 'e1', source: 'LGT_REFL_LAWS', target: 'LGT_RAY_DIAGRAMS_MIRROR', strength: 1.0 },
  { id: 'e2', source: 'LGT_REFL_LAWS', target: 'LGT_SIGN_CONVENTION', strength: 1.0 },
  { id: 'e3', source: 'LGT_SIGN_CONVENTION', target: 'LGT_MIRROR_FORMULA', strength: 1.0 },
  { id: 'e4', source: 'LGT_REFR_SNELLS_LAW', target: 'LGT_REFR_INDEX', strength: 1.0 },
  { id: 'e5', source: 'LGT_REFR_SNELLS_LAW', target: 'LGT_LENS_FORMULA', strength: 1.0 },
  { id: 'e6', source: 'LGT_LENS_FORMULA', target: 'LGT_LENS_POWER', strength: 1.0 },
  { id: 'e7', source: 'EYE_STRUCTURE_ACCOMMODATION', target: 'EYE_DEFECTS_MYOPIA_HYPER', strength: 1.0 },
  { id: 'e8', source: 'LGT_LENS_POWER', target: 'EYE_DEFECTS_MYOPIA_HYPER', strength: 1.0 },
  { id: 'e9', source: 'LGT_REFR_SNELLS_LAW', target: 'EYE_PRISM_DISPERSION', strength: 1.0 },
  { id: 'e10', source: 'ELC_CHARGE_CURRENT', target: 'ELC_POTENTIAL_DIFF', strength: 1.0 },
  { id: 'e11', source: 'ELC_CHARGE_CURRENT', target: 'ELC_OHMS_LAW', strength: 1.0 },
  { id: 'e12', source: 'ELC_POTENTIAL_DIFF', target: 'ELC_OHMS_LAW', strength: 1.0 },
  { id: 'e13', source: 'ELC_OHMS_LAW', target: 'ELC_FACTORS_RESISTANCE', strength: 1.0 },
  { id: 'e14', source: 'ELC_OHMS_LAW', target: 'ELC_RESISTORS_SERIES', strength: 1.0 },
  { id: 'e15', source: 'ELC_OHMS_LAW', target: 'ELC_RESISTORS_PARALLEL', strength: 1.0 },
  { id: 'e16', source: 'ELC_OHMS_LAW', target: 'ELC_JOULE_HEATING', strength: 1.0 },
  { id: 'e17', source: 'ELC_JOULE_HEATING', target: 'ELC_ELECTRIC_POWER', strength: 1.0 },
  { id: 'e18', source: 'MAG_FIELD_LINES', target: 'MAG_RIGHT_HAND_THUMB', strength: 1.0 },
  { id: 'e19', source: 'MAG_RIGHT_HAND_THUMB', target: 'MAG_SOLENOID', strength: 1.0 },
  { id: 'e20', source: 'MAG_SOLENOID', target: 'MAG_FORCE_FLEMING_LEFT', strength: 1.0 },
  { id: 'e21', source: 'ELC_RESISTORS_PARALLEL', target: 'MAG_DOMESTIC_CIRCUITS', strength: 1.0 }
];

export const MOCK_CONCEPT_GRAPH: ConceptGraphResponse = {
  nodes: rawNodes,
  edges: rawEdges,
  total_concepts: 28,
  mastered_count: 11,
  developing_count: 11,
  weak_count: 6,
  unassessed_count: 0
};

export const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q-ohm-1',
    concept_id: 'c17',
    concept_code: 'ELC_OHMS_LAW',
    concept_name: 'Ohm\'s Law & Resistance',
    chapter_number: 11,
    chapter_title: 'Electricity',
    code: 'Q_ELC_OHM_01',
    text: 'A student measures current I through an ohmic resistor at different potential differences V at constant temperature. What happens to the resistance R of the conductor as the current increases?',
    question_type: 'mcq',
    difficulty: 'intermediate',
    options: [
      { id: 'A', text: 'Resistance increases proportionally with current' },
      { id: 'B', text: 'Resistance remains constant as it is an inherent property of the conductor' },
      { id: 'C', text: 'Resistance decreases inversely with current' },
      { id: 'D', text: 'Resistance fluctuates sinusoidally' }
    ],
    correct_answer: 'B',
    step_by_step_explanation: 'According to Ohm\'s law (V = IR), for an ohmic conductor at constant temperature, the ratio V/I is a constant called Resistance (R). Resistance depends solely on conductor length, cross-sectional area, material, and temperature. Increasing current by increasing voltage does NOT change R.',
    expected_reasoning: 'Resistance is constant of proportionality and does not change with current.',
    is_ai_generated: false
  },
  {
    id: 'q-par-1',
    concept_id: 'c20',
    concept_code: 'ELC_RESISTORS_PARALLEL',
    concept_name: 'Resistors in Parallel',
    chapter_number: 11,
    chapter_title: 'Electricity',
    code: 'Q_ELC_PAR_01',
    text: 'Two identical resistors of resistance 10 Ω each are connected in parallel to a 6 V battery. What is the equivalent resistance of the circuit?',
    question_type: 'numerical',
    difficulty: 'foundational',
    correct_answer: '5',
    step_by_step_explanation: 'For two resistors in parallel: 1/R_p = 1/R₁ + 1/R₂ = 1/10 + 1/10 = 2/10 = 1/5. Therefore, R_p = 5 Ω.',
    expected_reasoning: 'Use 1/Rp = 1/R1 + 1/R2, resulting in 5 ohms.',
    is_ai_generated: false
  },
  {
    id: 'q-snell-1',
    concept_id: 'c5',
    concept_code: 'LGT_REFR_SNELLS_LAW',
    concept_name: 'Refraction & Snell\'s Law',
    chapter_number: 9,
    chapter_title: 'Light: Reflection and Refraction',
    code: 'Q_LGT_SNELL_01',
    text: 'When a ray of light enters from air into glass obliquely, what happens to its speed and direction?',
    question_type: 'mcq',
    difficulty: 'foundational',
    options: [
      { id: 'A', text: 'Speed decreases and the ray bends towards the normal' },
      { id: 'B', text: 'Speed increases and the ray bends away from the normal' },
      { id: 'C', text: 'Speed remains constant and the ray continues undeviated' },
      { id: 'D', text: 'Speed decreases and the ray bends away from the normal' }
    ],
    correct_answer: 'A',
    step_by_step_explanation: 'Glass is optically denser than air (n_glass ≈ 1.5 > n_air ≈ 1.0). When light enters a denser medium, its speed decreases (v = c/n) and it refracts towards the normal line.',
    expected_reasoning: 'Glass is denser medium so speed drops and ray bends towards the normal.',
    is_ai_generated: false
  }
];

export const MOCK_STUDENT_DASHBOARD: StudentDashboardData = {
  student_id: 'student-aarav-gupta',
  full_name: 'Aarav Gupta',
  email: 'student@masterymind.ai',
  class_grade: 'Class 10-A',
  target_exam_date: 'March 2026',
  preferred_language: 'English',
  learning_goals: 'Score 95%+ in CBSE Class 10 Board Exam.',
  overall_mastery_percentage: 68.4,
  curriculum_coverage_percentage: 82.1,
  chapter_masteries: [
    { chapter_number: 9, chapter_code: 'CH09_LIGHT', chapter_title: 'Light: Reflection & Refraction', mastery_percentage: 67.2, concepts_count: 8, mastered_count: 3 },
    { chapter_number: 10, chapter_code: 'CH10_HUMAN_EYE', chapter_title: 'Human Eye & Colourful World', mastery_percentage: 72.5, concepts_count: 6, mastered_count: 4 },
    { chapter_number: 11, chapter_code: 'CH11_ELECTRICITY', chapter_title: 'Electricity', mastery_percentage: 58.6, concepts_count: 8, mastered_count: 1 },
    { chapter_number: 12, chapter_code: 'CH12_MAGNETISM', chapter_title: 'Magnetic Effects of Current', mastery_percentage: 75.3, concepts_count: 6, mastered_count: 3 }
  ],
  strong_concepts: [
    { concept_id: 'c15', code: 'ELC_CHARGE_CURRENT', name: 'Electric Charge & Current', chapter_title: 'Electricity', mastery_percentage: 90, uncertainty: 0.12, status: 'Mastered' },
    { concept_id: 'c28', code: 'MAG_DOMESTIC_CIRCUITS', name: 'Domestic Circuits & Safety Earthing', chapter_title: 'Magnetic Effects of Current', mastery_percentage: 88, uncertainty: 0.12, status: 'Mastered' },
    { concept_id: 'c1', code: 'LGT_REFL_LAWS', name: 'Laws of Reflection & Spherical Mirrors', chapter_title: 'Light: Reflection and Refraction', mastery_percentage: 86, uncertainty: 0.15, status: 'Mastered' }
  ],
  weak_concepts: [
    { concept_id: 'c18', code: 'ELC_FACTORS_RESISTANCE', name: 'Factors Affecting Resistance & Resistivity', chapter_title: 'Electricity', mastery_percentage: 28, uncertainty: 0.45, status: 'Needs Work' },
    { concept_id: 'c22', code: 'ELC_ELECTRIC_POWER', name: 'Electric Power & Commercial Energy', chapter_title: 'Electricity', mastery_percentage: 30, uncertainty: 0.40, status: 'Needs Work' },
    { concept_id: 'c17', code: 'ELC_OHMS_LAW', name: 'Ohm\'s Law & Resistance', chapter_title: 'Electricity', mastery_percentage: 32, uncertainty: 0.42, status: 'Needs Work' }
  ],
  insufficient_evidence_concepts: [],
  accuracy_by_difficulty: {
    foundational: 85.0,
    intermediate: 71.4,
    advanced: 54.2
  },
  daily_study_plan: [
    {
      task_type: 'practice',
      title: 'Remediate Ohm\'s Law Proportionality',
      concept_code: 'ELC_OHMS_LAW',
      concept_name: 'Ohm\'s Law & Resistance',
      rationale: 'Recent written explanations reveal active confusion between resistance and current.',
      estimated_minutes: 8
    },
    {
      task_type: 'revision',
      title: 'SM-2 Review: Cartesian Sign Convention',
      concept_code: 'LGT_SIGN_CONVENTION',
      concept_name: 'New Cartesian Sign Convention',
      rationale: 'Scheduled spaced-repetition card due today (interval: 3 days).',
      estimated_minutes: 5
    }
  ],
  due_revisions_count: 2,
  upcoming_revisions_count: 4,
  total_questions_answered: 24,
  total_correct_answers: 18,
  active_misconceptions_count: 1
};

export const MOCK_HISTORY: MasteryEventHistoryItem[] = [
  {
    id: 'h-1',
    concept_code: 'ELC_OHMS_LAW',
    concept_name: 'Ohm\'s Law & Resistance',
    chapter_title: 'Electricity',
    previous_mastery: 0.20,
    new_mastery: 0.32,
    delta: 0.12,
    confidence_level: 'confident',
    reason_explanation: 'Correct answer, but written reasoning demonstrated misconception regarding resistance scaling with current. Mastery gain discounted by 50%.',
    created_at: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: 'h-2',
    concept_code: 'LGT_LENS_POWER',
    concept_name: 'Power of a Lens & Combinations',
    chapter_title: 'Light: Reflection and Refraction',
    previous_mastery: 0.60,
    new_mastery: 0.80,
    delta: 0.20,
    confidence_level: 'confident',
    reason_explanation: 'Sound numerical answer with correct unit conversion (cm to m). Mastery estimate reinforced.',
    created_at: new Date(Date.now() - 7200000).toISOString()
  }
];

export const MOCK_REVISIONS: RevisionScheduleItem[] = [
  {
    id: 'rev-1',
    concept_id: 'c3',
    concept_code: 'LGT_SIGN_CONVENTION',
    concept_name: 'New Cartesian Sign Convention',
    chapter_title: 'Light: Reflection and Refraction',
    interval_days: 1,
    ease_factor: 2.1,
    repetition_count: 2,
    next_due_date: new Date().toISOString(),
    status: 'due',
    formula: 'u < 0 (left of mirror/lens), f_concave < 0',
    key_concept_summary: 'All distances are measured from the Pole (or Optical Centre). Distances in direction of incident ray are positive.'
  },
  {
    id: 'rev-2',
    concept_id: 'c20',
    concept_code: 'ELC_RESISTORS_PARALLEL',
    concept_name: 'Resistors in Parallel',
    chapter_title: 'Electricity',
    interval_days: 1,
    ease_factor: 2.3,
    repetition_count: 1,
    next_due_date: new Date().toISOString(),
    status: 'due',
    formula: '1/R_p = 1/R₁ + 1/R₂ + ...',
    key_concept_summary: 'In parallel circuits, potential difference across each branch is identical. Equivalent resistance is smaller than any individual resistor.'
  }
];

export const MOCK_TEACHER_CLASSES = [
  {
    id: 'class-10-a',
    name: 'Class 10-A Physics',
    section: 'A',
    academic_year: '2025-2026',
    join_code: 'PHY10A',
    student_count: 9
  }
];

export const MOCK_CLASS_OVERVIEW: TeacherClassOverview = {
  class_id: 'class-10-a',
  class_name: 'Class 10-A Physics',
  section: 'A',
  academic_year: '2025-2026',
  join_code: 'PHY10A',
  total_students: 9,
  average_mastery: 56.4,
  completed_assessments: 38,
  active_misconceptions_count: 4,
  at_risk_count: 3,
  at_risk_students: [
    {
      student_id: 'p-1',
      name: 'Priya Patel',
      email: 'priya.patel@student.ai',
      average_mastery: 38.0,
      active_misconceptions: 2,
      recommended_action: 'Targeted Cartesian sign convention ray diagram worksheet.'
    },
    {
      student_id: 'a-1',
      name: 'Ananya Iyer',
      email: 'ananya.iyer@student.ai',
      average_mastery: 54.0,
      active_misconceptions: 1,
      recommended_action: 'Current vs Potential Difference hydraulic analogy demonstration.'
    }
  ]
};

export const MOCK_CLASS_HEATMAP: HeatmapItem[] = MOCK_CONCEPT_GRAPH.nodes.map((n) => ({
  chapter_number: n.chapter_number,
  chapter_code: n.chapter_code,
  chapter_title: n.chapter_title,
  concept_id: n.id,
  concept_code: n.code,
  concept_name: n.label,
  foundational_level: n.level,
  formula: n.formula,
  average_mastery: n.mastery_percentage,
  distribution: {
    mastered: n.mastery_percentage >= 75 ? 5 : 2,
    developing: n.mastery_percentage < 75 && n.mastery_percentage >= 40 ? 5 : 3,
    weak: n.mastery_percentage < 40 ? 4 : 1,
    unassessed: 0
  }
}));

export const MOCK_MISCONCEPTIONS: MisconceptionFrequencyItem[] = [
  {
    misconception_id: 'misc-1',
    code: 'MISC_OHM_R_I_CONFUSION',
    title: 'Belief that Resistance Changes with Current in an Ohmic Conductor',
    concept_name: 'Ohm\'s Law & Resistance',
    total_occurrences: 6,
    unique_students_affected: 3,
    percentage_class: 33.3,
    remediation_guide: 'Clarify that R is a geometric and material property (width of the pipe), not dependent on how much current is pumped through.',
    incorrect_belief: 'Believing that if current increases, resistance must increase proportionally.'
  },
  {
    misconception_id: 'misc-2',
    code: 'MISC_SIGN_CONV_MIRROR_LENS',
    title: 'Inverting Cartesian Sign Conventions in Spherical Optics',
    concept_name: 'New Cartesian Sign Convention',
    total_occurrences: 5,
    unique_students_affected: 2,
    percentage_class: 22.2,
    remediation_guide: 'Reinforce that incident light defines the positive direction; object distance u is always negative.',
    incorrect_belief: 'Assigning positive signs to concave mirror focal lengths or object distances.'
  }
];

export const MOCK_INTERVENTIONS: InterventionItem[] = [
  {
    priority: 'HIGH',
    title: 'Pedagogical Alert: Ohm\'s Law Resistance Constancy',
    affected_concept: 'Ohm\'s Law & Resistance',
    students_affected_count: 3,
    class_percentage: 33.3,
    observed_evidence: '33% of students write explanations claiming resistance increases when current increases in an ohmic conductor.',
    recommended_action: 'Demonstrate with a standard water pipe analogy that pipe diameter does not expand when water pressure is raised.',
    recommended_activity: '10-minute classroom interactive circuit simulator demonstration.'
  }
];
