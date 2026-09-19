/* ==========================================================================
   SAKSHAM (सक्षम) - Central Data Store & State Management
   Pre-seeds authentic Government of India Capacity Building & Training Data
   Includes 1 Admin, 2 Trainers, 4 Trainees, and 1 Pending Applicant
   ========================================================================== */

const SAKSHAM_STORAGE_KEY = 'saksham_gov_data_v2';

const DEFAULT_STORE = {
  // Current active logged-in user ID (null = on public homepage)
  currentUserId: null,

  // System Users with Credentials and Roles
  users: [
    {
      id: 'admin-1',
      name: 'Sh. R.K. Sharma',
      email: 'admin@cbc.gov.in',
      password: 'Admin@2026',
      role: 'ADMIN',
      status: 'APPROVED',
      designation: 'Joint Secretary & Nodal Officer',
      cadre: 'Central Secretariat Service (CSS)',
      department: 'Capacity Building Commission (CBC)',
      avatar: 'RS',
      dateJoined: '2024-01-15'
    },
    {
      id: 'trainer-1',
      name: 'Dr. Priya Venkatesh',
      email: 'priya.trainer@istm.gov.in',
      password: 'Trainer@2026',
      role: 'TRAINER',
      status: 'APPROVED',
      designation: 'Senior Faculty & Lead Instructor',
      cadre: 'Institute of Secretariat Training and Management (ISTM)',
      department: 'Dept of Personnel & Training (DoPT)',
      avatar: 'PV',
      dateJoined: '2024-03-10',
      qualifications: {
        highestDegree: 'Ph.D. in Public Finance & Fiscal Economics',
        certifications: ['Certified Public Procurement Specialist (CPPS)', 'GFR 2017 Lead Master Trainer', 'NIFM Senior Fellow'],
        yearsExperience: 14,
        batchesTrained: 48,
        rating: 4.88,
        competencyDomains: ['Public Procurement', 'GFR 2017', 'GeM Portal', 'Budgeting & Appropriations']
      }
    },
    {
      id: 'trainer-2',
      name: 'Col. Rajeshwar Rao (Retd.)',
      email: 'rajesh.trainer@cert-in.gov.in',
      password: 'Trainer@2026',
      role: 'TRAINER',
      status: 'APPROVED',
      designation: 'Principal Cyber Defense Advisor',
      cadre: 'CERT-In / MeitY Expert Panel',
      department: 'Ministry of Electronics & IT',
      avatar: 'RR',
      dateJoined: '2024-06-01',
      qualifications: {
        highestDegree: 'M.Tech in Cybersecurity & Information Warfare',
        certifications: ['CISM', 'CISSP', 'CERT-In Chief Information Security Auditor'],
        yearsExperience: 18,
        batchesTrained: 32,
        rating: 4.92,
        competencyDomains: ['Cybersecurity', 'Critical Infrastructure', 'Data Protection', 'Incident Response']
      }
    },
    {
      id: 'trainee-1',
      name: 'Amit Verma',
      email: 'amit.trainee@doe.gov.in',
      password: 'Trainee@2026',
      role: 'TRAINEE',
      status: 'APPROVED',
      designation: 'Under Secretary',
      cadre: 'Central Secretariat Service (CSS, Batch 2018)',
      department: 'Department of Expenditure, Ministry of Finance',
      avatar: 'AV',
      dateJoined: '2025-02-20',
      profile: {
        employeeCode: 'GOI-FIN-2018-0941',
        highestDegree: 'M.Com (Finance), Delhi University',
        publicServiceYears: 7,
        currentDivision: 'Public Financial Management System (PFMS) Cell',
        skills: ['Budget Analysis', 'File Processing', 'Tender Scrutiny', 'Parliamentary Questions'],
        learningInterests: ['GeM 4.0 Advanced Reverse Auction', 'Cyber Risk for Financial Portals', 'GFR 2026 Revisions'],
        certificatesEarned: [
          { title: 'Foundation Level Public Finance', issueDate: '2025-05-18', certNo: 'SAK-FIN-2025-019' }
        ]
      }
    },
    {
      id: 'trainee-2',
      name: 'Sneha Kulkarni',
      email: 'sneha.trainee@meity.gov.in',
      password: 'Trainee@2026',
      role: 'TRAINEE',
      status: 'APPROVED',
      designation: 'Scientist D',
      cadre: 'Ministry of Electronics & IT Technical Service',
      department: 'Cyber Law & e-Security Division, MeitY',
      avatar: 'SK',
      dateJoined: '2025-04-12',
      profile: {
        employeeCode: 'MEITY-SCI-2020-0412',
        highestDegree: 'B.Tech (Computer Science), IIT Bombay',
        publicServiceYears: 5,
        currentDivision: 'Critical Information Infrastructure Protection Desk',
        skills: ['Cloud Infrastructure', 'Network Forensics', 'Data Governance', 'Vulnerability Assessment'],
        learningInterests: ['CERT-In Mandatory Reporting', 'Digital Personal Data Protection (DPDP) Act'],
        certificatesEarned: []
      }
    },
    {
      id: 'trainee-3',
      name: 'Rohit Meena',
      email: 'rohit.trainee@morth.gov.in',
      password: 'Trainee@2026',
      role: 'TRAINEE',
      status: 'APPROVED',
      designation: 'Executive Engineer',
      cadre: 'Central Engineering Service (Roads)',
      department: 'Ministry of Road Transport & Highways (MoRTH)',
      avatar: 'RM',
      dateJoined: '2025-01-08',
      profile: {
        employeeCode: 'MORTH-ENG-2017-0881',
        highestDegree: 'B.Tech (Civil Engineering), NIT Jaipur',
        publicServiceYears: 8,
        currentDivision: 'National Highway Development Project Cell',
        skills: ['EPC Contract Management', 'Tender Drafting', 'Quality Assurance', 'Land Acquisition Norms'],
        learningInterests: ['Public Procurement & GFR 2017', 'Arbitration in Infrastructure Projects'],
        certificatesEarned: []
      }
    },
    {
      id: 'trainee-4',
      name: 'Ananya Sen',
      email: 'ananya.trainee@dopt.gov.in',
      password: 'Trainee@2026',
      role: 'TRAINEE',
      status: 'APPROVED',
      designation: 'Section Officer',
      cadre: 'Central Secretariat Service (CSS, Batch 2021)',
      department: 'Department of Personnel & Training (DoPT)',
      avatar: 'AS',
      dateJoined: '2025-06-15',
      profile: {
        employeeCode: 'DOPT-ADM-2021-1120',
        highestDegree: 'M.A. (Public Administration), JNU',
        publicServiceYears: 4,
        currentDivision: 'Establishment & Service Rules Division',
        skills: ['Service Book Maintenance', 'e-Office File Movement', 'RTI Replies', 'Disciplinary Matters'],
        learningInterests: ['e-Office 7.0 Advanced Paperless Workflows', 'CCS Conduct Rules'],
        certificatesEarned: []
      }
    },
    {
      id: 'trainer-pending',
      name: 'Dr. Vikram Malhotra',
      email: 'vikram.applicant@iipa.org.in',
      password: 'Applicant@2026',
      role: 'TRAINER',
      status: 'PENDING_APPROVAL',
      designation: 'Associate Professor, Public Administration',
      cadre: 'Indian Institute of Public Administration (IIPA)',
      department: 'Ministry of Personnel',
      avatar: 'VM',
      dateJoined: '2026-09-15',
      applicationRef: 'SAKSHAM/2026/TR-8841',
      qualifications: {
        highestDegree: 'Ph.D. in Public Policy & Administrative Law',
        certifications: ['Ethics in Governance Fellowship', 'Public Policy Evaluator'],
        yearsExperience: 8,
        batchesTrained: 6,
        rating: 4.5,
        competencyDomains: ['Administrative Ethics', 'GFR 2017', 'Vigilance & Disciplinary Proceedings']
      }
    }
  ],

  // Course Catalog with Detailed Syllabi & Resources
  courses: [
    {
      id: 'CRS-101',
      code: 'GOV-FIN-101',
      title: 'General Financial Rules (GFR 2017) & 2026 Directives',
      department: 'Ministry of Finance',
      durationHours: 30,
      credits: 4,
      level: 'Mandatory Foundation',
      category: 'Public Finance & Budgeting',
      leadTrainerId: 'trainer-1',
      summary: 'Comprehensive review of statutory expenditure norms, Single Tender clearances, emergency procurement authorizations, and accountability mechanisms.',
      competenciesAddressed: ['GFR 2017', 'Public Procurement', 'Audit Compliance'],
      enrolledCount: 1420,
      avgRating: 4.8,
      resources: [
        { type: 'DOC', title: 'Compendium of GFR 2017 with amendments up to June 2026', size: '2.4 MB' },
        { type: 'SLIDE', title: 'Chapter 6: Procurement of Goods and Services (Lecture Slides)', size: '4.8 MB' },
        { type: 'VIDEO', title: 'Recorded Session: Demystifying Rule 149 & 155 Exemptions', duration: '42 mins' }
      ]
    },
    {
      id: 'CRS-102',
      code: 'GOV-GEM-202',
      title: 'Government e-Marketplace (GeM 4.0) & Reverse Auction',
      department: 'Ministry of Commerce & Industry',
      durationHours: 24,
      credits: 3,
      level: 'Intermediate Specialist',
      category: 'Digital Procurement',
      leadTrainerId: 'trainer-1',
      summary: 'Operational mastery of GeM portal, direct purchase thresholds, L-1 reverse bidding, handling Buyer-Seller disputes, and PFMS integration.',
      competenciesAddressed: ['GeM Portal', 'Public Procurement', 'Vendor Vetting'],
      enrolledCount: 980,
      avgRating: 4.7,
      resources: [
        { type: 'DOC', title: 'GeM Buyer Handbook 2026 & Incident Management Policy', size: '3.1 MB' },
        { type: 'SLIDE', title: 'Workflow Guide: Reverse Auctions & Custom Bids', size: '5.2 MB' },
        { type: 'VIDEO', title: 'Live Demonstration: Creating Complex Multi-item BoQ Bids', duration: '35 mins' }
      ]
    },
    {
      id: 'CRS-103',
      code: 'GOV-CYB-303',
      title: 'Critical Information Infrastructure & CERT-In Compliance',
      department: 'Ministry of Electronics & IT (MeitY)',
      durationHours: 36,
      credits: 5,
      level: 'Advanced Governance',
      category: 'Information Security',
      leadTrainerId: 'trainer-2',
      summary: 'Cybersecurity hygiene for public servants, phishing counter-measures, reporting within 6 hours as per CERT-In directives, and handling classified documents.',
      competenciesAddressed: ['Cybersecurity', 'Critical Infrastructure', 'Incident Response'],
      enrolledCount: 650,
      avgRating: 4.9,
      resources: [
        { type: 'DOC', title: 'CERT-In Mandate on Incident Logging & Reporting Guidelines', size: '1.8 MB' },
        { type: 'SLIDE', title: 'Threat Surface Analysis for Government Intranets', size: '6.4 MB' },
        { type: 'VIDEO', title: 'Simulation: Handling Phishing Attacks Targeting NIC Mail', duration: '50 mins' }
      ]
    },
    {
      id: 'CRS-104',
      code: 'GOV-EOF-104',
      title: 'e-Office 7.0 Paperless Workflow & Digital Signing',
      department: 'Dept of Administrative Reforms (DARPG)',
      durationHours: 18,
      credits: 2,
      level: 'Universal Mandate',
      category: 'Digital Governance',
      leadTrainerId: 'trainer-1',
      summary: 'End-to-end secretarial operations on e-Office 7.0: file creation, docketing, drafting correspondence, Aadhaar OTP/DSC signing, and archiving.',
      competenciesAddressed: ['e-Office 7.0', 'Paperless Secretarial Processes'],
      enrolledCount: 2150,
      avgRating: 4.6,
      resources: [
        { type: 'DOC', title: 'Manual of Office Procedure (e-MOP) 2026 Edition', size: '4.2 MB' },
        { type: 'SLIDE', title: 'Quick Guide: Migration to e-File 7.0 & Movement Register', size: '3.9 MB' },
        { type: 'VIDEO', title: 'Step-by-Step: Processing Cabinet Notes on e-Office', duration: '28 mins' }
      ]
    }
  ],

  // Trainee Course Enrollments across the 4 trainees
  enrollments: [
    // Trainee 1: Amit Verma (Finance)
    {
      userId: 'trainee-1',
      courseId: 'CRS-101',
      progressPercent: 70,
      status: 'IN_PROGRESS',
      enrolledDate: '2026-08-01',
      assessmentTaken: false,
      score: null,
      feedbackSubmitted: true,
      feedback: { rating: 5, comment: 'Exceptional clarity on Single Tender sanctions under Rule 194.' }
    },
    {
      userId: 'trainee-1',
      courseId: 'CRS-104',
      progressPercent: 100,
      status: 'COMPLETED',
      enrolledDate: '2026-07-10',
      assessmentTaken: true,
      score: 92,
      feedbackSubmitted: false
    },
    // Trainee 2: Sneha Kulkarni (MeitY)
    {
      userId: 'trainee-2',
      courseId: 'CRS-103',
      progressPercent: 85,
      status: 'IN_PROGRESS',
      enrolledDate: '2026-08-15',
      assessmentTaken: false,
      score: null,
      feedbackSubmitted: false
    },
    // Trainee 3: Rohit Meena (MoRTH)
    {
      userId: 'trainee-3',
      courseId: 'CRS-101',
      progressPercent: 40,
      status: 'IN_PROGRESS',
      enrolledDate: '2026-09-01',
      assessmentTaken: false,
      score: null,
      feedbackSubmitted: false
    },
    // Trainee 4: Ananya Sen (DoPT)
    {
      userId: 'trainee-4',
      courseId: 'CRS-104',
      progressPercent: 100,
      status: 'COMPLETED',
      enrolledDate: '2026-06-20',
      assessmentTaken: true,
      score: 88,
      feedbackSubmitted: true,
      feedback: { rating: 5, comment: 'Essential for day-to-day file movement and docket tracking.' }
    }
  ],

  // Timed MCQ Assessment Engine Banks
  assessments: [
    {
      id: 'ASM-101',
      courseId: 'CRS-101',
      title: 'Statutory Certification Assessment: GFR 2017 & Procurement Norms',
      durationMinutes: 10,
      totalMarks: 50,
      passingCutoff: 60,
      deadline: '2026-10-15',
      questions: [
        {
          id: 'q1',
          text: 'Under GFR 2017 Rule 149, which procurement platform is statutorily mandatory for common-use goods and services available for Central Ministries?',
          options: [
            'Central Public Procurement Portal (CPPP)',
            'Government e-Marketplace (GeM)',
            'State Tenders Board',
            'Open e-Tendering through NIC'
          ],
          correctIndex: 1,
          explanation: 'Rule 149 of GFR 2017 mandates procurement through the Government e-Marketplace (GeM) for all common-use items.'
        },
        {
          id: 'q2',
          text: 'What is the standard monetary threshold for direct purchase of goods without quotation under Rule 154 of GFR (as amended)?',
          options: [
            'Up to ₹10,000',
            'Up to ₹25,000',
            'Up to ₹50,000',
            'Up to ₹1,00,000'
          ],
          correctIndex: 1,
          explanation: 'Purchase of goods up to ₹25,000 can be made directly without quotation on certification of reasonable quality and rate.'
        },
        {
          id: 'q3',
          text: 'Which committee must certify purchases between ₹25,000 and ₹2,50,000 under Rule 155 of GFR?',
          options: [
            'Departmental Standing Committee',
            'Local Purchase Committee (consisting of three members)',
            'Finance Advisor Review Board',
            'Public Accounts Sub-committee'
          ],
          correctIndex: 1,
          explanation: 'Rule 155 requires a Local Purchase Committee of three members decided by the Head of Department.'
        },
        {
          id: 'q4',
          text: 'Under standard public procurement guidelines, what is the mandatory percentage range for Performance Security (Security Deposit)?',
          options: [
            '1% to 2% of the contract value',
            '3% to 5% of the contract value (as revised post-OM 2021)',
            '10% to 15% of the contract value',
            'Zero for MSME vendors always'
          ],
          correctIndex: 1,
          explanation: 'Standard performance security was calibrated between 3% to 5% of the contract value following Ministry of Finance instructions.'
        },
        {
          id: 'q5',
          text: 'Under Rule 194 of GFR, Single Tender Enquiry (STE) procurement may be resorted to when:',
          options: [
            'The procuring officer is on urgent official tour',
            'It is in official knowledge that only a single source exists for the proprietary item',
            'When less than three vendors reply to open bids',
            'For any contract valued under ₹5,00,000'
          ],
          correctIndex: 1,
          explanation: 'Single source procurement requires proprietary article certification (PAC) that no alternative or substitute is acceptable.'
        }
      ]
    }
  ],

  // Competency Mapping: Subject Requirements vs Trainer Fit Matrix
  subjectsForMapping: [
    {
      id: 'SUBJ-FIN',
      title: 'Public Procurement & General Financial Rules (GFR 2017)',
      departmentMandate: 'Ministry of Finance / DoPT',
      requiredDegree: 'Public Finance, Economics, or Law',
      minExperienceYears: 8,
      requiredCertifications: ['CPPS', 'GFR Master Trainer'],
      importanceWeights: {
        qualification: 0.35,
        experience: 0.25,
        rating: 0.20,
        pedagogy: 0.20
      }
    },
    {
      id: 'SUBJ-CYB',
      title: 'Cybersecurity for Critical Public Infrastructure',
      departmentMandate: 'MeitY / National Critical Information Infrastructure Protection Centre (NCIIPC)',
      requiredDegree: 'Computer Science, Information Security, Cyber Warfare',
      minExperienceYears: 10,
      requiredCertifications: ['CERT-In Auditor', 'CISSP / CISM'],
      importanceWeights: {
        qualification: 0.40,
        experience: 0.30,
        rating: 0.15,
        pedagogy: 0.15
      }
    },
    {
      id: 'SUBJ-EOF',
      title: 'Digital Secretarial Governance & e-Office 7.0 Workflows',
      departmentMandate: 'DARPG / Capacity Building Commission',
      requiredDegree: 'Public Administration, Computer Applications',
      minExperienceYears: 6,
      requiredCertifications: ['e-Office Master Trainer'],
      importanceWeights: {
        qualification: 0.30,
        experience: 0.25,
        rating: 0.25,
        pedagogy: 0.20
      }
    }
  ],

  // Institutional Workforce Capability Matrix (Org Level Capacity)
  capabilityMatrix: [
    {
      ministry: 'Department of Expenditure (FinMin)',
      mandatedOfficers: 650,
      trainedOfficers: 580,
      complianceRate: '89.2%',
      skillGaps: ['GeM Reverse Auctioning', 'PFMS Single Nodal Agency (SNA)'],
      status: 'ADEQUATE',
      recommendedTrainers: ['Dr. Priya Venkatesh']
    },
    {
      ministry: 'Ministry of Electronics & IT (MeitY)',
      mandatedOfficers: 420,
      trainedOfficers: 210,
      complianceRate: '50.0%',
      skillGaps: ['Data Protection Board Compliance', 'NCIIPC Security Protocols'],
      status: 'CRITICAL',
      recommendedTrainers: ['Col. Rajeshwar Rao (Retd.)']
    },
    {
      ministry: 'Ministry of Road Transport & Highways (MoRTH)',
      mandatedOfficers: 890,
      trainedOfficers: 620,
      complianceRate: '69.6%',
      skillGaps: ['FIDIC Contracts & EPC Bidding', 'Arbitration & Dispute Boards'],
      status: 'GAP',
      recommendedTrainers: ['Dr. Vikram Malhotra (Pending Nodal Review)']
    },
    {
      ministry: 'Department of Personnel & Training (DoPT)',
      mandatedOfficers: 1100,
      trainedOfficers: 980,
      complianceRate: '89.0%',
      skillGaps: ['e-Office 7.0 Citizen Service Portal', 'Ethics in Disciplinary Inquiries'],
      status: 'ADEQUATE',
      recommendedTrainers: ['Dr. Priya Venkatesh']
    }
  ],

  // Official Announcements & Circulars
  announcements: [
    {
      id: 'ANN-01',
      date: '18 Sep 2026',
      circularNo: 'CBC/2026/SEC-09/44',
      title: 'Mandatory Timed MCQ Certification for all Group A & B Officers on GFR 2017',
      dept: 'Capacity Building Commission',
      urgent: true
    },
    {
      id: 'ANN-02',
      date: '14 Sep 2026',
      circularNo: 'DoPT/TRG/2026/891',
      title: 'Empanelment of Certified Lead Trainers for Mission Karmayogi National Rollout',
      dept: 'Department of Personnel & Training',
      urgent: false
    },
    {
      id: 'ANN-03',
      date: '02 Sep 2026',
      circularNo: 'NIC/EOF/2026/12',
      title: 'Phase-3 Migration of Central Ministries to e-Office 7.0 Cloud Infrastructure',
      dept: 'National Informatics Centre',
      urgent: false
    }
  ]
};

