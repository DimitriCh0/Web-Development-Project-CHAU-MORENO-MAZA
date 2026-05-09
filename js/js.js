document.addEventListener("DOMContentLoaded", function () {
    var simpleForms = document.querySelectorAll(".newsletter-form");

    simpleForms.forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            if (form.classList.contains("newsletter-form")) {
                showNewsletterModal();
                form.reset();
            }
        });
    });

    initQuiz();
    initPlanning();
    initCourseAccessModal();
});

function initCourseAccessModal() {
    var links = document.querySelectorAll(".course-link");
    var modal = document.querySelector(".course-access-modal");
    var closeButton = document.querySelector(".course-access-close");

    if (!links.length || !modal || !closeButton) {
        return;
    }

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            modal.classList.add("is-visible");
        });
    });

    closeButton.addEventListener("click", function () {
        modal.classList.remove("is-visible");
    });

    modal.addEventListener("click", function (event) {
        if (event.target === modal) {
            modal.classList.remove("is-visible");
        }
    });
}

function showNewsletterModal() {
    var modal = document.querySelector(".newsletter-modal");
    var closeButton = document.querySelector(".newsletter-modal-close");

    if (!modal || !closeButton) {
        return;
    }

    modal.classList.add("is-visible");
    closeButton.addEventListener("click", function () {
        modal.classList.remove("is-visible");
    }, { once: true });
}

function initQuiz() {
    var quizData = {
        programming: [
            {
                question: "Which keyword declares a block-scoped variable in JavaScript?",
                options: ["let", "table", "echo"],
                answer: "let"
            },
            {
                question: "What does a loop help you do?",
                options: ["Repeat instructions", "Delete the browser", "Change an image format"],
                answer: "Repeat instructions"
            }
        ],
        data: [
            {
                question: "Which structure follows Last In, First Out?",
                options: ["Stack", "Queue", "Array"],
                answer: "Stack"
            },
            {
                question: "Which structure stores key-value pairs?",
                options: ["Hash map", "For loop", "HTML tag"],
                answer: "Hash map"
            }
        ],
        systems: [
            {
                question: "What is the role of an operating system?",
                options: ["Manage hardware and software resources", "Style a web page", "Compress an image only"],
                answer: "Manage hardware and software resources"
            },
            {
                question: "Which component executes machine instructions?",
                options: ["CPU", "Router cable", "CSS file"],
                answer: "CPU"
            }
        ],
        ai: [
            {
                question: "What does Big O notation describe?",
                options: ["Algorithmic growth", "Screen brightness", "Database password length"],
                answer: "Algorithmic growth"
            },
            {
                question: "What is training data used for?",
                options: ["Teaching a model patterns", "Opening a browser tab", "Naming a CSS class"],
                answer: "Teaching a model patterns"
            }
        ]
    };
    var startButtons = document.querySelectorAll(".quiz-category-card .start-quiz");
    var runner = document.querySelector(".quiz-runner");
    var topic = document.querySelector(".quiz-runner-topic");
    var question = document.querySelector(".quiz-runner-question");
    var options = document.querySelector(".quiz-runner-options");
    var feedback = document.querySelector(".quiz-runner-feedback");
    var next = document.querySelector(".quiz-next");
    var activeQuiz = [];
    var activeIndex = 0;
    var score = 0;

    function renderRunner() {
        var current = activeQuiz[activeIndex];
        question.textContent = current.question;
        feedback.textContent = "";
        next.hidden = true;
        options.innerHTML = current.options.map(function (option) {
            return '<button type="button">' + escapeHtml(option) + '</button>';
        }).join("");
    }

    if (startButtons.length && runner && topic && question && options && feedback && next) {
        startButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                var card = button.closest(".quiz-category-card");
                var key = card.dataset.quizCard;
                activeQuiz = quizData[key];
                activeIndex = 0;
                score = 0;
                topic.textContent = card.querySelector("h3").textContent;
                runner.hidden = false;
                renderRunner();
                runner.scrollIntoView({ behavior: "smooth", block: "center" });
            });
        });

        options.addEventListener("click", function (event) {
            var button = event.target.closest("button");
            if (!button || button.classList.contains("is-correct") || button.classList.contains("is-wrong")) {
                return;
            }

            var current = activeQuiz[activeIndex];
            var buttons = options.querySelectorAll("button");
            buttons.forEach(function (item) {
                item.disabled = true;
                if (item.textContent === current.answer) {
                    item.classList.add("is-correct");
                }
            });

            if (button.textContent === current.answer) {
                score += 1;
                feedback.textContent = "Correct!";
            } else {
                button.classList.add("is-wrong");
                feedback.textContent = "Not quite. The correct answer is highlighted.";
            }

            next.hidden = false;
            next.textContent = activeIndex === activeQuiz.length - 1 ? "See score" : "Next question";
        });

        next.addEventListener("click", function () {
            activeIndex += 1;
            if (activeIndex >= activeQuiz.length) {
                question.textContent = "Quiz complete";
                options.innerHTML = "";
                feedback.textContent = "Your score: " + score + " / " + activeQuiz.length + ".";
                next.hidden = true;
                return;
            }
            renderRunner();
        });
    }

    var quizCards = document.querySelectorAll(".quiz-card");

    quizCards.forEach(function (card) {
        var buttons = card.querySelectorAll(".quiz-options button");
        var feedback = card.querySelector(".quiz-feedback");

        buttons.forEach(function (button) {
            button.addEventListener("click", function () {
                buttons.forEach(function (item) {
                    item.classList.remove("is-correct", "is-wrong");
                });

                if (button.dataset.correct === "true") {
                    button.classList.add("is-correct");
                    feedback.textContent = "Correct! Nice work.";
                    feedback.className = "quiz-feedback is-success";
                } else {
                    button.classList.add("is-wrong");
                    feedback.textContent = "Not quite. Try another answer.";
                    feedback.className = "quiz-feedback is-error";
                }
            });
        });
    });
}

