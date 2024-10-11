// Helper function to format date as dd-mm-yyyy
function formatDate(date) {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  // Initialize variables
  let startDate = localStorage.getItem('startDate') ? new Date(localStorage.getItem('startDate')) : null;
  let currentDate = startDate ? new Date(startDate) : new Date(); // If no start date, default to today
  let budget = localStorage.getItem('budget') ? Number(localStorage.getItem('budget')) : 150;
  const maxBudget = 150;  // Fixed daily budget
  const historyList = document.getElementById('history');
  
  // Load history from localStorage if available
  const savedHistory = localStorage.getItem('history') ? JSON.parse(localStorage.getItem('history')) : [];
  savedHistory.forEach(item => {
    const historyItem = document.createElement('li');
    historyItem.textContent = item;
    historyList.appendChild(historyItem);
  });
  
  // Ask for salary date if not already set
  if (!startDate) {
    startDate = new Date(prompt("Enter the date you received your salary (format: yyyy-mm-dd):"));
    localStorage.setItem('startDate', startDate);
    currentDate = new Date(startDate);
  }
  
  // Update UI on page load
  document.getElementById('current-day').textContent = formatDate(currentDate);
  document.getElementById('budget').textContent = budget;
  
  document.getElementById('expense-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const expense = Number(document.getElementById('expense').value);
    const formattedDate = formatDate(currentDate);
    
    let remaining = budget - expense;
    
    // Update budget for next day
    if (remaining < 0) {
      budget = maxBudget + remaining; // Adjust next day's budget based on overspend
    } else {
      budget = maxBudget + remaining; // Carry forward the remaining amount
    }
    
    // Log today's expense and updated budget
    const historyItemText = `${formattedDate}: Spent ₹${expense}, Next Day Budget: ₹${budget}`;
    const historyItem = document.createElement('li');
    historyItem.textContent = historyItemText;
    historyList.appendChild(historyItem);
    
    // Save data in localStorage
    savedHistory.push(historyItemText);
    localStorage.setItem('history', JSON.stringify(savedHistory));
    localStorage.setItem('budget', budget);
    
    // Update current date to next day
    currentDate.setDate(currentDate.getDate() + 1);
    document.getElementById('current-day').textContent = formatDate(currentDate);
    document.getElementById('budget').textContent = budget;
    document.getElementById('expense').value = '';
    
    // Stop after 30 days
    const dayDifference = Math.floor((currentDate - startDate) / (1000 * 60 * 60 * 24));
    if (dayDifference >= 30) {
      alert("You've completed 30 days of tracking!");
      document.getElementById('expense-form').reset();
      document.getElementById('expense-form').style.display = 'none';
    }
  });
  