/**
 * WiserCycle - Menstrual Cycle Tracking Application
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeCycleTracker();
    initializeCalendar();
    initializeSymptomTracker();
    initializeNotifications();
});

/**
 * Mobile Navigation Menu Toggle
 */
function initializeNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Setup dropdown menus
    const dropdowns = document.querySelectorAll('.group');
    dropdowns.forEach(dropdown => {
        const dropdownMenu = dropdown.querySelector('.group-hover\\:block');
        if (dropdownMenu) {
            dropdown.addEventListener('mouseenter', () => {
                dropdownMenu.classList.remove('hidden');
            });
            dropdown.addEventListener('mouseleave', () => {
                dropdownMenu.classList.add('hidden');
            });
        }
    });
}

/**
 * Cycle Tracking Core Functionality
 */
function initializeCycleTracker() {
    // Mock data - in a real app, this would come from an API or database
    const userData = {
        lastPeriod: new Date(2025, 2, 1), // March 1, 2025
        cycleLength: 28,
        periodLength: 5,
        averageCycleLength: 29,
        cycleHistory: [
            { startDate: new Date(2025, 0, 3), endDate: new Date(2025, 0, 7) },
            { startDate: new Date(2025, 1, 1), endDate: new Date(2025, 1, 6) },
            { startDate: new Date(2025, 2, 1), endDate: new Date(2025, 2, 5) }
        ],
        symptoms: {
            '2025-03-01': ['cramps', 'fatigue', 'headache'],
            '2025-03-02': ['cramps', 'bloating'],
            '2025-03-14': ['spotting', 'mood swings'],
            '2025-03-15': ['tender breasts', 'acne']
        }
    };

    // Calculate important dates
    const cycleData = calculateCycleData(userData);
    
    // Display cycle information if we have a container for it
    displayCycleInfo(cycleData);
    
    // Setup any tracking UI elements
    setupTrackerUI();
}

/**
 * Calculate menstrual cycle data and predictions
 */
function calculateCycleData(userData) {
    const lastPeriod = userData.lastPeriod;
    const cycleLength = userData.cycleLength;
    
    // Calculate next period start
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + cycleLength);
    
    // Calculate fertility window (typically 5 days before ovulation to 1 day after)
    const ovulationDay = new Date(lastPeriod);
    ovulationDay.setDate(lastPeriod.getDate() + Math.floor(cycleLength / 2) - 14);
    
    const fertilityStart = new Date(ovulationDay);
    fertilityStart.setDate(ovulationDay.getDate() - 5);
    
    const fertilityEnd = new Date(ovulationDay);
    fertilityEnd.setDate(ovulationDay.getDate() + 1);
    
    // Calculate current cycle day
    const today = new Date();
    const cycleDay = Math.floor((today - lastPeriod) / (1000 * 60 * 60 * 24)) + 1;
    
    // Calculate period end date
    const periodEnd = new Date(lastPeriod);
    periodEnd.setDate(lastPeriod.getDate() + userData.periodLength - 1);
    
    return {
        lastPeriod,
        nextPeriod,
        cycleLength,
        cycleDay,
        ovulationDay,
        fertilityStart,
        fertilityEnd,
        periodEnd,
        isOnPeriod: today >= lastPeriod && today <= periodEnd,
        isFertile: today >= fertilityStart && today <= fertilityEnd,
        isOvulation: today.toDateString() === ovulationDay.toDateString(),
        daysUntilNextPeriod: Math.floor((nextPeriod - today) / (1000 * 60 * 60 * 24))
    };
}

/**
 * Display cycle information in the UI
 */
