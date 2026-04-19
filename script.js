/**
 * Web Browser Quiz Logic
 * Handles validation, result display with detailed breakdown, and quiz reset.
 */

function checkQuiz() {
    let score = 0;
    const totalQuestions = 5;
    const minPassScore = 3;
    const results = [];

    // --- 1. Define Questions and Correct Answers ---
    const quizData = [
        {
            id: 'q1',
            text: "A web browser sends requests over the internet to a __________ to load web pages.",
            correct: "web server",
            type: "text"
        },
        {
            id: 'q2',
            text: "Which of the following is a web browser?",
            correct: "B",
            type: "radio",
            options: { A: "Windows", B: "Chrome", C: "Linux", D: "Excel" }
        },
        {
            id: 'q3',
            text: "What does a web browser do?",
            correct: "B",
            type: "radio",
            options: { A: "Creates games", B: "Displays web pages", C: "Stores files", D: "Edits videos" }
        },
        {
            id: 'q4',
            text: "Which component runs JavaScript?",
            correct: "B",
            type: "radio",
            options: { A: "Networking", B: "JavaScript Engine", C: "Data Storage", D: "User Interface" }
        },
        {
            id: 'q5',
            text: "Which are parts of a web browser? (Select all that apply)",
            correct: ["A", "B", "C"],
            type: "checkbox",
            options: { A: "User Interface", B: "Rendering Engine", C: "JavaScript Engine", D: "Operating System" }
        }
    ];

    // --- 2. Validate Answers ---
    
    // Q1 - Text
    const q1UserAns = document.getElementById('q1-blank').value.trim();
    const q1IsCorrect = q1UserAns.toLowerCase() === quizData[0].correct;
    if (q1IsCorrect) score++;
    results.push({
        question: quizData[0].text,
        userAns: q1UserAns || "(No answer)",
        correctAns: quizData[0].correct,
        isCorrect: q1IsCorrect
    });

    // Q2, Q3, Q4 - Radio
    for (let i = 1; i <= 3; i++) {
        const q = quizData[i];
        const selected = document.querySelector(`input[name="${q.id}"]:checked`);
        const userValue = selected ? selected.value : null;
        const isCorrect = userValue === q.correct;
        
        if (isCorrect) score++;
        results.push({
            question: q.text,
            userAns: userValue ? `${userValue}) ${q.options[userValue]}` : "(No selection)",
            correctAns: `${q.correct}) ${q.options[q.correct]}`,
            isCorrect: isCorrect
        });
    }

    // Q5 - Checkbox
    const q5 = quizData[4];
    const selectedBoxes = Array.from(document.querySelectorAll('input[name="q5"]:checked')).map(el => el.value);
    const isQ5Correct = selectedBoxes.length === q5.correct.length && 
                        selectedBoxes.every(val => q5.correct.includes(val));
    
    if (isQ5Correct) score++;
    
    const userAnsStr = selectedBoxes.length > 0 
        ? selectedBoxes.map(val => `${val}) ${q5.options[val]}`).join(", ") 
        : "(No selection)";
    const correctAnsStr = q5.correct.map(val => `${val}) ${q5.options[val]}`).join(", ");

    results.push({
        question: q5.text,
        userAns: userAnsStr,
        correctAns: correctAnsStr,
        isCorrect: isQ5Correct
    });

    // --- 3. Display Results in Overlay ---
    const overlay = document.getElementById('result-overlay');
    const statusDiv = document.getElementById('result-status');
    const scoreDiv = document.getElementById('score-display');
    const breakdownDiv = document.getElementById('breakdown-container');

    const passed = score >= minPassScore;

    statusDiv.textContent = passed ? "Pass" : "Fail";
    statusDiv.className = `result-status ${passed ? 'status-pass' : 'status-fail'}`;
    
    scoreDiv.innerHTML = `Total Score: <span class="${passed ? 'text-green' : 'text-red'}">${score} / ${totalQuestions}</span>`;

    // Build breakdown HTML
    let breakdownHtml = "";
    results.forEach((res, index) => {
        breakdownHtml += `
            <div class="breakdown-item ${res.isCorrect ? 'correct-bg' : 'incorrect-bg'}">
                <p class="breakdown-q-text">${index + 1}. ${res.question}</p>
                <p class="user-ans">Your Answer: <span class="${res.isCorrect ? 'text-green' : 'text-red'}">${res.userAns}</span></p>
                ${!res.isCorrect ? `<p class="correct-ans">Correct Answer: ${res.correctAns}</p>` : ''}
            </div>
        `;
    });
    breakdownDiv.innerHTML = breakdownHtml;

    // Show overlay
    overlay.style.display = 'flex';
    // Prevent scrolling on body when overlay is open
    document.body.style.overflow = 'hidden';
}

function resetQuiz() {
    // 1. Clear text input
    document.getElementById('q1-blank').value = "";

    // 2. Uncheck all radios and checkboxes
    const inputs = document.querySelectorAll('#quiz-form input[type="radio"], #quiz-form input[type="checkbox"]');
    inputs.forEach(input => input.checked = false);

    // 3. Clear result line if any
    const resultDiv = document.getElementById('quiz-result');
    if (resultDiv) {
        resultDiv.innerHTML = "";
        resultDiv.className = "";
    }

    // 4. Hide overlay
    const overlay = document.getElementById('result-overlay');
    overlay.style.display = 'none';
    
    // 5. Re-enable body scrolling
    document.body.style.overflow = 'auto';

    // 6. Scroll back to top of quiz
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
