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
            const formDataObj = collectFormData();

            // Costruzione querystring
            var params = [];
            for (var key in formDataObj) {
                if (formDataObj.hasOwnProperty(key)) {
                    params.push(encodeURIComponent(key) + '=' + encodeURIComponent(formDataObj[key]));
                }
            }
            var queryString = params.join('&');

            // URL finale
            var submitUrl =
                "https://docs.google.com/forms/d/e/1FAIpQLScOq262CVT2xSc6iassduh_AbQY75nYZZv9BRd8tn0U0TR0Eg/formResponse?"
                + queryString;

            console.log("Submitting to Google Forms:", submitUrl);

            // Invio GET con fetch no-cors
            try {
                fetch(submitUrl, {
                    method: "GET",
                    mode: "no-cors"
                })
                    .catch(function(err) {
                        console.error("Errore nel submit:", err);
                    });
            } catch (error) {
                console.error("Errore generale nel try/catch:", error);
            }

            // UI: mostra messaggio di successo
            form.style.display = 'none';
            document.querySelector('.progress-container').style.display = 'none';
            document.querySelector('.button-group').style.display = 'none';
            successMessage.classList.add('active');

        } else {
            currentStep++;
            updateProgress();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateProgress();
        }
    });

    form.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            nextBtn.click();
        }
    });

    updateProgress();
}