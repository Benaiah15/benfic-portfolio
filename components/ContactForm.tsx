"use client";

import { useState } from "react";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // 1. Save the form reference IMMEDIATELY before Javascript throws it away
    const form = event.currentTarget;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    const formData = new FormData(form);
    
    // REPLACE THIS WITH YOUR ACTUAL WEB3FORMS ACCESS KEY
    formData.append("access_key", "03072b62-4d8d-4220-8550-109fe9d491fa");

    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: json
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus("success");
        // 2. Use the saved form reference here to clear the inputs
        form.reset(); 
      } else {
        console.error("Web3Forms Error:", result);
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 relative overflow-hidden">
      
      {/* Success Message Overlay */}
      {submitStatus === "success" && (
        <div className="absolute inset-0 bg-zinc-900/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 border border-green-500/30">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
          <p className="text-zinc-400 mb-6">Thank you for reaching out. I will get back to you shortly.</p>
          <button 
            onClick={() => setSubmitStatus("idle")}
            className="text-sm font-semibold text-benfic-blue hover:text-white transition-colors border border-zinc-700 px-4 py-2 rounded-md hover:border-benfic-blue"
          >
            Send another message
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-medium text-zinc-400">Name</label>
            <input type="text" id="name" name="name" required className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-benfic-blue transition-colors" placeholder="John Doe" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email</label>
            <input type="email" id="email" name="email" required className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-benfic-blue transition-colors" placeholder="john@example.com" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
          <textarea id="message" name="message" required rows={5} className="bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-benfic-blue transition-colors resize-none" placeholder="Tell me about your project..."></textarea>
        </div>
        
        {submitStatus === "error" && (
          <p className="text-red-500 text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
            Something went wrong. Please try again or contact me on WhatsApp.
          </p>
        )}

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full rounded-md bg-benfic-blue px-5 py-3.5 text-sm font-semibold text-white transition-all hover:bg-blue-700 shadow-[0_0_15px_rgba(4,82,218,0.3)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Sending...
            </>
          ) : (
            "Send Message"
          )}
        </button>
      </form>
    </div>
  );
}