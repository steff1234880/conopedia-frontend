/**
 * Conopidea NCLEX-RN Assessment Data & API Adapter Service
 *
 * Loads assessment questions dynamically from:
 * 1. Configured backend API (`VITE_API_BASE_URL` or `/api/assessments/...`) if available
 * 2. Runtime/injected assessment payload (`window.__CANOPEDIA_ASSESSMENT_DATA__` or `assessmentData` prop)
 * 3. Built-in NextGen NCLEX-RN (NGN) clinical case study & calculation dataset matching the
 *    Conopidea curriculum (Sickle Cell Vaso-Occlusive Crisis Case Study + Pediatric Medication Safety)
 *
 * Normalizes any external API schema into the 6 supported NGN item formats:
 * - `matrix-grid`       (Matrix Multiple Response Grid)
 * - `dosage-calc`       (Numeric Fill-in Dosage Calculation in mL)
 * - `incident-report`   (Incident Report / Highlight Relevant Clinical Information)
 * - `multiple-response` (Select All That Apply / Multiple Select)
 * - `drag-drop`         (Drag and Drop Words / Sentence Completion Plan of Care)
 * - `cloze-dropdown`    (Drop-down Cloze Statements)
 */

const SICKLE_CELL_CLIENT_RECORD = {
  patientLabel: '19-year-old · Sickle Cell Vaso-Occlusive Crisis',
  tabs: [
    {
      id: 'admission',
      label: 'Admission',
      badgeTitle: 'ADMISSION ASSESSMENT',
      time: '14:30',
      primaryBox:
        '19-year-old client admitted via ED with severe generalized bone and chest pain rated 10/10, dry mucous membranes, and shortness of breath for 18 hours.',
      directiveTitle: 'HISTORY & RISK FACTORS:',
      directiveBody:
        'Known homozygous HbSS sickle cell disease. Reports 2 days of decreased oral fluid intake during college midterms. Tenting of skin noted over sternum; capillary refill 4 seconds.',
      note: 'Client alert and oriented ×4, grimacing andsplinting chest wall on inspiration.',
      vitalsTitle: 'ADMISSION VITALS (1430)',
      vitals: [
        { label: 'BP', value: '88/48', alert: true },
        { label: 'HR', value: '116 bpm', alert: true },
        { label: 'RR', value: '26 /min', alert: true },
        { label: 'SpO₂', value: '91% (RA)', alert: true },
      ],
    },
    {
      id: 'orders',
      label: 'Orders',
      hasDot: true,
      badgeTitle: 'ACTIVE PHYSICIAN ORDERS',
      time: 'Time: 15:00',
      primaryBox:
        'D5 ½ NS at 200 mL/hr • morphine 4 mg IVP stat • oxygen to keep SpO₂ ≥95%.',
      directiveTitle: 'STANDING DIRECTIVES:',
      directiveBody:
        'CBC/CMP stat, incentive spirometry hourly while awake, strict I&O, NPO, and vital signs every 15 minutes until stable.',
      note: 'Patient presenting with acute vaso-occlusive crisis. Focus on ABC priority framework and pain management guidelines.',
      vitalsTitle: 'INITIAL TRIAGE VITALS (1445)',
      vitals: [
        { label: 'BP', value: '118/74', alert: false },
        { label: 'HR', value: '112 bpm', alert: true },
        { label: 'RR', value: '26 /min', alert: true },
        { label: 'SpO₂', value: '91% (RA)', alert: true },
      ],
    },
    {
      id: 'nurses-notes',
      label: "Nurse's Notes",
      badgeTitle: 'PROGRESS NURSING NOTES',
      time: 'Time: 15:20',
      primaryBox:
        '15:05 — Peripheral 20G IV established in right forearm. Oxygen initiated at 2 L/min via nasal cannula; SpO₂ rose to 95%. Morphine 4 mg IVP administered slowly over 4 minutes.',
      directiveTitle: 'FOLLOW-UP REASSESSMENT (15:20):',
      directiveBody:
        'Client reports pain decreased from 10/10 to 7/10. Fine crackles auscultated at bilateral lung bases. Continuous pulse oximetry and respiratory monitoring in place.',
      note: 'Maintain warm room environment and avoid cold compresses to prevent further vasoconstriction.',
      vitalsTitle: 'POST-INTERVENTION VITALS (1520)',
      vitals: [
        { label: 'BP', value: '104/64', alert: false },
        { label: 'HR', value: '102 bpm', alert: true },
        { label: 'RR', value: '22 /min', alert: true },
        { label: 'SpO₂', value: '95% (2L)', alert: false },
      ],
    },
    {
      id: 'flowsheet',
      label: 'Flowsheet',
      badgeTitle: 'INTAKE, OUTPUT & PAIN FLOWSHEET',
      time: '14:30 – 15:30',
      primaryBox:
        'IV Intake: 200 mL D5 ½ NS infused • Oral Intake: 0 mL (NPO) • Urine Output: 25 mL dark amber urine over 1 hour.',
      directiveTitle: 'NEUROVASCULAR & SKIN CHECKS:',
      directiveBody:
        'Peripheral pulses +1 bilaterally in lower extremities. Skin warm, dry, poor turgor (tenting). Temperature 99.1°F (37.3°C).',
      note: 'Urine output < 30 mL/hr flagged for close renal perfusion surveillance.',
      vitalsTitle: 'SERIAL VITALS TREND (1530)',
      vitals: [
        { label: 'Temp', value: '99.1°F', alert: false },
        { label: 'Pain', value: '7 / 10', alert: true },
        { label: 'Cap Refill', value: '4 sec', alert: true },
        { label: 'UOP', value: '25 mL/h', alert: true },
      ],
    },
    {
      id: 'laboratory',
      label: 'Laboratory Results',
      shortLabel: 'Laboratory',
      badgeTitle: 'LABORATORY RESULTS',
      timeTag: '1530',
      labHighlight: 'Na 147 mEq/L · BUN 32 mg/dL · Hgb 7.1 g/dL · Hct 20%',
      labSecondaryLines: [
        { text: 'Potassium ', bold: '5.5 mEq/L', mid: ' and platelets ', bold2: '130,000/mcL', end: '.' },
        { text: 'Creatinine ', bold: '0.8 mg/dL', mid: '; WBC ', bold2: '8 × 10³ cells/mm³', end: '.' },
      ],
      verifiedRef: 'Ref: Standard S-1',
      casePresentation:
        'Client is a 19–year–old with confirmed sickle cell crisis experiencing severe vaso-occlusive episode and localized tissue hypoxia. Assessment findings require immediate pathophysiological classification.',
    },
  ],
};