function displayCycleInfo(cycleData) {
    // Find containers for displaying cycle data
    const cycleInfoContainer = document.querySelector('.cycle-info');
    const cycleStatusContainer = document.querySelector('.cycle-status');
    const cyclePredictionContainer = document.querySelector('.cycle-predictions');
    
    if (cycleInfoContainer) {
        cycleInfoContainer.innerHTML = `
            <p>Last period: ${formatDate(cycleData.lastPeriod)}</p>
            <p>Next period: ${formatDate(cycleData.nextPeriod)}</p>
            <p>Cycle length: ${cycleData.cycleLength} days</p>
            <p>Current cycle day: ${cycleData.cycleDay}</p>
        `;
    }
    
    if (cycleStatusContainer) {
        let statusMessage = '';
        let statusClass = '';
        
        if (cycleData.isOnPeriod) {
            statusMessage = 'You are on your period';
            statusClass = 'bg-pink-100 text-pink-800';
        } else if (cycleData.isOvulation) {
            statusMessage = 'Today is your ovulation day';
            statusClass = 'bg-purple-100 text-purple-800';
        } else if (cycleData.isFertile) {
            statusMessage = 'You are in your fertility window';
            statusClass = 'bg-indigo-100 text-indigo-800';
        } else {
            statusMessage = 'Regular cycle day';
            statusClass = 'bg-blue-100 text-blue-800';
        }
        
        cycleStatusContainer.innerHTML = `
            <div class="p-3 rounded-lg ${statusClass}">
                <p class="font-medium">${statusMessage}</p>
            </div>
        `;
    }
    
    if (cyclePredictionContainer) {
        cyclePredictionContainer.innerHTML = `
            <p class="font-medium">Period Predictions:</p>
            <p>Next period in ${cycleData.daysUntilNextPeriod} days</p>
            <p>Ovulation day: ${formatDate(cycleData.ovulationDay)}</p>
            <p>Fertility window: ${formatDate(cycleData.fertilityStart)} - ${formatDate(cycleData.fertilityEnd)}</p>
        `;
    }
}

/**
 * Setup interactive UI elements for the cycle tracker
 */
function setupTrackerUI() {
    // Setup "Log Period" button if it exists
    const logPeriodBtn = document.querySelector('.log-period-btn');
    if (logPeriodBtn) {
        logPeriodBtn.addEventListener('click', function() {
            // In a real app, this would open a modal or form
            alert('Period logging functionality would open here');
            // logPeriodStart(new Date());
        });
    }
    
    // Setup symptom logging buttons if they exist
    const symptomBtns = document.querySelectorAll('.symptom-tag');
    symptomBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            const symptom = this.dataset.symptom;
            // logSymptom(symptom, new Date());
        });
    });
}

/**
 * Calendar functionality
 */
function initializeCalendar() {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;
    
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Render initial calendar
    renderCalendar(currentMonth, currentYear);
    
    // Setup month navigation
    const prevMonthBtn = document.querySelector('.prev-month-btn');
    const nextMonthBtn = document.querySelector('.next-month-btn');
    
    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', function() {
            const currentMonthDisplay = document.querySelector('.current-month');
            const [month, year] = currentMonthDisplay.dataset.current.split('-');
            let newMonth = parseInt(month) - 1;
            let newYear = parseInt(year);
            
            if (newMonth < 0) {
                newMonth = 11;
                newYear--;
            }
            
            renderCalendar(newMonth, newYear);
        });
    }
    
    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', function() {
            const currentMonthDisplay = document.querySelector('.current-month');
            const [month, year] = currentMonthDisplay.dataset.current.split('-');
            let newMonth = parseInt(month) + 1;
            let newYear = parseInt(year);
            
            if (newMonth > 11) {
                newMonth = 0;
                newYear++;
            }
            
            renderCalendar(newMonth, newYear);
        });
    }
}

/**
 * Render calendar for specific month and year
 */
function renderCalendar(month, year) {
    const calendarContainer = document.querySelector('.calendar-container');
    if (!calendarContainer) return;
    
    const today = new Date();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay(); // 0 = Sunday, 6 = Saturday
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                        'July', 'August', 'September', 'October', 'November', 'December'];
    
    // Update header
    const calendarHeader = calendarContainer.querySelector('.calendar-header') || 
                           document.createElement('div');
    calendarHeader.className = 'calendar-header';
    calendarHeader.innerHTML = `
        <button class="prev-month-btn">←</button>
        <h3 class="current-month" data-current="${month}-${year}">${monthNames[month]} ${year}</h3>
        <button class="next-month-btn">→</button>
    `;
    
    if (!calendarContainer.querySelector('.calendar-header')) {
        calendarContainer.appendChild(calendarHeader);
    }
    
    // Create/update grid for days
    let calendarGrid = calendarContainer.querySelector('.calendar-grid');
    if (!calendarGrid) {
        calendarGrid = document.createElement('div');
        calendarGrid.className = 'calendar-grid';
        calendarContainer.appendChild(calendarGrid);
    }
    
    // Clear existing grid
    calendarGrid.innerHTML = '';
    
    // Add day headers
    const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'font-medium text-sm text-center py-2 bg-gray-100';
        dayHeader.textContent = day;
        calendarGrid.appendChild(dayHeader);
    });
    
    // Add blank cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
        const blankDay = document.createElement('div');
        blankDay.className = 'calendar-day text-gray-300';
        calendarGrid.appendChild(blankDay);
    }
    
    // Mock period data - in a real app, this would come from user data
    // Let's assume periods for this month are from 5th to 9th
    const periodDays = [5, 6, 7, 8, 9];
    // And ovulation is on the 19th
    const ovulationDay = 19;
    // And fertile window is 14th to 20th
    const fertileDays = [14, 15, 16, 17, 18, 19, 20];
    
    // Add actual days of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement('div');
        
        // Determine if this day has special status
        let dayClass = 'calendar-day';
        
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayClass += ' today';
        }
        
        if (periodDays.includes(day)) {
            dayClass += ' period';
        } else if (day === ovulationDay) {
            dayClass += ' ovulation';
        } else if (fertileDays.includes(day)) {
            dayClass += ' fertile';
        }
        
        dayCell.className = dayClass;
        dayCell.textContent = day;
        
        // Add click handler to log events for this day
        dayCell.addEventListener('click', function() {
            const selectedDate = new Date(year, month, day);
            showDayDetailsModal(selectedDate);
        });
        
        calendarGrid.appendChild(dayCell);
    }
}

