# CBSE Class 10 Physics Misconception Library
# Pedagogically verified misconceptions with symptom patterns, evidence detection triggers, and remediations

MISCONCEPTIONS_DATA = [
    {
        "code": "MISC_OHM_R_I_CONFUSION",
        "concept_code": "ELC_OHMS_LAW",
        "title": "Belief that Resistance Changes with Current/Voltage in an Ohmic Conductor",
        "incorrect_belief": "Believing that resistance R depends dynamically on current I or voltage V (e.g. 'resistance increases when current increases, even at constant voltage').",
        "symptom_patterns": [
            r"resistance (?:must |will )?increase[s]? (?:when|as|if) current increase[s]?",
            r"current increase[s]?,? (?:so |the )?resistance (?:must |will )?increase[s]?",
            r"resistance increases.*current increases",
            r"current increases.*resistance.*increase",
            r"R depends on current",
            r"higher current means higher resistance",
            r"resistance changes with voltage",
            r"more voltage makes resistance bigger"
        ],
        "example_student_reasoning": "Since R = V/I, if current increases, the resistance must increase to balance it, even though voltage is constant.",
        "correct_explanation": "For an ohmic conductor at constant temperature, resistance R is an intrinsic physical constant determined solely by length, cross-sectional area, and resistivity (R = ρ*l/A). Current I changes in direct proportion to voltage V, while R remains constant.",
        "remediation_text": "Remember: In Ohm's law (V = IR), resistance R is the constant of proportionality! Think of resistance like the width of a pipe: pumping more water through it doesn't change how wide the pipe is. Resistance only changes if you change the conductor's length, thickness, material, or temperature."
    },
    {
        "code": "MISC_CURRENT_VOLTAGE_CONFUSION",
        "concept_code": "ELC_POTENTIAL_DIFF",
        "title": "Confusing Electric Current (Flow Rate) with Potential Difference (Electrical Push)",
        "incorrect_belief": "Treating voltage and current as the same entity or believing voltage flows through a circuit.",
        "symptom_patterns": [
            r"voltage flows through",
            r"volts are moving",
            r"current pushes the voltage",
            r"voltage and current are the same",
            r"battery supplies current not voltage"
        ],
        "example_student_reasoning": "The 12V battery sends 12 volts of current through the wire to power the bulb.",
        "correct_explanation": "Current (measured in Amperes) is the rate of flow of electric charge (I = Q/t). Potential difference / Voltage (measured in Volts) is the work done per unit charge (V = W/Q) that provides the electrical push across two points. Voltage exists ACROSS two points; current flows THROUGH a component.",
        "remediation_text": "Visualize a water system: Potential difference (Voltage) is the water pressure created by a pump or water tower. Electric current is the actual flow rate of water (litres per second) flowing through the pipes. Voltage causes current to flow, but voltage itself never 'flows'!"
    },
    {
        "code": "MISC_SERIES_CURRENT_CONSUMPTION",
        "concept_code": "ELC_SERIES_CIRCUIT",
        "title": "Current is 'Consumed' or Weakens Along a Series Circuit",
        "incorrect_belief": "Believing that the first resistor or bulb 'uses up' current, leaving less current for subsequent components in series.",
        "symptom_patterns": [
            r"current is (used up|consumed)",
            r"less current reaches the second (resistor|bulb)",
            r"first bulb gets more current",
            r"current decreases along the wire",
            r"current drops after each resistor"
        ],
        "example_student_reasoning": "The first bulb is brighter because it takes most of the current, so the second bulb in series gets whatever current is left over.",
        "correct_explanation": "Charge is strictly conserved! In a single unbranched series loop, there is only one pathway for charge. Every Coulomb of charge that leaves the positive terminal must pass through every component consecutively. The current I is identical at every single point in a series circuit.",
        "remediation_text": "Think of a bicycle chain: when you pedal, every link moves at exactly the same speed at the same time. Resistors don't eat or destroy electrons; they simply slow down the overall rate of flow throughout the entire loop simultaneously."
    },
    {
        "code": "MISC_PARALLEL_RESISTANCE_SUM",
        "concept_code": "ELC_PARALLEL_CIRCUIT",
        "title": "Direct Addition of Resistors in Parallel Combinations",
        "incorrect_belief": "Adding parallel resistances directly (R_eq = R1 + R2) or believing adding parallel branches increases total resistance.",
        "symptom_patterns": [
            r"parallel resistance is (R1\s*\+\s*R2|sum of resistances)",
            r"adding more resistors in parallel increases resistance",
            r"total resistance is larger than individual",
            r"1/R formula not inverted",
            r"Req = 1/R1 \+ 1/R2 without inverting"
        ],
        "example_student_reasoning": "Two 6 ohm resistors connected in parallel give 12 ohms because 6 + 6 = 12.",
        "correct_explanation": "In a parallel combination, adding branches provides additional alternate pathways for current to flow, which REDUCES overall resistance. The reciprocal formula is 1/R_eq = 1/R1 + 1/R2, and R_eq is always smaller than the smallest individual resistance.",
        "remediation_text": "Analogous to toll booths on a highway: opening a second toll booth parallel to the first makes traffic flow EASIER, not harder! Two 6Ω resistors in parallel give: 1/R_eq = 1/6 + 1/6 = 2/6 = 1/3, so R_eq = 3Ω. Always remember to take the reciprocal at the final step!"
    },
    {
        "code": "MISC_POWER_ENERGY_UNITS",
        "concept_code": "ELC_POWER_ENERGY",
        "title": "Confusing Electrical Power (Watts) with Electrical Energy (Joules or kWh)",
        "incorrect_belief": "Treating power rating as the total energy consumed without multiplying by time, or confusing Watts with Watt-hours.",
        "symptom_patterns": [
            r"power and energy are the same",
            r"energy consumed = power (without time)",
            r"bulb consumed 100 Joules per day because it is 100W",
            r"kWh is a unit of power",
            r"1 unit of electricity = 1000 watts"
        ],
        "example_student_reasoning": "A 100W bulb uses 100 Joules of energy in 5 hours because its power is 100W.",
        "correct_explanation": "Power is the RATE of energy consumption (P = Energy / time, in Watts = Joules/second). Electrical energy is the total work done (E = P * t). The commercial unit 1 kilowatt-hour (kWh or 1 'Unit') represents 1000 Watts operating continuously for 3600 seconds, equal to 3.6 × 10^6 Joules.",
        "remediation_text": "Power is your speed (km/h); Energy is the total distance traveled (km). To find total electrical energy used, you must multiply Power (in kW) by Time (in hours): Energy (kWh) = Power (kW) × Time (h)."
    },
    {
        "code": "MISC_SIGN_CONVENTION_MIRROR",
        "concept_code": "LGT_SIGN_CONVENTION",
        "title": "Inverting Signs in New Cartesian Convention for Optical Distances",
        "incorrect_belief": "Treating object distance as positive or assuming concave mirror/lens focal length is positive.",
        "symptom_patterns": [
            r"u is positive",
            r"object distance is \+[\d\.]+",
            r"concave mirror focal length is positive",
            r"convex mirror focal length is negative",
            r"focal length is positive for concave"
        ],
        "example_student_reasoning": "Since the object is placed 20 cm in front of the concave mirror, u = +20 cm and f = +15 cm.",
        "correct_explanation": "In the New Cartesian Sign Convention, the pole/optical centre is the origin (0,0). Since incident light travels from left to right, all distances measured to the left of the pole are NEGATIVE. Therefore, object distance u is always negative (u < 0). For a concave mirror, the focus lies in front (to the left), so f is negative. For a convex mirror, focus lies behind (to the right), so f is positive.",
        "remediation_text": "Golden Rule for Signs: Treat the mirror pole as the origin (0,0) of a math coordinate plane. Left is NEGATIVE (-x), Right is POSITIVE (+x). Since objects are always kept on the left, u is ALWAYS negative! Concave cave faces left → f is negative. Convex bulges out → f is positive."
    },
    {
        "code": "MISC_REAL_VIRTUAL_CONFUSION",
        "concept_code": "LGT_RAY_DIAGRAMS_MIRROR",
        "title": "Confusing Real vs Virtual Images and Screen Projections",
        "incorrect_belief": "Believing virtual images can be captured on a screen or confusing inverted/erect image characteristics.",
        "symptom_patterns": [
            r"virtual image can be (formed|captured|projected) on a screen",
            r"real images are erect",
            r"virtual images are inverted",
            r"convex mirror gives real image",
            r"plane mirror makes a real image"
        ],
        "example_student_reasoning": "A virtual image is formed behind the mirror so we can place a screen behind the mirror to catch it.",
        "correct_explanation": "A real image is formed by the ACTUAL intersection of reflected or refracted light rays; it is inverted and CAN be captured on a physical screen. A virtual image is formed where diverging rays only APPEAR to meet when produced backward; it is erect and CANNOT be captured on a screen.",
        "remediation_text": "Real = Rays really meet = Inverted = Screen needed (like a cinema projector). Virtual = Rays only appear to meet = Erect = Seen in mirror, but placing paper behind the mirror catches nothing!"
    },
    {
        "code": "MISC_REFRACTIVE_INDEX_INVERSION",
        "concept_code": "LGT_REFR_INDEX",
        "title": "Inverting Relative Refractive Index or Speed of Light Relation",
        "incorrect_belief": "Believing light travels faster in optically denser media or confusing n21 = n2/n1 = v1/v2 with v2/v1.",
        "symptom_patterns": [
            r"light travels faster in (denser|glass|water)",
            r"higher refractive index means higher speed",
            r"n21 = v2/v1",
            r"optical density is mass density",
            r"denser medium bends away from normal"
        ],
        "example_student_reasoning": "Since diamond has a higher refractive index (2.42), light moves much faster in diamond than in water.",
        "correct_explanation": "Refractive index n = c/v is inversely proportional to the speed of light v in that medium. A higher refractive index means light travels SLOWER (optically denser). When light enters a denser medium from a rarer medium, it slows down and bends TOWARDS the normal.",
        "remediation_text": "Remember: High refractive index = Heavy optical traffic = Light slows down! n = c/v. Since diamond has n=2.42, light speed drops to c/2.42. The relative refractive index n21 = Speed in medium 1 / Speed in medium 2 = v1/v2."
    },
    {
        "code": "MISC_LENS_POWER_UNITS",
        "concept_code": "LGT_POWER_LENS",
        "title": "Calculating Lens Power Without Converting Focal Length to Metres",
        "incorrect_belief": "Calculating Power directly as P = 1/f when f is in centimetres, or confusing convex (positive) and concave (negative) powers.",
        "symptom_patterns": [
            r"P = 1/20 = 0\.05 D",
            r"forgot to convert cm to m for power",
            r"concave lens has positive power",
            r"convex lens has negative power",
            r"P = 1/f without converting cm"
        ],
        "example_student_reasoning": "Focal length is 25 cm, so Power P = 1/25 = 0.04 Dioptres.",
        "correct_explanation": "By definition, 1 Dioptre = 1 m^(-1). Optical power P = 1 / f(in metres). If focal length is in centimetres, P = 100 / f(in cm). Furthermore, convex lenses are converging (positive focal length → positive power); concave lenses are diverging (negative focal length → negative power).",
        "remediation_text": "Watch the units! Dioptres requires METRES. If f = +25 cm = +0.25 m, then P = 1 / 0.25 = +4 D (or P = 100/25 = +4 D). Positive power means convex; negative power means concave."
    },
    {
        "code": "MISC_ATM_SCATTERING_REFRACTION",
        "concept_code": "EYE_ATM_REFRACTION",
        "title": "Confusing Atmospheric Refraction with Light Scattering",
        "incorrect_belief": "Attributing star twinkling or advanced sunrise to Rayleigh scattering, or blue sky to refraction.",
        "symptom_patterns": [
            r"stars twinkle due to scattering",
            r"twinkling is caused by dispersion",
            r"blue sky is caused by refraction",
            r"advanced sunrise is due to scattering",
            r"rainbow is caused by atmospheric refraction alone"
        ],
        "example_student_reasoning": "Stars twinkle because blue light is scattered away by air particles continuously.",
        "correct_explanation": "Twinkling of stars and advanced sunrise/delayed sunset are caused by ATMOSPHERIC REFRACTION through air layers of fluctuating temperature and optical density. The blue color of the sky and red sunset are caused by SCATTERING of light by microscopic gas molecules (Rayleigh scattering: scattering intensity ∝ 1/λ^4).",
        "remediation_text": "Quick distinction guide: If light BENDS through atmospheric layers of changing density → Refraction (Twinkling, Apparent position of stars, 2 min early sunrise). If light is BOUNCED in all directions by tiny molecules/dust → Scattering (Blue sky, Red sunrise, Tyndall effect)."
    },
    {
        "code": "MISC_MAGNETIC_FIELD_DIRECTION",
        "concept_code": "MAG_FIELD_LINES",
        "title": "Confusing Direction of Magnetic Field Lines Inside vs Outside a Magnet",
        "incorrect_belief": "Believing magnetic field lines start at South and end at North everywhere, or that field lines have loose ends.",
        "symptom_patterns": [
            r"field lines go from south to north outside",
            r"field lines start at north and stop at south",
            r"field lines are open curves",
            r"field lines can cross each other",
            r"magnetic field is zero inside a magnet"
        ],
        "example_student_reasoning": "Magnetic field lines originate from North and terminate at South, so inside the magnet they also go North to South.",
        "correct_explanation": "Magnetic field lines are continuous CLOSED loops! OUTSIDE the magnet, they emerge from the North pole and enter the South pole. INSIDE the magnet, they continue from the South pole to the North pole to complete the closed loop. They never intersect because that would imply two distinct field directions at one point.",
        "remediation_text": "Visualize a racetrack: Magnetic field lines are closed loops with no beginning or end! Outside the bar magnet: North → South. Inside the bar magnet: South → North. This completes the loop!"
    },
    {
        "code": "MISC_FLEMING_RULES_SWAP",
        "concept_code": "MAG_FORCE_FLEMING_LEFT",
        "title": "Swapping Fleming's Left-Hand and Right-Hand Rules",
        "incorrect_belief": "Using Fleming's Right-Hand Rule to find motor force, or confusing the roles of thumb, index, and middle finger.",
        "symptom_patterns": [
            r"Fleming's right hand rule for electric motor",
            r"thumb represents magnetic field",
            "forefinger represents force",
            r"Fleming's left hand rule for induced current",
            r"right hand thumb rule used for motor force"
        ],
        "example_student_reasoning": "To find the direction of force on a current wire in a magnetic field, we use Fleming's Right-Hand Rule.",
        "correct_explanation": "Fleming's LEFT-Hand Rule is for MOTORS (electrical energy converted to mechanical FORCE on a conductor). Fleming's RIGHT-Hand Rule is for GENERATORS / INDUCTION (mechanical motion produces INDUCED CURRENT). In both rules: Thumb = Force/Motion, Forefinger = Field, Center finger = Current (mnemonic: Father, Mother, Child = F, B, I).",
        "remediation_text": "Mnemonic trick: LEFT is for electric motors (Left = driving motion/force). RIGHT is for generators/induction (Right = generator generating current). For fingers: Thumb = Father (Force), Forefinger = Mother (Magnetic field), Middle finger = Child (Current)."
    }
]
