import mongoose from "mongoose";
import { connectToDatabase } from "./mongodb";
import { Car } from "@/models/Car";
import { Complaint } from "@/models/Complaint";

export const INITIAL_CARS = [
  {
    carId: "CAR-0369-ROADSHTER",
    name: "0369 CYBER ROADSTER",
    make: "0369 Automotive",
    modelName: "Cyber Roadster EV",
    year: 2026,
    type: "Quad-Motor Electric Hypercar",
    powertrain: "1000V Solid-State Electric",
    power: "1,400 HP",
    vin: "0369-EV-9941-X",
    specs: { maxSpeedMph: 245, maxRpm: 18000, batteryCapacityKw: 120 },
    status: "OPTIMAL" as const,
  },
  {
    carId: "CAR-APEX-HYPERION",
    name: "APEX HYPERION GT",
    make: "Apex Performance",
    modelName: "Hyperion GT Hybrid",
    year: 2025,
    type: "V8 Twin-Turbo Hybrid",
    powertrain: "4.0L V8 Twin-Turbo + Dual Electric Motors",
    power: "1,150 HP",
    vin: "APEX-GT-8820-Z",
    specs: { maxSpeedMph: 218, maxRpm: 8800, engineDisplacement: "4.0L V8" },
    status: "ATTENTION NEEDED" as const,
  },
];

