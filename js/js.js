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
    initNavigation();
});

function initNavigation() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.querySelector(".main-nav");

    if (!toggle || !nav) {
        return;
    }

    toggle.addEventListener("click", function () {
        var isExpanded = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", !isExpanded);
        toggle.classList.toggle("is-active");
        nav.classList.toggle("is-open");
    });

    document.addEventListener("click", function (event) {
        if (nav.classList.contains("is-open") && !nav.contains(event.target) && !toggle.contains(event.target)) {
            toggle.classList.remove("is-active");
            toggle.setAttribute("aria-expanded", "false");
            nav.classList.remove("is-open");
        }
    });
}

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
            { type: "choice", question: "Which keyword declares a block-scoped variable in JavaScript?", options: ["let", "table", "echo"], answer: "let", points: 4 },
            { type: "choice", question: "What does a loop help you do?", options: ["Repeat instructions", "Delete the browser", "Change an image format"], answer: "Repeat instructions", points: 3 },
            { type: "text", question: "Explain the purpose of a function in programming.", keywords: ["reduce", "reusable", "organize", "optimize", "block", "lighten", "exploit", "facilitate"], points: 10 }
        ],
        data: [
            { type: "choice", question: "Which structure follows Last In, First Out?", options: ["Stack", "Queue", "Array"], answer: "Stack", points: 4 },
            { type: "choice", question: "Which structure stores key-value pairs?", options: ["Hash map", "For loop", "HTML tag"], answer: "Hash map", points: 3 },
            { type: "text", question: "Describe what a database is used for.", keywords: ["store", "organize", "manage", "data", "information", "retrieve"], points: 10 }
        ],
        systems: [
            { type: "choice", question: "What is the role of an operating system?", options: ["Manage hardware and software resources", "Style a web page", "Compress an image only"], answer: "Manage hardware and software resources", points: 4 },
            { type: "choice", question: "Which component executes machine instructions?", options: ["CPU", "Router cable", "CSS file"], answer: "CPU", points: 3 },
            { type: "text", question: "Explain the role of RAM in a computer.", keywords: ["memory", "temporary", "fast", "access", "volatile", "store"], points: 10 }
        ],
        ai: [
            { type: "choice", question: "What does Big O notation describe?", options: ["Algorithmic growth", "Screen brightness", "Database password length"], answer: "Algorithmic growth", points: 4 },
            { type: "choice", question: "What is training data used for?", options: ["Teaching a model patterns", "Opening a browser tab", "Naming a CSS class"], answer: "Teaching a model patterns", points: 3 },
            { type: "text", question: "Briefly explain how a neural network learns.", keywords: ["weights", "adjust", "train", "data", "patterns", "error", "optimize"], points: 10 }
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
    var attempts = 1;
    var currentCategoryName = "";

    function renderRunner() {
        var current = activeQuiz[activeIndex];
        question.textContent = current.question;
        feedback.textContent = "";
        next.hidden = true;
        
        if (current.type === "choice") {
            options.innerHTML = current.options.map(function (option) {
                return '<button type="button">' + escapeHtml(option) + '</button>';
            }).join("");
        } else if (current.type === "text") {
            options.innerHTML = '<textarea id="text-answer" rows="4" placeholder="Type your answer here..."></textarea><button type="button" class="submit-text">Submit Answer</button>';
        }
    }

    if (startButtons.length && runner && topic && question && options && feedback && next) {
        startButtons.forEach(function (button) {
            button.addEventListener("click", function () {
                if (attempts > 3) {
                    alert("You have reached the maximum number of attempts!");
                    return;
                }

                var name = document.getElementById("name").value;
                var surname = document.getElementById("surname").value;
                var birthdate = document.getElementById("birth_date").value;
                var mail = document.getElementById("mail").value;
                var status = document.getElementById("status").value;

                if (name == "" || surname == "" || birthdate == "" || mail == "" || status == "") {
                    alert("Please fill in all fields");
                    return;
                }

                var res = confirm("Are you sure you want to continue?");
                if (res == true) {
                    alert("The quiz will start in 5 seconds!");
                    
                    var timer = 5;
                    var countdownDisplay = document.getElementById("countdown-display");
                    countdownDisplay.textContent = timer + " seconds";
                    countdownDisplay.style.color = "red";
                    countdownDisplay.style.fontSize = "1.5em";
                    countdownDisplay.style.fontWeight = "bold";
                    countdownDisplay.style.textAlign = "center";

                    var interval = setInterval(function () {
                        timer--;
                        console.log(timer);
                        countdownDisplay.textContent = timer + " seconds";

                        if (timer == 0) {
                            clearInterval(interval);
                            countdownDisplay.textContent = "Here we go! Good luck!";
                            
                            var card = button.closest(".quiz-category-card");
                            var key = card.dataset.quizCard;
                            currentCategoryName = card.querySelector("h3").textContent;
                            
                            activeQuiz = quizData[key];
                            activeIndex = 0;
                            score = 0;
                            topic.textContent = currentCategoryName;
                            
                            runner.hidden = false;
                            renderRunner();
                            runner.scrollIntoView({ behavior: "smooth", block: "center" });
                        }
                    }, 1000);
                } else {
                    alert("You will be redirected to the home page!");
                    window.location.href = "./home.html";
                }
            });
        });

        options.addEventListener("click", function (event) {
            var current = activeQuiz[activeIndex];
            
            if (current.type === "choice") {
                var button = event.target.closest("button");
                if (!button || button.classList.contains("is-correct") || button.classList.contains("is-wrong") || button.classList.contains("submit-text")) {
                    return;
                }

                var buttons = options.querySelectorAll("button");
                buttons.forEach(function (item) {
                    item.disabled = true;
                    if (item.textContent === current.answer) {
                        item.classList.add("is-correct");
                    }
                });

                if (button.textContent === current.answer) {
                    score += current.points;
                    feedback.textContent = "Correct!";
                    feedback.className = "quiz-runner-feedback is-success";
                } else {
                    button.classList.add("is-wrong");
                    feedback.textContent = "Not quite. The correct answer is highlighted.";
                    feedback.className = "quiz-runner-feedback is-error";
                }

                next.hidden = false;
                next.textContent = activeIndex === activeQuiz.length - 1 ? "See score" : "Next question";
            
            } else if (current.type === "text") {
                var submitBtn = event.target.closest(".submit-text");
                if (!submitBtn) {
                    return;
                }

                var textarea = document.getElementById("text-answer");
                var textValue = textarea.value.toLowerCase();
                
                var isCorrect = current.keywords.some(function(kw) {
                    return textValue.includes(kw);
                });

                if (isCorrect) {
                    score += current.points;
                    feedback.textContent = "Great answer!";
                    feedback.className = "quiz-runner-feedback is-success";
                } else {
                    feedback.textContent = "Answer submitted.";
                    feedback.className = "quiz-runner-feedback";
                }

                textarea.disabled = true;
                submitBtn.disabled = true;
                next.hidden = false;
                next.textContent = activeIndex === activeQuiz.length - 1 ? "See score" : "Next question";
            }
        });

        next.addEventListener("click", function () {
            activeIndex += 1;
            if (activeIndex >= activeQuiz.length) {
                var tbody = document.querySelector("#result tbody");
                var tr = document.createElement("tr");
                
                var td1 = document.createElement("td");
                td1.textContent = attempts;
                tr.appendChild(td1);
                
                var td2 = document.createElement("td");
                td2.textContent = currentCategoryName;
                tr.appendChild(td2);
                
                var td3 = document.createElement("td");
                td3.textContent = score;
                tr.appendChild(td3);
                
                tbody.appendChild(tr);

                attempts++;
                document.getElementById("quiz-reg-form").reset();
                document.getElementById("countdown-display").textContent = "";
                
                runner.hidden = true;
                document.querySelector(".quiz-results").scrollIntoView({ behavior: "smooth", block: "center" });
                return;
            }
            renderRunner();
        });
    }
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
