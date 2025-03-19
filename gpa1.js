 // Function to add a new subject row with marks input
function addSubject() {
    const subjectTable = document.getElementById("subjectTable");

    // Create a new row with input fields for subject, marks, and credits
    const newRow = document.createElement("tr");

    newRow.innerHTML = `
        <td><input type="text" name="subject" placeholder="Subject"></td>
        <td><input type="number" name="marks" placeholder="Marks" min="0" max="100" oninput="updateGradeAndCredits(this)"></td>
        <td><input type="number" name="credits" placeholder="Credits" min="0" readonly></td>
        <td><span class="gradeOutput">Grade: </span></td>
        <td><button onclick="removeSubject(this)">Remove</button></td>
    `;
    
    // Append the new row to the subject table
    subjectTable.appendChild(newRow);
}

// Function to remove a subject row
function removeSubject(button) {
    const row = button.parentElement.parentElement;
    row.remove();
    calculateCGPA(); // Recalculate CGPA after a row is removed
}

// Function to convert marks to grade
function marksToGrade(marks) {
    if (marks >= 90) return "S";
    if (marks >= 80) return "A";
    if (marks >= 70) return "B";
    if (marks >= 60) return "C";
    if (marks >= 50) return "D";
    return "F"; // Failure grade
}

// Function to update the grade and credits dynamically when marks are input
function updateGradeAndCredits(inputElement) {
    const marks = parseFloat(inputElement.value);
    const grade = marksToGrade(marks);
    const row = inputElement.closest('tr');
    const creditsCell = row.querySelector('input[name="credits"]');
    const gradeOutput = row.querySelector('.gradeOutput');

    // Set grade text
    gradeOutput.textContent = `Grade: ${grade}`;

    // Assign credits based on the grade
    if (grade === "F") {
        creditsCell.value = 0; // Failed subject gets 0 credits
    } else {
        creditsCell.value = 3; // Passed subject gets 3 credits
    }

    // Recalculate CGPA whenever marks or credits are changed
    calculateCGPA();
}

// Function to calculate CGPA
function calculateCGPA() {
    const rows = document.querySelectorAll("#subjectTable tr");
    let totalCredits = 0;
    let totalGradePoints = 0;

    // Grade points based on the grade
    const gradePoints = {
        "S": 10.0,
        "A": 9.0,
        "B": 8.0,
        "C": 7.0,
        "D": 6.0,
        "F": 0.0 // Failed subjects have 0 grade points
    };

    let validInput = true;
    let errorMessage = '';

    // Loop through each row and calculate total grade points and credits
    rows.forEach(row => {
        const marks = parseFloat(row.querySelector('input[name="marks"]').value);
        const credits = parseFloat(row.querySelector('input[name="credits"]').value);
        
        // Validate marks and credits
        if (isNaN(marks) || marks < 0 || marks > 100) {
            validInput = false;
            errorMessage += `Invalid marks: ${marks}. Marks must be between 0 and 100.\n`;
        }
        if (isNaN(credits) || credits < 0) {
            validInput = false;
            errorMessage += `Invalid credits: ${credits}. Credits must be a positive number.\n`;
        }

        // Convert marks to grade
        const grade = marksToGrade(marks);
        // Calculate grade points based on grade
        totalCredits += credits;
        totalGradePoints += gradePoints[grade] * credits;
    });

    // If there's invalid input, show an error message
    if (!validInput) {
        alert(errorMessage); // Display error message to user
        document.getElementById("cgpaResult").textContent = "0.00"; // Reset CGPA result
        return; // Exit the function if there's an error
    }

    // Calculate CGPA and update the result
    if (totalCredits > 0) {
        const cgpa = (totalGradePoints / totalCredits).toFixed(2);
        document.getElementById("cgpaResult").textContent = cgpa;
    } else {
        document.getElementById("cgpaResult").textContent = "0.00";
    }
}