export const PRESET_SOLUTIONS_DB: Array<{
  code: string;
  symptomKeywords: string[];
  title: string;
  severity: "CRITICAL" | "WARNING" | "MILD";
  rootCauseTemplate: (make: string, model: string, year: number | string) => string;
  fixStepsTemplate: (make: string, model: string, year: number | string) => string[];
  partsRequiredTemplate: (make: string, model: string) => string[];
  estimatedCost: string;
  laborTime: string;
}> = [
  {
    code: "P0300",
    symptomKeywords: ["MISFIRE", "ENGINE SHAKE", "CYLINDER", "ROUGH IDLE", "SHAKING", "VIBRATING"],
    title: "Random / Multiple Cylinder Misfire Detected",
    severity: "WARNING",
    rootCauseTemplate: (make, model, year) =>
      `Ignition coil insulation micro-cracks or worn iridium spark plug electrode breakdown causing voltage collapse under load in the ${year} ${make} ${model} engine harness.`,
    fixStepsTemplate: (make, model, year) => [
      `Connect OBD-II master scanner to the ${year} ${make} ${model} OBD port and read freeze frame cylinder misfire registers.`,
      `Inspect direct ignition coil packs and high-tension wiring for arc tracking or oil contamination.`,
      `Replace spark plugs with high-grade laser iridium plugs spec'd for ${make} ${model}.`,
      `Perform ECU ignition timing adaptation reset and verify smooth idle.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} OEM Specification Iridium Spark Plugs (Full Set)`,
      `Direct Ignition Coil Pack Assembly`
    ],
    estimatedCost: "$240 - $410",
    laborTime: "1.5 Hours",
  },
  {
    code: "P0420",
    symptomKeywords: ["CATALYTIC", "EXHAUST", "EMISSIONS", "CATALYST", "POLLUTION", "SMOKE"],
    title: "Catalytic Converter System Efficiency Below Threshold",
    severity: "WARNING",
    rootCauseTemplate: (make, model, year) =>
      `Downstream oxygen sensor signal degradation or catalytic converter substrate carbon buildup in the ${year} ${make} ${model} exhaust assembly.`,
    fixStepsTemplate: (make, model, year) => [
      `Inspect ${make} ${model} exhaust manifold joints and oxygen sensor bungs for pinhole carbon leaks.`,
      `Measure Downstream O2 Sensor voltage signal waveform using digital storage oscilloscope.`,
      `Flush catalytic converter substrate using high-temperature ultrasonic detergent or replace catalyst pipe unit.`,
      `Reset ECU Long-Term Fuel Trim (LTFT) adaptive memory.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} ${model} Downstream Oxygen Sensor`,
      `High-Flow Direct-Fit Catalytic Converter`
    ],
    estimatedCost: "$450 - $890",
    laborTime: "2.5 Hours",
  },
  {
    code: "P0550",
    symptomKeywords: ["BRAKE", "PRESSURE", "ABS", "PEDAL", "SQUEAK", "GRINDING", "STOPPING"],
    title: "Brake Hydraulic Pressure Variance & Friction Pad Wear",
    severity: "CRITICAL",
    rootCauseTemplate: (make, model, year) =>
      `Front brake friction pads worn under 3mm safety margin causing rotor surface scoring and hydraulic pressure drop on the ${year} ${make} ${model}.`,
    fixStepsTemplate: (make, model, year) => [
      `Dismount front brake calipers on the ${year} ${make} ${model} and measure pad thickness across all pistons.`,
      `Measure brake rotor thickness runout using a micrometer dial gauge.`,
      `Install low-dust premium ceramic brake pads and turn/replace scored rotors.`,
      `Perform full brake fluid hydraulic line pressure flush with DOT 4 / DOT 5.1 synthetic fluid.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} ${model} Premium Ceramic Brake Pad Set`,
      `Ventilated Brake Rotors (Pair)`,
      `Synthetic DOT Fluid (1L)`
    ],
    estimatedCost: "$310 - $550",
    laborTime: "2.0 Hours",
  },
  {
    code: "P0A80",
    symptomKeywords: ["BATTERY", "HYBRID", "HV CELL", "VOLTAGE DRIFT", "CHARGE", "ELECTRIC", "EV"],
    title: "High-Voltage / Hybrid Battery Pack Module Imbalance",
    severity: "CRITICAL",
    rootCauseTemplate: (make, model, year) =>
      `Battery Management System (BMS) cell state-of-charge variance exceeding safety threshold in the ${year} ${make} ${model} high-voltage traction pack.`,
    fixStepsTemplate: (make, model, year) => [
      `Safely disconnect the high-voltage main breaker on the ${year} ${make} ${model}.`,
      `Perform automated BMS high-voltage module equalization and cell balance cycle.`,
      `Inspect thermal management cooling fan ducts and liquid coolant loops for flow blockages.`,
      `Flash updated BMS control module calibration software.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} ${model} BMS Balancing Interface Harness`,
      `HV Battery Thermal Coolant`
    ],
    estimatedCost: "$280 - $680",
    laborTime: "2.2 Hours",
  },
  {
    code: "P0299",
    symptomKeywords: ["TURBO", "BOOST", "UNDERBOOST", "POWER LOSS", "LAG", "ACCELERATION"],
    title: "Turbocharger / Supercharger Underboost Condition",
    severity: "WARNING",
    rootCauseTemplate: (make, model, year) =>
      `Electronic wastegate actuator solenoid sticking or intake charge pipe silicone coupler leaking under pressure in the ${year} ${make} ${model}.`,
    fixStepsTemplate: (make, model, year) => [
      `Perform high-pressure smoke leak test on the ${year} ${make} ${model} intercooler charge pipe assembly.`,
      `Inspect wastegate actuator rod linkage for mechanical binding or vacuum diaphragm tears.`,
      `Tighten charge pipe T-bolt clamps and verify MAP sensor voltage response under boost.`,
      `Clear ECU boost fault memory and conduct dynamic road test.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} ${model} HD Silicone Charge Pipe Couplers`,
      `Wastegate Solenoid Actuator Valve`
    ],
    estimatedCost: "$220 - $460",
    laborTime: "1.5 Hours",
  },
  {
    code: "P0117",
    symptomKeywords: ["OVERHEATING", "OVERHEAT", "COOLANT", "RADIATOR", "TEMPERATURE", "HOT", "THERMOSTAT"],
    title: "Engine Coolant Temperature High / Overheating Condition",
    severity: "CRITICAL",
    rootCauseTemplate: (make, model, year) =>
      `Thermostat valve stuck closed or electric cooling fan relay failure causing thermal runaway in the ${year} ${make} ${model} cooling circuit.`,
    fixStepsTemplate: (make, model, year) => [
      `Inspect ${year} ${make} ${model} coolant reservoir for low fluid levels or head gasket combustion gas intrusion.`,
      `Test thermostat opening temperature and electric radiator fan high-speed relay activation.`,
      `Replace thermostat assembly, purge air pockets from cooling system using vacuum bleeder.`,
      `Pressure test cooling system up to 18 PSI to confirm zero head gasket or hose leaks.`
    ],
    partsRequiredTemplate: (make, model) => [
      `${make} ${model} High-Temp Thermostat & Gasket`,
      `OEM Ethylene Glycol Coolant (5L)`
    ],
    estimatedCost: "$190 - $380",
    laborTime: "1.8 Hours",
  },
];

let inMemoryComplaints: any[] = [];

