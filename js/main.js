/* ==========================================================
   TEUTONIA — SITE INTERACTIONS
   ========================================================== */

/* Mark the homepage as pending before the initial reveal. */

if (document.body && document.body.classList.contains("tn-home")) {
    document.body.classList.add("tn-emblem-pending");
}


document.addEventListener("DOMContentLoaded", () => {

    const body = document.body;
    const header = document.querySelector(".tn-header");

    const nav = document.querySelector(
        ".main-nav, .tn-main-nav"
    );


    /* ------------------------------------------------------
       MOBILE NAVIGATION
       ------------------------------------------------------ */

    const toggle = document.querySelector(
        ".menu-toggle, .tn-menu-toggle"
    );

    if (toggle && nav) {

        toggle.addEventListener("click", () => {

            const open = nav.classList.toggle("open");

            toggle.setAttribute(
                "aria-expanded",
                String(open)
            );

        });

    }


    /* ------------------------------------------------------
       HERALDIC FLAG INTRODUCTION
       ------------------------------------------------------ */

    const hero = document.querySelector(".tn-home-hero");
    const heroFlag = document.querySelector(".tn-hero-flag");

    function revealImmediately() {

        body.classList.remove("tn-emblem-pending");
        body.classList.add("tn-emblem-revealed");

    }


    function playHeraldryIntro() {
        const target = document.querySelector(".tn-hero-flag");
        const hero = document.querySelector(".tn-home-hero");

        if (!target || !hero) {
            body.classList.remove("tn-emblem-pending");
            return;
        }

        const reveal = () => {
            body.classList.remove("tn-emblem-pending");
            body.classList.add("tn-emblem-revealed");
        };

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            reveal();
            return;
        }

        const storageKey = "teutonia-heraldry-intro-played";
        const navigation = performance.getEntriesByType("navigation")[0];
        const isReload = navigation?.type === "reload";

        if (sessionStorage.getItem(storageKey) && !isReload) {
            reveal();
            return;
        }

        if (!Element.prototype.animate) {
            reveal();
            return;
        }

        const startAnimation = () => {
            const heroRect = hero.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();

            const overlay = target.cloneNode(true);

            overlay.className = "tn-hero-flag-overlay";
            overlay.alt = "";
            overlay.setAttribute("aria-hidden", "true");

            /*
            * Convert viewport coordinates into coordinates
            * relative to the hero's own positioning context.
            */
            const startX =
                window.innerWidth / 2 - heroRect.left;

            const startY =
                window.innerHeight / 2 - heroRect.top;

            const targetX =
                targetRect.left - heroRect.left + targetRect.width / 2;

            const targetY =
                targetRect.top - heroRect.top + targetRect.height / 2;

            const startWidth = Math.min(
                Math.max(window.innerWidth * 0.62, 240),
                520
            );

            overlay.style.left = `${startX}px`;
            overlay.style.top = `${startY}px`;
            overlay.style.width = `${startWidth}px`;
            overlay.style.transform =
                "translate(-50%, -50%) rotateY(90deg) scale(.72)";
            overlay.style.opacity = "0";

            hero.appendChild(overlay);

            sessionStorage.setItem(storageKey, "true");

            const animation = overlay.animate(
                [
                    {
                        offset: 0,
                        left: `${startX}px`,
                        top: `${startY}px`,
                        width: `${startWidth}px`,
                        transform:
                            "translate(-50%, -50%) rotateY(90deg) scale(.72)",
                        opacity: 0
                    },
                    {
                        offset: 0.18,
                        left: `${startX}px`,
                        top: `${startY}px`,
                        width: `${startWidth}px`,
                        transform:
                            "translate(-50%, -50%) rotateY(-8deg) scale(1)",
                        opacity: 1
                    },
                    {
                        offset: 0.32,
                        left: `${startX}px`,
                        top: `${startY}px`,
                        width: `${startWidth}px`,
                        transform:
                            "translate(-50%, -50%) rotateY(0deg) scale(1)",
                        opacity: 1
                    },
                    {
                        offset: 1,
                        left: `${targetX}px`,
                        top: `${targetY}px`,
                        width: `${targetRect.width}px`,
                        transform:
                            "translate(-50%, -50%) rotateY(0deg) scale(1)",
                        opacity: 1
                    }
                ],
                {
                    duration: 1850,
                    easing: "cubic-bezier(.2,.75,.25,1)",
                    fill: "forwards"
                }
            );

            animation.onfinish = () => {
                overlay.remove();
                reveal();
            };

            animation.oncancel = () => {
                overlay.remove();
                reveal();
            };
        };

        if (target.complete && target.naturalWidth > 0) {
            startAnimation();
        } else if (target.decode) {
            target.decode().then(startAnimation).catch(startAnimation);
        } else {
            target.addEventListener("load", startAnimation, { once: true });
            target.addEventListener("error", reveal, { once: true });
        }
    }


    playHeraldryIntro();


    /* ------------------------------------------------------
       FLAG TRANSITION INTO THE HEADER
       ------------------------------------------------------ */

    function updateFlagState() {

        if (!body.classList.contains("tn-home")) {

            body.classList.toggle(
                "tn-scrolled",
                window.scrollY > 40
            );

            return;
        }

        if (!hero) return;

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const heroBottom = hero.getBoundingClientRect().bottom;

        const shouldCompact = heroBottom <= headerHeight + 8;

        body.classList.toggle(
            "tn-scrolled",
            shouldCompact
        );

    }


    updateFlagState();

    window.addEventListener("scroll", updateFlagState, {
        passive: true
    });

    window.addEventListener("resize", updateFlagState);


    /* ------------------------------------------------------
       ACTIVE MAIN NAVIGATION
       ------------------------------------------------------ */

    const currentSection = body.dataset.section;

    const mainLinks = document.querySelectorAll(
        ".main-nav a, .tn-main-nav a"
    );

    mainLinks.forEach(link => {

        if (
            currentSection &&
            link.dataset.section === currentSection
        ) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });


    /* ------------------------------------------------------
       NAVIGATION INDICATOR
       ------------------------------------------------------ */

    const indicator = document.querySelector(".nav-indicator");

    const activeLink = nav
        ? nav.querySelector("a.active")
        : null;


    function moveIndicator() {

        if (!indicator || !activeLink || !nav) return;

        if (window.innerWidth <= 850) return;

        const navRect = nav.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        indicator.style.width = linkRect.width + "px";

        indicator.style.transform =
            `translateX(${linkRect.left - navRect.left}px)`;

    }


    moveIndicator();

    window.addEventListener("resize", moveIndicator);


    /* ------------------------------------------------------
       ACTIVE SUBNAVIGATION
       ------------------------------------------------------ */

    const currentPage = body.dataset.page;

    document.querySelectorAll(
        ".section-nav a, .tn-section-nav a"
    ).forEach(link => {

        if (
            currentPage &&
            link.dataset.page === currentPage
        ) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });


    /* ------------------------------------------------------
       BREADCRUMB PROGRESS
       ------------------------------------------------------ */

    const progress = document.querySelector(
        ".breadcrumb-progress span"
    );

    if (progress) {

        const depth = Number(body.dataset.depth || 1);

        progress.style.width =
            Math.min(depth * 33.33, 100) + "%";

    }


    /* ------------------------------------------------------
       CURRENT YEAR
       ------------------------------------------------------ */

    const year = document.querySelector("#current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});
