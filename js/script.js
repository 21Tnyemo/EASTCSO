// =========================================================================
// 1. ANNOUNCEMENTS MANAGEMENT (CRUD SYSTEM WITH LOCALSTORAGE)
// =========================================================================

// Kupakia matangazo kutoka kwenye LocalStorage au kuanza na baadhi ya mifano (Mock data)
let announcements = JSON.parse(localStorage.getItem("announcements")) || [
    { title: "Wasomi League Finals", message: "Come support your class teams this Friday at the main campus sports ground. Entrance is free!" },
    { title: "General Assembly Meeting", message: "All class representatives must meet at Room 14 from 2:00 PM for the upcoming parliament agenda debate." }
];

// Kazi ya kuhifadhi data kwenye LocalStorage
function saveData() {
    localStorage.setItem("announcements", JSON.stringify(announcements));
}

// Onyesha matangazo yote kwenye ukurasa
function displayAnnouncements() {
    const list = document.getElementById("announcementList");
    
    if (!list) return; // Prevent errors if target div isn't loaded

    list.innerHTML = "";

    announcements.forEach((item, index) => {
        list.innerHTML += `
        <div class="announcement" style="background: rgba(255, 255, 255, 0.08); padding: 15px; border-radius: 8px; border-left: 4px solid #d4af37; margin-top: 15px;">
            <h4 style="color: #d4af37; font-size: 1.1rem; margin-bottom: 5px; text-transform: uppercase;">${item.title}</h4>
            <p style="color: #eee; font-size: 0.95rem; margin-bottom: 12px; line-height: 1.5;">${item.message}</p>
            
            <div class="announcement-buttons" style="display: flex; gap: 10px;">
                <button onclick="editAnnouncement(${index})" style="background: rgba(255, 255, 255, 0.2); color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">Edit</button>
                <button onclick="deleteAnnouncement(${index})" style="background: #e53e3e; color: white; border: none; padding: 4px 10px; border-radius: 4px; cursor: pointer; font-size: 0.85rem; font-weight: bold;">Delete</button>
            </div>
        </div>
        `;
    });
}

// Ongeza tangazo jipya (Create)
function addAnnouncement() {
    const titleInput = document.getElementById("title");
    const messageInput = document.getElementById("message");

    const title = titleInput.value.trim();
    const message = messageInput.value.trim();

    if (title === "" || message === "") {
        alert("Please fill in both Title and Message fields.");
        return;
    }

    announcements.push({ title, message });

    saveData();
    displayAnnouncements();

    titleInput.value = "";
    messageInput.value = "";
}

// Hariri tangazo (Update)
function editAnnouncement(index) {
    const title = prompt("Edit announcement title:", announcements[index].title);
    const message = prompt("Edit announcement message:", announcements[index].message);

    if (title !== null && message !== null) {
        if (title.trim() === "" || message.trim() === "") {
            alert("Fields cannot be empty.");
            return;
        }
        announcements[index].title = title.trim();
        announcements[index].message = message.trim();

        saveData();
        displayAnnouncements();
    }
}

// Futa tangazo (Delete)
function deleteAnnouncement(index) {
    if (confirm("Are you sure you want to delete this announcement?")) {
        announcements.splice(index, 1);
        saveData();
        displayAnnouncements();
    }
}

// =========================================================================
// 2. HERO SLIDESHOW LOGIC
// =========================================================================
let slideIndex = 0;
let slideTimeout;

function showSlides() {
    let slides = document.getElementsByClassName("slide");
    let dots = document.getElementsByClassName("dot");

    if (slides.length === 0) return; 

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slideIndex++;
    if (slideIndex > slides.length) {
        slideIndex = 1;
    }

    for (let i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }

    slides[slideIndex - 1].style.display = "block";
    if (dots.length > 0) {
        dots[slideIndex - 1].className += " active";
    }

    clearTimeout(slideTimeout);
    slideTimeout = setTimeout(showSlides, 5000); // Transitions every 5 seconds
}

function currentSlide(n) {
    slideIndex = n - 1;
    showSlides();
}

// =========================================================================
// 3. INITIALIZATION ON DOM LOAD
// =========================================================================
// 3. INITIALIZATION ON DOM LOAD & FORMSPREE SUBMISSION
// =========================================================================
document.addEventListener("DOMContentLoaded", () => {
    showSlides();
    displayAnnouncements();
    
    let dotElements = document.getElementsByClassName("dot");
    for (let i = 0; i < dotElements.length; i++) {
        dotElements[i].addEventListener("click", () => {
            currentSlide(i + 1);
        });
    }

    // Shughulikia utumaji wa fomu kwenda Formspree kwa njia ya AJAX (Bila kurefresh ukurasa)
    const contactForm = document.getElementById("contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", async function(event) {
            event.preventDefault(); // Zuia ukurasa usijirefresh
            
            const submitButton = contactForm.querySelector("button[type='submit']");
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            // Unda ujumbe wa hali ya utumaji (Status message)
            let status = contactForm.querySelector(".form-status");
            if (!status) {
                status = document.createElement("p");
                status.className = "form-status";
                status.style.fontWeight = "bold";
                status.style.marginTop = "15px";
                status.style.textAlign = "center";
                contactForm.appendChild(status);
            }

            const data = new FormData(event.target);
            try {
                const response = await fetch(event.target.action, {
                    method: contactForm.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });
                
                if (response.ok) {
                    status.style.color = "#2f855a"; // Rangi ya Kijani
                    status.innerHTML = "Thank you! Your message has been sent successfully to our email";
                    contactForm.reset(); // Safisha fomu
                } else {
                    const responseData = await response.json();
                    if (responseData.errors) {
                        status.style.color = "#e53e3e"; // Rangi ya Nyekundu
                        status.innerHTML = responseData.errors.map(error => error.message).join(", ");
                    } else {
                        status.style.color = "#e53e3e";
                        status.innerHTML = "There was an error sending your message. Please try again later.";
                    }
                }
            } catch (error) {
                status.style.color = "#e53e3e";
                status.innerHTML = "Failed to send message. Please check your internet connection and try again.";
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }
});
// HAMBURGER MENU
document.addEventListener("DOMContentLoaded", () => {
    // Slideshow & Announcements
    showSlides();
    displayAnnouncements();
    
    // Hamburger Menu Logic
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.innerHTML = navMenu.classList.contains("active") ? "✕" : "☰";
    });

    document.querySelectorAll(".nav-menu a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            menuToggle.innerHTML = "☰";
        });
    });
  
});   