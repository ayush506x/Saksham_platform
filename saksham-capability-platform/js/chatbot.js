/* ==========================================================================
   SAKSHAM (सक्षम) - "Saksham Saathi" (सक्षम साथी) AI Virtual Assistant
   Official Capacity Building & Administrative Training Desk Bot
   Answers inquiries on Competency Mapping, Approval Gates, Exams & Circulars
   ========================================================================== */

class SakshamChatbot {
  constructor() {
    this.isOpen = false;
    this.messages = [
      {
        sender: 'bot',
        text: 'नमस्ते! I am <strong>Saksham Saathi (सक्षम साथी)</strong>, the Capacity Building Commission virtual assistant. How may I assist your administrative training, competency certification, or cadre guidelines today?'
      }
    ];

    this.faqDatabase = [
      {
        keywords: ['competency', 'mapping', 'match', 'how it works', 'algorithm'],
        answer: '<strong>Competency Mapping Engine:</strong> Unlike generic LMS platforms that only match students to courses, Saksham evaluates certified trainers against statutory subject prerequisites using a multi-factor regression model: Domain Qualifications (35%), Cadre Field Experience (25%), Historical Trainee Rating (20%), and Batch Pedagogy Throughput (20%). This ensures high-impact faculty deployment across Central Ministries.'
      },
      {
        keywords: ['approval', 'gate', 'vetting', 'pending', 'verification', 'trainer approval'],
        answer: '<strong>Administrative Approval Gate:</strong> To maintain government instructional standards, all newly registered Trainers enter a status of <code>PENDING_APPROVAL</code>. The Joint Secretary / Admin inspects academic credentials, doctoral degrees, and parent cadre clearance NOCs before granting authorization to publish exams or syllabus materials.'
      },
      {
        keywords: ['gfr', 'exam', 'assessment', 'quiz', 'pass', 'cutoff', 'passing marks'],
        answer: '<strong>Timed MCQ Certification:</strong> The GFR 2017 certification assessment consists of timed questions with an official countdown clock and question navigation palette. The statutory qualifying benchmark is <strong>60%</strong>. Upon passing, a verifiable <em>Certificate of Competency</em> is issued under the Mission Karmayogi framework.'
      },
      {
        keywords: ['karmayogi', 'igot', 'mandate', 'mission', 'difference', 'sih'],
        answer: '<strong>Alignment with Mission Karmayogi:</strong> Saksham focuses on <em>Organizational Capability Building</em> rather than simple course completion. The executive dashboard tracks institutional compliance across Ministries (Finance, MeitY, MoRTH), identifying critical skill gaps and aligning with the National Capacity Building Commission charter.'
      },
      {
        keywords: ['enroll', 'course', 'register', 'how to join'],
        answer: 'To enroll in a training program, navigate to the <strong>Course Catalog</strong> or inspect the <strong>Cadre Recommendations</strong> on your Trainee Desk. Click "One-Click Enroll" to obtain immediate Department Training Sponsorship.'
      },
      {
        keywords: ['early warning', 'trainer', 'at risk', 'monitoring'],
        answer: '<strong>Trainer Early-Warning Desk:</strong> Enables instructors to monitor trainee pace in real-time. Officers with progress below 50% or failed quiz attempts are automatically flagged for pedagogical intervention before final batch completion.'
      }
    ];
  }

  toggle() {
    this.isOpen = !this.isOpen;
    const drawer = document.getElementById('saksham-chatbot-drawer');
    if (drawer) {
      drawer.className = this.isOpen ? 'chatbot-drawer open' : 'chatbot-drawer';
    }
  }

  sendMessage(text) {
    if (!text || !text.trim()) return;

    this.messages.push({ sender: 'user', text: text.trim() });
    this.renderMessages();

    const input = document.getElementById('chatbot-input');
    if (input) input.value = '';

    // Process Response
    setTimeout(() => {
      const reply = this.generateResponse(text.toLowerCase());
      this.messages.push({ sender: 'bot', text: reply });
      this.renderMessages();
    }, 400);
  }

  generateResponse(query) {
    for (const item of this.faqDatabase) {
      if (item.keywords.some(k => query.includes(k))) {
        return item.answer;
      }
    }

    if (query.includes('hello') || query.includes('hi') || query.includes('namaste')) {
      return 'नमस्कार! How can I assist you with the Saksham Capacity Building Portal? You can ask about Competency Mapping, the Approval Gate, or taking the GFR 2017 assessment.';
    }

    return 'Thank you for your query. As per Capacity Building Commission guidelines, detailed circulars are available on the public dashboard. You may also consult your designated Ministry Nodal Officer or explore the quick query chips below.';
  }

  renderMessages() {
    const mount = document.getElementById('chatbot-msg-area');
    if (!mount) return;

    mount.innerHTML = this.messages.map(m => `
      <div class="chat-bubble ${m.sender}">
        ${m.text}
      </div>
    `).join('');

    mount.scrollTop = mount.scrollHeight;
  }

  render() {
    return `
      <div class="chatbot-float-wrapper">
        <button class="chatbot-trigger-btn" onclick="window.sakshamBot.toggle()">
          <span style="font-size: 1.1rem;">🇮🇳</span>
          <span>सक्षम साथी / Saksham Saathi</span>
        </button>

        <div id="saksham-chatbot-drawer" class="chatbot-drawer ${this.isOpen ? 'open' : ''}">
          <div class="chatbot-header">
            <div class="chatbot-header-title">
              <span>🏛️</span>
              <div>
                <div>सक्षम साथी &bull; Virtual Assistant</div>
                <div style="font-size: 0.68rem; font-weight: normal; opacity: 0.85;">Capacity Building Commission</div>
              </div>
            </div>
            <button class="gov-modal-close-btn" style="color: #ffffff;" onclick="window.sakshamBot.toggle()">&times;</button>
          </div>

          <div id="chatbot-msg-area" class="chatbot-msg-area">
            <!-- Messages rendered dynamically -->
          </div>

          <!-- Quick Action Prompts for Judge Evaluation -->
          <div class="quick-prompts-row">
            <button class="quick-chip" onclick="window.sakshamBot.sendMessage('How does Competency Mapping work?')">Competency Mapping?</button>
            <button class="quick-chip" onclick="window.sakshamBot.sendMessage('What is the Approval Gate for Trainers?')">Approval Gate?</button>
            <button class="quick-chip" onclick="window.sakshamBot.sendMessage('What are the passing marks for GFR exam?')">Exam Rules?</button>
            <button class="quick-chip" onclick="window.sakshamBot.sendMessage('Explain alignment with Mission Karmayogi')">Karmayogi Mandate?</button>
          </div>

          <form class="chatbot-input-area" onsubmit="event.preventDefault(); window.sakshamBot.sendMessage(document.getElementById('chatbot-input').value);">
            <input type="text" id="chatbot-input" class="gov-form-control" style="font-size: 0.84rem;" placeholder="Ask in English or हिन्दी..." />
            <button type="submit" class="gov-btn gov-btn-primary gov-btn-sm">Send</button>
          </form>
        </div>
      </div>
    `;
  }
}

window.sakshamBot = new SakshamChatbot();