/**
 * Show modal with details for selected day
 */
function showDayDetailsModal(date) {
    // In a real app, this would show a modal with details and logging options
    alert(`Selected date: ${formatDate(date)}\nYou would see options to log period, symptoms, etc.`);
}

/**
 * Symptom Tracking Functionality
 */
function initializeSymptomTracker() {
    // Mock data visualization - in a real app, this would use actual user data
    const symptomContainer = document.querySelector('.symptom-heatmap');
    if (!symptomContainer) return;
    
    // Sample symptoms and their frequency over last 3 months
    const symptomsData = {
        'cramps': 15,
        'headache': 12,
        'bloating': 18,
        'fatigue': 22,
        'mood swings': 19,
        'acne': 8,
        'tender breasts': 14,
        'backache': 11,
        'nausea': 5,
        'spotting': 7
    };
    
    // Create heatmap visualization
    const heatmapContainer = document.createElement('div');
    heatmapContainer.className = 'heatmap-container mt-4';
    
    // Create a cell for each symptom
    Object.entries(symptomsData).forEach(([symptom, count]) => {
        const cell = document.createElement('div');
        
        // Determine intensity level (1-5) based on count
        const level = Math.min(5, Math.ceil(count / 5));
        
        cell.className = `heatmap-cell heatmap-level-${level} tooltip`;
        
        // Add tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltip-text';
        tooltip.textContent = `${symptom}: ${count} days`;
        
        cell.appendChild(tooltip);
        heatmapContainer.appendChild(cell);
    });
    
    symptomContainer.appendChild(heatmapContainer);
}

/**
 * Notification System
 */
function initializeNotifications() {
    // Mock notifications - in a real app, these would be fetched from a server
    const notifications = [
        { type: 'period', message: 'Your period is predicted to start in 3 days', date: new Date() },
        { type: 'fertility', message: 'Your fertility window begins tomorrow', date: new Date(Date.now() - 86400000) },
        { type: 'tip', message: 'Track your symptoms daily for more accurate predictions', date: new Date(Date.now() - 172800000) }
    ];
    
    // Update notification badge count
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.textContent = notifications.length;
    }
    
    // Setup notification dropdown if it exists
    const notificationButton = document.querySelector('.notification-button');
    const notificationDropdown = document.querySelector('.notification-dropdown');
    
    if (notificationButton && notificationDropdown) {
        notificationButton.addEventListener('click', function() {
            notificationDropdown.classList.toggle('hidden');
            
            // Populate notifications
            if (!notificationDropdown.classList.contains('hidden')) {
                // Clear existing notifications
                notificationDropdown.innerHTML = '';
                
                if (notifications.length === 0) {
                    const emptyMsg = document.createElement('div');
                    emptyMsg.className = 'p-4 text-center text-gray-500';
                    emptyMsg.textContent = 'No new notifications';
                    notificationDropdown.appendChild(emptyMsg);
                } else {
                    // Add each notification
                    notifications.forEach(notification => {
                        const notificationEl = document.createElement('div');
                        notificationEl.className = 'p-3 border-b hover:bg-gray-50 cursor-pointer';
                        
                        const typeColor = notification.type === 'period' ? 'pink' :
                                         notification.type === 'fertility' ? 'purple' : 'blue';
                        
                        notificationEl.innerHTML = `
                            <div class="flex items-start">
                                <div class="w-2 h-2 rounded-full bg