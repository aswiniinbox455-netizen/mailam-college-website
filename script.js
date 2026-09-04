/* ================================
   SMOOTH SCROLL
================================ */

document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", function (event) {

        const target = document.querySelector(this.getAttribute("href"));

        if (target) {
            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });
        }

    });

});


/* ================================
   SCROLL REVEAL
================================ */

const revealElements = document.querySelectorAll(
    ".department-card, .facility-card, .event-card, .info-card, .placement-stats div"
);

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("show");

                observer.unobserve(entry.target);

            }

        });

    },
    {
        threshold: 0.15
    }
);

revealElements.forEach(element => {

    element.classList.add("reveal");

    observer.observe(element);

});


/* ================================
   NAVBAR SHADOW ON SCROLL
================================ */

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 50) {

        navbar.style.boxShadow =
            "0 6px 25px rgba(0,0,0,0.12)";

    } else {

        navbar.style.boxShadow =
            "0 4px 20px rgba(0,0,0,0.06)";

    }

});


/* ================================
   APPLY NOW BUTTON
================================ */

const admissionButton =
    document.querySelector(".admission-btn");

if (admissionButton) {

    admissionButton.addEventListener("click", () => {

        document.querySelector("#contact")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}


/* ================================
   EXPLORE COLLEGE BUTTON
================================ */

const exploreButton =
    document.querySelector(".hero .primary-btn");

if (exploreButton) {

    exploreButton.addEventListener("click", () => {

        document.querySelector("#about")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

}


/* ================================
   CURRENT YEAR
================================ */

const year = new Date().getFullYear();

const footerText =
    document.querySelector(".footer-bottom");

if (footerText) {

    footerText.innerHTML =
        `© ${year} Mailam Engineering College. All Rights Reserved.`;

}