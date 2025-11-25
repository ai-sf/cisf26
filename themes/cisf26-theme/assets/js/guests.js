export function initGuestScroller() {
    gsap.registerPlugin(ScrollTrigger);

    const searchBar = document.querySelector('#guest-searchbar');
    const noResultsPane = document.querySelector('#no-res-pane');
    noResultsPane.style.display = 'none';

    // gsap anims
    const guestsPageTitle = document.querySelectorAll(".page-title-anim");
    const guestCards = document.querySelectorAll('.guest-card');

    // title animation on page load
    guestsPageTitle.forEach(letter => {
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
        })
    })

    // guests fade-in/fade-out on scroll
    guestCards.forEach((card, index) => {
        gsap.fromTo(card,
            {
                opacity: 0,
                y: 30
            },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 85%",
                    end: "top 15%",
                    toggleActions: "play none none reverse",
                }
            }
        );
    });

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
        if(!modal) return;
        if(modal && trigger) {
            const guestData = trigger.dataset;
            modal.querySelector('.modal-speaker.image').src = guestData.modalGuestImage || '';
            modal.querySelector('.modal-speaker.name').textContent = guestData.modalGuestName || '--';
            modal.querySelector('.modal-speaker.role').textContent = guestData.modalGuestRole || '';
            modal.querySelector('.modal-speaker.bio').innerHTML = guestData.guestBio || '--';

            modal.classList.add('open');
            document.body.classList.add('modal-open');

            const pageContent = document.querySelector('.page-content');
            pageContent.classList.add('page-content-modal-open');
        }
    }

    const findGuests = (searchString) => {
        const cards = document.querySelectorAll('.guest-card');
        const noResultsPane = document.getElementById('no-res-pane');
        const searchTerm = searchString.toLowerCase().trim();

        let visibleCount = 0;

        cards.forEach(card => {
            const guestName = card.getAttribute('data-modal-guest-name').toLowerCase();
            const isMatch = searchTerm === '' || guestName.includes(searchTerm);

            card.style.display = isMatch ? '' : 'none';
            if (isMatch) visibleCount++;
        });

        noResultsPane.style.display = visibleCount === 0 ? 'block' : 'none';
    };

    searchBar.addEventListener('keyup', e => findGuests(e.target.value));
}