class SakshamStore {
  constructor() {
    this.data = this.load();
  }

  load() {
    const raw = localStorage.getItem(SAKSHAM_STORAGE_KEY);
    if (!raw) {
      this.save(DEFAULT_STORE);
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.warn('Could not parse stored Saksham data, falling back to defaults', e);
      return JSON.parse(JSON.stringify(DEFAULT_STORE));
    }
  }

  save(data) {
    localStorage.setItem(SAKSHAM_STORAGE_KEY, JSON.stringify(data || this.data));
  }

  getCurrentUser() {
    if (!this.data.currentUserId) return null;
    return this.data.users.find(u => u.id === this.data.currentUserId) || null;
  }

  setCurrentUser(userId) {
    if (!userId) {
      this.data.currentUserId = null;
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:user-changed', { detail: null }));
      return null;
    }
    const u = this.data.users.find(item => item.id === userId);
    if (u) {
      this.data.currentUserId = userId;
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:user-changed', { detail: u }));
      return u;
    }
    return null;
  }

  authenticate(email, password) {
    const user = this.data.users.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );
    if (user) {
      return this.setCurrentUser(user.id);
    }
    return null;
  }

  registerUser(userData) {
    const id = `${userData.role.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newUser = {
      id,
      name: userData.name,
      email: userData.email,
      password: userData.password || 'Pass@2026',
      role: userData.role,
      status: userData.role === 'TRAINER' ? 'PENDING_APPROVAL' : 'APPROVED',
      designation: userData.designation,
      cadre: userData.cadre,
      department: userData.department,
      avatar: userData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase(),
      dateJoined: new Date().toISOString().split('T')[0],
      applicationRef: `SAKSHAM/2026/REG-${Math.floor(1000 + Math.random() * 9000)}`,
      profile: {
        employeeCode: userData.employeeCode || `GOI-REG-${Math.floor(1000 + Math.random() * 9000)}`,
        highestDegree: userData.highestDegree || 'Bachelor Degree',
        publicServiceYears: Number(userData.yearsExperience || 3),
        skills: ['Administrative Procedures', 'Government Operations'],
        learningInterests: ['GFR 2017', 'e-Office 7.0'],
        certificatesEarned: []
      },
      qualifications: userData.role === 'TRAINER' ? {
        highestDegree: userData.highestDegree || 'Doctoral Degree',
        certifications: ['Accredited Instructor'],
        yearsExperience: Number(userData.yearsExperience || 5),
        batchesTrained: 4,
        rating: 4.6,
        competencyDomains: ['Public Administration']
      } : undefined
    };

    this.data.users.push(newUser);
    this.save();
    window.dispatchEvent(new CustomEvent('saksham:data-updated'));
    return newUser;
  }

  approveUser(userId) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.status = 'APPROVED';
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:data-updated'));
      return true;
    }
    return false;
  }

  rejectUser(userId) {
    const index = this.data.users.findIndex(u => u.id === userId);
    if (index !== -1) {
      this.data.users[index].status = 'REJECTED';
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:data-updated'));
      return true;
    }
    return false;
  }

  reassignUserRole(userId, newRole) {
    const user = this.data.users.find(u => u.id === userId);
    if (user) {
      user.role = newRole;
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:data-updated'));
      return true;
    }
    return false;
  }

  enrollInCourse(userId, courseId) {
    const existing = this.data.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!existing) {
      this.data.enrollments.push({
        userId,
        courseId,
        progressPercent: 0,
        status: 'IN_PROGRESS',
        enrolledDate: new Date().toISOString().split('T')[0],
        assessmentTaken: false,
        score: null,
        feedbackSubmitted: false
      });
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:data-updated'));
      return true;
    }
    return false;
  }

  recordAssessmentScore(userId, courseId, score) {
    let enrollment = this.data.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (!enrollment) {
      enrollment = {
        userId,
        courseId,
        progressPercent: 100,
        status: 'COMPLETED',
        enrolledDate: new Date().toISOString().split('T')[0],
        assessmentTaken: true,
        score: score,
        feedbackSubmitted: false
      };
      this.data.enrollments.push(enrollment);
    } else {
      enrollment.assessmentTaken = true;
      enrollment.score = score;
      enrollment.progressPercent = 100;
      enrollment.status = score >= 60 ? 'COMPLETED' : 'IN_PROGRESS';
    }
    this.save();
    window.dispatchEvent(new CustomEvent('saksham:data-updated'));
    return enrollment;
  }

  submitCourseFeedback(userId, courseId, rating, comment) {
    const enrollment = this.data.enrollments.find(e => e.userId === userId && e.courseId === courseId);
    if (enrollment) {
      enrollment.feedbackSubmitted = true;
      enrollment.feedback = { rating: Number(rating), comment };
      this.save();
      window.dispatchEvent(new CustomEvent('saksham:data-updated'));
      return true;
    }
    return false;
  }

  addAssessment(assessmentData) {
    this.data.assessments.push(assessmentData);
    this.save();
    window.dispatchEvent(new CustomEvent('saksham:data-updated'));
    return true;
  }

  addAnnouncement(announcementData) {
    this.data.announcements.unshift(announcementData);
    this.save();
    window.dispatchEvent(new CustomEvent('saksham:data-updated'));
    return true;
  }

  resetToDefaults() {
    localStorage.removeItem(SAKSHAM_STORAGE_KEY);
    this.data = JSON.parse(JSON.stringify(DEFAULT_STORE));
    this.save();
    window.dispatchEvent(new CustomEvent('saksham:data-updated'));
  }
}

// Global Singleton Instance
window.sakshamStore = new SakshamStore();
