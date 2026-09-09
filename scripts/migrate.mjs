// scripts/migrate.mjs
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

// 1. Read .env.local manually
const envPath = path.join(rootDir, ".env.local");
let serviceAccountRaw = process.env.FIREBASE_ADMIN_SERVICE_ACCOUNT;
let storageBucket = process.env.FIREBASE_STORAGE_BUCKET;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("FIREBASE_ADMIN_SERVICE_ACCOUNT=")) {
      serviceAccountRaw = trimmed.slice("FIREBASE_ADMIN_SERVICE_ACCOUNT=".length);
    }
    if (trimmed.startsWith("FIREBASE_STORAGE_BUCKET=")) {
      storageBucket = trimmed.slice("FIREBASE_STORAGE_BUCKET=".length);
    }
  }
}

if (!serviceAccountRaw) {
  console.error("❌ Missing FIREBASE_ADMIN_SERVICE_ACCOUNT in .env.local or environment variables.");
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountRaw);

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: serviceAccount.project_id,
      clientEmail: serviceAccount.client_email,
      privateKey: serviceAccount.private_key.replace(/\\n/g, "\n"),
    }),
    storageBucket: storageBucket || `${serviceAccount.project_id}.firebasestorage.app`,
  });
}

const db = getFirestore();

async function migrate() {
  console.log("🚀 Starting data migration to Firestore...\n");

  // 1. Migrate Site Profile
  console.log("👉 1/6 Migrating Site Profile...");
  const siteProfile = {
    heroName: "Simeon Akinrinola",
    heroTagline: "Building better software, faster.",
    heroSubtitle: "Frontend, Backend, and AI Engineering.",
    footerQuote: "This site is haunted by a bee. It's not a bug, it's the most important feature.",
    githubUrl: "https://github.com/AkinDiamonds",
    linkedinUrl: "https://linkedin.com/in/simeon-akinrinola",
    whatsappUrl: "https://wa.me/+2349065979423",
    email: "simeonakinrinola7@gmail.com",
    calUrl: "https://cal.com/TODO",
    phone: "+2349065979423",
    resumeUrl: "/resume.pdf",
    updatedAt: new Date().toISOString(),
  };
  await db.collection("site").doc("profile").set(siteProfile, { merge: true });
  console.log("   ✅ Profile saved to site/profile\n");

  // 2. Migrate Technologies
  console.log("👉 2/6 Migrating Technologies...");
  const techFile = path.join(rootDir, "src/content/technologies.json");
  if (fs.existsSync(techFile)) {
    const techData = JSON.parse(fs.readFileSync(techFile, "utf8"));
    const techMap = {
      Frontend: { id: "frontend", order: 1 },
      "Backend & DevOps": { id: "backend-devops", order: 2 },
      "AI Engineering": { id: "ai-engineering", order: 3 },
    };

    const batch = db.batch();
    for (const group of techData) {
      const info = techMap[group.category] || { id: group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-"), order: 99 };
      batch.set(db.collection("technologies").doc(info.id), {
        category: group.category,
        items: group.items || [],
        order: info.order,
        updatedAt: new Date().toISOString(),
      });
    }
    await batch.commit();
    console.log("   ✅ 3 Technology category documents saved to technologies/*\n");
  }

  // 3. Migrate Work Experience
  console.log("👉 3/6 Migrating Work Experience...");
  const expFile = path.join(rootDir, "src/content/experience.json");
  if (fs.existsSync(expFile)) {
    const expData = JSON.parse(fs.readFileSync(expFile, "utf8"));
    for (let i = 0; i < expData.length; i++) {
      const item = expData[i];
      const docId = `exp-${i + 1}-${item.company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      await db.collection("experience").doc(docId).set({
        role: item.role,
        company: item.company,
        startDate: item.startDate,
        endDate: item.endDate || "",
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`   ✅ ${expData.length} experience records saved to experience/*\n`);
  }

  // 4. Migrate Testimonials
  console.log("👉 4/6 Migrating Testimonials...");
  const testFile = path.join(rootDir, "src/content/testimonials.json");
  if (fs.existsSync(testFile)) {
    const testData = JSON.parse(fs.readFileSync(testFile, "utf8"));
    for (let i = 0; i < testData.length; i++) {
      const item = testData[i];
      const docId = `test-${i + 1}-${item.name.replace("TODO: ", "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
      await db.collection("testimonials").doc(docId).set({
        quote: item.quote,
        name: item.name,
        role: item.role,
        company: item.company,
        avatarUrl: item.avatarUrl || "",
        visibility: true,
        order: i + 1,
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`   ✅ ${testData.length} testimonials saved to testimonials/*\n`);
  }

  // 5. Migrate Projects
  console.log("👉 5/6 Migrating Projects...");
  const projectsDir = path.join(rootDir, "src/content/projects");
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    let order = 1;
    for (const file of files) {
      const content = fs.readFileSync(path.join(projectsDir, file), "utf8");
      const { data } = matter(content);
      const slug = data.slug || file.replace(/\.mdx?$/, "");
      await db.collection("projects").doc(slug).set({
        slug,
        title: data.title || slug,
        summary: data.summary || data.description || "",
        description: data.description || data.summary || "",
        tags: data.tags || [],
        type: data.type || "Frontend & AI",
        demoUrl: data.demoUrl || data.demoVideo || data.demoImage || "",
        demoType: data.demoType || (data.demoVideo ? "video" : "image"),
        award: data.award || null,
        timeTaken: data.timeTaken || "",
        metrics: data.metrics || [],
        githubUrl: data.githubUrl || "",
        liveUrl: data.liveUrl || "",
        docsUrl: data.docsUrl || "",
        workplace: Boolean(data.workplace),
        role: data.role || "",
        duration: data.duration || "",
        details: data.details || null,
        visibility: true,
        order: order++,
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`   ✅ ${files.length} project documents saved to projects/*\n`);
  }

  // 6. Migrate Blog Posts
  console.log("👉 6/6 Migrating Blog Posts...");
  const blogDir = path.join(rootDir, "src/content/blog");
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));
    for (const file of files) {
      const raw = fs.readFileSync(path.join(blogDir, file), "utf8");
      const { data, content } = matter(raw);
      const slug = data.slug || file.replace(/\.mdx?$/, "");
      const formattedBody = content
        .trim()
        .split("\n\n")
        .map((para) => `<p>${para.replace(/\n/g, " ")}</p>`)
        .join("");

      await db.collection("posts").doc(slug).set({
        slug,
        title: data.title || slug,
        category: data.category || "Engineering",
        excerpt: data.excerpt || "",
        publishedAt: data.date || data.publishedAt || new Date().toISOString().split("T")[0],
        body: formattedBody || "<p>Article content.</p>",
        visibility: true,
        updatedAt: new Date().toISOString(),
      });
    }
    console.log(`   ✅ ${files.length} blog posts saved to posts/*\n`);
  }

  console.log("🎉 Migration complete! All Firestore collections are populated.\n");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Migration error:", err);
    process.exit(1);
  });
