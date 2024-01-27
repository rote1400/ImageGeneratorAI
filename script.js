const generateForm = document.querySelector(".generate-form");
const imgGallery = document.querySelector(".img-gallery");

const handleFormSubmission = (e) => {
    e.preventDefault();

    // Get prompt input and image quantity from the input form
    const prompt = e.srcElement[0].value;
    const imgQuantity = e.srcElement[1].value;
    
    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: imgQuantity}, () => 
        `<div class="img-card loadin">
            <img src="assets/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="assets/download.svg" alt="download">
            </a>
        </div>`
    ).join("");

    imgGallery.innerHTML = imgCardMarkup;
}

generateForm.addEventListener("submit", handleFormSubmission);