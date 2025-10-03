// Global variables
let map;
let performanceChart;
let isOptimizationRunning = false;
let optimizationTimeout;

// Optimization configuration from data
const optimizationSteps = [
    {
        step: 1,
        name: "Initializing GNN Predictor",
        description: "Analyzing supply network graph structure...",
        duration: 800,
        progress: 20
    },
    {
        step: 2,
        name: "Generating GA Solutions", 
        description: "Creating diverse population of feasible schedules...",
        duration: 1000,
        progress: 40
    },
    {
        step: 3,
        name: "Running ALNS Optimization",
        description: "Intelligently refining routes and schedules...",
        duration: 1500,
        progress: 70
    },
    {
        step: 4,
        name: "Applying Tabu Refinement",
        description: "Fine-tuning for globally optimal solution...",
        duration: 800,
        progress: 90
    },
    {
        step: 5,
        name: "Optimization Complete",
        description: "Generating results and explanations...",
        duration: 400,
        progress: 100
    }
];

const resultData = {
    before: {
        totalCost: 2500000,
        totalTime: 168,
        co2Emissions: 1250,
        demurragePenalties: 340000,
        efficiency: 72
    },
    after: {
        totalCost: 1750000,
        totalTime: 142,
        co2Emissions: 1025,
        demurragePenalties: 85000,
        efficiency: 94
    }
};

// Initialize application when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Synapse Logistics Engine - Initializing...');
    
    initializeMap();
    initializeChart();
    setupEventListeners();
    animateStats();
    
    console.log('✅ Dashboard ready - All systems operational');
});

// Initialize interactive map
function initializeMap() {
    try {
        // Initialize map centered on Eastern India
        map = L.map('logistics-map').setView([22.5726, 88.3639], 7);
        
        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
        
        // Add sample ports and plants
        const ports = [
            { name: "Kolkata Port", lat: 22.5726, lng: 88.3639, type: "port" },
            { name: "Paradip Port", lat: 20.2648, lng: 86.6250, type: "port" },
            { name: "Visakhapatnam Port", lat: 17.6868, lng: 83.2185, type: "port" }
        ];
        
        const plants = [
            { name: "Steel Plant A", lat: 22.7868, lng: 86.1547, type: "plant" },
            { name: "Steel Plant B", lat: 21.2514, lng: 81.6296, type: "plant" },
            { name: "Steel Plant C", lat: 23.3441, lng: 85.3096, type: "plant" }
        ];
        
        // Add markers for ports (blue)
        ports.forEach(location => {
            L.marker([location.lat, location.lng])
                .bindPopup(`<strong>${location.name}</strong><br>Type: Port`)
                .addTo(map);
        });
        
        // Add markers for plants (red)
        plants.forEach(location => {
            L.marker([location.lat, location.lng])
                .bindPopup(`<strong>${location.name}</strong><br>Type: Manufacturing Plant`)
                .addTo(map);
        });
        
        // Add sample route lines
        const routes = [
            [[22.5726, 88.3639], [22.7868, 86.1547]],
            [[20.2648, 86.6250], [21.2514, 81.6296]],
            [[17.6868, 83.2185], [23.3441, 85.3096]]
        ];
        
        routes.forEach(route => {
            L.polyline(route, { color: '#1FB8CD', weight: 3 }).addTo(map);
        });
        
    } catch (error) {
        console.warn('Map initialization failed:', error);
        document.getElementById('logistics-map').innerHTML = 
            '<div style="display: flex; align-items: center; justify-content: center; height: 100%; color: var(--color-text-secondary);">Map loading...</div>';
    }
}

