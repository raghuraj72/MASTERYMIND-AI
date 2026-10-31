# CBSE Class 10 Science - Physics Curriculum Seed
# Chapters, 28 Concepts, and Prerequisite Dependencies

CHAPTERS_DATA = [
    {
        "chapter_number": 9,
        "code": "CH09_LIGHT",
        "title": "Light: Reflection and Refraction",
        "description": "Exploration of light behavior, spherical mirrors, laws of reflection and refraction, lenses, and optical power."
    },
    {
        "chapter_number": 10,
        "code": "CH10_HUMAN_EYE",
        "title": "The Human Eye and the Colourful World",
        "description": "Structure and defects of human vision, prism dispersion, atmospheric refraction, and scattering of light."
    },
    {
        "chapter_number": 11,
        "code": "CH11_ELECTRICITY",
        "title": "Electricity",
        "description": "Electric charge, current, potential difference, Ohm's law, resistance combinations, heating effect, and electric power."
    },
    {
        "chapter_number": 12,
        "code": "CH12_MAGNETISM",
        "title": "Magnetic Effects of Electric Current",
        "description": "Magnetic fields, field lines, Oersted's experiment, solenoid, Fleming's Left-Hand Rule, and electromagnetic induction."
    }
]

CONCEPTS_DATA = [
    # --- Chapter 9: Light (8 concepts) ---
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_REFL_LAWS",
        "name": "Laws of Reflection & Spherical Mirrors",
        "order_index": 1,
        "foundational_level": 1,
        "formula": "i = r",
        "description": "Understanding incident ray, reflected ray, normal at point of incidence, concave and convex mirrors.",
        "learning_objectives": "State laws of reflection and identify focus, pole, radius of curvature, and principal axis of spherical mirrors."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_RAY_DIAGRAMS_MIRROR",
        "name": "Ray Diagrams & Image Formation in Mirrors",
        "order_index": 2,
        "foundational_level": 2,
        "formula": "R = 2f",
        "description": "Construction of ray diagrams for concave and convex mirrors across various object positions.",
        "learning_objectives": "Predict image position, nature (real/virtual, inverted/erect), and magnification for concave and convex mirrors."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_SIGN_CONVENTION",
        "name": "New Cartesian Sign Convention",
        "order_index": 3,
        "foundational_level": 2,
        "formula": "u < 0, f_concave < 0, f_convex > 0",
        "description": "Coordinate conventions for object distance (u), image distance (v), focal length (f), and heights.",
        "learning_objectives": "Correctly assign positive and negative signs to distances and heights in optical formulas."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_MIRROR_FORMULA",
        "name": "Mirror Formula & Linear Magnification",
        "order_index": 4,
        "foundational_level": 3,
        "formula": "1/v + 1/u = 1/f; m = -v/u = h'/h",
        "description": "Quantitative calculation of image distance, object distance, focal length, and magnification for mirrors.",
        "learning_objectives": "Solve numerical problems using the mirror equation and interpret the sign of magnification."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_REFR_LAWS",
        "name": "Refraction of Light & Snell's Law",
        "order_index": 5,
        "foundational_level": 1,
        "formula": "sin(i)/sin(r) = constant",
        "description": "Change in direction of light when traveling from one optical medium to another, Snell's law.",
        "learning_objectives": "State laws of refraction and apply Snell's law to boundary transitions."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_REFR_INDEX",
        "name": "Absolute & Relative Refractive Index",
        "order_index": 6,
        "foundational_level": 2,
        "formula": "n = c/v; n21 = v1/v2 = n2/n1",
        "description": "Speed of light in optical media, optical density vs mass density, and relative refractive index.",
        "learning_objectives": "Calculate refractive index and relate higher refractive index to lower speed of light."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_LENS_FORMULA",
        "name": "Lens Formula & Lens Magnification",
        "order_index": 7,
        "foundational_level": 3,
        "formula": "1/v - 1/u = 1/f; m = v/u = h'/h",
        "description": "Image formation by convex and concave lenses, lens formula and magnification.",
        "learning_objectives": "Solve numerical problems for thin spherical lenses and distinguish from mirror formula."
    },
    {
        "chapter_code": "CH09_LIGHT",
        "code": "LGT_POWER_LENS",
        "name": "Power of a Lens & Combination of Lenses",
        "order_index": 8,
        "foundational_level": 2,
        "formula": "P = 1/f (m); P_net = P1 + P2",
        "description": "Degree of convergence or divergence of light rays, dioptre unit, combination of thin lenses.",
        "learning_objectives": "Compute optical power in dioptres and calculate equivalent power of thin lens systems."
    },

    # --- Chapter 10: Human Eye and Colourful World (6 concepts) ---
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_ANATOMY_ACCOMMODATION",
        "name": "Eye Structure & Power of Accommodation",
        "order_index": 1,
        "foundational_level": 1,
        "formula": "Near point = 25 cm, Far point = infinity",
        "description": "Role of cornea, iris, pupil, crystalline lens, ciliary muscles, and retina in visual focusing.",
        "learning_objectives": "Explain accommodation mechanism and define standard near and far points of normal vision."
    },
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_DEFECTS_MYOPIA",
        "name": "Myopia (Nearsightedness) & Correction",
        "order_index": 2,
        "foundational_level": 2,
        "formula": "P_lens = -1/d_far",
        "description": "Inability to focus distant objects, elongated eyeball or excessive curvature, concave lens correction.",
        "learning_objectives": "Identify causes of myopia, draw ray diagrams of defective and corrected eye, and find lens power."
    },
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_DEFECTS_HYPERMETROPIA",
        "name": "Hypermetropia & Presbyopia",
        "order_index": 3,
        "foundational_level": 2,
        "formula": "1/f = 1/v - 1/u (correction)",
        "description": "Farsightedness, image formed behind retina, short eyeball or long focal length, convex lens correction.",
        "learning_objectives": "Differentiate hypermetropia and presbyopia and calculate required convex lens power."
    },
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_PRISM_DISPERSION",
        "name": "Refraction through Prism & Dispersion",
        "order_index": 4,
        "foundational_level": 2,
        "formula": "VIBGYOR (Red bends least, Violet most)",
        "description": "Splitting of white light into spectrum of colors due to wavelength-dependent refractive indices.",
        "learning_objectives": "Explain rainbow formation (refraction, dispersion, internal reflection, refraction) and prism spectrum."
    },
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_ATM_REFRACTION",
        "name": "Atmospheric Refraction Phenomena",
        "order_index": 5,
        "foundational_level": 2,
        "formula": "Apparent position shift, 2 min advance/delay",
        "description": "Continuous refraction of light through varying density air layers in Earth's atmosphere.",
        "learning_objectives": "Explain twinkling of stars, advanced sunrise, and delayed sunset using refractive gradient."
    },
    {
        "chapter_code": "CH10_HUMAN_EYE",
        "code": "EYE_SCATTERING_TYNDALL",
        "name": "Tyndall Effect & Scattering of Light",
        "order_index": 6,
        "foundational_level": 1,
        "formula": "Scattering intensity ∝ 1/λ^4 (Rayleigh)",
        "description": "Interaction of light with colloidal particles, clear blue sky, reddish appearance of sun at sunrise/sunset.",
        "learning_objectives": "Relate particle size and wavelength to light scattering and explain atmospheric colors."
    },

    # --- Chapter 11: Electricity (8 concepts) ---
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_CHARGE_CURRENT",
        "name": "Electric Charge & Electric Current",
        "order_index": 1,
        "foundational_level": 1,
        "formula": "Q = n*e; I = Q/t",
        "description": "Quantization of charge, definition of current in Amperes, direction of conventional vs electron current.",
        "learning_objectives": "Define 1 Coulomb and 1 Ampere, convert electron count to charge, and calculate current."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_POTENTIAL_DIFF",
        "name": "Electric Potential Difference & Voltage",
        "order_index": 2,
        "foundational_level": 1,
        "formula": "V = W/Q",
        "description": "Work done per unit charge moving between two points in an electrostatic field, Volt unit.",
        "learning_objectives": "Define 1 Volt and explain how a cell maintains potential difference across a conductor."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_OHMS_LAW",
        "name": "Ohm's Law & Resistance",
        "order_index": 3,
        "foundational_level": 2,
        "formula": "V = I*R; R = V/I",
        "description": "Linear proportionality between potential difference and current at constant temperature, Ohm unit.",
        "learning_objectives": "Verify Ohm's law with V-I graphs, define resistance as opposition to flow, and interpret V-I slope."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_RESISTIVITY",
        "name": "Factors Affecting Resistance & Resistivity",
        "order_index": 4,
        "foundational_level": 2,
        "formula": "R = ρ*(l/A)",
        "description": "Dependence of resistance on conductor length, cross-sectional area, material nature, and temperature.",
        "learning_objectives": "Distinguish between resistance (shape-dependent) and resistivity (material property), unit Ohm-meter."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_SERIES_CIRCUIT",
        "name": "Resistors in Series Combination",
        "order_index": 5,
        "foundational_level": 2,
        "formula": "R_eq = R1 + R2 + R3; I_same, V_split",
        "description": "Current remains identical throughout single branch, total voltage divides proportionally.",
        "learning_objectives": "Derive series equivalent resistance, calculate current and voltage drops across each resistor."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_PARALLEL_CIRCUIT",
        "name": "Resistors in Parallel Combination",
        "order_index": 6,
        "foundational_level": 3,
        "formula": "1/R_eq = 1/R1 + 1/R2; V_same, I_split",
        "description": "Voltage is identical across all branches, total current equals sum of branch currents.",
        "learning_objectives": "Calculate parallel equivalent resistance, branch currents, and explain advantages in household circuits."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_HEATING_JOULES",
        "name": "Heating Effect of Electric Current & Joule's Law",
        "order_index": 7,
        "foundational_level": 2,
        "formula": "H = I^2*R*t = V*I*t = (V^2/R)*t",
        "description": "Conversion of electrical energy into thermal energy in resistive elements, practical applications.",
        "learning_objectives": "State Joule's law of heating and apply formulas to heaters, electric irons, and fuses."
    },
    {
        "chapter_code": "CH11_ELECTRICITY",
        "code": "ELC_POWER_ENERGY",
        "name": "Electric Power & Commercial Energy Units",
        "order_index": 8,
        "foundational_level": 3,
        "formula": "P = V*I = I^2*R = V^2/R; 1 kWh = 3.6x10^6 J",
        "description": "Rate at which electric energy is dissipated, Watt unit, commercial unit of energy (kWh or 'Unit').",
        "learning_objectives": "Calculate electrical power ratings and compute household electricity consumption and bills."
    },

    # --- Chapter 12: Magnetic Effects (6 concepts) ---
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_FIELD_LINES",
        "name": "Magnetic Field & Properties of Field Lines",
        "order_index": 1,
        "foundational_level": 1,
        "formula": "B-vector direction (North to South outside)",
        "description": "Vector nature of magnetic field, compass deflection, closed continuous curves, never intersect.",
        "learning_objectives": "Draw magnetic field lines around bar magnet and explain why two field lines never cross."
    },
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_CURRENT_CONDUCTOR",
        "name": "Magnetic Field due to Straight Conductor & Loop",
        "order_index": 2,
        "foundational_level": 2,
        "formula": "Right-Hand Thumb Rule; B ∝ I, B ∝ 1/r",
        "description": "Concentric magnetic field lines around straight wire, circular loop field summation at center.",
        "learning_objectives": "Apply Right-Hand Thumb Rule to determine direction of magnetic field for wires and loops."
    },
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_SOLENOID_ELECTROMAGNET",
        "name": "Solenoid & Permanent vs Electromagnet",
        "order_index": 3,
        "foundational_level": 2,
        "formula": "B_inside is uniform; B ∝ n*I",
        "description": "Helical coil producing uniform field inside, soft iron core electromagnet construction.",
        "learning_objectives": "Describe uniform magnetic field in a solenoid and distinguish electromagnets from permanent magnets."
    },
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_FORCE_FLEMING_LEFT",
        "name": "Force on Current Conductor & Fleming's Left-Hand Rule",
        "order_index": 4,
        "foundational_level": 3,
        "formula": "F = B*I*L*sin(θ); Thumb=Force, Forefinger=Field, Center=Current",
        "description": "Mechanical force experienced by current-carrying wire in magnetic field, motor principle.",
        "learning_objectives": "Predict direction of magnetic force using Fleming's Left-Hand Rule and determine maximum force conditions."
    },
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_ELECTROMAGNETIC_INDUCTION",
        "name": "Electromagnetic Induction & Fleming's Right-Hand Rule",
        "order_index": 5,
        "foundational_level": 3,
        "formula": "Induced current from changing magnetic flux",
        "description": "Faraday's discovery: relative motion of coil and magnet produces induced current in circuit.",
        "learning_objectives": "State conditions for inducing current and apply Fleming's Right-Hand Rule for induced current direction."
    },
    {
        "chapter_code": "CH12_MAGNETISM",
        "code": "MAG_DOMESTIC_CIRCUITS",
        "name": "Domestic Electric Circuits & Safety Devices",
        "order_index": 6,
        "foundational_level": 1,
        "formula": "220 V AC, Live, Neutral, Earth wire; Fuse rating",
        "description": "Three-wire domestic supply, earthing of metallic appliances, short circuits, overloading, and safety fuses.",
        "learning_objectives": "Explain function of earth wire, role of fuse in breaking excessive currents, and circuit overload causes."
    }
]

