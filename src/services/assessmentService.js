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