export const BUILTIN_NGN_ASSESSMENT_QUESTIONS = [
  // 1. MATRIX GRID
  {
    id: 'ngn-q1-matrix',
    questionNumber: 1,
    type: 'matrix-grid',
    reviewTitle: 'Clinical judgment',
    clientNeedsCategory: 'Physiological Adaptation',
    shortDomain: 'Pathophysiology',
    cohortAvgPercent: 56,
    sectionLabel: 'NCLEX-RN PRACTICE',
    typeBadge: 'MATRIX GRID',
    defaultTab: 'laboratory',
    clientRecord: SICKLE_CELL_CLIENT_RECORD,
    prompt: 'For each finding, identify the supported condition.',
    instruction: 'A finding may support more than one condition. Select all that apply in each row.',
    columns: [
      { id: 'dehydration', label: 'DEHYDRATION' },
      { id: 'impaired_circ', label: 'IMPAIRED CIRC.' },
      { id: 'impaired_gas', label: 'IMPAIRED GAS EXCH.' },
    ],
    rows: [
      {
        id: 'spo2_91',
        finding: 'Oxygen saturation 91% on room air',
        correctColumns: ['impaired_gas'],
      },
      {
        id: 'bp_88_48',
        finding: 'Blood pressure 88/48 mm Hg',
        correctColumns: ['dehydration', 'impaired_circ'],
      },
      {
        id: 'tenting',
        finding: 'Tenting of skin',
        correctColumns: ['dehydration'],
      },
      {
        id: 'cap_refill',
        finding: 'Decreased capillary refill',
        correctColumns: ['impaired_circ'],
      },
      {
        id: 'temp_99_1',
        finding: 'Temperature 99.1°F (37.3°C)',
        correctColumns: [],
      },
      {
        id: 'pain_10',
        finding: 'Pain 10 out of 10',
        correctColumns: ['impaired_circ'],
      },
      {
        id: 'na_147',
        finding: 'Serum sodium 147 mEq/L',
        correctColumns: ['dehydration'],
      },
      {
        id: 'bun_32',
        finding: 'BUN 32 mg/dL',
        correctColumns: ['dehydration'],
      },
      {
        id: 'hgb_7_1',
        finding: 'Hemoglobin 7.1 g/dL',
        correctColumns: ['impaired_circ', 'impaired_gas'],
      },
    ],
    rationale:
      'Hypotension, skin tenting, hypernatremia (Na 147 mEq/L), and elevated BUN (32 mg/dL) reflect intravascular volume depletion (dehydration). Decreased capillary refill, severe vaso-occlusive pain (10/10), hypotension, and anemia (Hgb 7.1 g/dL) indicate impaired peripheral circulation/perfusion. SpO₂ 91% and reduced oxygen-carrying capacity (Hgb 7.1 g/dL) impair gas exchange.',
  },

  // 2. DOSAGE CALCULATION (NUMERIC FILL-IN)
  {
    id: 'ngn-q2-dosage',
    questionNumber: 2,
    type: 'dosage-calc',
    reviewTitle: 'Dosage calculation',
    clientNeedsCategory: 'Pharmacological Therapies',
    shortDomain: 'Pharmacology',
    cohortAvgPercent: 62,
    sectionLabel: 'NCLEX-RN PRACTICE',
    topicBadge: 'PEDIATRIC MEDICATION',
    topicSubheading: 'Clinical Dosage Calculation',
    typeBadge: 'NUMERIC FILL-IN',
    scenarioText:
      'The nurse is preparing to administer an oral liquid antibiotic to a child who is 18 months of age. The child weighs 25.2 lb (11.45 kg).',
    medicationOrder: {
      unitLabel: 'Unit: Pediatrics',
      prescribedDose: '1 mg per kg',
      availableConcentration: '2 mg per mL',
    },
    helperNote:
      'Use metric weight (11.45 kg) to calculate total milligram dose prior to converting to volume.',
    prompt: 'How many mL should the nurse administer?',
    instruction:
      'Enter a numeric response. Round the amount up or down to the appropriate half milliliter.',
    inputLabel: 'Dose to administer',
    unitSuffix: 'mL',
    roundingWarning: 'Round to the nearest 0.5 mL. Do not include the unit in the field.',
    correctNumeric: 5.5,
    acceptedRange: [5.5, 5.7],
    rationale:
      '11.45 kg × 1 mg/kg = 11.45 mg required. Volume = 11.45 mg ÷ (2 mg/mL) = 5.725 mL. Rounding to the nearest half milliliter (0.5 mL) yields 5.5 mL.',
  },

  // 3. DROP-DOWN / CLOZE QUESTION
  {
    id: 'ngn-q3-cloze',
    questionNumber: 3,
    type: 'cloze-dropdown',
    reviewTitle: 'Acute respiratory risk',
    clientNeedsCategory: 'Reduction of Risk Potential',
    shortDomain: 'Acute changes',
    cohortAvgPercent: 58,
    sectionLabel: 'NCLEX-RN PRACTICE',
    typeBadge: 'CLOZE DROP-DOWN',
    defaultTab: 'orders',
    useShortLabLabel: true,
    clientRecord: SICKLE_CELL_CLIENT_RECORD,
    prompt: "Complete the statement about the client's greatest risk.",
    instruction: 'Choose one complication and the strongest evidence supporting it.',
    clauses: [
      {
        id: 'complication',
        prefix: 'The client is at greatest risk for',
        label: 'COMPLICATION',
        placeholder: 'Select complication...',
        options: [
          'Acute chest syndrome',
          'Hypoglycemic shock',
          'Fluid volume overload',
          'Deep vein thrombosis',
        ],
        correctAnswer: 'Acute chest syndrome',
      },
      {
        id: 'evidence',
        prefix: 'as evidenced by',
        label: 'SUPPORTING EVIDENCE',
        placeholder: 'Select supporting evidence...',
        options: [
          'SpO₂ 91% on room air with dyspnea',
          'Temperature of 99.1°F (37.3°C)',
          'Creatinine level of 0.8 mg/dL',
          'Blood pressure of 118/74 mm Hg',
        ],
        correctAnswer: 'SpO₂ 91% on room air with dyspnea',
      },
    ],
    rationale:
      'Acute chest syndrome (ACS) is the leading cause of mortality in adults with sickle cell disease. Hypoxemia (SpO₂ 91% on room air), tachypnea (RR 26/min), and chest pain/dyspnea are hallmark early indicators requiring immediate oxygen therapy and close respiratory monitoring.',
  },

  // 4. DRAG AND DROP WORDS (SENTENCE COMPLETION)
  {
    id: 'ngn-q4-dragdrop',
    questionNumber: 4,
    type: 'drag-drop',
    reviewTitle: 'Prioritization',
    clientNeedsCategory: 'Management of Care',
    shortDomain: 'Prioritization',
    cohortAvgPercent: 55,
    sectionLabel: 'NCLEX-RN PRACTICE',
    typeBadge: 'DRAG WORDS · PLAN OF CARE',
    nextGenTag: 'Sentence Completion',
    defaultTab: 'orders',
    useShortLabLabel: true,
    clientRecord: SICKLE_CELL_CLIENT_RECORD,
    prompt: 'Build the priority nursing plan of care.',
    instruction:
      'Drag one clinical problem and the matching nursing action into the sentence slots below.',
    slots: [
      {
        id: 'slot_1',
        leadText: 'The priority problem is',
        correctWordId: 'w_oxygenation',
      },
      {
        id: 'slot_2',
        leadText: 'so the nurse will',
        correctWordId: 'w_titrate_o2',
      },
      {
        id: 'slot_3',
        leadText: 'and continue to address',
        correctWordId: 'w_acute_pain',
      },
    ],
    wordBank: [
      { id: 'w_oxygenation', text: 'impaired oxygenation' },
      { id: 'w_titrate_o2', text: 'titrate oxygen via NC to maintain SpO₂ ≥95%' },
      { id: 'w_acute_pain', text: 'acute pain' },
      { id: 'w_infection', text: 'risk for infection' },
      { id: 'w_knowledge', text: 'knowledge deficit' },
      { id: 'w_perfusion', text: 'altered tissue perfusion' },
      { id: 'w_npo', text: 'maintain NPO status' },
    ],
    rationale:
      'Following the ABC priority framework, impaired oxygenation (SpO₂ 91%) must be corrected first by titrating supplemental oxygen to keep SpO₂ ≥95%, which halts further sickling, while simultaneously addressing severe acute vaso-occlusive pain.',
  },

  // 5. INCIDENT REPORT (SELECT RELEVANT INFORMATION)
  {
    id: 'ngn-q5-incident',
    questionNumber: 5,
    type: 'incident-report',
    reviewTitle: 'Safety & incident review',
    clientNeedsCategory: 'Safety and Infection Control',
    shortDomain: 'Safety',
    cohortAvgPercent: 60,
    sectionLabel: 'NCLEX-RN PRACTICE',
    typeBadge: 'INCIDENT REPORT · SELECT RELEVANT INFO',
    defaultTab: 'nurses-notes',
    clientRecord: SICKLE_CELL_CLIENT_RECORD,
    prompt:
      'Select the statements in the nursing handoff event log that require an incident report or immediate safety follow-up.',
    instruction:
      'Click to highlight each relevant statement from the clinical shift narrative below. Select all that apply.',
    reportHeader: 'CLINICAL SHIFT EVENT NARRATIVE · UNIT 4B',
    reportTimestamp: '16:10 HRS',
    segments: [
      {
        id: 'seg_1',
        text: 'At 15:45, the client requested repositioning and warm blankets for bilateral leg discomfort.',
        isRelevant: false,
      },
      {
        id: 'seg_2',
        text: 'A chilled reusable ice pack was applied directly to the client’s left knee by assistive personnel to relieve joint swelling.',
        isRelevant: true,
      },
      {
        id: 'seg_3',
        text: 'Incentive spirometry was coached at the bedside with 10 slow sustained inspirations completed.',
        isRelevant: false,
      },
      {
        id: 'seg_4',
        text: 'The IV infusion pump was found set at 400 mL/hr instead of the prescribed 200 mL/hr D5 ½ NS rate.',
        isRelevant: true,
      },
      {
        id: 'seg_5',
        text: 'Continuous pulse oximetry remained attached to the right index finger reading 96% on 2 L/min nasal cannula.',
        isRelevant: false,
      },
      {
        id: 'seg_6',
        text: 'The bedside siderails were left lowered with the bed in high position while the sedated client rested after IV morphine.',
        isRelevant: true,
      },
    ],
    rationale:
      'Cold application (ice packs) triggers vasoconstriction and worsens sickling/ischemia; an IV pump running at double the prescribed rate (400 mL/hr vs. 200 mL/hr) is a medication/infusion error; and leaving the bed in a high position with rails down after opioid administration creates an immediate fall hazard requiring intervention and incident reporting.',
  },

  // 6. MULTIPLE RESPONSE / MULTIPLE SELECT (SATA)
  {
    id: 'ngn-q6-sata',
    questionNumber: 6,
    type: 'multiple-response',
    reviewTitle: 'Multiple response',
    clientNeedsCategory: 'Physiological Adaptation',
    shortDomain: 'Fundamentals',
    cohortAvgPercent: 56,
    sectionLabel: 'NCLEX-RN PRACTICE',
    typeBadge: 'MULTIPLE RESPONSE · SELECT ALL THAT APPLY',
    defaultTab: 'orders',
    clientRecord: SICKLE_CELL_CLIENT_RECORD,
    prompt:
      'Which nursing interventions are appropriate to include in the ongoing care plan for this client in vaso-occlusive crisis?',
    instruction: 'Select all that apply.',
    options: [
      {
        id: 'opt_a',
        label: 'A',
        text: 'Administer prescribed intravenous hypotonic fluids (D5 ½ NS) to reduce blood viscosity and reverse sickling.',
        isCorrect: true,
      },
      {
        id: 'opt_b',
        label: 'B',
        text: 'Apply cold compresses to painful joints every 2 hours to numb localized nociceptors.',
        isCorrect: false,
      },
      {
        id: 'opt_c',
        label: 'C',
        text: 'Coach hourly incentive spirometry while awake to prevent atelectasis and acute chest syndrome.',
        isCorrect: true,
      },
      {
        id: 'opt_d',
        label: 'D',
        text: 'Administer scheduled opioid analgesics and reassess pain and respiratory status frequently.',
        isCorrect: true,
      },
      {
        id: 'opt_e',
        label: 'E',
        text: 'Restrict intravenous and oral hydration once pain drops below 7 out of 10.',
        isCorrect: false,
      },
      {
        id: 'opt_f',
        label: 'F',
        text: 'Monitor oxygen saturation continuously and titrate supplemental oxygen to maintain SpO₂ ≥95%.',
        isCorrect: true,
      },
    ],
    rationale:
      'Core management of vaso-occlusive crisis (HOP: Hydration, Oxygenation, Pain relief) includes hypotonic IV hydration to draw fluid into sickled RBCs, supplemental oxygen to maintain SpO₂ ≥95%, hourly incentive spirometry to prevent acute chest syndrome, and aggressive opioid analgesia. Cold compresses and fluid restriction are contraindicated.',
  },
];

