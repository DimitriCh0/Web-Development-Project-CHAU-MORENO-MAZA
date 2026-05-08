document.addEventListener("DOMContentLoaded", function () {
    var newsletterForms = document.querySelectorAll(".newsletter-form, .contact-card");

    newsletterForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
        });
    });
});
