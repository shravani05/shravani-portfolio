import { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";


// Build-safe URL for anything in /public
const asset = (p: string) => import.meta.env.BASE_URL + p;



// ───────────────────────────────────────────────────────────
// Links / Profile
// ───────────────────────────────────────────────────────────
const PHOTO_URL = asset("pic.jpeg");
const LINKS = {
  email: "schavan@seas.upenn.edu",
  linkedin: "https://linkedin.com/in/shravanichavan05",
  github: "https://github.com/shravani05",
  resume: asset("Shravani_Chavan_Resume.pdf"),
  paper: "https://link.springer.com/chapter/10.1007/978-981-19-8094-7_35",
  demo: "https://youtu.be/pmGDxj7VQFk?si=7gK2XanwFnxS-Qfi",
};

// ───────────────────────────────────────────────────────────
// Animations / UI bits
// ───────────────────────────────────────────────────────────
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Tag = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium tracking-wide">
    {children}
  </span>
);

const Section = ({
  id,
  title,
  subtitle,
  children,
}: {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section id={id} className="scroll-mt-24 py-14 md:py-20">
    <h2 className="text-2xl md:text-3xl font-bold leading-tight">{title}</h2>
    {subtitle ? (
      <p className="mt-1 text-sm opacity-80 max-w-2xl">{subtitle}</p>
    ) : null}
    <div className="mt-6">{children}</div>
  </section>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="group rounded-2xl border p-5 md:p-6 shadow-sm hover:shadow-md transition-shadow">
    {children}
  </div>
);

// Always-open-in-new-tab external link
type ExtLinkProps = { href: string; className?: string; children: React.ReactNode };
const ExtLink = ({ href, className = "", children }: ExtLinkProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
    {children}
  </a>
);

// YouTube → thumbnail helpers
function getYouTubeId(url?: string): string | null {
  if (!url) return null;
  const m =
    url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/) ||
    url.match(/[?&]v=([\w-]{11})/);
  return m ? m[1] : null;
}
function ytThumb(url?: string): string | undefined {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : undefined;
}

// Small play badge overlay for video thumbs
const PlayBadge = () => (
  <span className="absolute inset-0 grid place-items-center">
    <span className="h-12 w-12 rounded-full bg-black/60 text-white grid place-items-center">
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M8 5v14l11-7z" />
      </svg>
    </span>
  </span>
);

