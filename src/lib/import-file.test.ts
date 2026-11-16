import { describe, expect, it } from "vitest";
import { fileToHtml, getExtension, isAllowedUpload } from "./import-file";

describe("import-file", () => {
  it("detects allowed extensions and rejects unsupported ones", () => {
    expect(getExtension("notes.MD")).toBe(".md");
    expect(isAllowedUpload("notes.md", "text/markdown")).toBe(true);
    expect(isAllowedUpload("brief.txt", "text/plain")).toBe(true);
    expect(isAllowedUpload("spec.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document")).toBe(
      true
    );
    expect(isAllowedUpload("photo.png", "image/png")).toBe(false);
  });

  it("converts plain text into editable HTML paragraphs", async () => {
    const html = await fileToHtml("ideas.txt", Buffer.from("Hello team\n\nShip the docs slice"));
    expect(html).toContain("<p>Hello team</p>");
    expect(html).toContain("<p>Ship the docs slice</p>");
  });

  it("converts lightweight markdown into headings and lists", async () => {
    const markdown = `# Launch notes\n\n- Bold plan\n1. Build\n2. Share`;
    const html = await fileToHtml("launch.md", Buffer.from(markdown));
    expect(html).toContain("<h1>Launch notes</h1>");
    expect(html).toContain("<ul>");
    expect(html).toContain("<ol>");
    expect(html).toContain("<li>Build</li>");
  });
});
