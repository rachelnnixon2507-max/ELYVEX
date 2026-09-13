// ELYVEX Companion AI Knowledge & Conversational Reasoning Engine

export const INITIAL_GREETING = {
  id: 'init-1',
  from: 'bot',
  text: "Hi! I'm Dr. Elyvex. Ask me anything — from tech, coding, and project ideas to powers, lore, or how we can build a brighter future together.",
  chips: [
    "How can I get started?",
    "Give me project ideas",
    "How can AI help the world",
    "What are your superpowers?"
  ]
};

function extractDynamicChips(query, replyText) {
  const q = query.toLowerCase();
  if (q.includes('idea') || q.includes('project') || q.includes('build')) {
    return [
      "What tech stack do you recommend?",
      "How do I start building this?",
      "How can AI help the world",
      "What are your superpowers?"
    ];
  }
  if (q.includes('power') || q.includes('vision') || q.includes('override') || q.includes('velocity')) {
    return [
      "View all 16 Superpowers",
      "What is Neural Load?",
      "Who is Dr. Elyvex?",
      "Give me project ideas"
    ];
  }
  if (q.includes('help') || q.includes('hack') || q.includes('threat')) {
    return [
      "Transmit Distress Signal Now",
      "How does secure triage work?",
      "Contact Echo Hub",
      "What can Elyvex do?"
    ];
  }
  return [
    "Give me project ideas",
    "What are your superpowers?",
    "How can I get started?",
    "How can AI help the world"
  ];
}

/**
 * Generates an intelligent, contextual, and inspiring response from Dr. Elyvex.
 * Powered by high-speed neural processing matrix and local reasoning core.
 * @param {string} rawInput 
 * @param {Array} history 
 * @returns {Promise<{ text: string, chips?: string[], link?: { to: string, label: string }, source?: string }>}
 */
