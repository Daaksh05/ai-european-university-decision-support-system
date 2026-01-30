import React, { useState } from "react";
import QueryBox from "../components/QueryBox";
import "./AskAIPage.css";

function AskAIPage() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What documents do I need for university applications?",
      answer: "Typically, you'll need your academic transcripts, statement of purpose (SOP), letters of recommendation (LORs), proof of English proficiency (IELTS/TOEFL), and a valid passport copy."
    },
    {
      question: "How long does the visa application process take?",
      answer: "Processing times vary by country but usually take 4-8 weeks. It's recommended to apply at least 3 months before your course starts."
    },
    {
      question: "What IELTS score do I need for top universities?",
      answer: "Most top European universities require a minimum IELTS score of 6.5 or 7.0, with no individual band below 6.0."
    },
    {
      question: "Which countries offer scholarships for international students?",
      answer: "Many countries like France (Eiffel), Germany (DAAD), Netherlands (OTS), and Italy offer generous government and university-specific scholarships."
    },
    {
      question: "How can I maximize my chances of admission?",
      answer: "Focus on maintaining a strong GPA, scoring well on required tests, writing a compelling SOP that highlights your goals, and applying as early as possible."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="ask-ai-page">
      <div className="ask-ai-header">
        <h1>Ask Our AI Assistant</h1>
        <p>Have questions about universities, applications, or scholarships? Get instant answers from our intelligent assistant.</p>
      </div>

      <div className="ask-ai-container">
        <div className="query-wrapper">
          <QueryBox />
        </div>

        <aside className="ask-ai-faq">
          <h3>Frequently Asked Questions</h3>
          <div className="faq-items">
            {faqData.map((item, index) => (
              <div
                key={index}
                className={`faq-item ${activeIndex === index ? "active" : ""}`}
                onClick={() => toggleFAQ(index)}
              >
                <div className="faq-question">
                  <h4>{item.question}</h4>
                  <span className="faq-icon">{activeIndex === index ? "−" : "+"}</span>
                </div>
                {activeIndex === index && (
                  <div className="faq-answer">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default AskAIPage;