function initPlanning() {
    var board = document.querySelector(".planning-board");

    if (!board) {
        return;
    }

    var selectedSlot = null;
    var registrations = {};
    var form = board.querySelector(".planning-form");
    var slots = board.querySelectorAll(".planning-slot");
    var modal = document.querySelector(".planning-modal");
    var modalClose = document.querySelector(".planning-modal-close");

    slots.forEach(function (slot) {
        registrations[slot.dataset.slot] = [];

        slot.querySelector(".choose-slot").addEventListener("click", function () {
            selectedSlot = slot.dataset.slot;
            slots.forEach(function (item) {
                item.classList.toggle("is-selected", item === slot);
            });
            var slotName = slot.querySelector("h3") || slot.querySelector("span");
            showToast("Selected: " + slotName.textContent + ".");
        });
    });

    if (modal && modalClose) {
        modal.classList.add("is-visible");
        modalClose.addEventListener("click", function () {
            modal.classList.remove("is-visible");
        });
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        var firstName = form.elements.firstName.value.trim();
        var lastName = form.elements.lastName.value.trim();

        if (!firstName || !lastName) {
            showToast("Please enter both first name and last name.", "error");
            return;
        }

        if (!selectedSlot) {
            showToast("Choose a support session before registering.", "error");
            return;
        }

        var normalizedName = (firstName + " " + lastName).toLowerCase();
        var alreadyRegistered = Object.keys(registrations).some(function (slotKey) {
            return registrations[slotKey].some(function (student) {
                return student.normalizedName === normalizedName;
            });
        });

        if (alreadyRegistered) {
            showToast("This student is already registered.", "error");
            return;
        }

        registrations[selectedSlot].push({
            firstName: firstName,
            lastName: lastName,
            normalizedName: normalizedName
        });

        form.reset();
        renderPlanning(registrations);
        showToast(firstName + " " + lastName + " has been registered.");
    });

    board.addEventListener("click", function (event) {
        var removeButton = event.target.closest(".remove-registration");

        if (!removeButton) {
            return;
        }

        var slotKey = removeButton.dataset.slot;
        var index = Number(removeButton.dataset.index);
        var removed = registrations[slotKey].splice(index, 1)[0];

        renderPlanning(registrations);
        showToast(removed.firstName + " " + removed.lastName + " has been removed.");
    });

    renderPlanning(registrations);
}

function renderPlanning(registrations) {
    Object.keys(registrations).forEach(function (slotKey) {
        var slot = document.querySelector('[data-slot="' + slotKey + '"]');
        var list = slot.querySelector(".slot-list");
        var students = registrations[slotKey];

        if (students.length === 0) {
            list.innerHTML = '<p class="empty-slot">No registration yet.</p>';
            return;
        }

        list.innerHTML = students.map(function (student, index) {
            return '<div class="registered-student"><span>' +
                escapeHtml(student.firstName + " " + student.lastName) +
                '</span><button type="button" class="remove-registration" data-slot="' +
                slotKey + '" data-index="' + index + '">Unregister</button></div>';
        }).join("");
    });
}

function showToast(message, type) {
    var region = document.querySelector(".toast-region");

    if (!region) {
        return;
    }

    var toast = document.createElement("div");
    toast.className = "toast-message" + (type === "error" ? " is-error" : "");
    toast.textContent = message;
    region.appendChild(toast);

    window.setTimeout(function () {
        toast.classList.add("is-hiding");
    }, 2600);

    window.setTimeout(function () {
        toast.remove();
    }, 3200);
}

function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}
