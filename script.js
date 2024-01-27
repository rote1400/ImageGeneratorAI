const generateForm = document.querySelector(".generate-form");
const imgGallery = document.querySelector(".img-gallery");

const API_KEY = "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";
let isImgGenerating = false;

const updateImageCard = (imgDataArray) => {
    imgDataArray.forEach((imgObject, index) => {
       const imgCard = imgGallery.querySelectorAll(".img-card")[index];
       const imgElement = imgCard.querySelector("img");
       const downloadBtn = imgCard.querySelector(".download-btn");

       // Set the image source to the AI-generated image data
       const aiGeneratedImg = `data:image/jpeg;base64,${imgObject.b64_json}`;
       imgElement.src = aiGeneratedImg;

       // When the image is generated, remove the loading class
       imgElement.onload = () => {
        imgCard.classList.remove("loading");
        downloadBtn.setAttribute("href", aiGeneratedImg);
        downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);
       }
    });
}

const generateImagesAI = async (prompt, imgQuantity) => {
    try {
        // Send response to OpenAI API to generate images based on user prompt
        const response = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                prompt: prompt,
                n: parseInt(imgQuantity),
                size: "512x512",
                response_format: "b64_json"
            })
        });

        if (!response.ok) {
            throw new Error("Failed to generate images! Please try again.");
        }

        // Get data returned from the request
        const { data } = await response.json();
        updateImageCard([...data]);
    } catch (error) {
        alert(error.message);
    } finally {
        isImgGenerating = false;
    }
}

const handleFormSubmission = (e) => {
    e.preventDefault();

    // Prevent from sending request while images are still generating
    if (isImgGenerating) {
        return;
    } else {
        isImgGenerating = true;
    }

    // Get prompt input and image quantity from the input form
    const prompt = e.srcElement[0].value;
    const imgQuantity = e.srcElement[1].value;
    
    // Creating HTML markup for image cards with loading state
    const imgCardMarkup = Array.from({length: imgQuantity}, () => 
        `<div class="img-card loading">
            <img src="assets/loader.svg" alt="image">
            <a href="#" class="download-btn">
                <img src="assets/download.svg" alt="download">
            </a>
        </div>`
    ).join("");

    imgGallery.innerHTML = imgCardMarkup;
    generateImagesAI(prompt, imgQuantity);
}

generateForm.addEventListener("submit", handleFormSubmission);