# Prerequisite dependencies (prerequisite_code -> dependent_code, strength)
PREREQUISITES_DATA = [
    # Light prerequisites
    ("LGT_REFL_LAWS", "LGT_RAY_DIAGRAMS_MIRROR", 1.0),
    ("LGT_REFL_LAWS", "LGT_SIGN_CONVENTION", 0.9),
    ("LGT_SIGN_CONVENTION", "LGT_MIRROR_FORMULA", 1.0),
    ("LGT_RAY_DIAGRAMS_MIRROR", "LGT_MIRROR_FORMULA", 0.8),
    ("LGT_REFR_LAWS", "LGT_REFR_INDEX", 1.0),
    ("LGT_REFR_LAWS", "LGT_LENS_FORMULA", 0.9),
    ("LGT_SIGN_CONVENTION", "LGT_LENS_FORMULA", 1.0),
    ("LGT_LENS_FORMULA", "LGT_POWER_LENS", 0.9),

    # Human eye prerequisites
    ("LGT_RAY_DIAGRAMS_MIRROR", "EYE_ANATOMY_ACCOMMODATION", 0.6),
    ("LGT_LENS_FORMULA", "EYE_DEFECTS_MYOPIA", 0.9),
    ("LGT_POWER_LENS", "EYE_DEFECTS_MYOPIA", 0.9),
    ("LGT_LENS_FORMULA", "EYE_DEFECTS_HYPERMETROPIA", 0.9),
    ("LGT_POWER_LENS", "EYE_DEFECTS_HYPERMETROPIA", 0.9),
    ("LGT_REFR_LAWS", "EYE_PRISM_DISPERSION", 0.8),
    ("LGT_REFR_INDEX", "EYE_PRISM_DISPERSION", 0.7),
    ("LGT_REFR_LAWS", "EYE_ATM_REFRACTION", 0.8),
    ("LGT_REFR_INDEX", "EYE_ATM_REFRACTION", 0.8),

    # Electricity prerequisites
    ("ELC_CHARGE_CURRENT", "ELC_POTENTIAL_DIFF", 0.8),
    ("ELC_CHARGE_CURRENT", "ELC_OHMS_LAW", 1.0),
    ("ELC_POTENTIAL_DIFF", "ELC_OHMS_LAW", 1.0),
    ("ELC_OHMS_LAW", "ELC_RESISTIVITY", 0.8),
    ("ELC_OHMS_LAW", "ELC_SERIES_CIRCUIT", 1.0),
    ("ELC_OHMS_LAW", "ELC_PARALLEL_CIRCUIT", 1.0),
    ("ELC_SERIES_CIRCUIT", "ELC_PARALLEL_CIRCUIT", 0.7),
    ("ELC_OHMS_LAW", "ELC_HEATING_JOULES", 0.9),
    ("ELC_POTENTIAL_DIFF", "ELC_HEATING_JOULES", 0.8),
    ("ELC_OHMS_LAW", "ELC_POWER_ENERGY", 0.9),
    ("ELC_HEATING_JOULES", "ELC_POWER_ENERGY", 0.9),

    # Magnetism prerequisites
    ("ELC_CHARGE_CURRENT", "MAG_CURRENT_CONDUCTOR", 0.9),
    ("MAG_FIELD_LINES", "MAG_CURRENT_CONDUCTOR", 0.8),
    ("MAG_CURRENT_CONDUCTOR", "MAG_SOLENOID_ELECTROMAGNET", 0.9),
    ("MAG_CURRENT_CONDUCTOR", "MAG_FORCE_FLEMING_LEFT", 1.0),
    ("MAG_FIELD_LINES", "MAG_FORCE_FLEMING_LEFT", 0.9),
    ("MAG_FORCE_FLEMING_LEFT", "MAG_ELECTROMAGNETIC_INDUCTION", 0.8),
    ("ELC_SERIES_CIRCUIT", "MAG_DOMESTIC_CIRCUITS", 0.7),
    ("ELC_PARALLEL_CIRCUIT", "MAG_DOMESTIC_CIRCUITS", 0.9),
    ("ELC_POWER_ENERGY", "MAG_DOMESTIC_CIRCUITS", 0.8),
]
