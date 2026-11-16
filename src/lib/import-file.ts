import mammoth from "mammoth";

const ALLOWED_EXTENSIONS = [".txt", ".md", ".docx"] as const;

export type AllowedExtension = (typeof ALLOWED_EXTENSIONS)[number];

export function getExtension(fileName: string): string {
  const idx = fileName.lastIndexOf(".");
  return idx >= 0 ? fileName.slice(idx).toLowerCase() : "";
}

export function isAllowedUpload(fileName: string, mimeType: string) {
  const ext = getExtension(fileName);
  if (!(ALLOWED_EXTENSIONS as readonly string[]).includes(ext)) {
    return false;
  }

  if (ext === ".txt" || ext === ".md") {
    return (
      mimeType.startsWith("text/") ||
      mimeType === "application/octet-stream" ||
      mimeType === ""
    );
  }

  return (
    mimeType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/octet-stream" ||
    mimeType === ""
  );
}

function escapeHtml(text: string) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function plainTextToHtml(text: string) {
  const paragraphs = text
    .replaceAll("\r\n", "\n")
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) {
    return "<p></p>";
  }

  return paragraphs
    .map((block) => `<p>${escapeHtml(block).replaceAll("\n", "<br />")}</p>`)
    .join("");
}

function markdownLiteToHtml(text: string) {
  const lines = text.replaceAll("\r\n", "\n").split("\n");
  const html: string[] = [];
  let inUl = false;
  let inOl = false;

  const closeLists = () => {
    if (inUl) {
      html.push("</ul>");
      inUl = false;
    }
    if (inOl) {
      html.push("</ol>");
      inOl = false;
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    if (/^#{1,3}\s+/.test(line)) {
      closeLists();
      const level = line.match(/^#+/)?.[0].length ?? 1;
      const content = escapeHtml(line.replace(/^#{1,3}\s+/, ""));
      html.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      if (!inUl) {
        closeLists();
        html.push("<ul>");
        inUl = true;
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      if (!inOl) {
        closeLists();
        html.push("<ol>");
        inOl = true;
      }
      html.push(`<li>${inlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`);
      continue;
    }

    closeLists();
    if (!line.trim()) continue;
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  }

  closeLists();
  return html.join("") || "<p></p>";
}

function inlineMarkdown(text: string) {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(/__(.+?)__/g, "<u>$1</u>");
  return out;
}

export async function fileToHtml(fileName: string, buffer: Buffer) {
  const ext = getExtension(fileName);

  if (ext === ".docx") {
    const result = await mammoth.convertToHtml({ buffer });
    return result.value || "<p></p>";
  }

  const text = buffer.toString("utf8");
  if (ext === ".md") {
    return markdownLiteToHtml(text);
  }

  return plainTextToHtml(text);
}

export { UPLOAD_HELP } from "./constants";
