import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.attachment.deleteMany();
  await prisma.documentVersion.deleteMany();
  await prisma.documentShare.deleteMany();
  await prisma.document.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      email: "alice@ajaia.dev",
      name: "Alice Chen",
      passwordHash,
    },
  });

  const bob = await prisma.user.create({
    data: {
      email: "bob@ajaia.dev",
      name: "Bob Martinez",
      passwordHash,
    },
  });

  const cara = await prisma.user.create({
    data: {
      email: "cara@ajaia.dev",
      name: "Cara Nguyen",
      passwordHash,
    },
  });

  const welcome = await prisma.document.create({
    data: {
      title: "Welcome to Ajaia Docs",
      content: `
        <h1>Welcome to Ajaia Docs</h1>
        <p>This is a lightweight collaborative editor built for the Ajaia AI-Native Full Stack assignment.</p>
        <h2>What you can try</h2>
        <ul>
          <li><strong>Create</strong> and rename documents</li>
          <li><em>Edit</em> with bold, italic, underline, headings, and lists</li>
          <li>Import <u>.txt</u>, <u>.md</u>, or <u>.docx</u> files</li>
          <li>Share with viewer or editor roles</li>
          <li>Restore from version history</li>
          <li>Export to Markdown</li>
        </ul>
        <ol>
          <li>Sign in as Alice</li>
          <li>Open this document</li>
          <li>Share it with Bob as editor</li>
        </ol>
      `,
      ownerId: alice.id,
    },
  });

  await prisma.documentShare.create({
    data: {
      documentId: welcome.id,
      userId: bob.id,
      role: "editor",
    },
  });

  await prisma.documentShare.create({
    data: {
      documentId: welcome.id,
      userId: cara.id,
      role: "viewer",
    },
  });

  await prisma.documentVersion.create({
    data: {
      documentId: welcome.id,
      title: welcome.title,
      content: welcome.content,
      createdById: alice.id,
    },
  });

  await prisma.document.create({
    data: {
      title: "Bob's Private Notes",
      content: `<h1>Private notes</h1><p>Only Bob owns this document initially.</p>`,
      ownerId: bob.id,
    },
  });

  console.log("Seeded users:");
  console.log("  alice@ajaia.dev / password123 (owner of Welcome doc)");
  console.log("  bob@ajaia.dev   / password123 (editor on Welcome)");
  console.log("  cara@ajaia.dev  / password123 (viewer on Welcome)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
