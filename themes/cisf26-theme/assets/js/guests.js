export function initGuestScroller() {
    const searchBar = document.querySelector('#guest-searchbar');
    const noResultsPane = document.querySelector('#no-res-pane');
    noResultsPane.style.display = 'none';
    console.log('searchbar', searchBar);

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
            console.log('guestData', guestData);
            modal.querySelector('.modal-speaker.image').src = guestData.modalGuestImage || '';
            modal.querySelector('.modal-speaker.name').textContent = guestData.modalGuestName || '--';
            modal.querySelector('.modal-speaker.role').textContent = guestData.modalGuestRole || '';
            modal.querySelector('.modal-speaker.bio').innerHTML = guestData.guestBio || '--';

            modal.classList.add('open');
            document.body.classList.add('modal-open');
        }
    }

    const findGuests = (searchString) => {
        let cards = document.getElementsByClassName('guest-card');
        let searchHits = 0;

        for (let i = 0; i < cards.length; i++) {
            if((cards[i].getAttribute('data-modal-guest-name')).toLowerCase().includes(searchString.toLowerCase())) {
                cards[i].style.display = '';
                searchHits++;
            }
            else {
                cards[i].style.display = 'none';
                searchHits--;
            }
        }

        if(searchHits < 1) {
            document.getElementById('no-res-pane').style.display = 'block';
        }
        else if (searchString === '')
            document.getElementById('no-res-pane').style.display = 'none';

    }

    searchBar.addEventListener('keyup', e => findGuests(e.target.value));
}