// Netlify serverless function serving dynamic configurations
export const handler = async (event, context) => {
  // Handle preflight OPTIONS
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "GET, OPTIONS"
      },
      body: ""
    };
  }

  if (event.httpMethod !== "GET") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  const features = [
    {
      id: "autonomous-ops",
      title: "Autonomous Operations",
      description: "Self-correcting workflows linking your CRMs, custom databases, and communication lines on autopilot.",
      icon: "Cpu",
      badge: "Core Engine"
    },
    {
      id: "whatsapp-tutor",
      title: "Context-Aware Memory",
      description: "Agents retain conversation context over days, allowing natural follow-ups and Socratic learning sessions.",
      icon: "MessageSquare",
      badge: "Conversational"
    },
    {
      id: "handwriting-ocr",
      title: "Handwriting OCR & Grading",
      description: "Read handwritten worksheets or scanned applications, analyze against rubrics, and feedback in real-time.",
      icon: "FileCheck",
      badge: "Vision AI"
    },
    {
      id: "outbound-voice",
      title: "Natural Voice Synthesizer",
      description: "Execute outbound collection reminders or warm-lead follow-ups using naturally paced voice generators.",
      icon: "PhoneCall",
      badge: "Voice Runtimes"
    }
  ];

  const agents = [
    {
      id: "lead-inquiry",
      name: "Lead & Inquiry Agent",
      role: "Sales",
      capabilities: [
        "Qualifies inbound inquiries instantly 24/7",
        "Engages leads across WhatsApp, web forms, and voice lines",
        "Answers business FAQs accurately without human delay",
        "Schedules meetings directly to calendars (Calendly, HubSpot, etc.)"
      ],
      avatar: "Users",
      status: "Active Under 5s Response"
    },
    {
      id: "support-doubt",
      name: "Support & Doubt-Resolution Agent",
      role: "Support",
      capabilities: [
        "24/7 instant replies with full context retention",
        "Trained on your specific knowledge base & business data",
        "Multi-lingual support for global customers",
        "Automated human escalation protocols (Zendesk, Slack)"
      ],
      avatar: "MessageSquare",
      status: "85%+ Automated Resolution"
    },
    {
      id: "document-workflow",
      name: "Document & Grading Agent",
      role: "Operations",
      capabilities: [
        "High-accuracy OCR for document and handwriting scanning",
        "Auto-checks and grades according to custom rubrics",
        "Generates immediate structured feedback for applicants/students",
        "Auto-syncs scores and data to backend systems"
      ],
      avatar: "FileCheck",
      status: "95% Review Time Saved"
    },
    {
      id: "content-marketing",
      name: "Content & Marketing Agent",
      role: "Marketing",
      capabilities: [
        "Extracts engaging short clips from long-form video or audio",
        "Generates context-rich captions and platform-specific hashtags",
        "Learns and replicates your unique brand voice",
        "Auto-schedules publications to social media boards"
      ],
      avatar: "Video",
      status: "10x Content Production"
    },
    {
      id: "outbound-followup",
      name: "Outbound & Follow-Up Agent",
      role: "Outbound",
      capabilities: [
        "Automates Conversational outreach over WhatsApp or Twilio voice",
        "Handles appointment reminders and invoice follow-ups",
        "Ensures strict script compliance and logging",
        "Updates CRM status based on call results"
      ],
      avatar: "PhoneCall",
      status: "98% Outreach Success"
    },
    {
      id: "custom-agent",
      name: "Custom Dedicated Agent",
      role: "Custom",
      capabilities: [
        "Discovery audit of your manual workflows",
        "Tailor-made model logic and API integrations",
        "Pilot trial on actual production workflows before payment",
        "Dedicated monitoring and ongoing performance tuning"
      ],
      avatar: "Bot",
      status: "100% Tailored to Your Stack"
    }
  ];

  const pricing = [
    {
      tier: "Sandbox Pilot",
      price: "Free / 14 Days",
      description: "Test-drive custom-tailored model logic on your live production data with zero risk.",
      inclusions: [
        "Custom agent design & prompts",
        "WhatsApp / Web sandbox access",
        "Founder-led operational audit",
        "Basic performance logs"
      ],
      highlighted: false
    },
    {
      tier: "Operations Growth",
      price: "$499/mo",
      description: "Scale customer engagement and document processing with dedicated cloud runtimes.",
      inclusions: [
        "1 Dedicated Production Agent",
        "WhatsApp API & Twilio connections",
        "Bi-weekly logic & context tuning",
        "CRM database sync & webhooks",
        "Standard Email & Slack support"
      ],
      highlighted: true
    },
    {
      tier: "Enterprise Orchestrator",
      price: "Custom",
      description: "Uncapped automated operations layer for high-volume service delivery.",
      inclusions: [
        "Unlimited Custom Agents",
        "Private LLM fine-tuning & gateways",
        "SLA-backed performance runtime",
        "Dedicated Support Engineer",
        "On-prem DB gateways"
      ],
      highlighted: false
    }
  ];

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET, OPTIONS"
    },
    body: JSON.stringify({ features, agents, pricing })
  };
};