/**
 * Normalizes raw API question objects if loaded from an external endpoint
 * so custom backend payloads work seamlessly alongside the NGN renderer.
 */
function normalizeExternalQuestions(rawList) {
  if (!Array.isArray(rawList) || rawList.length === 0) return null;

  return rawList.map((item, idx) => {
    const rawType = String(item.type || item.questionType || '').toLowerCase();
    let normalizedType = item.type;

    if (rawType.includes('matrix')) normalizedType = 'matrix-grid';
    else if (rawType.includes('dosage') || rawType.includes('numeric') || rawType.includes('calc'))
      normalizedType = 'dosage-calc';
    else if (rawType.includes('incident') || rawType.includes('highlight'))
      normalizedType = 'incident-report';
    else if (rawType.includes('drag')) normalizedType = 'drag-drop';
    else if (rawType.includes('cloze') || rawType.includes('dropdown') || rawType.includes('drop-down'))
      normalizedType = 'cloze-dropdown';
    else if (
      rawType.includes('multiple') ||
      rawType.includes('sata') ||
      Array.isArray(item.correctOptionIds)
    )
      normalizedType = 'multiple-response';

    return {
      ...item,
      id: item.id || `api-q-${idx + 1}`,
      questionNumber: item.questionNumber || idx + 1,
      type: normalizedType || 'multiple-response',
      clientRecord: item.clientRecord || SICKLE_CELL_CLIENT_RECORD,
    };
  });
}

export async function loadAssessmentQuestions(assessmentContext = {}) {
  // 1. Direct prop / context questions if supplied
  if (Array.isArray(assessmentContext?.questions) && assessmentContext.questions.length > 0) {
    return normalizeExternalQuestions(assessmentContext.questions);
  }

  // 2. Global preloaded assessment payload if injected by host
  if (
    typeof window !== 'undefined' &&
    Array.isArray(window.__CANOPEDIA_ASSESSMENT_DATA__) &&
    window.__CANOPEDIA_ASSESSMENT_DATA__.length > 0
  ) {
    return normalizeExternalQuestions(window.__CANOPEDIA_ASSESSMENT_DATA__);
  }

  // 3. Configured Backend API fetch if VITE_API_BASE_URL is defined
  const apiBase = import.meta.env?.VITE_API_BASE_URL;
  if (apiBase) {
    try {
      const endpoint = assessmentContext?.assessmentId
        ? `${apiBase.replace(/\/$/, '')}/assessments/${assessmentContext.assessmentId}/questions`
        : `${apiBase.replace(/\/$/, '')}/assessments/questions`;
      const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
      });
      if (response.ok) {
        const payload = await response.json();
        const list = Array.isArray(payload) ? payload : payload?.questions || payload?.data;
        const normalized = normalizeExternalQuestions(list);
        if (normalized) return normalized;
      }
    } catch {
      // Gracefully fall back to bundled NGN clinical item bank when offline/unconfigured
    }
  }

  // 4. Built-in Conopidea NGN Clinical Assessment Bank
  return BUILTIN_NGN_ASSESSMENT_QUESTIONS;
}