// Initialize performance chart
function initializeChart() {
    try {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        performanceChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
                datasets: [
                    {
                        label: 'Cost Efficiency (%)',
                        data: [72, 75, 78, 82, 85, 88, 94],
                        borderColor: '#1FB8CD',
                        backgroundColor: 'rgba(31, 184, 205, 0.1)',
                        fill: true,
                        tension: 0.4
                    },
                    {
                        label: 'On-Time Delivery (%)',
                        data: [78, 81, 83, 87, 90, 92, 95],
                        borderColor: '#FFC185',
                        backgroundColor: 'rgba(255, 193, 133, 0.1)',
                        fill: true,
                        tension: 0.4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100
                    }
                }
            }
        });
    } catch (error) {
        console.warn('Chart initialization failed:', error);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Optimization button
    const optimizeBtn = document.getElementById('runOptimization');
    if (optimizeBtn) {
        optimizeBtn.addEventListener('click', runOptimization);
    }
    
    // File input
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
    
    // Prevent form submissions for demo
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// Main optimization function
async function runOptimization() {
    if (isOptimizationRunning) return;
    
    console.log('🔄 Starting optimization process...');
    isOptimizationRunning = true;
    
    // Update UI to loading state
    updateOptimizationUI('loading');
    
    // Set timeout protection (max 10 seconds)
    optimizationTimeout = setTimeout(() => {
        console.warn('⚠️ Optimization timeout - falling back to demo results');
        completeOptimization();
    }, 10000);
    
    try {
        // Run through optimization steps
        for (let i = 0; i < optimizationSteps.length; i++) {
            const step = optimizationSteps[i];
            
            // Update progress display
            updateProgressDisplay(step);
            
            // Wait for step duration
            await sleep(step.duration);
            
            // Update progress bar
            updateProgressBar(step.progress);
        }
        
        // Complete optimization
        completeOptimization();
        
    } catch (error) {
        console.error('Optimization failed:', error);
        handleOptimizationError();
    }
}

// Update optimization UI state
function updateOptimizationUI(state) {
    const btn = document.getElementById('runOptimization');
    const status = document.getElementById('optimizationStatus');
    const progressContainer = document.getElementById('progressContainer');
    
    switch (state) {
        case 'loading':
            btn.classList.add('loading');
            btn.disabled = true;
            status.innerHTML = '<span class="status status--warning pulse">Running</span>';
            progressContainer.classList.remove('hidden');
            break;
            
        case 'complete':
            btn.classList.remove('loading');
            btn.disabled = false;
            status.innerHTML = '<span class="status status--success">Complete</span>';
            progressContainer.classList.add('hidden');
            break;
            
        case 'error':
            btn.classList.remove('loading');
            btn.disabled = false;
            status.innerHTML = '<span class="status status--error">Error</span>';
            progressContainer.classList.add('hidden');
            break;
            
        default:
            btn.classList.remove('loading');
            btn.disabled = false;
            status.innerHTML = '<span class="status status--info">Ready</span>';
            progressContainer.classList.add('hidden');
    }
}

// Update progress display
function updateProgressDisplay(step) {
    const stepElement = document.getElementById('progressStep');
    const descriptionElement = document.getElementById('progressDescription');
    
    if (stepElement) stepElement.textContent = step.name;
    if (descriptionElement) descriptionElement.textContent = step.description;
}

// Update progress bar
function updateProgressBar(progress) {
    const progressFill = document.getElementById('progressFill');
    const progressPercentage = document.getElementById('progressPercentage');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressPercentage) {
        progressPercentage.textContent = progress + '%';
    }
}

// Complete optimization and show results
function completeOptimization() {
    clearTimeout(optimizationTimeout);
    isOptimizationRunning = false;
    
    // Update UI to complete state
    updateOptimizationUI('complete');
    
    // Show results with animation
    displayResults();
    
    // Show success notification
    showNotification('🎉 Optimization completed successfully!', 'success');
    
    // Update stats with new values
    animateStatsUpdate();
    
    console.log('✅ Optimization completed successfully');
}

// Display optimization results
function displayResults() {
    const resultsSection = document.getElementById('resultsSection');
    if (!resultsSection) return;
    
    // Show results section
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('animate-in');
    
    // Update timestamp
    const timestamp = document.getElementById('resultsTimestamp');
    if (timestamp) {
        timestamp.textContent = `Completed at ${new Date().toLocaleTimeString()}`;
    }
    
    // Update comparison values with animation
    animateComparisonValues();
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Animate comparison values
function animateComparisonValues() {
    // Cost comparison
    animateValue('costBefore', resultData.before.totalCost, '$', true);
    animateValue('costAfter', resultData.after.totalCost, '$', true);
    animateValue('costSavings', -30, '%');
    
    // Time comparison  
    animateValue('timeBefore', resultData.before.totalTime, ' hrs');
    animateValue('timeAfter', resultData.after.totalTime, ' hrs');
    animateValue('timeSavings', -15.5, '%');
    
    // Emissions comparison
    animateValue('emissionsBefore', resultData.before.co2Emissions, ' tons');
    animateValue('emissionsAfter', resultData.after.co2Emissions, ' tons');
    animateValue('emissionsSavings', -18, '%');
}

// Animate individual values
function animateValue(elementId, targetValue, suffix = '', isCurrency = false) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const startValue = 0;
    const duration = 2000; // 2 seconds
    const startTime = Date.now();
    
    function updateValue() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart(progress);
        
        let displayValue;
        if (isCurrency) {
            displayValue = '$' + Math.round(currentValue).toLocaleString();
        } else {
            displayValue = Math.round(currentValue * 10) / 10 + suffix;
        }
        
        element.textContent = displayValue;
        
        if (progress < 1) {
            requestAnimationFrame(updateValue);
        }
    }
    
    updateValue();
}

// Easing function
function easeOutQuart(t) {
    return 1 - (--t) * t * t * t;
}

// Handle optimization error
function handleOptimizationError() {
    clearTimeout(optimizationTimeout);
    isOptimizationRunning = false;
    
    updateOptimizationUI('error');
    showNotification('❌ Optimization failed. Please try again.', 'error');
    
    console.error('Optimization process failed');
}

