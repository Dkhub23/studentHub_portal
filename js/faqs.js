// ==========================================
// FAQ MODULE
// ==========================================

let faqData = [];


// ==========================================
// FETCH FAQ DATA
// ==========================================

async function loadFAQs() {

    const loading =
        document.getElementById(
            "faqLoading"
        );

    const error =
        document.getElementById(
            "faqError"
        );


    try {

        loading.style.display = "block";

        error.textContent = "";


        const response =
            await fetch(
                "data/faqs.json"
            );


        if (!response.ok) {

            throw new Error(
                "Unable to fetch faqs.json"
            );

        }


        faqData =
            await response.json();


        loading.style.display =
            "none";


        renderFAQs();


    } catch (err) {

        loading.style.display =
            "none";


        error.textContent =
            "❌ Error loading FAQ data.";


        console.error(err);

    }
}


// ==========================================
// RENDER FAQ
// ==========================================

function renderFAQs() {

    const container =
        document.getElementById(
            "faqContainer"
        );


    container.innerHTML = "";


    faqData.forEach(faq => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "faq-item";


        item.innerHTML = `
            <button
                class="faq-question"
                type="button">

                <span>
                    ${faq.question}
                </span>

                <span class="faq-icon">
                    ▼
                </span>

            </button>

            <div class="faq-answer">

                <div class="faq-answer-inner">

                    ${faq.answer}

                </div>

            </div>
        `;


        const question =
            item.querySelector(
                ".faq-question"
            );


        question.addEventListener(
            "click",
            function () {

                item.classList.toggle(
                    "active"
                );

            }
        );


        container.appendChild(
            item
        );

    });

}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadFAQs
);