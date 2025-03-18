document.getElementById('ageForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get input values
    const birthDate = parseInt(document.getElementById('birthDate').value);
    const birthMonth = parseInt(document.getElementById('birthMonth').value);
    const birthYear = parseInt(document.getElementById('birthYear').value);
    
    // Get current date
    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth() + 1; // Adding 1 as months are zero-based
    const currentYear = today.getFullYear();
    
    // Validate input
    if (birthDate > 31 || birthMonth > 12 || birthYear > currentYear) {
        alert('Please enter valid date values');
        return;
    }
    
    // Calculate age
    let years = currentYear - birthYear;
    let months = currentMonth - birthMonth;
    let days = currentDate - birthDate;
    
    // Adjust for negative days
    if (days < 0) {
        months--;
        const lastMonth = new Date(currentYear, currentMonth - 1, 0);
        days += lastMonth.getDate();
    }
    
    // Adjust for negative months
    if (months < 0) {
        years--;
        months += 12;
    }
    
    // Display results with animation
    const yearSpan = document.getElementById('years');
    const monthSpan = document.getElementById('months');
    const daySpan = document.getElementById('days');
    
    // Animate numbers
    animateNumber(yearSpan, years);
    animateNumber(monthSpan, months);
    animateNumber(daySpan, days);
});

function animateNumber(element, final) {
    let current = 0;
    const duration = 1000; // Animation duration in milliseconds
    const steps = 50; // Number of steps in animation
    const increment = final / steps;
    const interval = duration / steps;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= final) {
            clearInterval(timer);
            element.textContent = final;
        } else {
            element.textContent = Math.floor(current);
        }
    }, interval);
} 