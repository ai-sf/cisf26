export function initSubscriptionsPage() {
    let currentStep = 1;
    const totalSteps = 5;
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    const progressFill = document.getElementById('progressFill');
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const errorMessage = document.getElementById('errorMessage');
    const form = document.getElementById('multiStepForm');
    const successMessage = document.getElementById('successMessage');

    const openingTimestamp = new Date('2025-11-17T19:00:00+01:00');
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
            subtitle: `
            Benvenut nel modulo di registrazione alla X Conferenza Italiana Studenti di Fisica, che si terrà dal <strong>13 al 17 Aprile 2026</strong> a <strong>Roma</strong>.<br><br>

            Tutte le informazioni sull'evento sono disponibili sul sito di CISF26. Per contattare il Comitato Organizzatore puoi scrivere a cisf26@ai-sf.it o utilizzare il modulo presente in home page.<br><br>

            Puoi modificare le tue risposte dopo aver inviato il form, se strettamente necessario.<br><br>

            <strong>1. Informazioni Generali:</strong><br>
            Le iscrizioni chiuderanno il <strong>18 Dicembre 2025</strong> alle 23.59.<br><br>

            La selezione dei/delle partecipanti sarà effettuata dal Comitato Organizzatore della CISF26 in collaborazione con il Comitato Esecutivo di AISF. La lettera di motivazione, da compilare nel presente modulo di registrazione, sarà presa in considerazione come importante elemento di valutazione.<br><br>

            Entro il <strong>10 Gennaio 2026</strong> i/le partecipanti selezionati/e saranno avvisati/e tramite l'indirizzo email indicato in fase di registrazione. Si prega a tal proposito di controllare quotidianamente la casella di posta.<br><br>

            Sarà quindi richiesto il pagamento della quota di iscrizione entro e non oltre Giovedì <strong>15 Gennaio 2026</strong> alle ore 23:59, pena l’esclusione della partecipazione all’evento.<br><br>

            Ti informiamo che la quota di partecipazione non è in nessun caso rimborsabile.<br><br>

            Una volta definiti i/le partecipanti/e all'evento verrà pianificato il calendario delle Parallel Sessions. Non è garantito che tutti i contributi scientifici potranno essere accettati.<br><br>

            <strong>2. Quota di Partecipazione</strong><br>

            Sono disponibili in totale 150 posti. Le quote di partecipazione per l'evento sono:<br>
            - 120 euro (con alloggio);<br>
            - 70 euro (senza alloggio).<br><br>

            Entrambe le quote di partecipazione comprendono:<br>
            - Una colazione, un pranzo, il pranzo sociale, la serata finale e i coffee break;<br>
            - Welcome kit;<br>
            - Soggiorno presso la casa per ferie Seraphicum per le 4 notti dell'evento (solo quota con alloggio).<br><br>

            Entrambe le quote di partecipazione non comprendono:<br>
            - Spese di viaggio per raggiungere la conferenza;<br>
            - Assicurazione.<br><br>

            Per chi non è ancora membro AISF alla quota di registrazione all'evento andrà aggiunta, al costo di 5 euro (10 euro per gli studenti di dottorato, 20 per gli esterni), la quota di iscrizione all'Associazione per l'anno 2025/2026. <br>
            Per informazioni consultare https://ai-sf.it/iscrizione/. <br>
            La quota di iscrizione all'AISF include la membership IAPS (International Association of Physics Students) di cui AISF è National Committee per l'italia.<br><br>

            Per motivi amministrativi, ti chiediamo Nome e Cognome che devono essere quelli presenti sulla carta d’identità.
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
        subtitleEl.innerHTML = subtitle; // ⭐ Permette HTML nei sottotitoli
    }

    // old
    // nextBtn.addEventListener('click', async () => {
    //     if (!validateStep()) {
    //         return;
    //     }
    //
    //     if (currentStep === totalSteps) {
    //         const formDataObj = collectFormData();
    //         console.log('Form submitted:', formDataObj);
    //
    //         // === POST TO GOOGLE FORMS ===
    //         try {
    //             const formData = new FormData();
    //
    //             // convert from object → FormData
    //             for (const key in formDataObj) {
    //                 formData.append(key, formDataObj[key]);
    //             }
    //
    //             const response = await fetch(
    //                 "https://docs.google.com/forms/d/e/1FAIpQLSetIKV5U_BNi9mqvsSRv5V_f4RYn3TsYMpvz8Kwm6VsfZy-Rg/formResponse",
    //                 {
    //                     method: "POST",
    //                     mode: "no-cors", // IMPORTANT: Google Forms requires no-cors
    //                     body: formData
    //                 }
    //             );
    //
    //             // NOTE: in mode:no-cors non puoi verificare response.status
    //             console.log("Form inviato correttamente a Google Forms");
    //
    //         } catch (error) {
    //             console.error("Errore nell'invio del form:", error);
    //
    //             // opzionale: mostra un messaggio di errore all'utente
    //             alert("Si è verificato un errore durante l'invio del form. Riprova.");
    //         }
    //
    //         // === UI after successful submission ===
    //         form.style.display = 'none';
    //         document.querySelector('.progress-container').style.display = 'none';
    //         document.querySelector('.button-group').style.display = 'none';
    //         successMessage.classList.add('active');
    //
    //     } else {
    //         currentStep++;
    //         updateProgress();
    //     }
    // });

    // experimental
    nextBtn.addEventListener('click', function() {
        if (!validateStep()) {
            return;
        }

        if (currentStep === totalSteps) {
            // const formDataObj = collectFormData();
            // console.log('form data', formDataObj);

            const data = {
                "entry.1314486349": "neutral",
                "entry.720304467": "Umberto",
                "entry.1761187174": "Gravante",
                "entry.660092797": "Umberto Gravante",
                "entry.309525043": "2025-11-22",
                "entry.2085700336": "123",
                "entry.122368367": "yes",
                "entry.131685819": "gravanteumberto@outlook.com",
                "entry.1631187488": "disability_no",
                "entry.665339377": "psyco_no",
                "entry.202655460": "sapienza",
                "entry.1286108536": "bachelor",
                "entry.1551803751": "Corso Giacomo Matteotti, 208",
                "entry.2034101649": "bachelor_first_year",
                "entry.532950537": "aisf_sub_yes",
                "entry.2122237580": "cl-bologna",
                "entry.1667927100": "cisf_vol_no",
                "entry.603086968": "aisf_role_president",
                "entry.1216570776": "cisf_no",
                "entry.1062006308": "Didattica della Fisica",
                "entry.1118044858": "Outreach e divulgazione",
                "entry.1741954400": "Astrofisica",
                "entry.907451803": "Fisica Terrestre",
                "entry.1364572595": "Fisica dell'Atmosfera e del Clima",
                "entry.300460686": "Fisica delle Particelle",
                "entry.715091551": "Fisica Nucleare e Subnucleare",
                "entry.1897383588": "Fisica Teorica",
                "entry.1046714189": "Fisica della Materia",
                "entry.1538025516": "XS",
                "entry.405331457": "lattosio",
                "entry.1900013430": "cisf_room_boys_only",
                "entry.1236401782": "mario",
                "entry.1956920736": "parallel_session_yes",
                "entry.102884040": "fdsfsf"
            };

            const formData = new FormData();

            Object.keys(data).forEach(key => {
                formData.append(key, data[key]);
            });

            /* NEW */
            fetch("https://docs.google.com/forms/d/e/1FAIpQLSetIKV5U_BNi9mqvsSRv5V_f4RYn3TsYMpvz8Kwm6VsfZy-Rg/formResponse",{
                method: "POST",
                mode: "no-cors",
                body: formData
            })
                .then(data=>{
                    console.log(data);
                    alert("Form Submitted");
                })
                .catch(err=>console.error(err));


            // const formDataObj = collectFormData();
            //
            // // Costruzione querystring
            // var params = [];
            // for (var key in formDataObj) {
            //     if (formDataObj.hasOwnProperty(key)) {
            //         params.push(encodeURIComponent(key) + '=' + encodeURIComponent(formDataObj[key]));
            //     }
            // }
            // var queryString = params.join('&');
            //
            // // URL finale
            // var submitUrl =
            //     "https://docs.google.com/forms/d/e/1FAIpQLSetIKV5U_BNi9mqvsSRv5V_f4RYn3TsYMpvz8Kwm6VsfZy-Rg/formResponse?"
            //     + queryString;
            //
            // console.log("Submitting to Google Forms:", submitUrl);
            //
            // try {
            //     fetch(submitUrl, {
            //         method: "GET",
            //         mode: "no-cors"
            //     })
            //         .catch(function(err) {
            //             console.error("Errore nel submit:", err);
            //         });
            // } catch (error) {
            //     console.error("Errore generale nel try/catch:", error);
            // }

            // UI: mostra messaggio di successo
            form.style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.button-group').style.display = 'none';
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
}