// ───────────────────────────────────────────────────────────
// Component
// ───────────────────────────────────────────────────────────
export default function Portfolio() {
  const [aboutOpen, setAboutOpen] = useState(false);

  // --- ONE-BUTTON THEME TOGGLE ---
  type Pref = "light" | "dark" | null;
  const [pref, setPref] = useState<Pref>(() => {
    try {
      const saved = localStorage.getItem("theme-pref");
      if (saved === "light" || saved === "dark") return saved;
    } catch {}
    return null; // default to system
  });
  const [systemDark, setSystemDark] = useState<boolean>(() =>
    window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false
  );
  useEffect(() => {
    const mm = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!mm) return;
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mm.addEventListener("change", onChange);
    return () => mm.removeEventListener("change", onChange);
  }, []);
  const effectiveDark = pref ? pref === "dark" : systemDark;
  useEffect(() => {
    document.documentElement.classList.toggle("dark", effectiveDark);
  }, [effectiveDark]);
  useEffect(() => {
    try {
      if (pref) localStorage.setItem("theme-pref", pref);
      else localStorage.removeItem("theme-pref");
    } catch {}
  }, [pref]);
  const toggleTheme = () => setPref(effectiveDark ? "light" : "dark");

  // ——— Data
  const education = [
    {
      school: "University of Pennsylvania",
      degree: "MSE in Computer & Information Science",
      when: "Expected May 2026",
      gpa: "3.62/4",
      coursework: ["Distributed Systems", "Operating Systems", "Artificial Intelligence", "Applied Machine Learning", "Big Data"],
    },
    {
      school: "MKSSS’s Cummins College of Engineering for Women",
      degree: "B.Tech in Information Technology",
      when: "May 2022",
      gpa: "9.04/10",
      coursework: ["Data Structures and Algorithms", "Object Oriented Programming", "Computer Networks", "Database and Management Systems"],
    },
  ];

  const skills = useMemo(
    () => ({
      Languages: ["Python", "Java", "C++", "C", "JavaScript", "Kotlin", "Go", "R", "SQL", "HTML", "CSS"],
      Frameworks: ["React", "Node.js", "Express", "Redux", "Vue", "Angular", "Flask", "JUnit", "jQuery", "Kubernetes", "TensorFlow", "Keras", "OpenCV"],
      Databases: ["MongoDB", "MySQL", "SQLite", "PostgreSQL"],
      Other: ["Applied AI/ML", "LLMs", "Apache Pulsar", "AWS", "GCP", "Git", "GitHub", "CI/CD", "Docker", "Postman", "Agile Development"],
    }),
    []
  );

  const projects = [
    {
      title: "AI Agent Test Framework (Oracle Fusion ERP)",
      period: "May 2025 – Aug 2025",
      summary:
        "Unified platform to evaluate non-deterministic ERP AI agents with LLM-as-a-Judge; backend built with Flask + MySQL, integrated with AI Studio, caching & multithreading.",
      highlights: [
        "Accelerated agent development by ~30%; tripled test coverage",
        "Automated test case generation, run comparison, and summarization using LLM",
        "Centralized results, reusable cases across agents/use-cases",
      ],
      tags: ["Flask", "Python", "MySQL", "AI Studio", "LLM-as-a-Judge", "Caching", "Parallelism", "React", "Node"],
    },
    {
      title: "Guidance System for Claims & Needs of Labor (SIH ‘22 Winner)",
      period: "Aug 2022",
      summary:
        "A web application that streamlines Employee Provident Fund claim filing with a multilingual assistant and OCR-based ID extraction; built with MERN (MongoDB + Express + React + Node) and OCR (Python).",
      highlights: [
        "Reduced claim filing time by ~60% via guided, simplified workflow",
        "Multilingual chatbot to assist workers through each step",
        "OCR auto-extracts identifiers from documents; fewer manual errors",
      ],
      tags: ["MongoDB", "Express", "React", "Redux", "Node", "OCR", "Python"],
    },
    {
      title: "Smart Soft Landing of Aerial Vehicles (Research)",
      period: "Jul 2021 – Apr 2022",
      summary:
        "Convolutional Neural Network (CNN) estimates drone velocity from onboard frames for smooth landings; trained in AirSim across diverse terrains using Deep Learning (CV/CNN).",
      highlights: [
        "Achieved ~97% accuracy on balanced evaluation data",
        "Robust to varied surfaces (moon/exoplanet/mountain) and lighting",
        "Compared deep learning and optical-flow approaches for velocity estimation; findings published in a Springer book",
      ],
      tags: ["Python", "TensorFlow", "Keras", "CNN", "Deep Learning", "Computer Vision", "AirSim"],
      cta: { label: "Read Paper", href: LINKS.paper },
    },
    {
      title: "New Normal Scheduler (Microsoft Engage 2021)",
      period: "Nov 2021",
      summary:
        "A web application that streamlines hybrid-learning logistics: students submit weekly in-person/remote preferences and the system auto-generates capacity-aware class rosters (MERN).",
      highlights: ["Cut TA/faculty scheduling from hours to minutes", "Faculty dashboard for review/overrides", "Role-based access (Student/Faculty) with secure login"],
      tags: ["React", "Redux", "Node", "Express", "MongoDB"],
      cta: { label: "Watch Demo", href: LINKS.demo },
    },
  ];

  const experience = [
    {
      company: "Oracle",
      title: "Software Engineer Intern",
      location: "Redwood City, CA",
      period: "May 2025 – Aug 2025",
      bullets: [
        "Designed & deployed AI agent testing platform for Fusion ERP Payment Agents.",
        "Automated evaluation via LLM-as-a-Judge across metrics like answer correctness/ query alignment/clarity.",
        "Introduced advanced LLM-driven features such as automated test case creation, test run comparison, and result summarization.",
        "Eliminated redundant calls & races with in-memory caching, multithreading, and locking.",
      ],
    },
    {
      company: "Flipkart",
      title: "Software Engineer 1",
      location: "Bangalore, India",
      period: "Jul 2022 – Jul 2024",
      bullets: [
        "Scaled Apache Pulsar on Kubernetes for high-fan-out workloads; hardened configs and tightened SLAs.",
        "Benchmarked and rolled out Pulsar 3.0.x across five isolation groups; validated throughput/latency and SLA compliance.",
        "Built capacity planning feature in Java that cut required producer quota by 62.5% and reduced hardware cost by 15%.",
        "Created Grafana dashboards and client-side metrics, reducing support inquiries by 30%.",
      ],
    },
    {
      company: "Nanyang Technological University (NTU)",
      title: "Research Intern",
      location: "Singapore",
      period: "May 2021 – Jul 2021",
      bullets: [
        "Concept-level sentiment analysis on climate change tweets using SenticNet.",
        "Revealed global sentiment trends on topics such as global warming, advancing AI-for-social-good research.",
        "Trained and compared RNN (Recurrent Neural Network), LSTM (Long Short-Term Memory), and BERT (Bidirectional Encoder Representations from Transformers) models.",
        "Achieved 89% accuracy and actionable insights.",
      ],
    },
  ];

  // ─────────── Achievements data ───────────
  const ACHIEVEMENTS = [
    {
      title: "Winner · Smart India Hackathon",
      when: "2022",
      desc:
        "Emerged victorious from 160,000+ participants. Built a top-tier solution for the Ministry of Labour & Employment’s “Guidance system for claims and needs of labour” problem statement",
      thumb: asset("achievements/sih.jpeg"),
    },
    {
      title: "Top 500 Mentee · Microsoft Engage",
      when: "2021",
      desc: "Selected from 25,000+ students; built New Normal Scheduler to mitigate hybrid-learning challenges post-COVID.",
      video: LINKS.demo,
      href: LINKS.demo,
    },
    {
      title: "Flipkart Girls Wanna Code Scholar",
      when: "2021",
      desc: "Recognized among the top 200 scholars out of 5,000+ participants.",
      thumb: asset("achievements/fk.jpeg"),
    },
    {
      title: "2nd Runner-Up · IBM Software Hackathon",
      when: "2020",
      desc: "Placed among 80+ teams; delivered an ML solution to help disaster victims navigate to safety.",

    },
    {
      title: "Economic Times Campus Stars 4.0",
      when: "2021",
      desc: "Among 87 students selected from 40,368 applicants across 2,000+ colleges after tests, GDs, and interviews.",
      thumb: asset("achievements/ET.jpg"),
    },
    {
      title: "1st Place · Code-It (ACM-W)",
      when: "2019",
      desc: "Ranked #1 among 250 competitors in ACM-W chapter’s coding contest.",
    },
  ];

  const nav = [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "experience", label: "Experience" },
    { id: "achievements", label: "Achievements" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="min-h-screen">
      <div className="bg-white text-gray-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors">
        {/* ───────── Header / Menu ───────── */}
        <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-neutral-950/60 border-b border-black/5 dark:border-white/10">
          <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
            <a href="#home" className="font-semibold tracking-tight text-lg">
              Shravani Chavan
            </a>

            <nav className="hidden md:flex items-center gap-6">
              {nav.map((n) => (
                <a key={n.id} href={`#${n.id}`} className="text-sm opacity-80 hover:opacity-100">
                  {n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <ExtLink href={LINKS.resume} className="rounded-xl border px-3 py-1.5 text-sm hover:-translate-y-0.5 transition">
                  Resume
                </ExtLink>
                <ExtLink href={LINKS.linkedin} className="rounded-xl border px-3 py-1.5 text-sm hover:-translate-y-0.5 transition">
                  LinkedIn
                </ExtLink>
                <ExtLink href={LINKS.github} className="rounded-xl border px-3 py-1.5 text-sm hover:-translate-y-0.5 transition">
                  GitHub
                </ExtLink>
              </div>

              {/* Divider */}
              <span className="mx-3 md:mx-5 h-5 w-px bg-black/10 dark:bg-white/15" />

              {/* Theme toggle */}
              <button
                aria-label={`Switch to ${effectiveDark ? "Light" : "Dark"} mode`}
                onClick={toggleTheme}
                className={
                  "group inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold transition " +
                  (effectiveDark
                    ? "bg-amber-300 text-gray-900 shadow ring-1 ring-amber-300/40 hover:shadow-md hover:-translate-y-0.5"
                    : "bg-gray-900 text-white shadow ring-1 ring-white/10 hover:shadow-md hover:-translate-y-0.5")
                }
              >
                {effectiveDark ? (
                  // Sun icon (offering Light)
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                    <path
                      fill="currentColor"
                      d="M12 4.5a1 1 0 0 1 1 1V7a1 1 0 1 1-2 0V5.5a1 1 0 0 1 1-1Zm0 11a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7ZM4.22 6.34a1 1 0 0 1 1.41 0l1.06 1.06a1 1 0 0 1-1.41 1.41L4.22 7.75a1 1 0 0 1 0-1.41ZM4.5 13a1 1 0 1 1 0-2H6a1 1 0 1 1 0 2H4.5Zm11.31-5.6 1.06-1.06a1 1 0 1 1 1.41 1.41l-1.06 1.06a1 1 0 0 1-1.41-1.41ZM18 13a1 1 0 1 1 0-2h1.5a1 1 0 1 1 0 2H18Zm-6 6.5a1 1 0 0 1-1-1V17a1 1 0 1 1 2 0v1.5a1 1 0 0 1-1 1Zm6.78-1.84a1 1 0 0 1-1.41 0L16.31 16.6a1 1 0 0 1 1.41-1.41l1.06 1.06a1 1 0 0 1 0 1.41Zm-11.56 0a1 1 0 0 1 0-1.41l1.06-1.06a1 1 0 1 1 1.41 1.41L7.63 17.66a1 1 0 0 1-1.41 0Z"
                    />
                  </svg>
                ) : (
                  // Moon icon (offering Dark)
                  <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4">
                    <path fill="currentColor" d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 1 0 9.79 9.79Z" />
                  </svg>
                )}
                <span>{effectiveDark ? "Light" : "Dark"}</span>
              </button>
            </div>
          </div>
        </header>

        {/* ───────── Hero with picture + email text ───────── */}
        <section id="home" className="max-w-6xl mx-auto px-4 pt-10 md:pt-16 pb-6">
          <div className="grid md:grid-cols-[1.2fr,0.8fr] gap-8 items-center">
            <motion.div {...fadeUp}>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">Shravani Chavan</h1>
              <p className="mt-4 text-lg md:text-xl opacity-90">MS CS @ UPenn (’26) • Ex-SWE Intern @ Oracle • Ex-SWE @ Flipkart</p>
              <div className="mt-4 text-sm opacity-80">
                Philadelphia, PA ·{" "}
                <a className="underline" href={`mailto:${LINKS.email}`} target="_blank" rel="noopener noreferrer">
                  {LINKS.email}
                </a>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <ExtLink href={LINKS.resume} className="rounded-2xl border px-4 py-2 font-medium">
                  Resume
                </ExtLink>
                <ExtLink href={LINKS.linkedin} className="rounded-2xl border px-4 py-2 font-medium">
                  LinkedIn
                </ExtLink>
                <ExtLink href={LINKS.github} className="rounded-2xl border px-4 py-2 font-medium">
                  GitHub
                </ExtLink>
              </div>
            </motion.div>

            <motion.div className="flex justify-center md:justify-end" {...fadeUp} transition={{ delay: 0.1 }}>
              <figure className="w-44 h-60 md:w-56 md:h-72 lg:w-64 lg:h-80 overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/10 dark:ring-white/10">
                <img src={PHOTO_URL} alt="Headshot" className="w-full h-full object-cover object-center" />
              </figure>
            </motion.div>
          </div>
        </section>

        {/* ───────── Main sections (in your order) ───────── */}
        <main className="max-w-6xl mx-auto px-4">
          <Section id="about" title="About">
            {/* Short, skimmable blurb */}
            <p className="max-w-3xl leading-relaxed">
              I am a Master’s student studying Computer & Information Science at the <b>University of Pennsylvania</b>, graduating in{" "}
              <b>May 2026</b>, with 2+ years of professional experience as a Software Engineer at <b>Flipkart</b> and recent internship
              experience at <b>Oracle</b>. I have built <b>AI-driven platforms</b>, <b>scalable distributed systems</b>, and <b>full-stack
              applications</b>, and I’m seeking full-time <b>Software Engineering roles starting Summer/Fall 2026 </b>.
            </p>

            {/* Read more (optional) */}
            <button onClick={() => setAboutOpen((v) => !v)} className="mt-3 text-sm underline opacity-80 hover:opacity-100">
              {aboutOpen ? "Show less" : "Read more"}
            </button>

            {aboutOpen && (
              <div className="mt-4 max-w-3xl space-y-4 text-sm md:text-base opacity-90">
                <p>
                  At <b>Oracle (Summer 2025)</b>, I designed and deployed an <b>AI Agent Testing Platform</b> for <b>Fusion ERP Payment
                  Agents</b>, integrating <b>LLM-as-a-Judge</b> with <b>Flask + MySQL</b>. I introduced features like automated test case
                  generation and run comparison using <b>LLM</b>, optimized performance with <b>caching and multithreading</b>, and
                  accelerated agent development by <b>30%</b> while <b>tripling test coverage</b>.
                </p>

                <p>
                  Previously as a Software Engineer at <b>Flipkart</b>, I contributed to the <b>Platforms team</b>, implementing <b>Apache
                  Pulsar</b> for distributed messaging. My work focused on <b>optimizing cluster performance</b>, upgrading versions, and
                  improving resource utilization, which resulted in <b>reduced support queries</b> and <b>enhanced system efficiency</b>.
                </p>

                <p>
                  I also have <b>research internship</b> experience from <b>Nanyang Technological University</b>, where I conducted{" "}
                  <b>sentiment analysis</b> on <b>global warming tweets</b> to understand public opinion trends. In addition, I’ve developed{" "}
                  <b>full-stack applications</b> using the <b>MERN (MongoDB, ExpressJS, ReactJS, NodeJS)</b> stack and worked on{" "}
                  <b>machine learning</b> and <b>computer vision</b> projects, with a <b>published paper in Springer</b>.
                </p>

                <p>
                  I am passionate about <b>AI-driven platforms</b>, <b>distributed systems</b>, and <b>full-stack product development</b> -
                  and am seeking <b>Software Engineer full-time opportunities starting in Summer/Fall 2026 </b>.
                </p>
              </div>
            )}
          </Section>

          <Section id="education" title="Education">
            <ol className="relative border-s pl-6">
              {education.map((ed) => (
                <li key={ed.school} className="mb-10">
                  {/* timeline dot */}
                  <span className="absolute -start-1.5 mt-1.5 h-3 w-3 rounded-full border bg-white dark:bg-neutral-950" />
                  <div className="rounded-2xl p-0">
                    <h3 className="text-lg md:text-xl font-semibold leading-tight">{ed.school}</h3>
                    <p className="text-sm opacity-80 mt-0.5">
                      {ed.degree} · GPA {ed.gpa} · {ed.when}
                    </p>

                    <div className="mt-3">
                      <h4 className="text-sm font-medium mb-2">Relevant Coursework</h4>
                      <div className="flex flex-wrap gap-2">
                        {ed.coursework.map((c) => (
                          <Tag key={c}>{c}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="skills" title="Skills">
            <div className="grid md:grid-cols-2 gap-6">
              {Object.entries(skills).map(([k, vals]) => (
                <Card key={k}>
                  <h4 className="font-semibold">{k}</h4>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {vals.map((v) => (
                      <Tag key={v}>{v}</Tag>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Section>

          <Section id="projects" title="Projects" subtitle="Impact-driven builds spanning full-stack systems, LLM evaluation, and applied ML.">
            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              {projects.map((p, i) => (
                <motion.div key={i} {...fadeUp} transition={{ delay: i * 0.05 }}>
                  <Card>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg md:text-xl font-semibold">{p.title}</h3>
                      <span className="text-xs opacity-60 whitespace-nowrap">{p.period}</span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{p.summary}</p>
                    {"highlights" in p && (p as any).highlights ? (
                      <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
                        {(p as any).highlights.map((h: string, j: number) => (
                          <li key={j}>{h}</li>
                        ))}
                      </ul>
                    ) : null}
                    {"tags" in p && (p as any).tags?.length ? (
                      <div className="mt-4">
                        <div className="mt-2 flex flex-wrap gap-2">
                          {(p as any).tags.map((t: string, j: number) => (
                            <Tag key={j}>{t}</Tag>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    {"cta" in p && (p as any).cta ? (
                      <div className="mt-4">
                        <ExtLink
                          href={(p as any).cta.href}
                          className="rounded-full border px-4 py-2 text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 inline-flex items-center gap-2 transition"
                        >
                          {(p as any).cta.label}
                        </ExtLink>
                      </div>
                    ) : null}
                  </Card>
                </motion.div>
              ))}
            </div>
          </Section>

          {/* Timeline Experience */}
          <Section id="experience" title="Experience">
            <ol className="relative border-s pl-6">
              {experience.map((e, idx) => (
                <li key={idx} className="mb-8">
                  <span className="absolute -start-1.5 mt-1 h-3 w-3 rounded-full border bg-white dark:bg-neutral-950" />
                  <h3 className="font-semibold">
                    {e.title} · <span className="opacity-80">{e.company}</span>
                  </h3>
                  <p className="text-sm opacity-70">
                    {e.period} · {e.location}
                  </p>
                  <ul className="mt-2 list-disc pl-5 space-y-1 text-sm">
                    {e.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </Section>

          <Section id="achievements" title="Achievements" subtitle="Awards, fellowships, and competitions.">
  <div className="space-y-12 md:space-y-16">
    {ACHIEVEMENTS.map((a, i) => {
      const thumb = a.thumb || ytThumb(a.video);
      const linkHref = a.href || a.video;
      const hasMedia = Boolean(thumb);

      const Media = hasMedia ? (
        <div className="relative w-full aspect-[16/9] overflow-hidden rounded-xl ring-1 ring-black/10 dark:ring-white/10">
          <img
            src={thumb!}
            alt={a.title}
            className="absolute inset-0 h-full w-full object-cover"
            loading="lazy"
          />
          {a.video ? <PlayBadge /> : null}
        </div>
      ) : null;

      return (
        <motion.div key={a.title} {...fadeUp} transition={{ delay: i * 0.03 }}>
          <div className="grid items-center gap-6 md:gap-8 md:grid-cols-12">
            {/* Text always on the left; expands if no media */}
            <div className={`${hasMedia ? "md:col-span-7 md:pr-12" : "md:col-span-12"}`}>
              <h3 className="text-lg md:text-xl font-semibold leading-tight">{a.title}</h3>
              <p className="text-xs opacity-70 mt-0.5">{a.when}</p>
              <p className="mt-3 text-sm md:text-base opacity-90">{a.desc}</p>
              {a.video ? (
                <ExtLink href={linkHref!} className="mt-3 inline-block underline text-sm">
                  Watch video
                </ExtLink>
              ) : a.href ? (
                <ExtLink href={a.href} className="mt-3 inline-block underline text-sm">
                  Learn more
                </ExtLink>
              ) : null}
            </div>

            {/* Media always on the right; hidden if none */}
            {hasMedia && (
              <div className="md:col-span-5 md:order-last">
                {linkHref ? (
                  <ExtLink href={linkHref} className="block">
                    {Media}
                  </ExtLink>
                ) : (
                  Media
                )}
              </div>
            )}
          </div>
        </motion.div>
      );
    })}
  </div>
</Section>



          <Section id="contact" title="Contact">
            <div className="p-6 rounded-2xl border">
              <p className="opacity-90">
                Open to full-time SWE roles starting Summer/Fall 2026. The fastest way to reach me is{" "}
                <a className="underline" href={`mailto:${LINKS.email}`} target="_blank" rel="noopener noreferrer">
                  {LINKS.email}
                </a>
                .
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ExtLink href={LINKS.linkedin} className="px-4 py-2 rounded-2xl border">
                  LinkedIn
                </ExtLink>
                <ExtLink href={LINKS.github} className="px-4 py-2 rounded-2xl border">
                  GitHub
                </ExtLink>
                <ExtLink href={LINKS.resume} className="px-4 py-2 rounded-2xl border">
                  Resume
                </ExtLink>
              </div>
            </div>
          </Section>
        </main>

        <footer className="max-w-6xl mx-auto px-4 py-10 opacity-70 text-sm">
          © {new Date().getFullYear()} Shravani Chavan · Built with React & Tailwind.
        </footer>
      </div>
    </div>
  );
}