/**
 * Evaluates whether a student's saved response for a given question is answered & correct.
 */
export function evaluateQuestionResponse(question, response) {
  if (!question) return { isAnswered: false, isCorrect: false };

  switch (question.type) {
    case 'matrix-grid': {
      // response: { [rowId]: string[] }
      const map = response && typeof response === 'object' ? response : {};
      const anyChecked = Object.values(map).some((arr) => Array.isArray(arr) && arr.length > 0);
      if (!anyChecked) return { isAnswered: false, isCorrect: false };

      const allRowsMatch = (question.rows || []).every((row) => {
        const picked = [...(map[row.id] || [])].sort();
        const expected = [...(row.correctColumns || [])].sort();
        return (
          picked.length === expected.length &&
          picked.every((val, idx) => val === expected[idx])
        );
      });
      return { isAnswered: true, isCorrect: allRowsMatch };
    }

    case 'dosage-calc': {
      // response: { value: string, confirmed?: boolean } or string
      const rawVal =
        typeof response === 'object' && response !== null ? response.value : response;
      const strVal = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';
      if (!strVal) return { isAnswered: false, isCorrect: false };
      const numeric = parseFloat(strVal);
      if (Number.isNaN(numeric)) return { isAnswered: true, isCorrect: false };
      const isCorrect =
        Math.abs(numeric - question.correctNumeric) < 0.01 ||
        (Array.isArray(question.acceptedRange) &&
          numeric >= question.acceptedRange[0] &&
          numeric <= question.acceptedRange[1]);
      return { isAnswered: true, isCorrect };
    }

    case 'cloze-dropdown': {
      // response: { [clauseId]: string }
      const map = response && typeof response === 'object' ? response : {};
      const clauses = question.clauses || [];
      const completedCount = clauses.filter((c) => Boolean(map[c.id])).length;
      if (completedCount === 0) return { isAnswered: false, isCorrect: false };
      const isFullyAnswered = completedCount === clauses.length;
      const isCorrect =
        isFullyAnswered && clauses.every((c) => map[c.id] === c.correctAnswer);
      return { isAnswered: isFullyAnswered, isCorrect };
    }

    case 'drag-drop': {
      // response: { [slotId]: wordId }
      const map = response && typeof response === 'object' ? response : {};
      const slots = question.slots || [];
      const filledCount = slots.filter((s) => Boolean(map[s.id])).length;
      if (filledCount === 0) return { isAnswered: false, isCorrect: false };
      const isFullyAnswered = filledCount === slots.length;
      const isCorrect =
        isFullyAnswered && slots.every((s) => map[s.id] === s.correctWordId);
      return { isAnswered: isFullyAnswered, isCorrect };
    }

    case 'incident-report': {
      // response: string[] of selected segment IDs
      const selected = Array.isArray(response) ? response : [];
      if (selected.length === 0) return { isAnswered: false, isCorrect: false };
      const expected = (question.segments || [])
        .filter((s) => s.isRelevant)
        .map((s) => s.id)
        .sort();
      const picked = [...selected].sort();
      const isCorrect =
        picked.length === expected.length &&
        picked.every((id, idx) => id === expected[idx]);
      return { isAnswered: true, isCorrect };
    }

    case 'multiple-response': {
      // response: string[] of selected option IDs
      const selected = Array.isArray(response) ? response : [];
      if (selected.length === 0) return { isAnswered: false, isCorrect: false };
      const expected = (question.options || [])
        .filter((o) => o.isCorrect)
        .map((o) => o.id)
        .sort();
      const picked = [...selected].sort();
      const isCorrect =
        picked.length === expected.length &&
        picked.every((id, idx) => id === expected[idx]);
      return { isAnswered: true, isCorrect };
    }

    default:
      return { isAnswered: Boolean(response), isCorrect: false };
  }
}

const LATEST_RESULT_STORAGE_KEY = 'canopedia_latest_assessment_result';
const RESULTS_HISTORY_STORAGE_KEY = 'canopedia_assessment_results_history';

const TOPIC_TAKEAWAYS = {
  'matrix-grid': {
    topicTitle: 'Hemodynamics & Perfusion',
    referenceTitle: 'Hemodynamics Clinical Reference Note',
    referenceContent:
      'In sickle cell vaso-occlusive crisis, distinguish intravascular dehydration (elevated Na⁺ 147 mEq/L, BUN 32 mg/dL, skin tenting, hypotension) from impaired peripheral perfusion (prolonged capillary refill, severe ischemic pain) and impaired gas exchange (SpO₂ < 95%, Hgb 7.1 g/dL).',
    strengthPhrase: 'classifying pathophysiological perfusion and laboratory cues',
    revisitPhrase: 'early compensatory hemodynamic and fluid-volume indicators—especially heart-rate and blood-pressure patterns in hypovolemia',
  },
  'dosage-calc': {
    topicTitle: 'Pediatric Dosage Calculation',
    referenceTitle: 'Weight-Based Pediatric Dosing Reference Note',
    referenceContent:
      'Always verify weight in kilograms before computing mg/kg doses, convert total milligrams using available concentration (mg/mL), and apply clinical rounding rules only at the final step.',
    strengthPhrase: 'safe pediatric weight-based dosage conversions',
    revisitPhrase: 'multi-step mg/kg liquid volume calculations and half-milliliter rounding checkpoints',
  },
  'cloze-dropdown': {
    topicTitle: 'Acute Chest Syndrome Recognition',
    referenceTitle: 'Acute Chest Syndrome Clinical Reference Note',
    referenceContent:
      'Acute chest syndrome presents with new pulmonary infiltrates, chest pain, tachypnea, and hypoxemia (SpO₂ < 95%). Immediate oxygen titration, incentive spirometry, and close respiratory surveillance prevent rapid decompensation.',
    strengthPhrase: 'identifying high-risk respiratory complications from bedside cues',
    revisitPhrase: 'linking acute hypoxemia and dyspnea cues to life-threatening vaso-occlusive complications',
  },
  'drag-drop': {
    topicTitle: 'ABC Priority Plan of Care',
    referenceTitle: 'NGN Priority Care Planning Reference Note',
    referenceContent:
      'Apply the ABC (Airway, Breathing, Circulation) framework: correct hypoxemia first by titrating supplemental O₂ to maintain SpO₂ ≥95%, while concurrently managing severe vaso-occlusive pain and IV hydration.',
    strengthPhrase: 'sequencing priority oxygenation and pain-management interventions',
    revisitPhrase: 'prioritizing airway/oxygenation targets ahead of secondary nursing diagnoses',
  },
  'incident-report': {
    topicTitle: 'Clinical Safety & Incident Reporting',
    referenceTitle: 'Patient Safety & Variance Reporting Reference Note',
    referenceContent:
      'File an incident/variance report and intervene immediately for thermal vasoconstriction hazards (ice packs in sickle cell crisis), IV infusion pump rate discrepancies, and unmitigated opioid fall risks.',
    strengthPhrase: 'detecting bedside safety variances requiring immediate intervention',
    revisitPhrase: 'high-alert IV pump verification and fall-prevention precautions following opioid administration',
  },
  'multiple-response': {
    topicTitle: 'Vaso-Occlusive Crisis Interventions',
    referenceTitle: 'Sickle Cell Crisis (HOP Protocol) Reference Note',
    referenceContent:
      'Standard vaso-occlusive crisis care follows HOP: Hydration (hypotonic IV fluids to reduce RBC sickling), Oxygenation (keep SpO₂ ≥95% + hourly incentive spirometry), and Pain control (scheduled opioids + warm compresses, never cold).',
    strengthPhrase: 'selecting evidence-based hydration, oxygenation, and analgesia orders',
    revisitPhrase: 'contraindicated thermal interventions and therapeutic hypotonic fluid goals',
  },
};