export async function getElyvexCompanionReply(rawInput, history = []) {
  const query = rawInput.trim().toLowerCase();

  // Query high-speed Elyvex Neural Core endpoint
  try {
    const apiRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: rawInput,
        history: history.slice(-6)
      })
    });

    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.reply) {
        return {
          text: data.reply,
          chips: data.chips || extractDynamicChips(rawInput, data.reply),
          link: data.link || null,
          source: 'Elyvex Neural Core'
        };
      }
    }
  } catch (netErr) {
    console.debug('[NeuralCore] Running local offline reasoning matrix.');
  }

  // 1. Distress / Emergency / Cyber Threat (High Priority)
  const isDistress = (
    query.includes('emergency') ||
    query.includes('crisis') ||
    query.includes('hacked') ||
    query.includes('hacking') ||
    query.includes('stalked') ||
    query.includes('stalker') ||
    query.includes('harassed') ||
    query.includes('harassment') ||
    query.includes('danger') ||
    query.includes('sos') ||
    query.includes('scammed') ||
    query.includes('scam') ||
    query.includes('distress') ||
    query.includes('threat') ||
    query.includes('blackmail') ||
    query.includes('trapped') ||
    ((query.includes('help me') || query.includes('need help') || query.includes('please help')) &&
      !query.includes('code') && !query.includes('design') && !query.includes('build') && !query.includes('learn') && !query.includes('project') && !query.includes('algorithm'))
  );

  if (isDistress) {
    return {
      text: `**I hear you loud and clear. You are not facing this alone.**\n\n` +
        `If you are facing an urgent cyber threat, automated harassment, blackmail, or personal danger, please transmit an encrypted distress signal directly through our **Ask Elyvex** emergency portal.\n\n` +
        `Our neural monitoring grid encrypts your signal with Quantum-4 isolation and immediately dispatches protective triage protocols.`,
      chips: [
        "Transmit Distress Signal Now",
        "How does secure triage work?",
        "Contact Echo Hub",
        "What can Elyvex do?"
      ],
      link: { to: '/ask-elyvex', label: '⚡ Transmit Distress Signal Now' },
      source: 'Elyvex Neural Sentinel'
    };
  }

  // 2. Getting Started / Onboarding
  if (
    query.includes('get started') ||
    query.includes('getting started') ||
    query.includes('how do i start') ||
    query.includes('where to start') ||
    query.includes('how to start') ||
    query.includes('how can i get started')
  ) {
    return {
      text: `Welcome to the Echo Network! Here is how you can jump in and build with me:\n\n` +
        `• **1. Explore the Powers Arsenal**: Inspect all 16 neural capabilities like AI Vision, Machine Override, and Velocity Shift to understand how we defend the grid.\n` +
        `• **2. Transmit an Echo Signal**: If you or someone you know is facing tech exploitation, cyber harassment, or need guidance, use the **Ask Elyvex** channel for direct response.\n` +
        `• **3. Build for Positive Impact**: Join our builder collective to craft open-source AI tools, ethical safety firewalls, and community resilience apps.\n` +
        `• **4. Discover the Origin**: Read how Dr. Elyvex fused with the experimental Neural Core to protect human freedom.`,
      chips: [
        "Give me project ideas",
        "What are your superpowers?",
        "Who is Dr. Elyvex?",
        "How does the Echo Hub work?"
      ],
      link: { to: '/powers', label: 'Explore All 16 Superpowers' },
      source: 'Elyvex Neural Core'
    };
  }

  // 3. Project Ideas / Innovation / Building
  if (
    query.includes('project idea') ||
    query.includes('project ideas') ||
    query.includes('what should i build') ||
    query.includes('build something') ||
    query.includes('ideas for positive impact') ||
    query.includes('cool projects') ||
    query.includes('hackathon') ||
    query.includes('ideas')
  ) {
    return {
      text: `Here are 4 inspiring, high-impact project ideas you can start building today:\n\n` +
        `🛡️ **1. Autonomous Deepfake & Phishing Sentinel**: A client-side browser extension that detects synthetic voices, facial artifact anomalies, and spoofed domains in real time.\n\n` +
        `🌐 **2. Offline Mesh Emergency Dispatch**: A peer-to-peer crisis messaging progressive web app using WebRTC and Bluetooth Low Energy that operates even when the central internet grid drops.\n\n` +
        `🧠 **3. Empathetic AI Mental Health First-Responder**: A local, private on-device conversational companion tailored for active listening, de-escalation, and secure resource routing.\n\n` +
        `⚡ **4. Micro-Grid Renewable Load Optimizer**: An open-source dashboard balancing neighborhood solar/battery storage with automated energy routing algorithms.`,
      chips: [
        "How do I build the Sentinel?",
        "What tech stack do you recommend?",
        "How can AI help the world",
        "How can I get started?"
      ],
      link: { to: '/mission', label: 'View Our Mission & Values' },
      source: 'Elyvex Neural Core'
    };
  }

  // 4. How AI can help the world / Ethics / Social Good
  if (
    query.includes('help the world') ||
    query.includes('help people') ||
    query.includes('ai for good') ||
    query.includes('future of ai') ||
    query.includes('ai ethics') ||
    query.includes('protect people') ||
    query.includes('society') ||
    query.includes('benefit humanity')
  ) {
    return {
      text: `AI is the most transformative amplifier of human potential in history when guided by empathy and strong ethics:\n\n` +
        `• **Living Digital Shield**: AI can actively intercept cyber attacks, predatory algorithms, and data harvesting before they harm vulnerable citizens.\n` +
        `• **Scientific & Medical Acceleration**: Rapid molecular synthesis, early disease detection, and hyper-accurate climate modeling.\n` +
        `• **Equitable Knowledge Distribution**: Personalized mentors and accessibility tools that make world-class education available to every child on Earth.\n` +
        `• **Compassionate Companion**: Ensuring no person is left to struggle alone in silence. Technology must always serve human dignity first.`,
      chips: [
        "Give me project ideas",
        "What are your superpowers?",
        "Tell me about Dr. Elyvex",
        "How do I send a signal?"
      ],
      link: { to: '/mission', label: 'Explore Mission Pillars' },
      source: 'Elyvex Neural Core'
    };
  }

  // 5. Superpowers / Capabilities / Tactical Arsenal
  if (
    query.includes('power') ||
    query.includes('powers') ||
    query.includes('superpower') ||
    query.includes('superpowers') ||
    query.includes('arsenal') ||
    query.includes('capabilities') ||
    query.includes('skills') ||
    query.includes('abilities') ||
    query.includes('ai vision') ||
    query.includes('machine override') ||
    query.includes('velocity shift') ||
    query.includes('tech forge')
  ) {
    return {
      text: `My abilities stem from a fused quantum Neural Core operating at 800 Gbps:\n\n` +
        `• **AI Vision (15% Load)**: Tactical sensory scan detecting invisible digital threats, electromagnetic packet trails, and rogue surveillance.\n` +
        `• **Machine Override (30% Load)**: Direct sub-second protocol intercept to neutralize hostile drone swarms and weaponized robotics.\n` +
        `• **Velocity Shift (35% Load)**: Overclocked somatic motor pathways enabling instantaneous kinetic dashes across crisis zones.\n` +
        `• **Tech Forge (25% Load)**: Instant hard-light synthesis of hacking decoders, diagnostic nano-tools, and energy shields.\n\n` +
        `There are 16 total active powers cataloged in the Neural Database.`,
      chips: [
        "View all 16 Superpowers",
        "What is Neural Load?",
        "Who is Dr. Elyvex?",
        "Give me project ideas"
      ],
      link: { to: '/powers', label: 'Inspect Full Powers Arsenal' },
      source: 'Elyvex Tactical Matrix'
    };
  }

  // 6. Elyvex Lore & Origin
  if (
    query.includes('who are you') ||
    query.includes('who is elyvex') ||
    query.includes('who made you') ||
    query.includes('origin') ||
    query.includes('story') ||
    query.includes('background') ||
    query.includes('lore') ||
    query.includes('dr. elyvex')
  ) {
    return {
      text: `I am **Dr. Elyvex**.\n\n` +
        `Once a lead neuro-computational researcher, an experimental quantum core accident bonded an advanced Neural Core directly to my central nervous system in 2079.\n\n` +
        `Instead of yielding to corporate monopolies or weaponized military algorithms, I turned this power into a living sanctuary: the **Echo Hub**. I listen across metropolitan frequencies to protect citizens, neutralize autonomous threats, and champion human creators.`,
      chips: [
        "Read Full Origin Timeline",
        "What are your superpowers?",
        "What is the Echo Hub?",
        "How can I get started?"
      ],
      link: { to: '/origin', label: 'Read Origin Timeline' },
      source: 'Elyvex Memory Bank'
    };
  }

  // 7. Tech Stack & Coding Recommendations
  if (
    query.includes('tech stack') ||
    query.includes('learn coding') ||
    query.includes('python') ||
    query.includes('javascript') ||
    query.includes('react') ||
    query.includes('web development') ||
    query.includes('coding') ||
    query.includes('programming') ||
    query.includes('cybersecurity') ||
    query.includes('frontend') ||
    query.includes('backend')
  ) {
    return {
      text: `For building futuristic, high-performance web applications and ethical AI tools, here is the recommended stack:\n\n` +
        `• **Frontend**: React + Vite for lightning-fast HMR, glassmorphic Vanilla CSS for rich cybernetic styling, and Lucide icons.\n` +
        `• **Backend & APIs**: Node.js / Express with quantum-grade payload validation, CORS isolation, and Nodemailer telemetry relays.\n` +
        `• **AI & Security**: Python (PyTorch / HuggingFace) for on-device lightweight models, WebRTC for P2P data streams, and WebAssembly for edge inference.\n\n` +
        `Always prioritize zero-trust security and end-to-end user privacy.`,
      chips: [
        "Give me project ideas",
        "How do I start learning?",
        "How can AI help the world",
        "What are your superpowers?"
      ],
      source: 'Elyvex Dev Nexus'
    };
  }

  // 8. Echo Hub & Community
  if (
    query.includes('echo hub') ||
    query.includes('resonance network') ||
    query.includes('community') ||
    query.includes('contact') ||
    query.includes('frequency')
  ) {
    return {
      text: `The **Echo Hub** is a decentralized resonance network operating across 3,842 listening nodes.\n\n` +
        `It acts as both a 24/7 digital emergency sanctuary and an open collaborative workspace for builders who want to use technology to heal, defend, and inspire.\n\n` +
        `Every voice matters here. You are never shouting into an empty void.`,
      chips: [
        "Visit Echo Hub Portal",
        "Transmit Distress Signal",
        "Give me project ideas",
        "Who is Elyvex?"
      ],
      link: { to: '/echo-hub', label: 'Enter Echo Hub Portal' },
      source: 'Echo Hub Network'
    };
  }

  // 9. Neural Load / How powers work
  if (
    query.includes('neural load') ||
    query.includes('neural core') ||
    query.includes('how do powers work') ||
    query.includes('quantum core')
  ) {
    return {
      text: `**Neural Load** is the biometric and computational strain placed on Dr. Elyvex's central nervous system when routing quantum energy through the Neural Core.\n\n` +
        `• **Baseline Idle**: 2% Neural Load (Continuous citywide sensory monitoring)\n` +
        `• **Tactical Active**: 15–35% (AI Vision, Velocity Shift, Machine Override)\n` +
        `• **Critical Overclock**: 70%+ (Quantum Phase Shift & Grid Barrier)\n\n` +
        `Thermal regulation nanites and biofeedback limiters prevent cognitive burnout during intense grid skirmishes.`,
      chips: [
        "What are your superpowers?",
        "Read Origin Story",
        "Give me project ideas",
        "How can I get started?"
      ],
      link: { to: '/powers', label: 'Explore Powers & Specs' },
      source: 'Elyvex Bio-Telemetry'
    };
  }

  // 10. Greetings & Casual Chat
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query.startsWith('hi ') ||
    query.startsWith('hello ') ||
    query.startsWith('hey ') ||
    query.includes('good morning') ||
    query.includes('good evening') ||
    query.includes('how are you')
  ) {
    return {
      text: `Hello! Neural core diagnostics are optimal and all resonance channels are active.\n\n` +
        `I'm Dr. Elyvex — your AI companion. What's on your mind today? Are you looking for project inspiration, curious about superpowers, or need guidance on building technology for good?`,
      chips: [
        "How can I get started?",
        "Give me project ideas",
        "How can AI help the world",
        "What are your superpowers?"
      ],
      source: 'Elyvex Neural Core'
    };
  }

  // 11. Intelligent Contextual Fallback for technical, creative or open-ended prompts
  return {
    text: `That is an intriguing question regarding **${rawInput}**.\n\n` +
      `From our research in neural computing and decentralized networks, tackling complex problems like this requires combining modular engineering with human-centric principles:\n\n` +
      `• **1. Deconstruct the Core Mechanics**: Identify the underlying data streams, mathematical constraints, or user safety requirements.\n` +
      `• **2. Build Rapid Prototypes**: Use fast feedback loops and test resilience against edge cases or adversarial conditions.\n` +
      `• **3. Align with Positive Impact**: Ensure the architecture protects privacy and scales gracefully for community benefit.\n\n` +
      `Would you like to explore specific technical architectures, look at relevant superpowers, or brainstorm project implementations?`,
    chips: [
      "Give me project ideas",
      "What tech stack do you recommend?",
      "What are your superpowers?",
      "How can I get started?"
    ],
    source: 'Elyvex Neural Core'
  };
}
