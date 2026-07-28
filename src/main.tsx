import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { ArrowUpRight, Code2, Cpu, Github, Layers3, Mail, Send, Sparkles, Zap } from "lucide-react";
import { WebGLStage } from "./webgl/WebGLStage";
import "./styles.css";

const projects = [
  {
    title: "InstallDV",
    type: "Автосервис",
    text: "Сайт-визитка для автосервиса в Хабаровске: услуги, контакты, быстрый звонок и понятная подача сервиса.",
    tech: "React / TypeScript / Vite",
    cover: "installdv-cover.png",
    siteUrl: "https://installdv.ru",
    repoUrl: "https://github.com/Sodex00/InstallDV",
  },
  {
    title: "DentaFlow",
    type: "Демо стоматологии",
    text: "Демо-сайт стоматологии с мягкой визуальной подачей, блоками услуг, подхода и быстрым переходом к записи.",
    tech: "React / TypeScript / Node.js",
    cover: "dentaflow-cover.png",
    siteUrl: "https://sodex00.github.io/dentaflow/",
    repoUrl: "https://github.com/Sodex00/dentaflow",
  },
  {
    title: "ProfitFlow",
    type: "Личный трейдинг-трекер",
    text: "Личный проект для учета сделок, контроля P&L, аналитики и наблюдения за крипторынком в одном темном интерфейсе.",
    tech: "React / TypeScript / Binance API",
    cover: "profitflow-cover.png",
    siteUrl: "https://sodex00.github.io/ProfitFlow/",
    repoUrl: "https://github.com/Sodex00/ProfitFlow",
  },
  {
    title: "Ops Core",
    type: "DevOps tooling",
    text: "Контейнеризация, окружения, базы данных и надежный запуск продукта без хаоса.",
    tech: "Docker / MySQL / Linux",
  },
];

const marqueeStack = [
  "Java",
  "Python",
  "Docker",
  "MySQL",
  "PostgreSQL",
  "React",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "REST API",
  "Git",
  "Linux",
];
const logoUrl = `${import.meta.env.BASE_URL}logo.png`;
const assetUrl = (fileName: string) => `${import.meta.env.BASE_URL}${fileName}`;

