export function initSubscriptionsPage() {
    // -------------------------------
    // Cookie utilities
    // -------------------------------
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';')[0];
    }

    function setCookie(name, value, days = 365) {
        const maxAge = days * 24 * 60 * 60;
        document.cookie = `${name}=${value}; path=/; max-age=${maxAge}`;
    }

    // -------------------------------
    // DOM Elements
    // -------------------------------
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
    const successContainer = document.getElementById('successContainer');

    const warningContainer = document.getElementById('warningContainer');
    const formContainer = document.getElementById('formContainer');
    const closedContainer = document.getElementById('closedContainer');

    // -------------------------------
    // Prevent double submissions using cookie
    // -------------------------------
    const alreadySubmitted = getCookie("cisf_submitted");
    console.log('already submitted', alreadySubmitted);

    if (alreadySubmitted !== undefined && alreadySubmitted === "true") {
        if (warningContainer) warningContainer.style.display = "none";
        if (closedContainer) closedContainer.style.display = "none";
        if (formContainer) formContainer.style.display = "none";

        document.querySelector('.progress-container')?.style.setProperty("display", "none");
        document.querySelector('.button-group')?.style.setProperty("display", "none");
        document.querySelector('.form-header')?.style.setProperty("display", "none");
        document.querySelector('.cisf-info-anchor-button')?.style.setProperty("display", "none");

        successMessage.classList.add('active');
        successContainer.style.display = "block";
        return;
    }

    // -------------------------------
    // TIME WINDOW
    // -------------------------------
    const openingTimestamp = new Date('2025-11-17T19:00:00+01:00');
    const closingTimestamp = new Date('2025-12-18T23:59:00+01:00');

    const now = new Date();

    if (now < openingTimestamp) {
        warningContainer.style.display = "block";
        formContainer.style.display = "none";
    } else if (now > closingTimestamp) {
        warningContainer.style.display = "none";
        closedContainer.style.display = "block";
    } else {
        warningContainer.style.display = "none";
        formContainer.style.display = "block";
    }

    // -------------------------------
    // Step text content
    // -------------------------------
    const stepTexts = {
        1: {
            title: "Cominciamo",
            subtitle: `Per motivi amministrativi, ti chiediamo Nome e Cognome che devono essere quelli presenti sulla carta d’identità.
            Se vuoi, puoi indicare anche un nome alias, che useremo su badge e comunicazioni ufficiali.`
        },
        2: {
            title: "Informazioni aggiuntive",
            subtitle: `Come Comitato Organizzatore di CISF26 ci impegniamo, al meglio delle nostre possibilità, a garantire una conferenza inclusiva. 
            In questa sezione puoi indicarci eventuali bisogni specifici legati a disabilità fisiche, condizioni psicologiche o altre situazioni 
            per le quali potremmo offrirti supporto.`
        },
        3: {
            title: "Condizione accademica",
            subtitle: `In questa sezione ti chiederemo informazioni riguardanti la tua attuale condizione accademica. 
            Se non sei al momento iscritt presso alcun corso di laurea, specifica e/o inserisci "non applicabile" nei seguenti campi.`
        },
        4: {
            title: "Iscrizione ad AISF",
            subtitle: `
            L'iscrizione ad AISF è necessaria per poter partecipare a CISF26. Se dovessi essere selezionat per partecipare 
            all'evento dovrai provvedere a iscriverti entro il <strong>15 Gennaio 2026</strong>. <br>
            Per informazioni sulle quote d'iscrizione ad AISF è possibile consultare il sito ufficiale: http://ai-sf.it/iscrizione/ .`
        },
        5: {
            title: "CISF26",
            subtitle: `È possibile partecipare a CISF26 in due modalità: <strong>con alloggio</strong> o <strong>senza alloggio</strong>. 
            Ti chiediamo di indicare la tua preferenza. Ti chiediamo inoltre di specificare il tipo di stanza desiderato e, se già noti, i nomi degli eventuali compagni di stanza.<br>
            Faremo tutto il possibile per soddisfare le preferenze indicate, ma non possiamo garantirne l’assegnazione.<br>
            Ti chiediamo inoltre di specificare alcune informazioni utili all'organizzazione della conferenza.`
        },
        6: {
            title: "Per concludere",
            subtitle: `CISF è il più importante evento di AISF, e i posti disponibili sono limitati per ragioni organizzative. Ti chiediamo di scrivere una piccola lettera motivazionale per aiutarci nella selezione. 
            Inoltre ti chiediamo di accettare i Termini e Condizioni  dell'iscrizione all'evento e l'informativa sulla privacy.`
        }
    };

    // -------------------------------
    // UI Updates
    // -------------------------------
    function updateProgress() {
        const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;
        progressFill.style.width = progress + '%';

        progressSteps.forEach((step, i) => {
            const stepNum = i + 1;
            step.classList.remove('active', 'completed');
            if (stepNum < currentStep) step.classList.add('completed');
            else if (stepNum === currentStep) step.classList.add('active');
        });

        formSteps.forEach(step => {
            step.classList.toggle('active', parseInt(step.dataset.step) === currentStep);
        });

        prevBtn.style.display = currentStep === 1 ? 'none' : 'block';
        nextBtn.textContent = currentStep === totalSteps ? 'Submit' : 'Continua';

        errorMessage.classList.remove('active');
    }

    function updateStepTexts(step) {
        const titleEl = document.querySelector(".form-title");
        const subtitleEl = document.querySelector(".form-subtitle");

        titleEl.textContent = stepTexts[step].title;
        subtitleEl.innerHTML = stepTexts[step].subtitle;
    }

    // -------------------------------
    // Validation
    // -------------------------------
    function validateStep() {
        const currentStepEl = document.querySelector(`.form-step[data-step="${currentStep}"]`);
        const requiredInputs = currentStepEl.querySelectorAll('[required]');

        for (let input of requiredInputs) {
            if (input.type === "radio") {
                const radios = currentStepEl.querySelectorAll(`[name="${input.name}"]`);
                if (![...radios].some(r => r.checked)) {
                    errorMessage.textContent = 'Per favore, seleziona un\'opzione';
                    errorMessage.classList.add('active');
                    return false;
                }
                continue;
            }

            if (!input.value.trim()) {
                errorMessage.textContent = 'Per favore, compila tutti i campi obbligatori';
                errorMessage.classList.add('active');
                input.focus();
                return false;
            }
        }

        return true;
    }

    function collectFormData() {
        const data = {};
        new FormData(form).forEach((value, key) => (data[key] = value));
        return data;
    }

    // -------------------------------
    // NEXT / PREV BUTTONS
    // -------------------------------
    nextBtn.addEventListener('click', () => {
        if (!validateStep()) return;

        if (currentStep === totalSteps) {
            fetch(
                "https://script.google.com/macros/s/AKfycbyivfDK0XgJM7Fw2grR2QxVzU5N1YXS-lStvtpiJERQ5NShj8M-nu7_tKFw6DrjmNLxfw/exec",
                {
                    method: "POST",
                    mode: "no-cors",
                    body: JSON.stringify(collectFormData())
                }
            );

            form.style.display = "none";
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.button-group').style.display = 'none';
            document.querySelector('.form-header').style.display = 'none';
            document.querySelector('.cisf-info-anchor-button').style.display = 'none';

            successMessage.classList.add('active');

            // 🔥 Save cookie to prevent resubmission
            setCookie("cisf_submitted", "true");

            return;
        }

        currentStep++;
        updateProgress();
        updateStepTexts(currentStep);
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
            updateStepTexts(currentStep);
        }
    });

    form.addEventListener('keypress', e => {
        if (e.key === "Enter" && e.target.tagName !== "TEXTAREA") {
            e.preventDefault();
            nextBtn.click();
        }
    });

    // -------------------------------
    // Modal loader (Markdown)
    // -------------------------------
    document.addEventListener('click', async ev => {
        const trigger = ev.target.closest('[data-modal-target]');
        if (!trigger) return;

        ev.preventDefault();
        const modal = document.querySelector(trigger.dataset.modalTarget);
        if (!modal) return;

        const response = await fetch('/cisf26/modal-content/cisf-subscription-info.md');
        const markdown = await response.text();

        modal.querySelector('.modal-info.body').innerHTML = marked.parse(markdown);

        modal.classList.add('open');
        document.body.classList.add('modal-open');
        document.querySelector('.page-content').classList.add('page-content-modal-open');
    });

    document.addEventListener('click', async ev => {
        const trigger = ev.target.closest('[data-modal-target]');
        if (!trigger) return;

        ev.preventDefault();
        const modal = document.querySelector(trigger.dataset.modalTarget);
        if (!modal) return;

        const response = await fetch(`/cisf26/modal-content/field-${trigger.dataset.modalFieldName}-info.md`);
        console.log(response);
        const markdown = await response.text();

        modal.querySelector('.modal-form-field-info.body').innerHTML = marked.parse(markdown);

        modal.classList.add('open');
        document.body.classList.add('modal-open');
        document.querySelector('.page-content').classList.add('page-content-modal-open');
    })

    // -------------------------------
    // Init UI
    // -------------------------------
    updateProgress();
    updateStepTexts(1);
}
