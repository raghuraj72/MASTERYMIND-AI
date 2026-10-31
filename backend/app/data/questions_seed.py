# CBSE Class 10 Physics Question Bank Seed
# 48 syllabus-aligned questions spanning Light, Human Eye, Electricity, and Magnetism
# Across Foundational, Intermediate, and Advanced difficulties with misconception distractor mappings

import json

QUESTIONS_DATA = [
    # ==========================================
    # CHAPTER 9: LIGHT (12 Questions)
    # ==========================================
    {
        "code": "Q_LGT_01",
        "concept_code": "LGT_REFL_LAWS",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "An incident ray makes an angle of 35° with the surface of a plane mirror. What is the angle of reflection?",
        "options": [
            {"id": "A", "text": "35°", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "55°", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "70°", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "90°", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. The angle of incidence (i) is measured between the incident ray and the NORMAL (perpendicular to surface).\n2. If the ray makes 35° with the surface, angle of incidence i = 90° - 35° = 55°.\n3. By the First Law of Reflection, angle of reflection (r) = angle of incidence (i) = 55°.",
        "expected_reasoning": "Angle with surface is glancing angle 35°, normal is 90°, so i = 55°. Since angle of incidence equals angle of reflection, r = 55°."
    },
    {
        "code": "Q_LGT_02",
        "concept_code": "LGT_RAY_DIAGRAMS_MIRROR",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Where should an object be placed in front of a concave mirror so that its image is real, inverted, and of the same size as the object?",
        "options": [
            {"id": "A", "text": "Between the pole and principal focus", "is_correct": False, "distractor_misconception_code": "MISC_REAL_VIRTUAL_CONFUSION"},
            {"id": "B", "text": "At the principal focus (F)", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "At the centre of curvature (C)", "is_correct": True, "distractor_misconception_code": None},
            {"id": "D", "text": "Beyond the centre of curvature", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "C",
        "step_by_step_explanation": "When an object is placed at the centre of curvature (C) of a concave mirror:\n- The reflected rays converge exactly at C.\n- The image formed is real, inverted, and exactly equal in size (magnification m = -1).",
        "expected_reasoning": "Object at C forms an image at C with magnification m = -v/u = -(-2f)/(-2f) = -1, which means real, inverted and same size."
    },
    {
        "code": "Q_LGT_03",
        "concept_code": "LGT_SIGN_CONVENTION",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "According to the New Cartesian Sign Convention, which of the following is ALWAYS true for spherical mirrors?",
        "options": [
            {"id": "A", "text": "Object distance u is positive", "is_correct": False, "distractor_misconception_code": "MISC_SIGN_CONVENTION_MIRROR"},
            {"id": "B", "text": "Object distance u is negative", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Focal length of concave mirror is positive", "is_correct": False, "distractor_misconception_code": "MISC_SIGN_CONVENTION_MIRROR"},
            {"id": "D", "text": "Image distance v is always negative", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "By international convention, the object is always placed to the left of the mirror. Since light travels from left to right and distances are measured from the pole as origin, distances to the left are always negative. Hence, u < 0.",
        "expected_reasoning": "The object is kept on the left side of the pole, which is against the direction of incident light, making u always negative."
    },
    {
        "code": "Q_LGT_04",
        "concept_code": "LGT_MIRROR_FORMULA",
        "difficulty": "intermediate",
        "question_type": "numerical",
        "text": "An object is placed at a distance of 30 cm in front of a concave mirror of focal length 20 cm. Calculate the image distance v in cm (include sign).",
        "options": None,
        "correct_answer": "-60",
        "numerical_tolerance": "0.5",
        "acceptable_units": "cm",
        "step_by_step_explanation": "1. Given: Concave mirror, so f = -20 cm; u = -30 cm.\n2. Mirror formula: 1/f = 1/v + 1/u => 1/v = 1/f - 1/u.\n3. 1/v = 1/(-20) - 1/(-30) = -1/20 + 1/30 = (-3 + 2)/60 = -1/60.\n4. Therefore, v = -60 cm (real, inverted image 60 cm in front of the mirror).",
        "expected_reasoning": "Using 1/v = 1/f - 1/u with f = -20 and u = -30 gives 1/v = -1/20 + 1/30 = -1/60, so v = -60 cm."
    },
    {
        "code": "Q_LGT_05",
        "concept_code": "LGT_REFR_LAWS",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "When a ray of light enters from air into glass obliquely, the ray:",
        "options": [
            {"id": "A", "text": "Bends away from the normal", "is_correct": False, "distractor_misconception_code": "MISC_REFRACTIVE_INDEX_INVERSION"},
            {"id": "B", "text": "Bends towards the normal", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Continues without any deviation", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Reflects back completely into air", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Glass is optically denser than air. Light slows down upon entering glass, causing the refracted ray to bend towards the normal.",
        "expected_reasoning": "Moving from rarer (air) to denser (glass) medium causes speed of light to decrease, bending the ray towards the normal."
    },
    {
        "code": "Q_LGT_06",
        "concept_code": "LGT_REFR_INDEX",
        "difficulty": "intermediate",
        "question_type": "numerical",
        "text": "The absolute refractive index of a medium is 1.5. If the speed of light in vacuum is 3 × 10^8 m/s, what is the speed of light in this medium in 10^8 m/s?",
        "options": None,
        "correct_answer": "2.0",
        "numerical_tolerance": "0.1",
        "acceptable_units": "10^8 m/s,m/s",
        "step_by_step_explanation": "1. Formula: n = c / v => v = c / n.\n2. v = (3 × 10^8 m/s) / 1.5 = 2.0 × 10^8 m/s.",
        "expected_reasoning": "v = c/n = 3e8 / 1.5 = 2.0e8 m/s."
    },
    {
        "code": "Q_LGT_07",
        "concept_code": "LGT_LENS_FORMULA",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "A convex lens forms a real and inverted image of a needle at a distance of 50 cm from it. Where is the needle placed in front of the convex lens if the image is equal to the size of the object?",
        "options": [
            {"id": "A", "text": "-25 cm", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "-50 cm", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "+50 cm", "is_correct": False, "distractor_misconception_code": "MISC_SIGN_CONVENTION_MIRROR"},
            {"id": "D", "text": "-100 cm", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. For a real, inverted image of the same size, magnification m = -1.\n2. Lens magnification m = v / u => -1 = (+50) / u => u = -50 cm.\n3. The needle is placed at 2F1 (50 cm in front of the lens).",
        "expected_reasoning": "m = v/u = -1 since image is real and same size. v = +50 cm, so u = -50 cm."
    },
    {
        "code": "Q_LGT_08",
        "concept_code": "LGT_POWER_LENS",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "What is the power of a diverging (concave) lens having a focal length of 20 cm?",
        "options": [
            {"id": "A", "text": "+5.0 D", "is_correct": False, "distractor_misconception_code": "MISC_LENS_POWER_UNITS"},
            {"id": "B", "text": "-5.0 D", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "-0.05 D", "is_correct": False, "distractor_misconception_code": "MISC_LENS_POWER_UNITS"},
            {"id": "D", "text": "+0.05 D", "is_correct": False, "distractor_misconception_code": "MISC_LENS_POWER_UNITS"}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. Concave lens has a negative focal length: f = -20 cm = -0.20 m.\n2. Power P = 1 / f(in metres) = 1 / (-0.20) = -5.0 D.",
        "expected_reasoning": "Convert f to meters: -0.2 m. Power is P = 1/f = 1/(-0.2) = -5 D."
    },
    {
        "code": "Q_LGT_09",
        "concept_code": "LGT_RAY_DIAGRAMS_MIRROR",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Which type of mirror is used as a rear-view mirror in vehicles, and why?",
        "options": [
            {"id": "A", "text": "Concave mirror, because it forms magnified real images", "is_correct": False, "distractor_misconception_code": "MISC_REAL_VIRTUAL_CONFUSION"},
            {"id": "B", "text": "Convex mirror, because it always gives an erect, diminished image and a wider field of view", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Plane mirror, because it gives an inverted image", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Concave mirror, because it converges light on the driver", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Convex mirrors are curved outwards, which provides a significantly wider field of view. They always produce virtual, erect, and diminished images of traffic behind.",
        "expected_reasoning": "Convex mirrors produce virtual and erect images with broad field of view, making them ideal for automotive rear view."
    },
    {
        "code": "Q_LGT_10",
        "concept_code": "LGT_MIRROR_FORMULA",
        "difficulty": "advanced",
        "question_type": "short_answer",
        "text": "A student finds the magnification of a mirror to be m = -2.5. Explain the nature and relative size of the image formed.",
        "options": None,
        "correct_answer": "Real, inverted, and magnified",
        "step_by_step_explanation": "1. The negative sign of magnification (m < 0) indicates the image is inverted and real.\n2. The magnitude |m| = 2.5 > 1 indicates the image is enlarged (2.5 times the size of object).",
        "expected_reasoning": "Negative sign indicates real and inverted image. Magnitude 2.5 is greater than 1, so the image is magnified."
    },
    {
        "code": "Q_LGT_11",
        "concept_code": "LGT_REFR_INDEX",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "The refractive index of water is 4/3 and glass is 3/2. What is the refractive index of glass with respect to water (n_gw)?",
        "options": [
            {"id": "A", "text": "8/9", "is_correct": False, "distractor_misconception_code": "MISC_REFRACTIVE_INDEX_INVERSION"},
            {"id": "B", "text": "9/8", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "2/1", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "1/2", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. Relative refractive index n_gw = n_glass / n_water.\n2. n_gw = (3/2) / (4/3) = (3/2) × (3/4) = 9/8 (or 1.125).",
        "expected_reasoning": "n_gw = n_g / n_w = (3/2) / (4/3) = 9/8."
    },
    {
        "code": "Q_LGT_12",
        "concept_code": "LGT_POWER_LENS",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Two thin lenses of optical powers +3.5 D and -1.5 D are placed in contact. What is the power of the combination?",
        "options": [
            {"id": "A", "text": "+5.0 D", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "+2.0 D", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "-2.0 D", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "-5.25 D", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Power of lens combination in contact is the algebraic sum of individual powers: P_net = P1 + P2 = (+3.5 D) + (-1.5 D) = +2.0 D.",
        "expected_reasoning": "Algebraic addition of optical powers: 3.5 - 1.5 = +2.0 D."
    },

    # ==========================================
    # CHAPTER 10: HUMAN EYE (12 Questions)
    # ==========================================
    {
        "code": "Q_EYE_01",
        "concept_code": "EYE_ANATOMY_ACCOMMODATION",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "For a young adult with normal vision, the least distance of distinct vision (near point) is approximately:",
        "options": [
            {"id": "A", "text": "25 m", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "2.5 cm", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "25 cm", "is_correct": True, "distractor_misconception_code": None},
            {"id": "D", "text": "Infinity", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "C",
        "step_by_step_explanation": "The minimum distance at which objects can be seen most distinctly without strain is 25 cm for a normal human eye.",
        "expected_reasoning": "The near point of a normal human eye is 25 cm."
    },
    {
        "code": "Q_EYE_02",
        "concept_code": "EYE_DEFECTS_MYOPIA",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "A person suffering from myopia (nearsightedness) cannot clearly see objects situated:",
        "options": [
            {"id": "A", "text": "Near the eye (closer than 25 cm)", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "At distant positions (far point is closer than infinity)", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "In dark rooms only", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "At any position", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "In myopia, the person can see nearby objects clearly but cannot see distant objects distinctly because rays converge in front of the retina.",
        "expected_reasoning": "Myopic individuals have a reduced far point closer than infinity, unable to focus distant objects."
    },
    {
        "code": "Q_EYE_03",
        "concept_code": "EYE_DEFECTS_MYOPIA",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "Which corrective lens is prescribed to correct myopia?",
        "options": [
            {"id": "A", "text": "Convex lens of suitable focal length", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Concave lens of suitable focal length", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Bifocal cylindrical lens", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Plane glass plate", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "A concave lens diverges incoming parallel rays so that they appear to originate from the person's defective far point, focusing correctly on the retina.",
        "expected_reasoning": "Concave lens diverges parallel light from infinity to bring the focus back onto the retina."
    },
    {
        "code": "Q_EYE_04",
        "concept_code": "EYE_DEFECTS_HYPERMETROPIA",
        "difficulty": "advanced",
        "question_type": "numerical",
        "text": "A hypermetropic person has a near point of 100 cm. Calculate the power of the convex lens (in Dioptres) required to enable normal reading at 25 cm.",
        "options": None,
        "correct_answer": "+3.0",
        "numerical_tolerance": "0.1",
        "acceptable_units": "D,dioptre,dioptres",
        "step_by_step_explanation": "1. Object should be at u = -25 cm = -0.25 m.\n2. Image should be formed at defective near point v = -100 cm = -1.0 m.\n3. 1/f = 1/v - 1/u = 1/(-1.0) - 1/(-0.25) = -1 + 4 = +3 m^(-1).\n4. Power P = +3.0 D.",
        "expected_reasoning": "P = 1/v - 1/u with v = -1m and u = -0.25m gives P = -1 + 4 = +3.0 D."
    },
    {
        "code": "Q_EYE_05",
        "concept_code": "EYE_PRISM_DISPERSION",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "When white light passes through a glass prism, which color of light deviates the LEAST?",
        "options": [
            {"id": "A", "text": "Violet", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Green", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Red", "is_correct": True, "distractor_misconception_code": None},
            {"id": "D", "text": "Yellow", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "C",
        "step_by_step_explanation": "Red light has the longest wavelength in the visible spectrum and experiences the lowest refractive index in glass, bending the least.",
        "expected_reasoning": "Red light has the largest wavelength and smallest refractive index, so it deviates least."
    },
    {
        "code": "Q_EYE_06",
        "concept_code": "EYE_PRISM_DISPERSION",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "What are the three optical phenomena involved in the formation of a rainbow in the sky?",
        "options": [
            {"id": "A", "text": "Refraction, dispersion, and total internal reflection (internal reflection)", "is_correct": True, "distractor_misconception_code": None},
            {"id": "B", "text": "Scattering, absorption, and polarization", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"},
            {"id": "C", "text": "Diffraction, interference, and reflection", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Atmospheric refraction and scattering only", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"}
        ],
        "correct_answer": "A",
        "step_by_step_explanation": "Sunlight enters a raindrop (refraction & dispersion), reflects internally at the back surface, and refracts again upon leaving the droplet towards the observer.",
        "expected_reasoning": "Water droplet acts as a tiny prism: refraction + dispersion upon entry, internal reflection, and refraction on exit."
    },
    {
        "code": "Q_EYE_07",
        "concept_code": "EYE_ATM_REFRACTION",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "The twinkling of stars at night is primarily caused by:",
        "options": [
            {"id": "A", "text": "Scattering of starlight by atmospheric dust", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"},
            {"id": "B", "text": "Atmospheric refraction through turbulent air of changing density", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Periodic explosion inside stars", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Dispersion of light in the upper ozone layer", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Starlight passes through changing atmospheric layers. Because temperature and air density fluctuate constantly, the apparent position and intensity of the point-sized star fluctuate, causing twinkling.",
        "expected_reasoning": "Continuous fluctuations in refractive index of air layers refract starlight unpredictably, resulting in twinkling."
    },
    {
        "code": "Q_EYE_08",
        "concept_code": "EYE_ATM_REFRACTION",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "Why is the Sun visible to us about 2 minutes before actual sunrise and 2 minutes after actual sunset?",
        "options": [
            {"id": "A", "text": "Due to Rayleigh scattering of red wavelengths", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"},
            {"id": "B", "text": "Due to atmospheric refraction bending sunlight over the horizon", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Due to total internal reflection in cloud droplets", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Due to rotation of Earth on its axis speeding up at dawn", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "When the sun is just below the horizon, rays entering the increasingly dense atmosphere bend downwards towards the Earth, making the sun appear higher than it actually is.",
        "expected_reasoning": "Atmospheric refraction bends sunlight downwards so it clears the horizon early."
    },
    {
        "code": "Q_EYE_09",
        "concept_code": "EYE_SCATTERING_TYNDALL",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Why does the clear sky appear blue on a sunny day?",
        "options": [
            {"id": "A", "text": "Fine atmospheric molecules scatter shorter blue wavelengths more strongly than red", "is_correct": True, "distractor_misconception_code": None},
            {"id": "B", "text": "Water vapor reflects only blue light", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Atmospheric refraction separates blue light from sunlight", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"},
            {"id": "D", "text": "Ozone layer absorbs all wavelengths except blue", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "A",
        "step_by_step_explanation": "Fine gas particles in the atmosphere have sizes smaller than the wavelength of visible light. According to Rayleigh scattering (intensity ∝ 1/λ^4), shorter wavelengths (blue) are scattered much more effectively than longer wavelengths (red).",
        "expected_reasoning": "Rayleigh scattering scatters shorter wavelength blue light much more intensely across the sky."
    },
    {
        "code": "Q_EYE_10",
        "concept_code": "EYE_SCATTERING_TYNDALL",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "Why does the Sun appear reddish at sunrise and sunset?",
        "options": [
            {"id": "A", "text": "Sun radiates only red light in the morning", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Sunlight travels through a thicker atmospheric layer; blue light is scattered away, leaving red light to reach our eyes", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Red light has shorter wavelength and gets scattered directly into our eyes", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Due to atmospheric dispersion separating red light", "is_correct": False, "distractor_misconception_code": "MISC_ATM_SCATTERING_REFRACTION"}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Near the horizon, sunlight travels the greatest distance through the atmosphere. The shorter blue and violet wavelengths are almost entirely scattered out of the direct line of sight, leaving predominantly red wavelengths.",
        "expected_reasoning": "Long path through atmosphere scatters out blue light; longer red wavelengths penetrate to reach observer."
    },
    {
        "code": "Q_EYE_11",
        "concept_code": "EYE_DEFECTS_HYPERMETROPIA",
        "difficulty": "intermediate",
        "question_type": "short_answer",
        "text": "Name the visual defect where an elderly person loses the power of accommodation due to weakening of ciliary muscles and diminishing flexibility of the eye lens.",
        "options": None,
        "correct_answer": "Presbyopia",
        "step_by_step_explanation": "Presbyopia is age-related farsightedness caused by gradual stiffening of the crystalline lens and weakening of ciliary muscles.",
        "expected_reasoning": "Age-related defect of accommodation is presbyopia."
    },
    {
        "code": "Q_EYE_12",
        "concept_code": "EYE_SCATTERING_TYNDALL",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "If the Earth had no atmosphere, what color would the sky appear to an observer on the ground?",
        "options": [
            {"id": "A", "text": "Bright white", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Dark or black", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Deep blue", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Reddish orange", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Without an atmosphere, there would be no particles or gas molecules to scatter sunlight. Space and the sky would appear completely dark/black, exactly as seen by astronauts in space.",
        "expected_reasoning": "No scattering occurs without an atmosphere, making the sky appear dark."
    },

    # ==========================================
    # CHAPTER 11: ELECTRICITY (12 Questions)
    # ==========================================
    {
        "code": "Q_ELC_01",
        "concept_code": "ELC_CHARGE_CURRENT",
        "difficulty": "foundational",
        "question_type": "numerical",
        "text": "A current of 0.5 A is drawn by a filament of an electric bulb for 10 minutes. Find the amount of electric charge that flows through the circuit in Coulombs.",
        "options": None,
        "correct_answer": "300",
        "numerical_tolerance": "1",
        "acceptable_units": "C,Coulombs",
        "step_by_step_explanation": "1. Current I = 0.5 A.\n2. Time t = 10 minutes = 10 × 60 = 600 seconds.\n3. Charge Q = I × t = 0.5 A × 600 s = 300 C.",
        "expected_reasoning": "Q = I * t. Convert 10 min to 600 s. 0.5 * 600 = 300 C."
    },
    {
        "code": "Q_ELC_02",
        "concept_code": "ELC_POTENTIAL_DIFF",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "How much work is done in moving a charge of 2 Coulombs across two points having a potential difference of 12 Volts?",
        "options": [
            {"id": "A", "text": "6 Joules", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "24 Joules", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "14 Joules", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "10 Joules", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. Potential difference formula: V = W / Q.\n2. Work done W = V × Q = 12 V × 2 C = 24 Joules.",
        "expected_reasoning": "W = V * Q = 12 * 2 = 24 Joules."
    },
    {
        "code": "Q_ELC_03",
        "concept_code": "ELC_OHMS_LAW",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "A student measures current I through an ohmic resistor at different voltages V at constant temperature. What does the slope of the V vs I graph (V on y-axis, I on x-axis) represent?",
        "options": [
            {"id": "A", "text": "Conductance", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Resistance R", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Electric power", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Heat generated", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "By Ohm's law, V = IR. The slope of a graph plotting V against I is ΔV / ΔI = R (Resistance of the conductor).",
        "expected_reasoning": "Slope = Δy/Δx = ΔV/ΔI = R from Ohm's Law."
    },
    {
        "code": "Q_ELC_04",
        "concept_code": "ELC_OHMS_LAW",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "If the potential difference across the ends of a fixed metallic resistor is doubled at constant temperature, the current passing through it will:",
        "options": [
            {"id": "A", "text": "Be halved", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Double", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Quadruple", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Remain unchanged", "is_correct": False, "distractor_misconception_code": "MISC_OHM_R_I_CONFUSION"}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "According to Ohm's law, I = V / R. When resistance R remains constant, current I is directly proportional to potential difference V. Doubling V doubles I.",
        "expected_reasoning": "I is directly proportional to V for constant R, so doubling V doubles I."
    },
    {
        "code": "Q_ELC_05",
        "concept_code": "ELC_RESISTIVITY",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "A cylindrical metallic wire of resistance R is stretched to double its original length without changing its mass or density. What is its new resistance?",
        "options": [
            {"id": "A", "text": "2 R", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "4 R", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "R / 2", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "R / 4", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. Volume V = A × l is constant. When length doubles (l' = 2l), area halves (A' = A/2).\n2. Initial resistance: R = ρ*(l/A).\n3. New resistance: R' = ρ*(2l / (A/2)) = 4 * ρ*(l/A) = 4R.",
        "expected_reasoning": "Stretching doubles length and halves area because volume is conserved, so R increases by factor of 2 / 0.5 = 4."
    },
    {
        "code": "Q_ELC_06",
        "concept_code": "ELC_SERIES_CIRCUIT",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "Three resistors of 2 Ω, 3 Ω, and 5 Ω are connected in series with a 10 V battery. What is the electric current flowing through the 3 Ω resistor?",
        "options": [
            {"id": "A", "text": "3.33 A", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "1.0 A", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "0.5 A", "is_correct": False, "distractor_misconception_code": "MISC_SERIES_CURRENT_CONSUMPTION"},
            {"id": "D", "text": "2.0 A", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "1. Total series resistance R_eq = 2 + 3 + 5 = 10 Ω.\n2. Total current I = V / R_eq = 10 V / 10 Ω = 1.0 A.\n3. In a series circuit, current is identical through every component. Thus, current through the 3 Ω resistor is 1.0 A.",
        "expected_reasoning": "R_eq = 10 Ω. Total current is 10/10 = 1A. In series, current is identical through every resistor."
    },
    {
        "code": "Q_ELC_07",
        "concept_code": "ELC_PARALLEL_CIRCUIT",
        "difficulty": "intermediate",
        "question_type": "numerical",
        "text": "Two resistors of 10 Ω and 40 Ω are connected in parallel. Calculate the equivalent resistance in Ohms.",
        "options": None,
        "correct_answer": "8",
        "numerical_tolerance": "0.1",
        "acceptable_units": "Ω,ohm,ohms",
        "step_by_step_explanation": "1. Parallel formula: 1/R_eq = 1/R1 + 1/R2.\n2. 1/R_eq = 1/10 + 1/40 = (4 + 1)/40 = 5/40 = 1/8.\n3. R_eq = 8 Ω.",
        "expected_reasoning": "1/R_eq = 1/10 + 1/40 = 5/40 = 1/8 => R_eq = 8 Ω."
    },
    {
        "code": "Q_ELC_08",
        "concept_code": "ELC_PARALLEL_CIRCUIT",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "Why are domestic electric appliances connected in parallel rather than in series?",
        "options": [
            {"id": "A", "text": "In parallel, all appliances get the full supply voltage and operate independently", "is_correct": True, "distractor_misconception_code": None},
            {"id": "B", "text": "In parallel, total resistance is greater, so less power is used", "is_correct": False, "distractor_misconception_code": "MISC_PARALLEL_RESISTANCE_SUM"},
            {"id": "C", "text": "In parallel, if one appliance fails, all other appliances stop working", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "In parallel, appliances share the same current equally", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "A",
        "step_by_step_explanation": "Parallel connections ensure: 1) Each appliance receives full 220 V; 2) Turning off or failure of one appliance does not disrupt other branches; 3) Each appliance draws current according to its individual power rating.",
        "expected_reasoning": "Parallel ensures equal voltage (220V) and independent operation of appliances."
    },
    {
        "code": "Q_ELC_09",
        "concept_code": "ELC_HEATING_JOULES",
        "difficulty": "intermediate",
        "question_type": "numerical",
        "text": "100 Joules of heat is produced each second in a 4 Ω resistor. Find the potential difference across the resistor in Volts.",
        "options": None,
        "correct_answer": "20",
        "numerical_tolerance": "0.1",
        "acceptable_units": "V,volts",
        "step_by_step_explanation": "1. Rate of heat production H/t = Power P = 100 J/s = 100 W.\n2. P = V^2 / R => 100 = V^2 / 4.\n3. V^2 = 400 => V = 20 V.",
        "expected_reasoning": "P = V^2 / R => 100 = V^2 / 4 => V^2 = 400 => V = 20 V."
    },
    {
        "code": "Q_ELC_10",
        "concept_code": "ELC_POWER_ENERGY",
        "difficulty": "advanced",
        "question_type": "numerical",
        "text": "An electric refrigerator rated 400 W operates 8 hours/day. What is the cost of electrical energy to operate it for 30 days at ₹ 3.00 per kWh?",
        "options": None,
        "correct_answer": "288",
        "numerical_tolerance": "1",
        "acceptable_units": "₹,Rs,rupees",
        "step_by_step_explanation": "1. Power in kW = 400 W / 1000 = 0.4 kW.\n2. Total operating hours = 8 hours/day × 30 days = 240 hours.\n3. Energy consumed = 0.4 kW × 240 h = 96 kWh.\n4. Total cost = 96 kWh × ₹ 3.00 = ₹ 288.",
        "expected_reasoning": "Energy = 0.4 kW * 8 * 30 = 96 kWh. Cost = 96 * 3 = ₹ 288."
    },
    {
        "code": "Q_ELC_11",
        "concept_code": "ELC_POWER_ENERGY",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Which of the following does NOT represent electrical power in a circuit?",
        "options": [
            {"id": "A", "text": "I^2 * R", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "I * R^2", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "V * I", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "V^2 / R", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Power P = VI. Substituting V = IR gives P = I^2*R. Substituting I = V/R gives P = V^2/R. The expression I*R^2 has incorrect dimensions.",
        "expected_reasoning": "Power formulas are VI, I^2*R, and V^2/R. I*R^2 is not a valid formula for power."
    },
    {
        "code": "Q_ELC_12",
        "concept_code": "ELC_OHMS_LAW",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "What is the SI unit of electrical resistivity?",
        "options": [
            {"id": "A", "text": "Ohm", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Ohm-metre (Ω·m)", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Ohm / metre", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Volt / Ampere", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "From R = ρ(l/A), resistivity ρ = (R × A) / l. Substituting units: (Ω × m^2) / m = Ω·m.",
        "expected_reasoning": "ρ = R*A/l => units are Ω * m^2 / m = Ω·m."
    },

    # ==========================================
    # CHAPTER 12: MAGNETISM (12 Questions)
    # ==========================================
    {
        "code": "Q_MAG_01",
        "concept_code": "MAG_FIELD_LINES",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Outside a bar magnet, what is the direction of the magnetic field lines?",
        "options": [
            {"id": "A", "text": "From South pole to North pole", "is_correct": False, "distractor_misconception_code": "MISC_MAGNETIC_FIELD_DIRECTION"},
            {"id": "B", "text": "From North pole to South pole", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Radially outwards from the centre", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Random and varying with atmospheric pressure", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "By definition, magnetic field lines emerge from the North pole and enter the South pole outside a magnet. Inside the magnet, they travel from South to North.",
        "expected_reasoning": "Outside a magnet, magnetic field lines always direct from North pole to South pole."
    },
    {
        "code": "Q_MAG_02",
        "concept_code": "MAG_FIELD_LINES",
        "difficulty": "foundational",
        "question_type": "short_answer",
        "text": "Why can two magnetic field lines never intersect each other?",
        "options": None,
        "correct_answer": "Because at the point of intersection, the compass needle would have to point in two different directions simultaneously, which is impossible.",
        "step_by_step_explanation": "The direction of magnetic field at any point is tangent to the field line. If two lines intersected, there would be two tangents, meaning two simultaneous magnetic field directions at one single point.",
        "expected_reasoning": "Intersection would imply two tangents and two different magnetic field directions at a single point, which is physically impossible."
    },
    {
        "code": "Q_MAG_03",
        "concept_code": "MAG_CURRENT_CONDUCTOR",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "Which rule is used to determine the direction of the magnetic field around a straight current-carrying conductor?",
        "options": [
            {"id": "A", "text": "Fleming's Left-Hand Rule", "is_correct": False, "distractor_misconception_code": "MISC_FLEMING_RULES_SWAP"},
            {"id": "B", "text": "Right-Hand Thumb Rule", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "Fleming's Right-Hand Rule", "is_correct": False, "distractor_misconception_code": "MISC_FLEMING_RULES_SWAP"},
            {"id": "D", "text": "Snell's Law", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "Imagine holding the conductor in your right hand with the thumb pointing in the direction of current; your curled fingers indicate the direction of circular magnetic field lines.",
        "expected_reasoning": "Right-Hand Thumb Rule maps thumb to current and curled fingers to magnetic field direction."
    },
    {
        "code": "Q_MAG_04",
        "concept_code": "MAG_SOLENOID_ELECTROMAGNET",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "The magnetic field inside a long straight current-carrying solenoid is:",
        "options": [
            {"id": "A", "text": "Zero at all points", "is_correct": False, "distractor_misconception_code": "MISC_MAGNETIC_FIELD_DIRECTION"},
            {"id": "B", "text": "Decreases as we move towards its ends", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Uniform and the same at all points", "is_correct": True, "distractor_misconception_code": None},
            {"id": "D", "text": "Increases as we move towards its ends", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "C",
        "step_by_step_explanation": "Inside a long solenoid, the magnetic field lines are parallel straight lines along the axis, indicating a uniform and constant magnetic field throughout the interior.",
        "expected_reasoning": "Field lines inside a solenoid are parallel straight lines, proving the magnetic field is uniform."
    },
    {
        "code": "Q_MAG_05",
        "concept_code": "MAG_SOLENOID_ELECTROMAGNET",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "Which material is placed inside a current-carrying solenoid to create a powerful electromagnet?",
        "options": [
            {"id": "A", "text": "Soft iron", "is_correct": True, "distractor_misconception_code": None},
            {"id": "B", "text": "Hardened steel", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Copper rod", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Aluminium plate", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "A",
        "step_by_step_explanation": "Soft iron has high magnetic permeability and low retentivity; it magnetizes strongly when current flows and demagnetizes quickly when current is switched off.",
        "expected_reasoning": "Soft iron easily magnetizes and demagnetizes, making it the ideal core for temporary electromagnets."
    },
    {
        "code": "Q_MAG_06",
        "concept_code": "MAG_FORCE_FLEMING_LEFT",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "According to Fleming's Left-Hand Rule, the forefinger, middle finger, and thumb represent respectively:",
        "options": [
            {"id": "A", "text": "Field, Current, Force (Motion)", "is_correct": True, "distractor_misconception_code": None},
            {"id": "B", "text": "Force, Field, Current", "is_correct": False, "distractor_misconception_code": "MISC_FLEMING_RULES_SWAP"},
            {"id": "C", "text": "Current, Force, Field", "is_correct": False, "distractor_misconception_code": "MISC_FLEMING_RULES_SWAP"},
            {"id": "D", "text": "Motion, Resistance, Voltage", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "A",
        "step_by_step_explanation": "Forefinger = Magnetic Field (B), Middle finger = Current (I), Thumb = Force / Motion (F) (Mnemonic: Father=Force/Thumb, Mother=Field/Forefinger, Child=Current/Center finger).",
        "expected_reasoning": "Thumb is Force, Forefinger is Field, Middle finger is Current."
    },
    {
        "code": "Q_MAG_07",
        "concept_code": "MAG_FORCE_FLEMING_LEFT",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "A positively charged alpha particle projected towards the west is deflected towards the north by a magnetic field. What is the direction of the magnetic field?",
        "options": [
            {"id": "A", "text": "Towards the south", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "Towards the east", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Downwards", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "Upwards", "is_correct": True, "distractor_misconception_code": None}
        ],
        "correct_answer": "D",
        "step_by_step_explanation": "1. Positive particle moving West => Current is towards West (middle finger points West).\n2. Deflection is towards North => Force is towards North (thumb points North).\n3. Applying Fleming's Left-Hand Rule, the forefinger (field) points vertically upwards.",
        "expected_reasoning": "Current is West, Force is North. Fleming's Left-Hand Rule dictates the magnetic field points vertically upwards."
    },
    {
        "code": "Q_MAG_08",
        "concept_code": "MAG_ELECTROMAGNETIC_INDUCTION",
        "difficulty": "intermediate",
        "question_type": "mcq",
        "text": "The phenomenon of electromagnetic induction is:",
        "options": [
            {"id": "A", "text": "The process of charging a body by friction", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "The process of generating magnetic field around a compass", "is_correct": False, "distractor_misconception_code": None},
            {"id": "C", "text": "Producing induced current in a coil due to relative motion between a magnet and the coil", "is_correct": True, "distractor_misconception_code": None},
            {"id": "D", "text": "The process of rotating a motor coil using current", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "C",
        "step_by_step_explanation": "Electromagnetic induction (discovered by Michael Faraday) is the production of an induced electric current in a closed loop whenever the magnetic field or flux linking the coil changes with time.",
        "expected_reasoning": "EM induction is the generation of induced current from changing magnetic flux through a conductor."
    },
    {
        "code": "Q_MAG_09",
        "concept_code": "MAG_DOMESTIC_CIRCUITS",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "In domestic electric wiring in India, the potential difference between the live wire and the neutral wire is:",
        "options": [
            {"id": "A", "text": "110 V", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "220 V", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "440 V", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "12 V", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "In Indian household circuits, standard AC electric supply has a frequency of 50 Hz and a potential difference of 220 V between live and neutral wires.",
        "expected_reasoning": "Indian domestic AC supply standard is 220 V at 50 Hz."
    },
    {
        "code": "Q_MAG_10",
        "concept_code": "MAG_DOMESTIC_CIRCUITS",
        "difficulty": "foundational",
        "question_type": "mcq",
        "text": "What is the primary function of the green/yellow earth wire connected to the metallic casing of heavy electrical appliances?",
        "options": [
            {"id": "A", "text": "To increase the current flowing to the motor", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "To provide a low-resistance path to ground, preventing fatal electric shocks if insulation fails", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "To reduce electricity meter consumption", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "To act as an antenna for remote controls", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "If the live wire accidentally touches the metal casing, earthing conducts the leakage current directly into the earth safely, protecting the user from an electric shock and causing the fuse/circuit breaker to trip.",
        "expected_reasoning": "Earthing safely drains leakage currents to ground, preventing electric shocks."
    },
    {
        "code": "Q_MAG_11",
        "concept_code": "MAG_DOMESTIC_CIRCUITS",
        "difficulty": "intermediate",
        "question_type": "short_answer",
        "text": "Explain why an electric fuse wire must have a low melting point and high resistance.",
        "options": None,
        "correct_answer": "High resistance generates rapid Joule heat when excessive current flows, and low melting point causes the wire to melt quickly and break the circuit before appliances are damaged.",
        "step_by_step_explanation": "From Joule's law (H = I^2*R*t), excessive current heats the fuse rapidly. A low melting point ensures the wire melts and breaks the circuit immediately to prevent electrical fires and equipment damage.",
        "expected_reasoning": "Low melting point ensures it melts quickly during overload or short-circuit, while high resistance ensures sufficient heating."
    },
    {
        "code": "Q_MAG_12",
        "concept_code": "MAG_FORCE_FLEMING_LEFT",
        "difficulty": "advanced",
        "question_type": "mcq",
        "text": "Under what condition is the mechanical force experienced by a current-carrying conductor in a magnetic field MAXIMUM?",
        "options": [
            {"id": "A", "text": "When the conductor is placed parallel to the magnetic field", "is_correct": False, "distractor_misconception_code": None},
            {"id": "B", "text": "When the conductor is placed perpendicular (at 90°) to the magnetic field", "is_correct": True, "distractor_misconception_code": None},
            {"id": "C", "text": "When the conductor is coiled into an open triangle", "is_correct": False, "distractor_misconception_code": None},
            {"id": "D", "text": "When the magnetic field is alternating at 100 Hz", "is_correct": False, "distractor_misconception_code": None}
        ],
        "correct_answer": "B",
        "step_by_step_explanation": "The magnetic force on a current conductor is F = B * I * L * sin(θ). Since sin(90°) = 1 (maximum value), the force is greatest when the conductor is strictly perpendicular to the magnetic field lines.",
        "expected_reasoning": "F = B*I*L*sin(θ) reaches its maximum when θ = 90° (perpendicular)."
    }
]