export async function getLiveCars() {
  try {
    await connectToDatabase();
    if (mongoose.connection.readyState === 1) {
      const count = await Car.countDocuments();
      if (count === 0) {
        await Car.insertMany(INITIAL_CARS);
      }
      const cars = await Car.find({}).sort({ createdAt: -1 });
      return cars.map((c) => ({
        id: c.carId,
        carId: c.carId,
        name: c.name,
        make: c.make,
        modelName: c.modelName,
        year: c.year,
        type: c.type,
        powertrain: c.powertrain,
        power: c.power,
        vin: c.vin,
        status: c.status,
      }));
    }
  } catch (err) {
    // Fallback
  }
  return INITIAL_CARS.map((c) => ({ id: c.carId, ...c }));
}

export async function logCarComplaint(payload: {
  carMake: string;
  carModel: string;
  carYear: number | string;
  driverName?: string;
  query: string;
}) {
  const make = payload.carMake ? payload.carMake.trim() : "Custom Make";
  const model = payload.carModel ? payload.carModel.trim() : "Custom Model";
  const year = payload.carYear || 2026;
  const fullCarName = `${year} ${make} ${model}`;
  const carId = `CAR-${make.toUpperCase()}-${model.toUpperCase()}-${year}`.replace(/\s+/g, "-");

  const searchUpper = payload.query.toUpperCase();

  let matchedSolution = PRESET_SOLUTIONS_DB.find((sol) =>
    searchUpper.includes(sol.code) ||
    sol.symptomKeywords.some((kw) => searchUpper.includes(kw))
  );

  let solutionTitle = matchedSolution ? matchedSolution.title : `Vehicle Diagnostic Resolution for: "${payload.query.slice(0, 35)}"`;
  let severity: "CRITICAL" | "WARNING" | "MILD" = matchedSolution ? matchedSolution.severity : "WARNING";
  let rootCause = matchedSolution
    ? matchedSolution.rootCauseTemplate(make, model, year)
    : `CAN-bus telemetry & sensor variance detected on the ${year} ${make} ${model} corresponding to symptom: ${payload.query}`;

  let fixSteps = matchedSolution
    ? matchedSolution.fixStepsTemplate(make, model, year)
    : [
        `Connect master diagnostic scanner to the ${year} ${make} ${model} OBD-II diagnostic port.`,
        `Perform deep sensor voltage sweep across powertrain, transmission, and body control modules.`,
        `Inspect related wiring harnesses and mechanical components for ${make} ${model} service bulletins.`,
        `Re-flash sensor calibration profile, clear fault codes, and conduct test drive verification.`
      ];

  let partsRequired = matchedSolution
    ? matchedSolution.partsRequiredTemplate(make, model)
    : [`${make} ${model} Specified Replacement Component`, `OEM Diagnostic Harness`];

  let estimatedCost = matchedSolution ? matchedSolution.estimatedCost : "$180 - $390";
  let laborTime = matchedSolution ? matchedSolution.laborTime : "1.5 Hours";

  const complaintData = {
    complaintId: `COMP-${Date.now().toString().slice(-6)}`,
    carId,
    carName: fullCarName,
    driverName: payload.driverName || "Driver / Owner",
    code: matchedSolution ? matchedSolution.code : `DTC-${Math.floor(100 + Math.random() * 899)}`,
    symptom: payload.query,
    severity,
    solution: {
      title: solutionTitle,
      rootCause,
      fixSteps,
      estimatedCost,
      laborTime,
      partsRequired,
      confidenceScore: 98.8,
    },
    status: "DIAGNOSED" as const,
    createdAt: new Date(),
  };

  try {
    await connectToDatabase();
    if (mongoose.connection.readyState === 1) {
      await Car.findOneAndUpdate(
        { carId },
        {
          carId,
          name: fullCarName,
          make,
          modelName: model,
          year: Number(year) || 2026,
          type: "Custom Passenger Vehicle",
          powertrain: "Powertrain Unit",
          power: "Standard Spec",
          vin: `VIN-${make.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`,
          status: "OPTIMAL",
        },
        { upsert: true, new: true }
      );
      const doc = await Complaint.create(complaintData);
      return doc;
    }
  } catch (err) {
    // Fallback gracefully
  }

  inMemoryComplaints.unshift(complaintData);
  return complaintData;
}

export async function getLiveComplaints() {
  try {
    await connectToDatabase();
    if (mongoose.connection.readyState === 1) {
      const complaints = await Complaint.find({}).sort({ createdAt: -1 }).limit(30);
      return complaints;
    }
  } catch (err) {
    // Fallback
  }
  return inMemoryComplaints;
}
