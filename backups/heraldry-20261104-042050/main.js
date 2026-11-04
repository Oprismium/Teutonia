
document.addEventListener("DOMContentLoaded", () => {

    // ============================================
    // MOBILE NAVIGATION
    // ============================================

    const toggle = document.querySelector(".menu-toggle, .tn-menu-toggle");
    const nav = document.querySelector(".main-nav, .tn-main-nav");

    if (toggle && nav) {

        toggle.addEventListener("click", () => {

            const open = nav.classList.toggle("open");

            toggle.setAttribute("aria-expanded", String(open));

        });

    }


    // ============================================
    // NATIONAL FLAG TRANSITION
    // ============================================

    const body = document.body;
    const header = document.querySelector(".tn-header");
    const flagSection = document.querySelector(".tn-flag-section");

    function updateFlagState() {

        if (!body.classList.contains("tn-home")) {
            body.classList.toggle("tn-scrolled", window.scrollY > 40);
            return;
        }

        if (!flagSection) return;

        const headerHeight = header
            ? header.getBoundingClientRect().height
            : 0;

        const flagBottom = flagSection.getBoundingClientRect().bottom;

        const shouldCompact = flagBottom <= headerHeight + 8;

        body.classList.toggle("tn-scrolled", shouldCompact);

    }

    updateFlagState();

    window.addEventListener("scroll", updateFlagState, {
        passive: true
    });

    window.addEventListener("resize", updateFlagState);


    // ============================================
    // ACTIVE MAIN NAVIGATION
    // ============================================

    const currentSection = body.dataset.section;

    const mainLinks = document.querySelectorAll(
        ".main-nav a, .tn-main-nav a"
    );

    mainLinks.forEach(link => {

        if (currentSection && link.dataset.section === currentSection) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });


    // ============================================
    // NAVIGATION INDICATOR
    // ============================================

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


    // ============================================
    // ACTIVE SUBNAVIGATION
    // ============================================

    const currentPage = body.dataset.page;

    document.querySelectorAll(
        ".section-nav a, .tn-section-nav a"
    ).forEach(link => {

        if (currentPage && link.dataset.page === currentPage) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });


    // ============================================
    // BREADCRUMB PROGRESS
    // ============================================

    const progress = document.querySelector(
        ".breadcrumb-progress span"
    );

    if (progress) {

        const depth = Number(body.dataset.depth || 1);

        progress.style.width =
            Math.min(depth * 33.33, 100) + "%";

    }


    // ============================================
    // CURRENT YEAR
    // ============================================

    const year = document.querySelector("#current-year");

    if (year) {
        year.textContent = new Date().getFullYear();
    }

});