function App() {
  const worksSectionRef = useRef<HTMLElement | null>(null);
  const projectRailRef = useRef<HTMLDivElement | null>(null);
  const [worksHeight, setWorksHeight] = useState<number>();
  const [activeProject, setActiveProject] = useState(1);

  useEffect(() => {
    const section = worksSectionRef.current;
    const rail = projectRailRef.current;
    if (!section || !rail) return;

    const updateMetrics = () => {
      if (window.innerWidth <= 760) {
        setWorksHeight(undefined);
        section.style.setProperty("--project-shift", "0px");
        rail.style.setProperty("--project-progress", "0");
        return;
      }

      const maxShift = Math.max(0, rail.scrollWidth - window.innerWidth + window.innerWidth * 0.06);
      const releaseOffset = Math.min(260, window.innerHeight * 0.22);
      setWorksHeight(window.innerHeight + Math.max(0, maxShift - releaseOffset));
      section.style.setProperty("--project-shift", `${maxShift}px`);
    };

    const updateScroll = () => {
      if (window.innerWidth <= 760) return;

      const maxShift = Number.parseFloat(section.style.getPropertyValue("--project-shift")) || 0;
      const start = section.offsetTop;
      const usableShift = Math.max(1, section.offsetHeight - window.innerHeight);
      const progress = maxShift === 0 ? 0 : Math.min(Math.max((window.scrollY - start) / usableShift, 0), 1);
      rail.style.setProperty("--project-progress", `${progress}`);
      setActiveProject(Math.min(projects.length, Math.max(1, Math.round(progress * (projects.length - 1)) + 1)));
    };

    const updateMobileRail = () => {
      if (window.innerWidth > 760) return;
      const maxScroll = Math.max(1, rail.scrollWidth - rail.clientWidth);
      const progress = Math.min(Math.max(rail.scrollLeft / maxScroll, 0), 1);
      setActiveProject(Math.min(projects.length, Math.max(1, Math.round(progress * (projects.length - 1)) + 1)));
    };

    updateMetrics();
    updateScroll();
    window.addEventListener("resize", updateMetrics);
    window.addEventListener("scroll", updateScroll, { passive: true });
    rail.addEventListener("scroll", updateMobileRail, { passive: true });

    return () => {
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("scroll", updateScroll);
      rail.removeEventListener("scroll", updateMobileRail);
    };
  }, []);

  return (
    <main>
      <WebGLStage />
      <header className="topbar">
        <a className="brand" href="#hero" aria-label="SodeX Studio">
          <span className="brand-mark">
            <img src={logoUrl} alt="" />
          </span>
          <span>SodeX Studio</span>
        </a>
        <nav>
          <a href="#works">Работы</a>
          <a href="#stack">Стек</a>
          <a href="#contact">Контакт</a>
        </nav>
      </header>

      <section className="hero" id="hero">
        <div className="hero-copy">
          <p className="eyebrow"><Sparkles size={16} /> Creative frontend studio</p>
          <h1>SodeX Studio</h1>
          <p className="lead">
            Я fullstack-разработчик: проектирую frontend, пишу backend, настраиваю базы,
            API и окружение, делаю Telegram/Discord-ботов, Telegram Mini Apps и
            мобильные приложения под iOS и Android.
          </p>
          <div className="hero-actions">
            <a className="primary" href="#works">
              Смотреть проекты <ArrowUpRight size={18} />
            </a>
            <a className="ghost" href="mailto:zenavuken67570@gmail.com">
              <Mail size={18} /> Написать
            </a>
          </div>
        </div>
        <div className="signal-panel" aria-label="Live studio metrics">
          <div>
            <span>FPS feel</span>
            <strong>Silky</strong>
          </div>
          <div>
            <span>Theme</span>
            <strong>Crimson dark</strong>
          </div>
          <div>
            <span>Focus</span>
            <strong>Interfaces</strong>
          </div>
        </div>
      </section>

      <section
        className="section works-section"
        id="works"
        ref={worksSectionRef}
        style={worksHeight ? { height: worksHeight } : undefined}
      >
        <div className="works-sticky">
          <div className="section-head">
            <p className="eyebrow"><Layers3 size={16} /> Selected builds</p>
            <h2>Проекты, которые выглядят дорого и работают быстро</h2>
          </div>
          <div className="project-window">
            <div
              className="project-rail"
              aria-label="Горизонтальная лента проектов"
              ref={projectRailRef}
            >
              {projects.map((project, index) => (
                <article className="portfolio-slide" key={project.title}>
                  <a
                    className={`project-preview ${project.cover ? "project-preview-image" : ""}`}
                    href={project.siteUrl ?? "#works"}
                    target={project.siteUrl ? "_blank" : undefined}
                    rel={project.siteUrl ? "noreferrer" : undefined}
                    aria-label={project.siteUrl ? `Открыть сайт ${project.title}` : project.title}
                  >
                    {project.cover ? (
                      <>
                        <img src={assetUrl(project.cover)} alt={`Обложка проекта ${project.title}`} />
                        <span className="preview-open">
                          Live site <ArrowUpRight size={18} />
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="preview-topline">
                          <span>SodeX Studio</span>
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </div>
                        <div className="preview-orbit" />
                        <div className="preview-grid">
                          <span />
                          <span />
                          <span />
                          <span />
                        </div>
                        <strong>{project.type}</strong>
                      </>
                    )}
                  </a>
                  <div className="project-info">
                    <p>{project.type}</p>
                    <h3>{project.title}</h3>
                    <span>{project.text}</span>
                    <small>{project.tech}</small>
                    <div className="project-actions">
                      {project.repoUrl ? (
                        <a className="repo-chip" href={project.repoUrl} target="_blank" rel="noreferrer">
                          <Github size={18} />
                          Source
                        </a>
                      ) : null}
                      <a
                        className="project-open"
                        href={project.siteUrl ?? "#works"}
                        target={project.siteUrl ? "_blank" : undefined}
                        rel={project.siteUrl ? "noreferrer" : undefined}
                        aria-label={`Открыть ${project.title}`}
                      >
                        <ArrowUpRight size={22} />
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="rail-hint">
            <span>Scroll</span>
            <strong>
              {String(activeProject).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
            </strong>
          </div>
        </div>
      </section>

      <section className="talk-strip" id="stack" aria-label="Технологии">
        <div className="talk-copy">
          <p className="eyebrow"><Code2 size={16} /> Stack in motion</p>
          <h2>Я работаю с технологиями, которые держат проект в форме</h2>
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeStack, ...marqueeStack].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="contact" id="contact">
        <div className="contact-copy">
          <p className="eyebrow"><Cpu size={16} /> Available for work</p>
          <h2>Давай поговорим</h2>
          <p>
            Беру идеи от первого экрана до серверной логики: сайты, приложения,
            API, базы данных, боты, Telegram Mini Apps и мобильные продукты.
            Напиши, что хочешь собрать, и я предложу понятный путь к рабочему результату.
          </p>
        </div>
        <div className="contact-links" aria-label="Контакты">
          <a href="https://t.me/NEVERLOSEE_YOURSELF" target="_blank" rel="noreferrer">
            <Send size={20} />
            <span>Telegram</span>
            <strong>@NEVERLOSEE_YOURSELF</strong>
          </a>
          <a href="https://t.me/SodeX_Studio" target="_blank" rel="noreferrer">
            <Send size={20} />
            <span>Telegram канал</span>
            <strong>@SodeX_Studio</strong>
          </a>
          <a href="mailto:zenavuken67570@gmail.com">
            <Mail size={20} />
            <span>Почта</span>
            <strong>zenavuken67570@gmail.com</strong>
          </a>
          <a href="https://github.com/Sodex00" target="_blank" rel="noreferrer">
            <Github size={20} />
            <span>GitHub</span>
            <strong>github.com/Sodex00</strong>
          </a>
          <a className="primary contact-cta" href="mailto:zenavuken67570@gmail.com">
            Start project <Zap size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
