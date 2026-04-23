// India Election Guide — single source of truth

export const journeySteps = [
  { label: 'Check\nEligibility' },
  { label: 'Gather\nDocuments' },
  { label: 'Register\non NVSP' },
  { label: 'Find Your\nBooth' },
  { label: 'Cast\nYour Vote' },
]

export const overview = [
  { icon: '📣', title: 'Election Schedule Announced', body: 'The Election Commission of India (ECI) announces the election schedule. The Model Code of Conduct comes into effect immediately.' },
  { icon: '📋', title: 'Voter Registration (Form 6)', body: 'New voters register using Form 6 on nvsp.in or the Voter Helpline App. Existing voters update details using Form 8.' },
  { icon: '🗓️', title: 'Nomination & Campaigning', body: 'Candidates file nominations. Parties campaign across constituencies. Campaigning stops 48 hours before polling day.' },
  { icon: '🗳️', title: 'Polling Day', body: 'Registered voters visit their assigned polling booth and vote using the EVM. Booths open 7 AM to 6 PM.' },
  { icon: '🔢', title: 'Vote Counting (EVM)', body: 'EVMs are counted at designated centres under strict ECI supervision.' },
  { icon: '📢', title: 'Results & Government Formation', body: 'Results are declared by the Returning Officer. The winning party forms the government after swearing-in.' },
]

export const timeline = [
  { date: 'Jan 1 to Mar 31, 2026', title: 'Voter Registration Window', desc: 'New voters register on nvsp.in using Form 6. Existing voters update address using Form 8.', tip: 'Use the Voter Helpline App — registration takes under 5 minutes.', icon: '📋', highlight: false, actions: ['Visit nvsp.in or download the Voter Helpline App', 'Fill Form 6 with your name, DOB, address, and photo', 'Submit and note your reference number'] },
  { date: 'Mar 15, 2026', title: 'Final Electoral Roll Published', desc: 'The final electoral roll is published by ECI. Check your name at electoralsearch.eci.gov.in.', tip: 'If your name is missing, file a complaint at your local BLO office immediately.', icon: '📜', highlight: true, actions: ['Visit electoralsearch.eci.gov.in', 'Search by name, EPIC number, or mobile number', 'Contact your BLO if your name is missing'] },
  { date: 'Apr 1, 2026', title: 'Model Code of Conduct', desc: 'The MCC comes into effect. Political parties and candidates must follow ECI guidelines.', tip: 'Report MCC violations using the cVIGIL app — ECI responds within 100 minutes.', icon: '⚖️', highlight: false, actions: ['Download the cVIGIL app to report violations', 'Avoid sharing unverified election news'] },
  { date: 'Apr 10, 2026', title: 'Nomination Filing Deadline', desc: 'Candidates must file nomination papers with the Returning Officer.', tip: 'Check your candidate list on the ECI website before polling day.', icon: '📝', highlight: false, actions: ['View candidate list on eci.gov.in', 'Read candidate affidavits'] },
  { date: 'Apr 20, 2026', title: 'Campaign Silence Period', desc: 'Campaigning must stop 48 hours before polling begins.', tip: 'Violating the silence period is a criminal offence under the Representation of the People Act, 1951.', icon: '🔇', highlight: false, actions: ['Do not share campaign material', 'Prepare your documents for polling day'] },
  { date: 'Apr 22, 2026', title: 'Polling Day', desc: 'Polling booths open 7 AM to 6 PM. Carry your EPIC card or any of the 12 approved photo IDs. Vote using the EVM and verify on VVPAT.', tip: 'Arrive early — queues are shorter before 9 AM. Your employer must give you paid leave to vote.', icon: '🏛️', highlight: true, actions: ['Carry your EPIC card or approved alternative ID', 'Reach your booth before 6 PM', 'Press the blue EVM button next to your candidate', 'Verify your vote on the VVPAT slip (7 seconds)'] },
  { date: 'Apr 23, 2026', title: 'Vote Counting & Results', desc: 'EVMs are counted at designated counting centres. Preliminary trends appear within hours.', tip: 'Watch live results on the ECI Results portal: results.eci.gov.in', icon: '📢', highlight: false, actions: ['Follow live results at results.eci.gov.in', 'Results are verified before being declared final'] },
]

