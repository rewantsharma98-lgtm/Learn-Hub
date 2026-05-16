/**
 * seed_semester2.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Seeds ALL units (sections) + 5 lectures each for every Semester-2 subject.
 * Lecture 1-4 = topic-specific; Lecture 5 = One-Shot revision.
 *
 * HOW TO USE:
 *   1. Make sure your server .env is correct (MONGO_URI set)
 *   2. Run:  node seed_semester2.js
 *   3. Open Admin Panel → Edit Course → Course Structure for each subject
 *   4. Paste your YouTube URLs into each lecture
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import courseModel from "./model/CourseModel.js";
import SectionModel from "./model/SectionModel.js";
import lectureModel from "./model/LectureModel.js";

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);
console.log("✅ Connected to MongoDB");

// ── Subject → Unit → Lecture structure ───────────────────────────────────────
const SUBJECTS = [
  {
    title: "Engineering Mathematics-II",
    units: [
      {
        title: "Determinants & Matrices",
        lectures: [
          "Determinants – Definition, Expansion of Order 2 & 3, Minors & Cofactors",
          "Properties of Determinants, Chios Method for 4th Order Determinant",
          "Cramer's Rule – Solution of Linear Simultaneous Equations (up to 3 unknowns)",
          "Matrices – Types, Operations, Transpose, Symmetric & Skew-Symmetric, Adjoint & Inverse",
          "⚡ One Shot – Unit 1: Determinants & Matrices Complete Revision",
        ],
      },
      {
        title: "Co-ordinate Geometry (2D)",
        lectures: [
          "Coordinate Systems – Cartesian & Polar, Distance Formula, Section Formula",
          "Straight Lines – Slope, Standard Forms (Slope-intercept, Two-point, Intercept)",
          "Angle Between Lines, Parallel & Perpendicular Conditions, Perpendicular Distance",
          "Circle – Centre-Radius Form, General Equation; Conic Sections – Parabola & Ellipse",
          "⚡ One Shot – Unit 2: Co-ordinate Geometry Complete Revision",
        ],
      },
      {
        title: "Integral Calculus",
        lectures: [
          "Indefinite Integration – Standard Functions, Rules (Sum, Difference, Scalar Multiple)",
          "Integration by Substitution & Integration by Parts",
          "Integration by Partial Fractions",
          "Definite Integral – Definition, Properties & Applications (Area, Volume, Surface Area)",
          "⚡ One Shot – Unit 3: Integral Calculus Complete Revision",
        ],
      },
      {
        title: "Ordinary Differential Equations",
        lectures: [
          "Introduction to ODE – Order, Degree; Separation of Variables Method",
          "Homogeneous Type & Exact Type Differential Equations",
          "Linear Type First Order ODE",
          "Second Order Linear ODE – Complementary Function & Particular Integral",
          "⚡ One Shot – Unit 4: Ordinary Differential Equations Complete Revision",
        ],
      },
      {
        title: "Partial Differentiation",
        lectures: [
          "Partial Derivatives – Definition, Meaning & Evaluation",
          "Homogeneous Functions – Definition & Examples",
          "Euler's Theorem (1st Order) for Two Variables – Statement & Proof",
          "Problems on Partial Differentiation & Applications",
          "⚡ One Shot – Unit 5: Partial Differentiation Complete Revision",
        ],
      },
      {
        title: "Statistics & Probability",
        lectures: [
          "Frequency Distribution – Mean, Median, Mode for Ungrouped Data",
          "Mean, Median, Mode for Grouped Frequency Distribution",
          "Measures of Dispersion – Standard Deviation, Simple Problems",
          "Probability – Sample Space, Events, Classical Definition & Simple Problems",
          "⚡ One Shot – Unit 6: Statistics & Probability Complete Revision",
        ],
      },
    ],
  },
  {
    title: "Applied Physics-II",
    units: [
      {
        title: "Wave Motion and Its Applications",
        lectures: [
          "SHM – Displacement, Velocity, Acceleration, Time Period & Frequency; Cantilever",
          "Wave Motion – Transverse & Longitudinal Waves, Wave Equation & Superposition",
          "Acoustics of Buildings – Reverberation, Reverberation Time & Noise Control",
          "Ultrasonic Waves – Introduction, Properties & Engineering/Medical Applications",
          "⚡ One Shot – Unit 1: Wave Motion & Applications Complete Revision",
        ],
      },
      {
        title: "Optics",
        lectures: [
          "Basic Optical Laws – Reflection, Refraction, Refractive Index & Lens Formula",
          "Total Internal Reflection, Critical Angle & Optical Fiber Applications",
          "Optical Instruments – Simple & Compound Microscope, Astronomical Telescope",
          "Interference & Diffraction of Light (Qualitative)",
          "⚡ One Shot – Unit 2: Optics Complete Revision",
        ],
      },
      {
        title: "Electrostatics",
        lectures: [
          "Coulomb's Law, Electric Field, Electric Lines of Force & Their Properties",
          "Electric Flux, Potential, Potential Difference & Gauss's Law with Application",
          "Capacitor – Working, Types & Capacitance of Parallel Plate Capacitor",
          "Series & Parallel Combination of Capacitors, Dielectric & Dielectric Breakdown",
          "⚡ One Shot – Unit 3: Electrostatics Complete Revision",
        ],
      },
      {
        title: "Current Electricity",
        lectures: [
          "Electric Current, Resistance, Specific Resistance, Series & Parallel Combinations",
          "Ohm's Law, Kirchhoff's Laws & Wheatstone Bridge / Carey Foster Bridge",
          "Heating Effect of Current, Electric Power & Energy (Numerical Problems)",
          "Thermoelectric Effect – Seebeck & Peltier Effects",
          "⚡ One Shot – Unit 4: Current Electricity Complete Revision",
        ],
      },
      {
        title: "Electromagnetism",
        lectures: [
          "Magnetic Field, Lorentz Force & Biot-Savart Law (Straight Conductor & Circular Loop)",
          "Force on Current-Carrying Conductor & Torque on Rectangular Coil",
          "Electromagnetic Induction – Faraday's Laws & Moving Coil Galvanometer",
          "Conversion of Galvanometer; Types of Magnetic Materials – Dia, Para, Ferromagnetic",
          "⚡ One Shot – Unit 5: Electromagnetism Complete Revision",
        ],
      },
      {
        title: "Semiconductor Physics",
        lectures: [
          "Energy Bands in Solids – Insulator, Conductor, Semiconductor; Intrinsic & Extrinsic",
          "P-N Junction Formation & V-I Characteristics of Junction Diode",
          "Diode as Rectifier – Half Wave & Full Wave (Centre Tapped) Rectifier",
          "Transistor – PNP, NPN Types & CE Mode Amplifier; Photocells, Solar Cells & LED",
          "⚡ One Shot – Unit 6: Semiconductor Physics Complete Revision",
        ],
      },
      {
        title: "Modern Physics",
        lectures: [
          "Bohr's Atom Model, Energy Levels, Ionization & Excitation Potentials",
          "X-Rays – Production (Coolidge Tube), Continuous & Characteristic X-Rays & Uses",
          "Laser – Spontaneous & Stimulated Emission; He-Ne Laser Characteristics & Applications",
          "Fiber Optics – Light Propagation; Nanoscience & Nanotechnology (Introduction)",
          "⚡ One Shot – Unit 7: Modern Physics Complete Revision",
        ],
      },
    ],
  },
  {
    title: "Introduction to IT Systems",
    units: [
      {
        title: "Basic Internet, Number Systems & Computer Hardware",
        lectures: [
          "Browser Skills, Search Engines & Digital India / College Portals",
          "Number Systems – Binary, Octal, Hex, BCD, Gray Code, ASCII & EBCDIC; Conversions",
          "Boolean Algebra – Logic Gates (AND, OR, NOT, NAND, NOR, XOR), Universal Gates & De-Morgan's",
          "Computer Hardware – CPU, Memory, Display, HDD, SSD, Peripherals & Types of Software",
          "⚡ One Shot – Unit 1: Internet, Number Systems & Hardware Complete Revision",
        ],
      },
      {
        title: "Operating Systems",
        lectures: [
          "What is an OS? – Definition, Brief History & Computer System Review",
          "Types of OS & Architecture – Batch, Multi-programmed Batch",
          "Time-Sharing Systems & Computer System Structures",
          "Operating System Structures & Components Overview",
          "⚡ One Shot – Unit 2: Operating Systems Complete Revision",
        ],
      },
      {
        title: "Algorithm and Flowcharts",
        lectures: [
          "Algorithms – Definition, Characteristics, Advantages & Disadvantages",
          "Flowcharts – Definition, Symbols, Advantages & Disadvantages",
          "Flowchart Examples – Sequential, Conditional & Loop Structures",
          "Practical Algorithm Design & Flowchart Problems",
          "⚡ One Shot – Unit 3: Algorithm & Flowcharts Complete Revision",
        ],
      },
      {
        title: "HTML5, CSS & JavaScript",
        lectures: [
          "HTML5 Basics – Elements, Tags, Text, Formatting, Lists, Tables & Images",
          "HTML Forms – Input Types, Select, Textarea, Submit & Hidden Fields",
          "CSS – Syntax, Selectors, Box Model, Positioning, Flexbox & Navigation",
          "JavaScript – Syntax, Variables, Operators, Conditionals (If/Else, Switch) & Loops",
          "⚡ One Shot – Unit 4: HTML5, CSS & JavaScript Complete Revision",
        ],
      },
      {
        title: "Network Utilities & Cyber Security",
        lectures: [
          "Introduction to Computer Security & Network Fundamentals",
          "DoS Attacks – Tools & Techniques (Tracert, Visual Route, WireShark)",
          "Cyber Stalking, Fraud & Abuse – Awareness & Prevention",
          "Malware Types & Techniques Used by Hackers",
          "⚡ One Shot – Unit 5: Network & Cyber Security Complete Revision",
        ],
      },
    ],
  },
  {
    title: "Fundamentals of Electrical & Electronics Engineering (FEEE)",
    units: [
      {
        title: "Overview of Electrical Components",
        lectures: [
          "Passive Components – Resistors, Capacitors & Inductors with Their Properties",
          "Signal Waveforms – DC, AC, Periodic & Non-Periodic Signals",
          "Ideal & Practical Voltage/Current Sources & Source Transformation",
          "Component Identification & Simple Numerical Problems",
          "⚡ One Shot – Unit 1: Electrical Components Complete Revision",
        ],
      },
      {
        title: "Electric and Magnetic Circuits",
        lectures: [
          "EMF, Current, Potential Difference, Power & Energy – Concepts & Units",
          "MMF, Permeability, BH Curve, Hysteresis Loss & Eddy Current Loss",
          "Electromagnetic Induction – Faraday's Laws, Lenz's Law & Dynamically/Statically Induced EMF",
          "Self & Mutual Inductance; Fleming's Left & Right Hand Rules",
          "⚡ One Shot – Unit 2: Electric & Magnetic Circuits Complete Revision",
        ],
      },
      {
        title: "A.C. Circuits",
        lectures: [
          "AC Fundamentals – Cycle, Frequency, RMS, Average, Form Factor & Peak Factor",
          "Pure R, L, C Circuits – Voltage, Current & Phasor Representation",
          "Series R-L, R-C & R-L-C Circuits with Sinusoidal Excitation",
          "Impedance Triangle, Power Factor, Active/Reactive/Apparent Power & Star-Delta Connections",
          "⚡ One Shot – Unit 3: A.C. Circuits Complete Revision",
        ],
      },
      {
        title: "Transformer and Machines",
        lectures: [
          "Basic Working Principle of Two-Winding Transformer",
          "EMF Equation & Transformation Ratio of Transformers (Numerical Problems)",
          "Working Principle & Applications of AC & DC Motors",
          "Simple Problems on Transformers & Electrical Motors",
          "⚡ One Shot – Unit 4: Transformer & Machines Complete Revision",
        ],
      },
      {
        title: "Overview of Basic Semiconductor Devices",
        lectures: [
          "Energy Level Diagrams – Insulator, Conductor & Semiconductor; Intrinsic & Extrinsic",
          "P-Type & N-Type Semiconductors – Formation & Properties",
          "P-N Junction Diode – Formation, Forward & Reverse Biased Characteristics",
          "PNP & NPN Transistors – Working & Applications in CE Mode",
          "⚡ One Shot – Unit 5: Semiconductor Devices Complete Revision",
        ],
      },
      {
        title: "Overview of Analog Circuits (Op-Amp)",
        lectures: [
          "Ideal Op-Amp Features, Pin Configuration of 741C & Concept of Virtual Ground",
          "Inverting & Non-Inverting Op-Amp Amplifiers & Gain Calculation",
          "Applications of Op-Amp – Adder Circuit & Signal Processing",
          "Practical Op-Amp Circuit Analysis & Numerical Problems",
          "⚡ One Shot – Unit 6: Analog Circuits & Op-Amp Complete Revision",
        ],
      },
      {
        title: "Overview of Digital Electronics",
        lectures: [
          "Logic Gates – AND, OR, NOT, NAND, NOR, Ex-OR, Ex-NOR & Truth Tables",
          "Universal Gates – NAND & NOR as Universal Building Blocks",
          "Postulates of Boolean Algebra",
          "De-Morgan's Theorem, Minterm (SOP) & Maxterm (POS)",
          "⚡ One Shot – Unit 7: Digital Electronics Complete Revision",
        ],
      },
    ],
  },
  {
    title: "Engineering Mechanics",
    units: [
      {
        title: "Basics of Mechanics and Force System",
        lectures: [
          "Concept of Engineering Mechanics – Statics & Dynamics; Scalar & Vector Quantities",
          "Force – Definition, Characteristics, Bow's Notation & Principle of Transmissibility",
          "Coplanar Concurrent Forces – Parallelogram Law, Triangle Law & Polygon Law",
          "Resolution of Forces – Orthogonal Components & Analytical/Graphical Method",
          "⚡ One Shot – Unit 1: Basics of Mechanics & Force System Complete Revision",
        ],
      },
      {
        title: "Moments and Couples",
        lectures: [
          "Moment of a Force – Definition, Physical Significance & Varignon's Theorem",
          "Resultant of Parallel & Inclined Force Systems",
          "Couples – Definition, Physical Significance & Equivalent Couples",
          "Resultant of Coplanar Couples & Replacement of Force by Couple",
          "⚡ One Shot – Unit 2: Moments & Couples Complete Revision",
        ],
      },
      {
        title: "Condition of Equilibrium",
        lectures: [
          "Lami's Theorem & Triangle/Polygon Law of Equilibrium; Free Body Diagram",
          "Equilibrium of Coplanar Concurrent Force Systems",
          "Equilibrium of Coplanar Non-Concurrent Parallel Forces",
          "Types of Beams, Supports & Beam Reactions – Simply Supported Beams (UDL + Point Load)",
          "⚡ One Shot – Unit 3: Condition of Equilibrium Complete Revision",
        ],
      },
      {
        title: "Friction",
        lectures: [
          "Friction – Relevance in Engineering, Types & Laws of Friction",
          "Limiting Friction, Coefficient of Friction, Angle of Friction & Cone of Friction",
          "Equilibrium of Bodies on Horizontal Surface (Parallel & Inclined Forces)",
          "Equilibrium of Bodies on Inclined Plane (Parallel & Inclined Forces)",
          "⚡ One Shot – Unit 4: Friction Complete Revision",
        ],
      },
      {
        title: "Centroid and Centre of Gravity",
        lectures: [
          "Centroid of Plane Figures – Triangle, Rectangle, Circle, Semi-circle & Quadrant",
          "Centroid of Composite Sections – T, L, I, Channel & Z Sections",
          "Centroid of Cut-out & Built-up Sections",
          "Centre of Gravity of Simple & Composite Solids (Cube, Cuboid, Cylinder, Sphere)",
          "⚡ One Shot – Unit 5: Centroid & Centre of Gravity Complete Revision",
        ],
      },
      {
        title: "Simple Lifting Machines",
        lectures: [
          "Lifting Machines – Load, Effort, MA, VR, Efficiency & Law of Machine",
          "Ideal Machine, Friction in Machine, Reversible & Non-Reversible Machines",
          "Axle & Wheel, Worm & Worm Wheel – Velocity Ratios & Problems",
          "Single/Double Purchase Crab Winch, Screw Jack & Simple Pulley Block",
          "⚡ One Shot – Unit 6: Simple Lifting Machines Complete Revision",
        ],
      },
      {
        title: "Motion in a Plane",
        lectures: [
          "Rectilinear Motion – D-T & V-T Diagrams, Motion Equations & Newton's Second Law",
          "Conservation of Momentum & Simple Numerical Problems",
          "Curvilinear Motion – Angular Displacement, Velocity & Acceleration",
          "Centripetal & Centrifugal Force; Work, Power & Energy – Concepts & Units",
          "⚡ One Shot – Unit 7: Motion in a Plane Complete Revision",
        ],
      },
    ],
  },
];

// ── SEED FUNCTION ─────────────────────────────────────────────────────────────
async function seedSubject(subjectData) {
  // Find the course by title (case-insensitive)
  const course = await courseModel.findOne({
    title: { $regex: new RegExp(subjectData.title.slice(0, 20), "i") },
  });

  if (!course) {
    console.warn(`⚠️  Course NOT FOUND: "${subjectData.title}" — skipping`);
    return;
  }

  console.log(`\n📚 Seeding: ${course.title} (${course._id})`);

  for (let uIdx = 0; uIdx < subjectData.units.length; uIdx++) {
    const unit = subjectData.units[uIdx];

    // Check if section already exists
    const existingSection = await SectionModel.findOne({
      course: course._id,
      title: { $regex: new RegExp(unit.title.slice(0, 20), "i") },
    });

    if (existingSection) {
      console.log(`  ⏭  Section exists: "${unit.title}" — skipping`);
      continue;
    }

    // Create section
    const section = new SectionModel({
      title: unit.title,
      course: course._id,
      order: uIdx,
    });
    await section.save();

    // Push section to course
    course.sections.push(section._id);

    // Create 5 lectures
    for (let lIdx = 0; lIdx < unit.lectures.length; lIdx++) {
      const lectureTitle = unit.lectures[lIdx];

      const lecture = new lectureModel({
        title: lectureTitle,
        description: "",
        videoUrl: "", // Admin will fill this via the Edit Course panel
        notes: "",
        order: lIdx,
        course: course._id,
        unitTitle: unit.title,
        isLocked: false,
        isPreviewFree: lIdx === 0, // First lecture free preview
      });
      await lecture.save();

      section.lectures.push(lecture._id);
      course.lectures.push(lecture._id);

      console.log(`    ✅ L${lIdx + 1}: ${lectureTitle.slice(0, 60)}`);
    }

    await section.save();
    console.log(`  ✔  Section created: "Unit ${uIdx + 1}: ${unit.title}"`);
  }

  await course.save();
  console.log(`  💾 Course saved: ${course.title}`);
}

// ── RUN ───────────────────────────────────────────────────────────────────────
for (const subject of SUBJECTS) {
  await seedSubject(subject);
}

console.log("\n\n🎉 Seeding complete!");
console.log("👉 Next: Open Admin Panel → Edit each course → paste YouTube URLs into each lecture.");
await mongoose.disconnect();
