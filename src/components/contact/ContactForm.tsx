'use client';

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";

export default function ContactForm() {
  const t = useTranslations("contactForm");
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale;
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState(0);

  // Generate a new math question on component mount
  useEffect(() => {
    const n1 = Math.floor(Math.random() * 10) + 1; // Numbers between 1 and 10
    const n2 = Math.floor(Math.random() * 10) + 1;
    setNum1(n1);
    setNum2(n2);
    setCorrectAnswer(n1 + n2);
  }, []); // Empty dependency array ensures this runs only once on mount

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    // Honeypot field
    website: "",
    // "Am I human" check - math question answer
    mathAnswer: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(t("sending"));

    // Honeypot check
    if (formData.website) {
      setStatus(t("spamDetected"));
      return;
    }

    // "Am I human" check - math question
    if (parseInt(formData.mathAnswer) !== correctAnswer) {
      setStatus(t("incorrectMathAnswer"));
      return;
    }

    try {
      const response = await fetch(`/${locale}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          correctAnswer: correctAnswer, // Send correct answer for server-side validation
        }),
      });

      if (response.ok) {
        setStatus(t("success"));
        setFormData({
          name: "",
          email: "",
          message: "",
          website: "",
          mathAnswer: "",
        });
        // Regenerate math question after successful submission
        const n1 = Math.floor(Math.random() * 10) + 1;
        const n2 = Math.floor(Math.random() * 10) + 1;
        setNum1(n1);
        setNum2(n2);
        setCorrectAnswer(n1 + n2);
      } else {
        const errorData = await response.json();
        setStatus(`${t("error")}: ${errorData.message || response.statusText}`);
      }
    } catch (error) {
      setStatus(`${t("error")}: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t("nameLabel")}
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t("emailLabel")}
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          {t("messageLabel")}
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          value={formData.message}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        ></textarea>
      </div>
      {/* Honeypot field - visually hidden */}
      <div style={{ display: "none" }}>
        <label htmlFor="website">{t("websiteLabel")}</label>
        <input
          type="text"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
      {/* "Am I human" check - Math question */}
      <div>
        <label htmlFor="mathAnswer" className="block text-sm font-medium text-gray-700">
          {t("mathQuestion", { num1, num2 })}
        </label>
        <input
          type="number"
          id="mathAnswer"
          name="mathAnswer"
          value={formData.mathAnswer}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <button
        type="submit"
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {t("submitButton")}
      </button>
      {status && (
        <p className={`mt-4 text-sm ${status.includes(t("error")) || status.includes(t("incorrectMathAnswer")) || status.includes(t("spamDetected")) ? "text-red-600" : "text-green-600"}`}>
          {status}
        </p>
      )}
    </form>
  );
}
