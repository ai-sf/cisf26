export function initSubscriptionsPage() {
    let currentStep = 1;
    const totalSteps = 6;
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progressFill');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const errorMessage = document.getElementById('errorMessage');
    const form = document.getElementById('multiStepForm');
    const successMessage = document.getElementById('successMessage');

    const openingTimestamp = new Date('2025-11-17T15:00:00+01:00');
    const closingTimestamp = new Date('2025-12-18T23:59:00+01:00');

    const currentTime = new Date();

    const warningContainer = document.getElementById('warningContainer');
    const formContainer = document.getElementById('formContainer');
    const closedContainer = document.getElementById('closedContainer');

    if (currentTime < openingTimestamp) {
    } else if (currentTime > closingTimestamp) {
        if (warningContainer) warningContainer.style.display = 'none';
        if (closedContainer) closedContainer.style.display = 'block';

    } else {
        if (warningContainer) warningContainer.style.display = 'none';
        if (formContainer) formContainer.style.display = 'block';
    }

    const stepTexts = {
        1: {
            title: "Cominciamo",
            subtitle: `Per motivi amministrativi, ti chiediamo Nome e Cognome che devono essere quelli presenti sulla carta d’identità.
            Se vuoi, puoi indicare anche un nome alias, che useremo su badge e comunicazioni ufficiali.
        `
        },
        2: {
            title: "Informazioni aggiuntive",
            subtitle: `
            Come Comitato Organizzatore di CISF26 ci impegniamo, al meglio delle nostre possibilità, a garantire una conferenza inclusiva. 
            In questa sezione puoi indicarci eventuali bisogni specifici legati a disabilità fisiche, condizioni psicologiche o altre situazioni 
            per le quali potremmo offrirti supporto.
        `
        },
        3: {
            title: "Condizione accademica",
            subtitle: `
            In questa sezione ti chiederemo informazioni riguardanti la tua attuale condizione accademica. Se non sei al momento iscritt presso alcun corso di laurea, specifica e/o inserisci "non applicabile" nei seguenti campi." 
            `
        },
        4: {
            title: "Iscrizione ad AISF",
            subtitle: `
            L'iscrizione ad AISF è necessaria per poter partecipare a CISF26. Se dovessi essere selezionat per partecipare 
            all'evento dovrai provvedere ad iscriverti entro il <strong>15 Gennaio 2026</strong>. <br><br>

            Per informazioni sulle quote d'iscrizione ad AISF è possibile consultare il sito ufficiale: http://ai-sf.it/iscrizione/ .
        `
        },
        5: {
            title: "CISF26",
            subtitle: `È possibile partecipare a CISF26 in due modalità: <strong>con alloggio</strong> o <strong>senza alloggio</strong>. Ti chiediamo di indicare la tua preferenza. Ti chiediamo inoltre di specificare il tipo di stanza desiderato e, se già noti, i nomi degli eventuali compagni di stanza.<br><br>

            Faremo tutto il possibile per soddisfare le preferenze indicate, ma non possiamo garantirne l’assegnazione.<br><br>

            Ti chiediamo inoltre di specificare alcune informazioni utili all'organizzazione della conferenza.`
        },
        6: {
            title: "Per concludere",
            subtitle: `CISF è il più importante evento di AISF, e i posti disponibili sono limitati per ragioni organizzative. Ti chiediamo di scrivere una piccola lettera motivazionale per aiutarci nella selezione. Inoltre ti chiediamo di accettare i Termini e Condizioni  dell'iscrizione all'evento e l'informativa sulla privacy.`
        }
    };

    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = progress + '%';

        progressSteps.forEach((step, index) => {
            const stepNum = index + 1;
            step.classList.remove('active', 'completed');
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });

        formSteps.forEach(step => {
            step.classList.remove('active');
            if (parseInt(step.dataset.step) === currentStep) {
                step.classList.add('active');
            }
        });

        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.textContent = currentStep === totalSteps ? 'Submit' : 'Continue';

        errorMessage.classList.remove('active');
    }

    function validateStep() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredInputs = currentStepElement.querySelectorAll('[required]');

        for (let input of requiredInputs) {
            if (!input.value.trim()) {
                errorMessage.textContent = 'Per favore, compila tutti i campi obbligatori';
                errorMessage.classList.add('active');
                input.focus();
                return false;
            }

            if (input.type === 'email' && !isValidEmail(input.value)) {
                errorMessage.textContent = 'Per favore, inserisci un indirizzo e-mail valido';
                errorMessage.classList.add('active');
                input.focus();
                return false;
            }

            if (input.type === 'radio') {
                const radioGroup = currentStepElement.querySelectorAll(`[name="${input.name}"]`);
                const isChecked = Array.from(radioGroup).some(radio => radio.checked);
                if (!isChecked) {
                    errorMessage.textContent = 'Per favore, seleziona un\'opzione';
                    errorMessage.classList.add('active');
                    return false;
                }
            }
        }

        return true;
    }

    function isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function collectFormData() {
        const formData = new FormData(form);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        return data;
    }

    /**
     * Updates form's header and subtext
     */
    function updateStepTexts(step) {
        const titleEl = document.querySelector(".form-title");
        const subtitleEl = document.querySelector(".form-subtitle");

        const { title, subtitle } = stepTexts[step];

        titleEl.textContent = title;
        subtitleEl.innerHTML = subtitle;
    }

    nextBtn.addEventListener('click', function() {
        if (!validateStep()) {
            return;
        }

        if (currentStep === totalSteps) {
            collectFormData();

            fetch("https://script.google.com/macros/s/AKfycbyivfDK0XgJM7Fw2grR2QxVzU5N1YXS-lStvtpiJERQ5NShj8M-nu7_tKFw6DrjmNLxfw/exec",{
                method: "POST",
                mode: "no-cors",
                body: JSON.stringify(collectFormData())
            })
                .then(data=>{
                })
                .catch(err=>console.error(err));


            form.style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.button-group').style.display = 'none';
            document.querySelector('.form-header').style.display = 'none';
            document.querySelector('.cisf-info-fab-button').style.display = 'none';
            successMessage.classList.add('active');

        } else {
            currentStep++;
            updateProgress();
            updateStepTexts(currentStep);
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
            updateStepTexts(currentStep);
        }
    });

    form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            nextBtn.click();
        }
    });

    updateProgress();
    updateStepTexts(1);

    document.addEventListener('click',  async (ev) => {
        const trigger = ev.target.closest('[data-modal-target]');
        if (trigger) {
            ev.preventDefault();
            const modalId = trigger.dataset.modalTarget || '';
            const selector = modalId.startsWith('#') ? modalId : `#${modalId}`;
            const modal = document.querySelector(selector);
            openModal(modal, trigger);
            return;
        }
    })

    const openModal =  async (modal, trigger) => {
        if(!modal) return;
        if (modal && trigger) {
            const response = await fetch('/cisf26/modal-content/cisf-subscription-info.md');
            const markdown = await response.text();

            modal.querySelector('.modal-info.body').innerHTML = marked.parse(markdown);

            modal.classList.add('open');
            document.body.classList.add('modal-open');

            const pageContent = document.querySelector('.page-content');
            pageContent.classList.add('page-content-modal-open');
        }
    }
}