// Animate stats on page load
function animateStats() {
    const statValues = document.querySelectorAll('.stat-value');
    
    statValues.forEach((stat, index) => {
        setTimeout(() => {
            stat.style.opacity = '0';
            stat.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                stat.style.transition = 'all 0.6s ease-out';
                stat.style.opacity = '1';
                stat.style.transform = 'translateY(0)';
            }, 100);
        }, index * 200);
    });
}

// Update stats after optimization
function animateStatsUpdate() {
    const stats = [
        { id: 'costSaved', value: '30%' },
        { id: 'co2Reduced', value: '18%' },
        { id: 'onTimeDelivery', value: '95%' },
        { id: 'vesselsOptimized', value: '250' }
    ];
    
    stats.forEach((stat, index) => {
        setTimeout(() => {
            const element = document.getElementById(stat.id);
            if (element) {
                element.style.transform = 'scale(1.1)';
                element.textContent = stat.value;
                
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 300);
            }
        }, index * 100);
    });
}

// File upload handling
function triggerFileUpload() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(input) {
    if (input.files && input.files[0]) {
        const file = input.files[0];
        const fileName = file.name;
        
        // Simulate file processing
        showNotification(`📁 Processing ${fileName}...`, 'info');
        
        setTimeout(() => {
            showNotification(`✅ ${fileName} processed successfully!`, 'success');
            // Here you would typically send the file to your backend
        }, 1500);
    }
}

// Chart period update
function updateChartPeriod(period) {
    if (!performanceChart) return;
    
    // Update chart data based on period
    let newData, newLabels;
    
    switch (period) {
        case '7d':
            newLabels = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
            newData = [
                [72, 75, 78, 82, 85, 88, 94],
                [78, 81, 83, 87, 90, 92, 95]
            ];
            break;
        case '30d':
            newLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            newData = [
                [70, 80, 85, 94],
                [75, 85, 90, 95]
            ];
            break;
        case '90d':
            newLabels = ['Month 1', 'Month 2', 'Month 3'];
            newData = [
                [68, 82, 94],
                [72, 88, 95]
            ];
            break;
    }
    
    performanceChart.data.labels = newLabels;
    performanceChart.data.datasets[0].data = newData[0];
    performanceChart.data.datasets[1].data = newData[1];
    performanceChart.update();
}

// Map layer toggle
function toggleLayer(layerType) {
    console.log(`Toggling ${layerType} layer`);
    showNotification(`${layerType.charAt(0).toUpperCase() + layerType.slice(1)} layer toggled`, 'info');
}

// Export results
function exportResults() {
    // Simulate export functionality
    showNotification('📊 Exporting optimization results...', 'info');
    
    setTimeout(() => {
        // Create a simple CSV-like data string
        const exportData = `Optimization Results - ${new Date().toLocaleDateString()}\n\nMetric,Before,After,Improvement\nTotal Cost,$2,500,000,$1,750,000,-30%\nDelivery Time,168 hrs,142 hrs,-15.5%\nCO2 Emissions,1250 tons,1025 tons,-18%\nDemurrage Penalties,$340,000,$85,000,-75%\nEfficiency,72%,94%,+22%`;
        
        // Create and download file
        const blob = new Blob([exportData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optimization-results-${Date.now()}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        
        showNotification('✅ Results exported successfully!', 'success');
    }, 1000);
}

// Contact form functions
function showContactForm() {
    document.getElementById('contactModal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function closeContactForm() {
    document.getElementById('contactModal').classList.add('hidden');
    document.body.style.overflow = '';
}

function submitContact(event) {
    event.preventDefault();
    
    showNotification('📧 Message sent successfully! We\'ll contact you soon.', 'success');
    closeContactForm();
    
    // Reset form
    event.target.reset();
}

// Utility functions
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const textElement = notification.querySelector('.notification-text');
    
    if (!notification || !textElement) return;
    
    // Set message and type
    textElement.textContent = message;
    notification.className = `notification show ${type}`;
    
    // Auto-hide after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
    }, 4000);
}

// Handle clicks outside modal
document.addEventListener('click', function(event) {
    const modal = document.getElementById('contactModal');
    if (event.target === modal) {
        closeContactForm();
    }
});

// Handle escape key for modal
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeContactForm();
    }
});

// Performance monitoring
let performanceMetrics = {
    optimizationCount: 0,
    averageTime: 4.2,
    successRate: 98.5
};

function updatePerformanceMetrics() {
    performanceMetrics.optimizationCount++;
    console.log(`📈 Optimizations run: ${performanceMetrics.optimizationCount}`);
}

// Error handling
window.addEventListener('error', function(e) {
    console.warn('Application error:', e.message);
    showNotification('⚠️ A minor error occurred. Functionality may be limited.', 'warning');
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.warn('Unhandled promise rejection:', e.reason);
    e.preventDefault();
});

// Export functions for global access
window.SynapseLogistics = {
    runOptimization,
    showContactForm,
    exportResults,
    toggleLayer,
    updateChartPeriod,
    handleFileUpload: triggerFileUpload
};

console.log('🚀 Synapse Logistics Engine - Ready for operation');