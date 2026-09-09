import React, { useState, useRef, useEffect, useCallback } from "react";
import { X, Send, Minimize2, RotateCcw, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { FitLaunchMark } from "@/components/features/Logo";
import { supabase } from "@/lib/supabase";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "ai";
  text: string;
  links?: { label: string; href: string }[];
  typing?: boolean;
}

const PROMPTS = [
  "Which service do I need?",
  "What do you build for gyms?",
  "Help me plan my website",
  "Start a project",
];

function parseLinks(text: string): { label: string; href: string }[] {
  const links: { label: string; href: string }[] = [];
  const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let m;
  while ((m = regex.exec(text)) !== null) {
    links.push({ label: m[1], href: m[2] });
  }
  return links;
}

function stripMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function TypingText({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <span className="whitespace-pre-wrap">
      {displayed}
      {!done && <span className="inline-block w-0.5 h-4 bg-mint animate-pulse ml-0.5 align-middle" />}
    </span>
  );
}

export default function FitLaunchAI() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "ai",
      text: "I'm the FitLaunch AI assistant, powered by live site content. Ask me about our services, what we build for your sport, or how to start a project.",
      links: [{ label: "Start a Project", href: "/contact" }],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const conversationHistory = messages
    .filter(m => m.id !== "init")
    .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text }));

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: text.trim() };
    const aiMsgId = (Date.now() + 1).toString();

    setMessages(m => [...m, userMsg, { id: aiMsgId, role: "ai", text: "", typing: true }]);
    setInput("");
    setLoading(true);

    const newHistory = [...conversationHistory, { role: "user" as const, content: text.trim() }];

    const { data, error } = await supabase.functions.invoke("fitlaunch-ai", {
      body: { messages: newHistory, stream: false },
    });

    let responseText = "I'm having trouble connecting right now. Please try again or visit our contact page.";
    let links: { label: string; href: string }[] = [{ label: "Contact Us", href: "/contact" }];

    if (error) {
      console.log("AI error:", error);
    } else if (data?.text) {
      responseText = data.text;
      links = parseLinks(responseText);
    }

    const cleanText = stripMarkdown(responseText);

    setMessages(m => m.map(msg =>
      msg.id === aiMsgId
        ? { ...msg, text: cleanText, links, typing: false }
        : msg
    ));
    setLoading(false);
  }, [loading, conversationHistory]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const reset = () => {
    setMessages([{
      id: "init",
      role: "ai",
      text: "I'm the FitLaunch AI assistant, powered by live site content. Ask me about our services, what we build for your sport, or how to start a project.",
      links: [{ label: "Start a Project", href: "/contact" }],
    }]);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 group",
          "bg-obsidian border border-mint/30 hover:border-mint/60",
          open && "opacity-0 pointer-events-none scale-90"
        )}
        aria-label="Open FitLaunch AI Assistant"
        style={{ boxShadow: "0 0 20px rgba(0,245,160,0.15)" }}
      >
        <FitLaunchMark size="sm" className="group-hover:scale-110 transition-transform duration-200" />
        <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-mint animate-pulse" />
      </button>

      {/* Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 origin-bottom-right",
          "bg-obsidian border border-white/10",
          open ? "scale-100 opacity-100" : "scale-90 opacity-0 pointer-events-none"
        )}
        style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,245,160,0.06)" }}
        role="dialog"
        aria-label="FitLaunch AI Assistant"
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/8 bg-deep-slate">
          <FitLaunchMark size="sm" className="flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm text-off-white tracking-wider">FITLAUNCH AI</div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" />
              <span className="text-[10px] text-muted-slate">Gemini Flash · Live content</span>
            </div>
          </div>
          <button onClick={reset} className="p-1.5 text-muted-slate hover:text-off-white transition-colors rounded-lg hover:bg-white/5" aria-label="Reset">
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setOpen(false)} className="p-1.5 text-muted-slate hover:text-off-white transition-colors rounded-lg hover:bg-white/5" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Messages */}
        <div className="h-72 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-obsidian">
          {messages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-2", msg.role === "user" ? "justify-end" : "justify-start")}>
              {msg.role === "ai" && (
                <div className="w-6 h-6 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="w-3 h-3 text-mint" />
                </div>
              )}
              <div className={cn(
                "max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-mint/15 border border-mint/25 text-off-white rounded-tr-sm"
                  : "bg-elevated border border-white/8 text-off-white/90 rounded-tl-sm"
              )}>
                {msg.role === "ai" && !msg.typing && msg.id !== "init" ? (
                  <TypingText text={msg.text} />
                ) : (
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                )}
                {msg.typing && (
                  <div className="flex gap-1 py-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-mint/60 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                    ))}
                  </div>
                )}
                {msg.links && msg.links.length > 0 && !msg.typing && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {msg.links.map((link) => (
                      <button
                        key={link.href}
                        onClick={() => { navigate(link.href); setOpen(false); }}
                        className="inline-flex items-center gap-1 text-[11px] font-display font-bold text-mint hover:text-off-white transition-colors tracking-wider uppercase"
                      >
                        {link.label} <ArrowRight className="w-2.5 h-2.5" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 pt-3 pb-2 flex flex-wrap gap-1.5 bg-obsidian border-t border-white/5">
          {PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => sendMessage(p)}
              disabled={loading}
              className="text-[10px] font-display font-bold tracking-wider px-2.5 py-1.5 rounded-full bg-elevated border border-white/8 text-muted-slate hover:text-mint hover:border-mint/20 transition-all duration-150 disabled:opacity-40"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="px-4 pb-4 bg-obsidian">
          <div className="flex gap-2 bg-elevated rounded-2xl border border-white/8 p-1 pl-4 focus-within:border-mint/25 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about our services..."
              className="flex-1 bg-transparent text-sm text-off-white placeholder-muted-slate/50 outline-none py-2"
              disabled={loading}
              aria-label="Message FitLaunch AI"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="p-2.5 bg-mint rounded-xl text-obsidian disabled:opacity-40 hover:bg-off-white transition-colors flex-shrink-0"
              aria-label="Send"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-center text-[9px] text-muted-slate/40 mt-2 font-body">
            Powered by OnSpace AI · Live site content only
          </p>
        </form>
      </div>
    </>
  );
}
