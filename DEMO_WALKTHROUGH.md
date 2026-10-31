# MASTERYMIND AI — Competition Demonstration Script

This walkthrough script presents the complete end-to-end journey of **MASTERYMIND AI** in a concise, 5-minute competition presentation.

---

### Step 1: Landing Page & Problem Context (30 seconds)
1. Open `http://localhost:5173/` (or `http://localhost:8000/`).
2. Show the tagline: *"Every answer teaches us how to teach you better."*
3. Highlight the core differentiator:
   - Traditional apps tell students they're wrong.
   - MASTERYMIND AI models student understanding through **Extended Bayesian Knowledge Tracing (BKT)**, **written reasoning inspection**, and **prerequisite dependency graphs**.

---

### Step 2: One-Click Demo Persona Login (20 seconds)
1. Click **"Launch Student Demo"** or click the **Switch Persona** pill in the top-right corner.
2. Select **Aarav Gupta (Student)** (`student@masterymind.ai` / `Student@123`).
3. Notice that the authentication uses genuine JWT bearer tokens and password hashing via bcrypt.

---

### Step 3: Diagnostic Assessment & Baseline Calibration (60 seconds)
1. Navigate to the **Diagnostic** tab.
2. Show how the 12 questions are balanced across all four chapters (Light, Human Eye, Electricity, Magnetism) and span multiple difficulty levels.
3. Answer a question, select a confidence rating (**"Confident"** or **"Guessing"**), and type brief reasoning.
4. Click **Submit Diagnostic**:
   - Point out that the system does **not** treat the total score as the learner model.
   - Show the per-concept BKT baseline estimates (e.g. 70% in Reflection, 35% in Ohm's Law).

---

### Step 4: Interactive Concept Dependency Graph (45 seconds)
1. Navigate to the **Concept Graph** tab.
2. Show the color-coded nodes:
   - **Emerald:** Mastered concepts ($\ge 75\%$)
   - **Amber:** Developing concepts ($40-74\%$)
   - **Rose:** Weak concepts ($< 40\%$)
   - **Purple Badge:** Prerequisite Gap (a foundational prerequisite is weak, blocking downstream concepts!)
3. Click on **Ohm's Law & Resistance**:
   - Inspect the formula $V = IR$, learning objectives, and model uncertainty ($\pm 18\%$).
   - Click **"Practice This Concept"** directly from the modal.

---

### Step 5: Adaptive Practice & Misconception Diagnosis (90 seconds)
1. In the **Adaptive Practice Workspace**, point out the **"Why this question was selected"** pill:
   - Shows real utility factors: mastery deficit, prerequisite blockage, uncertainty, and difficulty fit.
2. Enter an answer with a known conceptual reasoning flaw:
   - Question on Ohm's law: Select Option A and write in the reasoning box:  
     *"Since current increases, the resistance must increase according to Ohm's law."*
   - Set confidence to **"Confident"**.
3. Click **Submit & Diagnose**:
   - **Misconception Alert appears!**
   - Identifies: `MISC_OHM_R_I_CONFUSION`.
   - Displays the exact quoted evidence span from the student's text.
   - Provides targeted physical intuition (*water pipe analogy: pipe width doesn't change when water flows faster*).
   - Shows the BKT mastery drop and logs an auditable explanation.

---

### Step 6: Spaced Repetition Planner (30 seconds)
1. Navigate to the **Revision** tab.
2. Point out that the failed concept was immediately rescheduled for tomorrow (interval reset to 1 day due to active misconception).
3. Demonstrate self-rating buttons (**Again 1**, **Hard 2**, **Good 4**, **Easy 5**) running the SuperMemo SM-2 algorithm.

---

### Step 7: Teacher Analytics Workspace (60 seconds)
1. Switch personas using the top-right pill to **Dr. Radhika Sharma (Teacher)** (`teacher@masterymind.ai`).
2. Show the **Classroom Overview**:
   - Class average mastery (68.4%), active misconceptions, and at-risk student warnings.
3. Show the **Concept Heatmap**:
   - Matrix of all 28 concepts showing exact distributions of Mastered, Developing, and Weak students.
4. Show the **Teaching Interventions**:
   - Evidence-grounded recommendation: *"40% of class is confusing current and voltage. Recommended: conduct a 15-minute hands-on demonstration before assigning more numericals."*
5. Click **Export CSV** to demonstrate instant gradebook/report download.

---

### Step 8: Scientific Evaluation Proof (15 seconds)
1. Show the evaluation harness report:
   - **88.00% F1 score** on gold-standard benchmark cases.
   - **0.00% unsupported false-positive diagnosis rate**.
   - **0.25 ms execution latency**.
   - **27/27 automated unit & integration tests passing**.
