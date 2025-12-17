export function initAboutUsPage() {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.clearScrollMemory("manual");
    window.scrollTo(0, 0);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    const parent = document.getElementById('roma-tre-university');
    const image = document.querySelector("#my-image");
    const helloText = document.querySelector('#hello');
    const textLeft = document.querySelector('.hero__text--left');
    const textRight = document.querySelector('.hero__text--right');

    // aisf-informative
    const statItems = document.querySelectorAll('.stat-item');
    const container = document.querySelector('#aisf-informative');

    // team members
    const membersPageSectionTitle = document.querySelectorAll(".members-section-title");
    const memberCards = document.querySelectorAll('.team-member-card');

    // presskit download button
    const presskitDownloadBtn = document.querySelector("#presskitButton");
    console.log('presskit download', presskitDownloadBtn);

    /* Initial anim on page load
        helloText bumps out and img fades in
     */
    if (helloText) {
        gsap.from(helloText, {
            opacity: 0,
            scale: 0.5,
            duration: 1,
            ease: "back.out(1.7)",
            delay: 0.2
        });
    }

    if (image) {
        gsap.from(image, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            ease: "power2.out",
            delay: 0.5
        });
    }

    // Binding timeline to scroll event
    if (parent && image) {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: parent,
                start: "top top",
                end: isMobile ? "+=100%" : "+=150%",
                scrub: isMobile ? 1 : 1.5,
                pin: true,
                anticipatePin: 1
            }
        });

        // What happens on scroll
        tl.to(helloText, {
            opacity: 0,
            y: -50,
            duration: 0.2,
            ease: "power2.in"
        }, 0)
            .to(image, {
                width: "100vw",
                height: "100vh",
                maxWidth: "100vw",
                borderRadius: "0px",
                outlineWidth: "0px",
                top: "50%",
                left: "50%",
                duration: isMobile ? 0.7 : 1,
                ease: "power1.inOut"
            }, 0.1)
            .fromTo(textLeft, {
                opacity: 0,
                x: isMobile ? -50 : -100
            }, {
                opacity: 1,
                x: 0,
                duration: isMobile ? 0.5 : 0.4,
                ease: "power2.out"
            }, isMobile ? 0.5 : 0.8)
            .fromTo(textRight, {
                opacity: 0,
                x: isMobile ? 50 : 100
            }, {
                opacity: 1,
                x: 0,
                duration: isMobile ? 0.5 : 0.4,
                ease: "power2.out"
            }, isMobile ? 0.6 : 0.9);
    }

    // stats
    if (container && statItems.length > 0) {
        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: container,
                start: "top 60%",
                end: "top 1%",
                scrub: 1.2,
                toggleActions: "play none none reverse",
                // markers: true
            }
        });

        statItems.forEach((item, index) => {
            tl2.fromTo(item,
                {
                    opacity: 0.2,
                    y: 30,
                    color: "#8B5A2B"
                },
                {
                    opacity: 1,
                    y: 0,
                    color: "#3D2817",
                    duration: 0.5,
                    ease: "power2.out"
                },
                index * 0.8
            );
        });
    }

    // animating members section title
    membersPageSectionTitle.forEach(letter => {
        const text = letter.innerHTML.trim();
        letter.innerHTML = "";

        text.split("").forEach(char => {
            const span = document.createElement("span");
            span.innerHTML = char === " " ? "&nbsp;" : char;
            letter.appendChild(span);
        });

        gsap.from(letter.querySelectorAll("span"), {
            scrollTrigger: {
                trigger: letter,
                start: "top 85%",
                once: true
            },
            y: "100%",
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            stagger: 0.05
        });
    });

    // animating member cards
    memberCards.forEach((member) => {
        gsap.fromTo(member,
            {
                opacity: 0,
                y: 30,
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: member,
                    start: "top 85%",
                    end: "top 15%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Team member modal
    document.addEventListener('click', (ev) => {
        const trigger = ev.target.closest('[data-modal-target]');
        if (trigger) {
            ev.preventDefault();
            const modalId = trigger.dataset.modalTarget || '';
            const selector = modalId.startsWith('#') ? modalId : `#${modalId}`;
            const modal = document.querySelector(selector);
            openModal(modal, trigger);
            return;
        }
    });

    const openModal = (modal, trigger) => {
        console.log('triggering open modal');
        if (!modal) return;

        if (modal && trigger) {
            console.log('dataset', trigger.dataset);
            const memberData = trigger.dataset;
            modal.querySelector('.modal-team-member.image').src = memberData.modalMemberPicture || "";
            modal.querySelector('.modal-team-member.name').textContent = memberData.modalMemberName || '--';
            modal.querySelector('.modal-team-member.role').textContent = memberData.modalMemberRole || '';
            modal.querySelector('.modal-team-member.bio').innerHTML = memberData.modalMemberBio || '--';

            modal.classList.add('open');
            document.body.classList.add('modal-open');

            const pageContent = document.querySelector('.page-content');
            if (pageContent) {
                pageContent.classList.add('page-content-modal-open');
            }
        }
    };

    // Refresh ScrollTrigger on resize (todo: improve)
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 250);
    });


    presskitDownloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let anchorElement = document.createElement('a');
        anchorElement.setAttribute('href', '/cisf26/docs/cisf26-presskit.zip');
        anchorElement.setAttribute('download', 'cisf26-presskit.zip');

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
    })
}