export const states = [
  { value: 'AP', label: 'Andhra Pradesh', seats: 25, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'AR', label: 'Arunachal Pradesh', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'AS', label: 'Assam', seats: 14, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'BR', label: 'Bihar', seats: 40, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'CG', label: 'Chhattisgarh', seats: 11, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'GA', label: 'Goa', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'GJ', label: 'Gujarat', seats: 26, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'HR', label: 'Haryana', seats: 10, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'HP', label: 'Himachal Pradesh', seats: 4, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'JH', label: 'Jharkhand', seats: 14, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'KA', label: 'Karnataka', seats: 28, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'KL', label: 'Kerala', seats: 20, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'MP', label: 'Madhya Pradesh', seats: 29, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'MH', label: 'Maharashtra', seats: 48, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'MN', label: 'Manipur', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'ML', label: 'Meghalaya', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'MZ', label: 'Mizoram', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'NL', label: 'Nagaland', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'OD', label: 'Odisha', seats: 21, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'PB', label: 'Punjab', seats: 13, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'RJ', label: 'Rajasthan', seats: 25, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'SK', label: 'Sikkim', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'TN', label: 'Tamil Nadu', seats: 39, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'TS', label: 'Telangana', seats: 17, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'TR', label: 'Tripura', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'UP', label: 'Uttar Pradesh', seats: 80, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'UK', label: 'Uttarakhand', seats: 5, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'WB', label: 'West Bengal', seats: 42, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'AN', label: 'Andaman & Nicobar Islands', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'CH', label: 'Chandigarh', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'DN', label: 'Dadra & Nagar Haveli and Daman & Diu', seats: 2, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'DL', label: 'Delhi (NCT)', seats: 7, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'JK', label: 'Jammu & Kashmir', seats: 5, regDeadline: '30 days before election', postalVoting: true, epicRequired: true },
  { value: 'LA', label: 'Ladakh', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'LD', label: 'Lakshadweep', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
  { value: 'PY', label: 'Puducherry', seats: 1, regDeadline: '30 days before election', postalVoting: false, epicRequired: true },
]

export const documents = [
  { name: 'EPIC Card (Voter ID)', purpose: 'Primary photo ID issued by ECI — most widely accepted at booths', status: 'required' },
  { name: 'Aadhaar Card', purpose: 'Accepted as alternative photo ID at polling booths', status: 'required' },
  { name: 'Passport', purpose: 'Valid alternative photo ID', status: 'optional' },
  { name: 'Driving Licence', purpose: 'Valid alternative photo ID', status: 'optional' },
  { name: 'PAN Card (with photo)', purpose: 'Accepted as alternative photo ID', status: 'optional' },
  { name: 'MNREGA Job Card', purpose: 'Accepted for rural voters as alternative ID', status: 'optional' },
  { name: 'Bank / Post Office Passbook (with photo)', purpose: 'Accepted as alternative photo ID', status: 'optional' },
  { name: 'Smart Card (CGHS / ECHS)', purpose: 'Health smart cards accepted as alternative ID', status: 'optional' },
  { name: 'Pension Document (with photo)', purpose: 'Accepted for senior citizens as alternative ID', status: 'optional' },
  { name: 'Disability Certificate (with photo)', purpose: 'Accepted for PwD voters as alternative ID', status: 'optional' },
]

export const guideSteps = [
  {
    title: 'Register on NVSP / Voter App', subtitle: 'Get your name on the electoral roll', icon: '📝',
    body: 'Every Indian citizen aged 18+ must be registered on the electoral roll to vote. Register online at nvsp.in or via the Voter Helpline App. It takes under 5 minutes.',
    items: [
      { icon: '🌐', title: 'Visit nvsp.in or download Voter Helpline App', desc: 'Available on Android and iOS. You can also register at your local BLO office.' },
      { icon: '📄', title: 'Fill Form 6 (new registration)', desc: 'Provide your name, DOB, address, and upload a passport-size photo and address proof.' },
      { icon: '🔍', title: 'Check your name on the roll', desc: 'Visit electoralsearch.eci.gov.in and search by name, EPIC number, or mobile number.' },
      { icon: '📬', title: 'Receive your EPIC card', desc: 'Your Voter ID (EPIC) card will be dispatched to your registered address within 30 days.' },
    ],
    cta: 'Go to Eligibility Check', ctaHref: '#eligibility',
  },
  {
    title: 'Verify Your Documents', subtitle: 'Know what to carry on polling day', icon: '📋',
    body: 'You must carry at least one of the 12 approved photo IDs to vote. Your EPIC card is the primary ID, but Aadhaar, PAN, Passport, and others are also accepted.',
    items: [
      { icon: '🪪', title: 'EPIC Card (Voter ID)', desc: 'Your primary voter identity card issued by ECI. Carry the original — photocopies are not accepted.' },
      { icon: '📱', title: 'e-EPIC on mobile', desc: 'Download your digital Voter ID from the Voter Helpline App or nvsp.in — accepted at booths.' },
      { icon: '🏠', title: 'Check your booth address', desc: 'Your polling booth is printed on your EPIC card. Also check on the Voter Helpline App.' },
      { icon: '📸', title: 'Aadhaar as backup', desc: 'If you do not have your EPIC, Aadhaar card is accepted as an alternative photo ID.' },
    ],
    cta: 'See Full Documents List', ctaHref: '#documents',
  },
  {
    title: 'Cast Your Vote (EVM)', subtitle: 'What happens inside the polling booth', icon: '🗳️',
    body: 'India uses Electronic Voting Machines (EVMs). Voting is simple, fast, and completely secret.',
    items: [
      { icon: '📍', title: 'Find your polling booth', desc: 'Check your EPIC card or the Voter Helpline App. Booths are open 7 AM to 6 PM on polling day.' },
      { icon: '🪪', title: 'Show your ID and get marked', desc: 'Show your EPIC or approved alternative ID. The officer will mark your finger with indelible ink.' },
      { icon: '🔵', title: 'Press the EVM button', desc: 'Enter the voting compartment. Press the blue button next to your chosen candidate on the EVM.' },
      { icon: '🧾', title: 'Verify on VVPAT', desc: 'A paper slip appears in the VVPAT machine for 7 seconds — verify your vote, then it drops into the sealed box.' },
    ],
    cta: 'See Key Dates', ctaHref: '#timeline',
  },
]

export const faq = [
  { q: 'Who is eligible to vote in India?', a: 'Any Indian citizen aged 18 or above on January 1 of the qualifying year who is ordinarily resident in a constituency is eligible. You must be registered on the electoral roll.' },
  { q: 'How do I register as a new voter?', a: 'Visit nvsp.in or download the Voter Helpline App. Fill Form 6 with your name, date of birth, address, and a passport-size photo. You can also visit your local BLO (Booth Level Officer) office.' },
  { q: 'What is an EPIC card?', a: 'EPIC stands for Electors Photo Identity Card — commonly called the Voter ID card. It is issued by the Election Commission of India and is the primary identity document for voting.' },
  { q: 'I do not have my EPIC card. Can I still vote?', a: 'Yes. ECI accepts 12 alternative photo IDs including Aadhaar, Passport, Driving Licence, PAN card, MNREGA Job Card, Bank Passbook with photo, and more. You can also use the e-EPIC (digital Voter ID) on your phone.' },
  { q: 'What is an EVM and is it reliable?', a: 'An Electronic Voting Machine (EVM) is a standalone device used to record votes. It is not connected to the internet. The VVPAT machine lets you verify your vote on a paper slip for 7 seconds.' },
  { q: 'What is NOTA?', a: 'NOTA stands for None of the Above. It is the last option on every EVM ballot. If you are not satisfied with any candidate, you can press NOTA. Your vote is counted but does not go to any candidate.' },
  { q: 'Can I vote if I am away from my constituency?', a: 'You must vote in your registered constituency. However, senior citizens (80+), persons with disabilities (PwD), and essential service workers can apply for a Postal Ballot.' },
  { q: 'What is the Model Code of Conduct?', a: 'The Model Code of Conduct (MCC) is a set of guidelines issued by ECI that governs the conduct of political parties and candidates during elections.' },
  { q: 'How do I report election violations?', a: 'Use the cVIGIL app to report MCC violations with photo or video evidence. ECI guarantees a response within 100 minutes. You can also call the National Voter Helpline at 1950.' },
  { q: 'Is my vote secret in India?', a: 'Yes. The EVM records your vote without linking it to your identity. The secrecy of the ballot is guaranteed by the Representation of the People Act, 1951.' },
  { q: 'Can my employer stop me from voting?', a: 'No. Under Section 135B of the Representation of the People Act, every employer must give employees paid leave on polling day.' },
  { q: 'What is the Voter Helpline number?', a: 'The National Voter Helpline number is 1950. You can call to check your voter registration, find your polling booth, report issues, or get any election-related information.' },
]

export const wizardSteps = [
  {
    type: 'options', key: 'citizenship',
    question: 'Welcome! Are you an Indian citizen?',
    options: [
      { icon: '🇮🇳', label: 'Yes, I am an Indian citizen', value: 'citizen' },
      { icon: '🌍', label: 'I am an NRI (Non-Resident Indian)', value: 'nri' },
      { icon: '✈️', label: 'I am a foreign national or OCI holder', value: 'foreign' },
    ],
  },
  { type: 'input', key: 'age', question: 'How old are you?', inputType: 'number', placeholder: 'Enter your age', label: 'Your age' },
  { type: 'select', key: 'state', question: 'Which state or UT are you from?', label: 'Select your state / UT' },
  {
    type: 'options', key: 'registered',
    question: 'Are you registered on the electoral roll?',
    options: [
      { icon: '✅', label: 'Yes, I am registered', value: 'yes' },
      { icon: '❓', label: 'Not sure — need to check', value: 'unsure' },
      { icon: '❌', label: 'No, not registered yet', value: 'no' },
    ],
  },
]

export const searchIndex = [
  { title: 'Check eligibility', section: '#eligibility', keywords: 'eligible vote citizen age 18 nvsp' },
  { title: 'Registration deadline', section: '#timeline', keywords: 'register deadline date form 6 nvsp' },
  { title: 'What documents do I need?', section: '#documents', keywords: 'documents id aadhaar epic voter card proof' },
  { title: 'How to vote on election day', section: '#guide', keywords: 'vote ballot polling booth evm vvpat' },
  { title: 'Postal ballot options', section: '#timeline', keywords: 'postal ballot absentee senior pwd' },
  { title: 'FAQ — EVM and NOTA', section: '#faq', keywords: 'evm nota machine reliable' },
  { title: 'FAQ — disability assistance', section: '#faq', keywords: 'disability pwd help accessible' },
  { title: 'Key election dates', section: '#timeline', keywords: 'dates deadlines calendar schedule mcc' },
  { title: 'Step-by-step voting guide', section: '#guide', keywords: 'steps guide register verify vote booth' },
  { title: 'Overview of election process', section: '#overview', keywords: 'overview process how election works eci' },
  { title: 'Voter Helpline 1950', section: '#faq', keywords: 'helpline 1950 contact number' },
  { title: 'EPIC / Voter ID card', section: '#documents', keywords: 'epic voter id card aadhaar' },
]

export function determineEligibility(age, citizenship, registered, stateData) {
  if (citizenship === 'foreign') return {
    type: 'ineligible', icon: '❌', title: 'Not Eligible',
    body: 'Foreign nationals and OCI card holders are not eligible to vote in Indian elections. Only Indian citizens can vote.',
  }
  if (citizenship === 'nri') return {
    type: 'maybe', icon: '🌍', title: 'NRI — Special Rules Apply',
    body: 'NRIs who hold an Indian passport can register as overseas voters and vote in person at their registered constituency in India. Register using Form 6A on nvsp.in.',
  }
  if (age < 18) return {
    type: 'ineligible', icon: '⏳', title: 'Not Yet Eligible',
    body: 'You must be 18 years old on January 1 of the qualifying year to vote. Register as soon as you turn 18!',
  }
  if (registered === 'no') return {
    type: 'maybe', icon: '📝', title: 'Eligible — But Not Registered',
    body: 'You appear to be eligible to vote' + (stateData ? ' in ' + stateData.label : '') + ', but you need to register first. Visit nvsp.in or the Voter Helpline App to fill Form 6. It takes under 5 minutes.',
  }
  if (registered === 'unsure') return {
    type: 'maybe', icon: '🔍', title: 'Check Your Registration',
    body: 'You may be eligible to vote' + (stateData ? ' in ' + stateData.label : '') + '. Check your name on the electoral roll at electoralsearch.eci.gov.in or call the Voter Helpline at 1950.',
  }
  return {
    type: 'eligible', icon: '🎉', title: "You're Eligible to Vote!",
    body: 'Great news! You are eligible to vote' + (stateData ? ' in ' + stateData.label + ' (' + stateData.seats + ' Lok Sabha seat' + (stateData.seats !== 1 ? 's' : '') + ')' : '') + '. Carry your EPIC card or any approved photo ID on polling day.',
  }
}