export function formatDurationShort(totalSeconds) {
  const safeSecs = Math.max(1, Math.round(Number(totalSeconds) || 0));
  const mins = Math.floor(safeSecs / 60);
  const secs = safeSecs % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

export function formatCompletedTimestamp(dateObj = new Date()) {
  try {
    const datePart = dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timePart = dateObj.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${datePart} · ${timePart}`;
  } catch {
    return 'Completed just now';
  }
}

/**
 * Computes dynamic summary metrics, personalized Learning Takeaway, and weak-area questions
 * directly from the student's actual submitted answers and elapsed exam duration.
 */
export function buildAndSaveAssessmentResult({
  questions = [],
  answers = {},
  flagged = {},
  elapsedSeconds = 0,
  assessmentTitle = 'RECOGNITION PRACTICE',
  returnRoute = 'courses',
}) {
  const totalQuestions = questions.length;
  const itemEvaluations = questions.map((q) => {
    const evalResult = evaluateQuestionResponse(q, answers[q.id]);
    return {
      question: q,
      userAnswer: answers[q.id],
      isAnswered: evalResult.isAnswered,
      isCorrect: evalResult.isCorrect,
      isFlagged: Boolean(flagged[q.id]),
    };
  });

  const completedCount = itemEvaluations.filter((i) => i.isAnswered).length;
  const correctCount = itemEvaluations.filter((i) => i.isCorrect).length;
  const reviewItemsCount = Math.max(0, totalQuestions - correctCount);

  const completionRatePercent =
    totalQuestions > 0 ? Math.round((completedCount / totalQuestions) * 100) : 0;
  const scorePercent =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const benchmarkPercent = 70;
  const benchmarkMet = scorePercent >= benchmarkPercent;

  const safeElapsed = Math.max(1, Math.round(Number(elapsedSeconds) || 0));
  const avgSecondsPerQuestion =
    totalQuestions > 0 ? Math.max(1, Math.round(safeElapsed / totalQuestions)) : safeElapsed;

  // Build personalized Learning Takeaway based on actual correct vs. missed items
  const correctItems = itemEvaluations.filter((i) => i.isCorrect);
  const incorrectItems = itemEvaluations.filter((i) => !i.isCorrect);

  const strongestMeta =
    (correctItems[0] && TOPIC_TAKEAWAYS[correctItems[0].question.type]) ||
    TOPIC_TAKEAWAYS['matrix-grid'];
  const primaryWeakMeta =
    (incorrectItems[0] && TOPIC_TAKEAWAYS[incorrectItems[0].question.type]) ||
    strongestMeta;

  let takeawayMessage = '';
  if (incorrectItems.length === 0 && totalQuestions > 0) {
    takeawayMessage = `Outstanding clinical judgment—you accurately mastered ${strongestMeta.strengthPhrase} across all ${totalQuestions} assessment items with zero remediation gaps.`;
  } else if (correctItems.length > 0) {
    takeawayMessage = `You consistently recognized ${strongestMeta.strengthPhrase}. Revisit ${primaryWeakMeta.revisitPhrase}.`;
  } else {
    takeawayMessage = `Focus your remediation on ${primaryWeakMeta.revisitPhrase} before retaking this clinical benchmark.`;
  }

  const weakQuestionIds = incorrectItems.map((i) => i.question.id);
  const weakQuestions = incorrectItems.map((i) => i.question);

  // Format MM:SS clock string (e.g. "24:18")
  const minsClock = Math.floor(safeElapsed / 60);
  const secsClock = safeElapsed % 60;
  const timeSpentClock = `${String(minsClock).padStart(2, '0')}:${String(secsClock).padStart(
    2,
    '0'
  )}`;

  // Full date string (e.g. "October 5, 2026")
  let completedDateLong = 'Today';
  try {
    completedDateLong = new Date().toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    completedDateLong = 'Completed today';
  }

  // Lookup previous attempts from history to compute attempt number & prior category scores
  let existingHistory = [];
  try {
    const rawHist = localStorage.getItem(RESULTS_HISTORY_STORAGE_KEY);
    existingHistory = rawHist ? JSON.parse(rawHist) : [];
    if (!Array.isArray(existingHistory)) existingHistory = [];
  } catch {
    existingHistory = [];
  }

  const priorAttemptRecord = existingHistory[0] || null;
  const attemptIndex = existingHistory.length + 1;
  const maxAttempts = 6;
  const attemptBadgeText = `Attempt ${Math.min(attemptIndex, maxAttempts)} of ${maxAttempts}`;

  // Dynamic performance level, rank pill, and Chance of Passing band
  let passingZoneLabel = 'Passing Zone';
  let rankBadgeText = 'Top 41%';
  let readinessHeading = "You're nearly ready";
  let readinessFeedback =
    'Keep sharpening your weaker topics to close the final gap before your scheduled exam date.';
  let chanceOfPassingBand = 'High'; // 'Low' | 'Borderline' | 'High' | 'Very High'
  let chanceOfPassingLabel = 'High Probability';

  if (scorePercent >= 85) {
    passingZoneLabel = 'Passing Zone';
    rankBadgeText = `Top ${Math.max(5, 100 - scorePercent)}%`;
    readinessHeading = "You're exam ready";
    readinessFeedback =
      'Excellent clinical mastery across NextGen item formats. Maintain momentum until exam day.';
    chanceOfPassingBand = 'Very High';
    chanceOfPassingLabel = 'Very High Probability';
  } else if (scorePercent >= 70) {
    passingZoneLabel = 'Passing Zone';
    rankBadgeText = `Top ${Math.max(18, 114 - scorePercent)}%`;
    readinessHeading = "You're nearly ready";
    readinessFeedback =
      'Keep sharpening your weaker topics to close the final gap before your scheduled exam date.';
    chanceOfPassingBand = 'High';
    chanceOfPassingLabel = 'High Probability';
  } else if (scorePercent >= 55) {
    passingZoneLabel = 'Borderline';
    rankBadgeText = 'Building Mastery';
    readinessHeading = 'Close to passing standard';
    readinessFeedback =
      'Review missed clinical rationales and practice targeted weak areas to reach the passing zone.';
    chanceOfPassingBand = 'Borderline';
    chanceOfPassingLabel = 'Borderline Probability';
  } else {
    passingZoneLabel = 'Needs Focus';
    rankBadgeText = 'Remediation Needed';
    readinessHeading = 'Strengthen core concepts';
    readinessFeedback =
      'Focus on foundational safety, pharmacology, and ABC prioritization before your next benchmark.';
    chanceOfPassingBand = 'Low';
    chanceOfPassingLabel = 'Low Probability';
  }

  // Compute NCLEX-RN Client Needs category breakdown dynamically from submitted questions
  const categoryBuckets = {};
  itemEvaluations.forEach(({ question: q, isCorrect }) => {
    const catName =
      q.clientNeedsCategory ||
      q.category ||
      (q.type === 'dosage-calc'
        ? 'Pharmacological Therapies'
        : q.type === 'incident-report'
        ? 'Safety and Infection Control'
        : q.type === 'drag-drop'
        ? 'Management of Care'
        : q.type === 'cloze-dropdown'
        ? 'Reduction of Risk Potential'
        : 'Physiological Adaptation');

    if (!categoryBuckets[catName]) {
      categoryBuckets[catName] = {
        category: catName,
        correct: 0,
        total: 0,
        cohortSum: 0,
      };
    }
    categoryBuckets[catName].total += 1;
    if (isCorrect) categoryBuckets[catName].correct += 1;
    categoryBuckets[catName].cohortSum += Number(q.cohortAvgPercent || 57);
  });

  const priorCategoryMap = {};
  if (Array.isArray(priorAttemptRecord?.categoryBreakdown)) {
    priorAttemptRecord.categoryBreakdown.forEach((c) => {
      priorCategoryMap[c.category] = c.percent;
    });
  }

  const categoryBreakdown = Object.values(categoryBuckets).map((bucket) => {
    const percent =
      bucket.total > 0 ? Math.round((bucket.correct / bucket.total) * 100) : 0;
    const cohortAvg =
      bucket.total > 0 ? Math.round(bucket.cohortSum / bucket.total) : 57;
    const priorPercent =
      priorCategoryMap[bucket.category] !== undefined
        ? priorCategoryMap[bucket.category]
        : 0;
    return {
      category: bucket.category,
      correct: bucket.correct,
      total: bucket.total,
      percent,
      priorPercent,
      cohortAvg,
      needsRemediation: percent < 50,
    };
  });

  // Strong Foundations vs. Focus Area to Improve derived dynamically from items/categories
  const strongDomainsSet = new Set();
  const weakDomainsSet = new Set();

  itemEvaluations.forEach(({ question: q, isCorrect }) => {
    const domainLabel =
      q.shortDomain ||
      q.reviewTitle ||
      q.clientNeedsCategory ||
      TOPIC_TAKEAWAYS[q.type]?.topicTitle ||
      'Clinical Judgment';
    if (isCorrect) {
      strongDomainsSet.add(domainLabel);
    } else {
      weakDomainsSet.add(domainLabel);
    }
  });

  const strongFoundationsList = Array.from(strongDomainsSet).slice(0, 4);
  const focusAreasList = Array.from(weakDomainsSet).slice(0, 4);

  const resultRecord = {
    id: `result-${Date.now()}`,
    completedAtIso: new Date().toISOString(),
    completedAtFormatted: formatCompletedTimestamp(new Date()),
    completedDateLong,
    assessmentDisplayName: assessmentTitle || 'NCLEX-RN readiness assessment',
    attemptBadgeText,
    practiceLabel: (assessmentTitle || 'RECOGNITION PRACTICE').toUpperCase(),
    returnRoute: returnRoute || 'courses',
    totalQuestions,
    completedCount,
    completionRatePercent,
    scorePercent,
    benchmarkPercent,
    benchmarkMet,
    passingZoneLabel,
    rankBadgeText,
    readinessHeading,
    readinessFeedback,
    chanceOfPassingBand,
    chanceOfPassingLabel,
    correctCount,
    reviewItemsCount,
    elapsedSeconds: safeElapsed,
    timeSpentClock,
    timeSpentFormatted: formatDurationShort(safeElapsed),
    avgTimePerQuestionFormatted: `~${formatDurationShort(avgSecondsPerQuestion)} / question`,
    strongFoundationsList,
    focusAreasList,
    categoryBreakdown,
    takeaway: {
      badge: 'LEARNING TAKEAWAY',
      category: 'Clinical Synthesis',
      message: takeawayMessage,
      referenceLinkLabel: `View ${primaryWeakMeta.referenceTitle}`,
      referenceTitle: primaryWeakMeta.referenceTitle,
      topicTitle: primaryWeakMeta.topicTitle,
      referenceContent: primaryWeakMeta.referenceContent,
    },
    questions,
    answers,
    flagged,
    weakQuestionIds,
    weakQuestions,
    itemEvaluations: itemEvaluations.map((e) => ({
      questionId: e.question.id,
      isAnswered: e.isAnswered,
      isCorrect: e.isCorrect,
      isFlagged: e.isFlagged,
    })),
  };

  // Persist locally
  try {
    sessionStorage.setItem(LATEST_RESULT_STORAGE_KEY, JSON.stringify(resultRecord));
    localStorage.setItem(LATEST_RESULT_STORAGE_KEY, JSON.stringify(resultRecord));

    const existingHistoryRaw = localStorage.getItem(RESULTS_HISTORY_STORAGE_KEY);
    const historyList = existingHistoryRaw ? JSON.parse(existingHistoryRaw) : [];
    const updatedHistory = [resultRecord, ...(Array.isArray(historyList) ? historyList : [])].slice(
      0,
      20
    );
    localStorage.setItem(RESULTS_HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch {
    // Ignore storage quota errors
  }

  // Optional non-blocking POST to backend API if VITE_API_BASE_URL is configured
  const apiBase = import.meta.env?.VITE_API_BASE_URL;
  if (apiBase) {
    fetch(`${apiBase.replace(/\/$/, '')}/assessments/results`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        assessmentTitle,
        totalQuestions,
        completedCount,
        correctCount,
        scorePercent,
        elapsedSeconds: safeElapsed,
        answers,
        completedAt: resultRecord.completedAtIso,
      }),
    }).catch(() => {});
  }

  return resultRecord;
}

export function getLatestAssessmentResult() {
  try {
    const fromSession = sessionStorage.getItem(LATEST_RESULT_STORAGE_KEY);
    if (fromSession) return JSON.parse(fromSession);
    const fromLocal = localStorage.getItem(LATEST_RESULT_STORAGE_KEY);
    if (fromLocal) return JSON.parse(fromLocal);
  } catch {
    // ignore parse errors
  }
  return null;
}

/**
 * Formats a human-readable summary of the user's answer vs. the correct answer for Review Answers mode.
 */
export function getQuestionReviewDetails(question, response) {
  if (!question) return { userSummary: 'No answer submitted', correctSummary: '' };

  switch (question.type) {
    case 'matrix-grid': {
      const map = response && typeof response === 'object' ? response : {};
      const colLabels = {};
      (question.columns || []).forEach((c) => {
        colLabels[c.id] = c.label;
      });
      const rowDetails = (question.rows || []).map((r) => {
        const picked = (map[r.id] || []).map((id) => colLabels[id] || id);
        const expected = (r.correctColumns || []).map((id) => colLabels[id] || id);
        const rowCorrect =
          picked.length === expected.length &&
          [...picked].sort().every((v, idx) => v === [...expected].sort()[idx]);
        return {
          label: r.finding,
          userValue: picked.length > 0 ? picked.join(', ') : 'None selected',
          correctValue: expected.length > 0 ? expected.join(', ') : 'None applicable',
          isCorrect: rowCorrect,
        };
      });
      return { type: 'rows', rowDetails };
    }

    case 'dosage-calc': {
      const rawVal =
        typeof response === 'object' && response !== null ? response.value : response;
      const userStr = rawVal ? `${rawVal} ${question.unitSuffix || 'mL'}` : 'Not answered';
      const correctStr = `${question.correctNumeric} ${question.unitSuffix || 'mL'}`;
      return {
        type: 'single',
        userSummary: userStr,
        correctSummary: correctStr,
      };
    }

    case 'cloze-dropdown': {
      const map = response && typeof response === 'object' ? response : {};
      const rowDetails = (question.clauses || []).map((c) => ({
        label: `${c.prefix} (${c.label})`,
        userValue: map[c.id] || 'Not selected',
        correctValue: c.correctAnswer,
        isCorrect: map[c.id] === c.correctAnswer,
      }));
      return { type: 'rows', rowDetails };
    }

    case 'drag-drop': {
      const map = response && typeof response === 'object' ? response : {};
      const bankMap = {};
      (question.wordBank || []).forEach((w) => {
        bankMap[w.id] = w.text;
      });
      const rowDetails = (question.slots || []).map((s) => {
        const pickedId = map[s.id];
        return {
          label: s.leadText,
          userValue: pickedId ? bankMap[pickedId] || pickedId : 'Empty slot',
          correctValue: bankMap[s.correctWordId] || s.correctWordId,
          isCorrect: pickedId === s.correctWordId,
        };
      });
      return { type: 'rows', rowDetails };
    }

    case 'incident-report': {
      const selected = Array.isArray(response) ? response : [];
      const rowDetails = (question.segments || []).map((seg) => {
        const wasPicked = selected.includes(seg.id);
        return {
          label: seg.text,
          userValue: wasPicked ? 'Selected' : 'Not selected',
          correctValue: seg.isRelevant ? 'Requires Incident Follow-up' : 'Routine / Appropriate Care',
          isCorrect: wasPicked === Boolean(seg.isRelevant),
        };
      });
      return { type: 'rows', rowDetails };
    }

    case 'multiple-response': {
      const selected = Array.isArray(response) ? response : [];
      const rowDetails = (question.options || []).map((opt) => {
        const wasPicked = selected.includes(opt.id);
        return {
          label: opt.text,
          userValue: wasPicked ? 'Selected' : 'Not selected',
          correctValue: opt.isCorrect ? 'Correct Intervention' : 'Contraindicated / Incorrect',
          isCorrect: wasPicked === Boolean(opt.isCorrect),
        };
      });
      return { type: 'rows', rowDetails };
    }

    default:
      return { type: 'single', userSummary: 'Submitted', correctSummary: '' };
  }
}

/**
 * Computes rich NGN partial-credit scoring, remediation feedback, key findings breakdown,
 * and clinical takeaway for a single submitted question on the Detailed Review Answers page.
 */
export function getDetailedItemAnalysis(question, response, elapsedTotalSeconds = 0, totalQuestions = 1) {
  if (!question) {
    return {
      scoredPoints: 0,
      maxPoints: 1,
      scoringRule: '0 / 1 rule',
      typeLabel: 'CLINICAL ITEM',
      hintTag: 'Review item',
      isFullyCorrect: false,
      feedbackTitle: 'Not answered',
      feedbackBody: 'No response was recorded for this question.',
      remediationHeading: 'Clinical Remediation',
      remediationBody: '',
      keyPointsTitle: 'Why these findings matter',
      keyPoints: [],
      clinicalTakeaway: '',
      estimatedItemSeconds: 1,
    };
  }

  const evalStatus = evaluateQuestionResponse(question, response);
  const avgSecs = Math.max(1, Math.round((Number(elapsedTotalSeconds) || 6) / Math.max(1, totalQuestions)));

  switch (question.type) {
    case 'matrix-grid': {
      const userMap = response && typeof response === 'object' ? response : {};
      const colLookup = {};
      (question.columns || []).forEach((c) => {
        colLookup[c.id] = c.label;
      });

      let rawPoints = 0;
      let maxPoints = 0;
      let firstWrongFinding = null;

      const keyPoints = [];
      (question.rows || []).forEach((row) => {
        const expected = row.correctColumns || [];
        const picked = Array.isArray(userMap[row.id]) ? userMap[row.id] : [];
        maxPoints += expected.length;

        picked.forEach((colId) => {
          if (expected.includes(colId)) {
            rawPoints += 1;
          } else {
            rawPoints -= 1;
            if (!firstWrongFinding) {
              firstWrongFinding = {
                title: `${row.finding} → ${colLookup[colId] || colId}`,
                body: `${row.finding} does not directly indicate ${(colLookup[colId] || colId).toLowerCase()}. Match each clinical cue to its primary pathophysiological mechanism.`,
              };
            }
          }
        });

        if (expected.length > 0 && keyPoints.length < 4) {
          keyPoints.push({
            title: row.finding,
            description: `Supports ${expected.map((id) => colLookup[id] || id).join(' & ')} based on the client's acute sickle cell crisis presentation.`,
          });
        }
      });

      const scoredPoints = Math.max(0, rawPoints);
      return {
        scoredPoints,
        maxPoints: Math.max(1, maxPoints),
        scoringRule: '+ / – rule',
        typeLabel: 'MATRIX GRID',
        hintTag: `${(question.rows || []).length} assessment rows`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Spot on!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? 'You accurately mapped every clinical assessment finding to its underlying pathophysiological condition.'
          : 'One or more condition mappings were missed or over-selected. Separate volume depletion cues from hypoxia and perfusion deficits.',
        remediationHeading: firstWrongFinding
          ? `Rationale: ${firstWrongFinding.title}`
          : 'Matrix Classification Synthesis',
        remediationBody: firstWrongFinding
          ? firstWrongFinding.body
          : question.rationale,
        keyPointsTitle: 'Why these findings matter',
        keyPoints,
        clinicalTakeaway:
          'Differentiate intravascular dehydration (elevated Na⁺, BUN, skin tenting) from impaired perfusion and gas exchange.',
        estimatedItemSeconds: avgSecs,
      };
    }

    case 'dosage-calc': {
      const rawVal =
        typeof response === 'object' && response !== null ? response.value : response;
      const enteredStr = rawVal !== undefined && rawVal !== null ? String(rawVal).trim() : '';
      const scoredPoints = evalStatus.isCorrect ? 1 : 0;

      return {
        scoredPoints,
        maxPoints: 1,
        scoringRule: '0 / 1 rule',
        typeLabel: 'DOSAGE CALCULATION',
        hintTag: `Round to 0.5 ${question.unitSuffix || 'mL'}`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Exact calculation!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? `Your calculated volume (${enteredStr} ${question.unitSuffix || 'mL'}) matches the verified pediatric medication order.`
          : `Your response (${enteredStr || 'blank'}) differs from the safe target dose of ${question.correctNumeric} ${question.unitSuffix || 'mL'}. Verify weight-based mg conversion before dividing by concentration.`,
        remediationHeading: enteredStr
          ? `Rationale: ${enteredStr} ${question.unitSuffix || 'mL'} vs. ${question.correctNumeric} ${question.unitSuffix || 'mL'}`
          : 'Pediatric Dose Calculation Walkthrough',
        remediationBody: question.rationale,
        keyPointsTitle: 'Calculation safety checkpoints',
        keyPoints: [
          {
            title: 'Step 1 · Verify Metric Weight',
            description: 'Use 11.45 kg (not 25.2 lb) to compute the prescribed milligram dose: 11.45 kg × 1 mg/kg = 11.45 mg.',
          },
          {
            title: 'Step 2 · Convert Mass to Volume',
            description: 'Divide required dose by available concentration: 11.45 mg ÷ 2 mg/mL = 5.725 mL.',
          },
          {
            title: 'Step 3 · Apply Rounding Protocol',
            description: 'Rounding 5.725 mL to the nearest 0.5 mL yields 5.5 mL for safe oral syringe measurement.',
          },
        ],
        clinicalTakeaway:
          'Convert pounds to kilograms first and round only at the final step according to institutional medication policy.',
        estimatedItemSeconds: avgSecs,
      };
    }

    case 'cloze-dropdown': {
      const userMap = response && typeof response === 'object' ? response : {};
      const clauses = question.clauses || [];
      let scoredPoints = 0;
      let wrongClause = null;

      const keyPoints = clauses.map((c) => {
        const picked = userMap[c.id];
        if (picked === c.correctAnswer) {
          scoredPoints += 1;
        } else if (!wrongClause) {
          wrongClause = {
            picked: picked || 'Unselected dropdown',
            clause: c,
          };
        }
        return {
          title: `${c.label}: ${c.correctAnswer}`,
          description: `Directly links "${c.prefix}" to the client's highest-priority physiological risk.`,
        };
      });

      return {
        scoredPoints,
        maxPoints: Math.max(1, clauses.length),
        scoringRule: '0 / 1 per blank',
        typeLabel: 'CLOZE DROP-DOWN',
        hintTag: `Complete ${clauses.length} dropdowns`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Accurate clinical synthesis!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? 'Both dropdown selections accurately identify the primary complication and supporting bedside evidence.'
          : 'Review how acute hypoxemia and tachypnea point to the most life-threatening complication in sickle cell crisis.',
        remediationHeading: wrongClause
          ? `Rationale: ${wrongClause.picked}`
          : 'Complication & Evidence Rationale',
        remediationBody: wrongClause
          ? `"${wrongClause.picked}" is not the strongest match for ${wrongClause.clause.label.toLowerCase()}. ${question.rationale}`
          : question.rationale,
        keyPointsTitle: 'Why these selections matter',
        keyPoints,
        clinicalTakeaway:
          'In vaso-occlusive crisis, new hypoxemia (SpO₂ < 95%) and dyspnea signal acute chest syndrome until proven otherwise.',
        estimatedItemSeconds: avgSecs,
      };
    }

    case 'drag-drop': {
      const slotMap = response && typeof response === 'object' ? response : {};
      const bankLookup = {};
      (question.wordBank || []).forEach((w) => {
        bankLookup[w.id] = w.text;
      });

      const slots = question.slots || [];
      let scoredPoints = 0;
      let wrongSlotInfo = null;

      const keyPoints = slots.map((s) => {
        const pickedId = slotMap[s.id];
        const correctText = bankLookup[s.correctWordId] || s.correctWordId;
        if (pickedId === s.correctWordId) {
          scoredPoints += 1;
        } else if (!wrongSlotInfo) {
          wrongSlotInfo = {
            pickedText: pickedId ? bankLookup[pickedId] || pickedId : 'Blank slot',
            leadText: s.leadText,
            correctText,
          };
        }
        return {
          title: `${s.leadText} → ${correctText}`,
          description: 'Aligns nursing interventions with the ABC priority framework and active orders.',
        };
      });

      return {
        scoredPoints,
        maxPoints: Math.max(1, slots.length),
        scoringRule: '0 / 1 per slot',
        typeLabel: 'DRAG & DROP · PLAN OF CARE',
        hintTag: `Fill ${slots.length} slots`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Well prioritized!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? 'Your nursing plan of care sequences oxygenation, titration, and acute pain control in priority order.'
          : 'Check the sequence of clinical priorities—oxygenation deficits take precedence before secondary risks.',
        remediationHeading: wrongSlotInfo
          ? `Rationale: ${wrongSlotInfo.pickedText}`
          : 'Plan of Care Sequencing',
        remediationBody: wrongSlotInfo
          ? `For "${wrongSlotInfo.leadText}", "${wrongSlotInfo.pickedText}" is less urgent than "${wrongSlotInfo.correctText}". ${question.rationale}`
          : question.rationale,
        keyPointsTitle: 'Why this plan of care matters',
        keyPoints,
        clinicalTakeaway:
          'Correct hypoxemia first to halt further erythrocyte sickling while simultaneously treating severe vaso-occlusive pain.',
        estimatedItemSeconds: avgSecs,
      };
    }

    case 'incident-report': {
      const selected = Array.isArray(response) ? response : [];
      const segments = question.segments || [];
      const relevantSegments = segments.filter((s) => s.isRelevant);
      let rawPoints = 0;
      let wrongPickedSeg = null;

      segments.forEach((seg) => {
        const wasPicked = selected.includes(seg.id);
        if (wasPicked && seg.isRelevant) rawPoints += 1;
        if (wasPicked && !seg.isRelevant) {
          rawPoints -= 1;
          if (!wrongPickedSeg) wrongPickedSeg = seg;
        }
      });

      const scoredPoints = Math.max(0, rawPoints);
      return {
        scoredPoints,
        maxPoints: Math.max(1, relevantSegments.length),
        scoringRule: '+ / – rule',
        typeLabel: 'INCIDENT REPORT',
        hintTag: `Select ${relevantSegments.length} findings`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Sharp safety awareness!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? 'You identified every shift variance requiring immediate safety intervention and incident documentation.'
          : 'Review each bedside event—distinguish routine therapeutic care from thermal hazards, pump errors, and fall risks.',
        remediationHeading: wrongPickedSeg
          ? 'Rationale: Routine Therapeutic Care Selected'
          : 'Clinical Variance & Safety Analysis',
        remediationBody: wrongPickedSeg
          ? `"${wrongPickedSeg.text}" reflects safe, expected nursing care and does not require an incident report. ${question.rationale}`
          : question.rationale,
        keyPointsTitle: 'Why these safety events matter',
        keyPoints: relevantSegments.map((s, idx) => ({
          title: `Safety Variance ${idx + 1}`,
          description: s.text,
        })),
        clinicalTakeaway:
          'Never apply cold packs in sickle cell crisis, double-check high-volume IV pump rates, and enforce fall precautions after IV opioids.',
        estimatedItemSeconds: avgSecs,
      };
    }

    case 'multiple-response':
    default: {
      const selected = Array.isArray(response)
        ? response
        : response
        ? [response]
        : [];
      const options = question.options || [];
      const correctOptions = options.filter(
        (o) => o.isCorrect || (question.correctOptionId && question.correctOptionId === o.id)
      );

      let rawPoints = 0;
      let wrongOption = null;

      options.forEach((opt) => {
        const isCorrectOpt = Boolean(
          opt.isCorrect || (question.correctOptionId && question.correctOptionId === opt.id)
        );
        const wasPicked = selected.includes(opt.id);
        if (wasPicked && isCorrectOpt) rawPoints += 1;
        if (wasPicked && !isCorrectOpt) {
          rawPoints -= 1;
          if (!wrongOption) wrongOption = opt;
        }
      });

      const scoredPoints = Math.max(0, rawPoints);
      return {
        scoredPoints,
        maxPoints: Math.max(1, correctOptions.length),
        scoringRule: '+ / – rule',
        typeLabel: 'MULTIPLE RESPONSE',
        hintTag: `Select ${correctOptions.length} findings`,
        isFullyCorrect: evalStatus.isCorrect,
        feedbackTitle: evalStatus.isCorrect ? 'Excellent clinical judgment!' : 'Not quite',
        feedbackBody: evalStatus.isCorrect
          ? 'All selected nursing interventions align with evidence-based clinical safety thresholds.'
          : 'Your selection missed priority interventions or included contraindicated actions. Prioritize acute physiological needs.',
        remediationHeading: wrongOption
          ? `Rationale: ${wrongOption.text.slice(0, 58)}${wrongOption.text.length > 58 ? '…' : ''}`
          : 'Candidate Choice Remediation',
        remediationBody: wrongOption
          ? `"${wrongOption.text}" is contraindicated or non-priority for this client's acute presentation. ${question.rationale}`
          : question.rationale,
        keyPointsTitle: 'Why these findings matter',
        keyPoints: correctOptions.map((o) => ({
          title: o.text.split(' to ')[0] || o.text,
          description: o.text,
        })),
        clinicalTakeaway:
          'Prioritize acute physiological stabilization (Hydration, Oxygenation, Pain control) and avoid vasoconstrictive triggers.',
        estimatedItemSeconds: avgSecs,
      };
    }
  }
}

