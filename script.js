// Mobile navigation: close after choosing a section and keep ARIA state in sync.
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");
    menuToggle.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
      menuToggle.querySelector("span").textContent = isOpen ? "✕" : "☰";
    });
    navLinks.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation menu");
      menuToggle.querySelector("span").textContent = "☰";
    }));

    // Typing effect. Reduced-motion preference shows the first role without animation.
    const roles = ["Cyber Security Enthusiast", "Network Support Engineer", "Linux & Windows Administration", "IT Infrastructure"];
    const typedText = document.getElementById("typedText");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduceMotion) {
      let roleIndex = 0, charIndex = roles[0].length, deleting = true;
      function typeLoop() {
        const role = roles[roleIndex];
        typedText.textContent = role.slice(0, charIndex);
        let delay = deleting ? 42 : 78;
        if (!deleting && charIndex === role.length) { deleting = true; delay = 1350; }
        else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 260; }
        charIndex += deleting ? -1 : 1;
        window.setTimeout(typeLoop, delay);
      }
      window.setTimeout(typeLoop, 900);
    }

    // Reveal sections and animate skill bars only when they enter the viewport.
    const revealTargets = document.querySelectorAll(".reveal, .timeline-item");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            entry.target.querySelectorAll?.(".skill-fill").forEach(bar => bar.classList.add("in-view"));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealTargets.forEach(el => observer.observe(el));
      document.querySelectorAll(".skill").forEach(el => observer.observe(el));
    } else {
      revealTargets.forEach(el => el.classList.add("in-view"));
      document.querySelectorAll(".skill-fill").forEach(el => el.classList.add("in-view"));
    }

    // Subtle pointer-based 3D tilt on the hero card. Disabled for touch/reduced-motion users.
    const visualWrap = document.getElementById("visualWrap");
    const cyberCard = document.getElementById("cyberCard");
    if (!reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      visualWrap.addEventListener("pointermove", event => {
        const rect = cyberCard.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        cyberCard.style.transform = `rotateY(${(x - .5) * 10}deg) rotateX(${(.5 - y) * 10}deg)`;
      });
      visualWrap.addEventListener("pointerleave", () => { cyberCard.style.transform = "rotateY(0deg) rotateX(0deg)"; });
    }

    // GitHub public repository integration with loading, empty, and error states.
    // Update this username if your GitHub account is different.
    const githubUsername = "Ankush2502";
    const repoContainer = document.getElementById("githubRepos");
    const githubStatus = document.getElementById("githubStatus");
    function safeExternalLink(url) {
      try {
        const parsed = new URL(url);
        return parsed.protocol === "https:" && parsed.hostname === "github.com" ? parsed.href : "https://github.com/" + githubUsername;
      } catch { return "https://github.com/" + githubUsername; }
    }
    function makeRepoCard(repo) {
      const article = document.createElement("article");
      article.className = "panel repo-card reveal in-view";
      const title = document.createElement("a");
      title.className = "repo-title";
      title.href = safeExternalLink(repo.html_url);
      title.target = "_blank";
      title.rel = "noopener noreferrer";
      title.textContent = repo.name || "Untitled repository";
      const description = document.createElement("p");
      description.textContent = repo.description || "No description added yet.";
      const meta = document.createElement("div");
      meta.className = "repo-meta";
      const language = document.createElement("span");
      language.textContent = "● " + (repo.language || "Other");
      const stars = document.createElement("span");
      stars.textContent = "★ " + (Number(repo.stargazers_count) || 0);
      const forks = document.createElement("span");
      forks.textContent = "⑂ " + (Number(repo.forks_count) || 0);
      meta.append(language, stars, forks);
      article.append(title, description, meta);
      return article;
    }
    async function loadGitHubRepos() {
      try {
        const response = await fetch(`https://api.github.com/users/${encodeURIComponent(githubUsername)}/repos?sort=updated&per_page=6&type=owner`, {
          headers: { "Accept": "application/vnd.github+json" }
        });
        if (!response.ok) throw new Error("GitHub API returned " + response.status);
        const repos = await response.json();
        if (!Array.isArray(repos) || repos.length === 0) {
          githubStatus.textContent = "No public repositories were found. Add public projects to GitHub to show them here.";
          return;
        }
        repoContainer.replaceChildren(...repos.slice(0, 6).map(makeRepoCard));
        githubStatus.textContent = "Showing recently updated public repositories from github.com/" + githubUsername + ".";
      } catch (error) {
        githubStatus.textContent = "Repositories could not load right now (network or API rate limit). You can still browse the GitHub profile directly.";
      }
    }
    loadGitHubRepos();

    // Current year in footer.
    document.getElementById("year").textContent = new Date().getFullYear();

    // If the resume file has not been created yet, provide a clear fallback instead of a dead link.
    document.getElementById("resumeButton").addEventListener("click", event => {
      const link = event.currentTarget;
      // The included Arun-CV.pdf is your original uploaded CV.
      // Replace Arun-CV.pdf whenever you want to update your CV.
      link.setAttribute("download", "Arun-CV.pdf");
    });
