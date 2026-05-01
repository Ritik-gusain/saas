"use client";

import { useState, useRef, useEffect } from "react";
import { Plus, Minus } from "lucide-react";
import gsap from "gsap";

const faqData = [
  {
    question: "How secure is the Luminescent orchestration layer?",
    answer: "We use AES-256-GCM encryption for all data at rest and TLS 1.3 for data in transit. Our orchestration layer is designed with a zero-trust architecture, meaning even we cannot access your private model weights or training data."
  },
  {
    question: "Can I deploy my own custom models?",
    answer: "Yes. Luminescent supports all major model formats (PyTorch, TensorFlow, ONNX) and can orchestrate deployments across any cloud provider or on-premise hardware via our proprietary node system."
  },
  {
    question: "What is the average latency for collaborative agents?",
    answer: "Our global edge network ensures sub-30ms latency for agent-to-agent communication and sub-50ms for end-user interactions, depending on the model size and regional availability."
  },
  {
    question: "Do you offer enterprise-level SLAs?",
    answer: "Absolutely. Our Enterprise tier includes 99.99% uptime guarantees, 24/7 dedicated support, and custom deployment architectures tailored to your specific regulatory requirements."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section 
      id="faq"
      className="scrolly-section"
      data-bg="#0E1218"
      data-text="#FFFFFF"
      style={{
        padding: "120px 24px",
        background: "var(--landing-bg2)",
        position: "relative"
      }}
    >
      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="mono-label" style={{ color: "var(--landing-purple)", marginBottom: 16 }}>
            QUESTIONS // 07
          </div>
          <h2 className="header-h2" style={{ fontSize: "clamp(28px, 3vw, 40px)" }}>
            Frequently Asked <span className="shimmer-text">Protocol.</span>
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {faqData.map((item, i) => (
            <div 
              key={i}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 16,
                overflow: "hidden",
                transition: "all 0.3s ease"
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "24px 32px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: "none",
                  border: "none",
                  color: "#FFF",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: 18,
                  fontWeight: 500,
                  fontFamily: "var(--font-header)"
                }}
              >
                {item.question}
                {openIndex === i ? <Minus size={20} color="var(--landing-purple)" /> : <Plus size={20} color="rgba(255,255,255,0.3)" />}
              </button>
              
              <div 
                style={{
                  maxHeight: openIndex === i ? "300px" : "0",
                  overflow: "hidden",
                  transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  padding: openIndex === i ? "0 32px 32px" : "0 32px"
                }}
              >
                <p style={{ 
                  color: "var(--landing-muted)", 
                  lineHeight: 1.6, 
                  fontSize: 16,
                  borderTop: openIndex === i ? "1px solid rgba(255,255,255,0.05)" : "none",
                  paddingTop: openIndex === i ? 24 : 0
                }}>
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative dots to fill space */}
      <div style={{
        position: "absolute",
        top: "20%",
        left: "5%",
        width: 100,
        height: 100,
        background: "radial-gradient(circle, rgba(123,97,255,0.1) 0%, transparent 70%)",
        pointerEvents: "none"
      }} />
    </section>
  );
}
