import { Chapter } from "../types";

export function parseChapters(text: string): Chapter[] {
  if (!text) return [];

  const chapters: Chapter[] = [];
  const normalizedText = text.replace(/
/g, "
");
  const parts = normalizedText.split(/
##s+/);

  const firstPart = parts[0];
  if (firstPart.trim() && !normalizedText.startsWith("##")) {
    const cleanContent = firstPart.trim();
    chapters.push({
      id: "intro",
      title: "Introduction",
      content: cleanContent,
      bullets: extractBullets(cleanContent),
      visualPrompt: "Introduction Diagram & Overview",
    });
  }

  for (let i = 1; i < parts.length; i++) {
    const section = parts[i];
    const lines = section.split("
");
    const title = lines[0].trim();
    const content = lines.slice(1).join("
").trim();

    if (title && content) {
      chapters.push({
        id: `chap-${i}`,
        title,
        content,
        bullets: extractBullets(content),
        visualPrompt: generateVisualPrompt(title, content),
      });
    }
  }

  if (chapters.length === 0) {
    const cleanText = text.replace(/#/g, "").trim();
    chapters.push({
      id: "lesson-full",
      title: "Core Lesson Overview",
      content: cleanText,
      bullets: extractBullets(cleanText),
      visualPrompt: "Overview Infographics & Key Points",
    });
  }

  return chapters;
}

function extractBullets(text: string): string[] {
  const lines = text.split("
");
  const bullets: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (
      trimmed.startsWith("-") ||
      trimmed.startsWith("*") ||
      trimmed.startsWith("•") ||
      /^d+./.test(trimmed)
    ) {
      const cleanBullet = trimmed
        .replace(/^[-*•]s+/, "")
        .replace(/^d+.s+/, "")
        .trim();
      if (cleanBullet) bullets.push(cleanBullet);
    }
  }

  if (bullets.length === 0) {
    const sentences = text
      .split(/[.!?]s+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 5 && !s.startsWith("##") && !s.includes("http"));

    return sentences.slice(0, 4);
  }

  return bullets.slice(0, 5);
}

function generateVisualPrompt(title: string, content: string): string {
  const lowerTitle = title.toLowerCase();
  const lowerContent = content.toLowerCase();

  if (lowerTitle.includes("qubit") || lowerContent.includes("superposition") || lowerContent.includes("entanglement")) {
    return "Quantum Qubits Bloch Sphere & Wave Interference Patterns";
  }
  if (lowerTitle.includes("applications") || lowerContent.includes("cryptography") || lowerContent.includes("medicine")) {
    return "Global Connectivity Networks & Dynamic Molecular Simulation";
  }
  if (lowerTitle.includes("classical") || lowerContent.includes("binary") || lowerContent.includes("gate")) {
    return "Classical Boolean Logic Gates (AND, OR, NOT) 1 vs 0";
  }
  if (lowerTitle.includes("ai") || lowerContent.includes("neural") || lowerContent.includes("intelligence")) {
    return "Neural Network Architecture with Synaptic Feedforward Weights";
  }
  if (lowerTitle.includes("math") || lowerContent.includes("calculus") || lowerContent.includes("equation")) {
    return "Analytical Coordinate Grid with Exponential Function Slopes";
  }

  return `${title} Visual Schematics & Abstract Concepts`;
}