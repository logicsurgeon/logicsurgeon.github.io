// Typing animation control
function initializeTypingAnimation() {
    const typingElement = document.querySelector('.typing-text-bg');
    if (!typingElement) return;
    
    const firstPart = 'We are';
    const secondPart = ' Team Framing.';
    const fullText = firstPart + secondPart;
    let currentCycle = 0;
    const maxCycles = 2;
    let isTyping = true;
    let currentIndex = 0;
    let isSecondPart = false;
    let isWaitingForSecondPart = false;
    
    // Start cursor blinking immediately
    startCursorBlink(typingElement);
    
    function typeText() {
        if (currentCycle >= maxCycles) {
            // Final cycle: type smoothly and keep the text without deletion
            if (isTyping) {
                if (!isSecondPart && currentIndex <= firstPart.length) {
                    // Type "We are"
                    typingElement.textContent = firstPart.substring(0, currentIndex);
                    currentIndex++;
                    
                    if (currentIndex > firstPart.length) {
                        // Wait 1.5 seconds before typing second part
                        isWaitingForSecondPart = true;
                        setTimeout(() => {
                            isSecondPart = true;
                            isWaitingForSecondPart = false;
                            currentIndex = firstPart.length;
                            typeText();
                        }, 1500);
                        return;
                    }
                    
                    // Continue typing first part
                    setTimeout(typeText, getSmoothTypingSpeed());
                    return;
                }
                
                if (isSecondPart && currentIndex <= fullText.length) {
                    // Type " Team Framing."
                    typingElement.textContent = fullText.substring(0, currentIndex);
                    currentIndex++;
                    
                    if (currentIndex > fullText.length) {
                        // Animation complete, text stays displayed
                        return;
                    }
                    
                    // Continue typing second part
                    setTimeout(typeText, getSmoothTypingSpeed());
                    return;
                }
            }
            return;
        }
        
        if (isTyping) {
            // Typing phase for cycles 1 and 2
            if (!isSecondPart && currentIndex <= firstPart.length) {
                // Type "We are"
                typingElement.textContent = firstPart.substring(0, currentIndex);
                currentIndex++;
                
                if (currentIndex > firstPart.length) {
                    // Wait 1.5 seconds before typing second part
                    isWaitingForSecondPart = true;
                    setTimeout(() => {
                        isSecondPart = true;
                        isWaitingForSecondPart = false;
                        currentIndex = firstPart.length;
                        typeText();
                    }, 1500);
                    return;
                }
                
                // Continue typing first part
                setTimeout(typeText, getSmoothTypingSpeed());
                return;
            }
            
            if (isSecondPart && currentIndex <= fullText.length) {
                // Type " Team Framing."
                typingElement.textContent = fullText.substring(0, currentIndex);
                currentIndex++;
                
                if (currentIndex > fullText.length) {
                    // Hold the complete text for 1.5 seconds
                    setTimeout(() => {
                        isTyping = false;
                        currentIndex = fullText.length;
                        typeText();
                    }, 1500);
                    return;
                }
                
                // Continue typing second part
                setTimeout(typeText, getSmoothTypingSpeed());
                return;
            }
        } else {
            // Deleting phase
            if (currentIndex >= 0) {
                typingElement.textContent = fullText.substring(0, currentIndex);
                currentIndex--;
                
                if (currentIndex < 0) {
                    // Start next cycle
                    currentCycle++;
                    isTyping = true;
                    isSecondPart = false;
                    isWaitingForSecondPart = false;
                    currentIndex = 0;
                    
                    // Pause before starting next cycle
                    setTimeout(() => {
                        typeText();
                    }, 300);
                    return;
                }
            }
            
            // Continue deleting
            setTimeout(typeText, getSmoothDeletingSpeed());
        }
    }
    
    // Smooth and consistent typing speed
    function getSmoothTypingSpeed() {
        return 90; // Fixed 90ms for smooth, consistent typing
    }
    
    // Smooth and consistent deleting speed
    function getSmoothDeletingSpeed() {
        return 60; // Fixed 60ms for smooth, consistent deleting
    }
    
    // Start the typing animation after a short delay
    setTimeout(typeText, 500);
}

function startCursorBlink(element) {
    const isDarkMode = document.body.hasAttribute('data-theme');
    const cursorColor = isDarkMode ? 'rgba(0, 255, 255, 1)' : 'rgba(0, 240, 255, 0.9)';
    
    function blink() {
        const currentColor = element.style.borderRightColor;
        if (currentColor === 'transparent' || currentColor === '') {
            element.style.borderRightColor = cursorColor;
        } else {
            element.style.borderRightColor = 'transparent';
        }
    }
    
    // Blink every 750ms
    setInterval(blink, 750);
    
    // Update cursor color when theme changes
    const observer = new MutationObserver(() => {
        const newIsDarkMode = document.body.hasAttribute('data-theme');
        const newCursorColor = newIsDarkMode ? 'rgba(0, 255, 255, 1)' : 'rgba(0, 240, 255, 0.9)';
        // Only update if currently visible
        if (element.style.borderRightColor !== 'transparent') {
            element.style.borderRightColor = newCursorColor;
        }
    });
    
    observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
    });
}

// Global variables
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let activeWindow = null;
let zIndexCounter = 100;
let isDarkMode = true;
let isLoading = true;


// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeLoadingScreen();
});

// Loading screen functions
function initializeLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    const mainContent = document.getElementById('mainContent');
    
    // Show loading for 4 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        mainContent.style.display = 'block';
        isLoading = false;
        
        // Initialize main application after loading
        initializeApp();
        
        // Remove loading screen from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 4000);
}

function initializeApp() {
    initializeDateTime();
    initializeWindows();
    initializeDesktopInteractions();
    initializeDarkMode();
    checkMinimumHeight(); // Check initial height
    
    // Adjust text position before starting animation
    setTimeout(() => {
        adjustTypingTextPosition();
    }, 100);
    
    // Initialize typing animation
    initializeTypingAnimation();
    
    // Portfolio window auto-popup disabled
    // setTimeout(() => {
    //     showWindow('portfolio');
    // }, 200);
    
    // Update time every second
    setInterval(updateDateTime, 1000);
}

// Check and enforce minimum height
function checkMinimumHeight() {
    const minHeight = 550;
    const currentHeight = window.innerHeight;
    
    if (currentHeight < minHeight) {
        document.body.style.overflow = 'auto';
        document.body.style.minHeight = minHeight + 'px';
        showNotification(`최적의 화면 경험을 위해 브라우저 높이를 ${minHeight}px 이상으로 설정해주세요.`, 'info');
    } else {
        document.body.style.overflow = 'hidden';
        document.body.style.minHeight = '100vh';
    }
    
    // Adjust typing text position
    adjustTypingTextPosition();
}

// Adjust typing animation text position to avoid overlapping with icons
function adjustTypingTextPosition() {
    const typingBg = document.querySelector('.typing-animation-background');
    const iconsContainer = document.querySelector('.desktop-icons-container');
    
    if (!typingBg || !iconsContainer) return;
    
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    const isMobile = windowWidth <= 768;
    
    const taskbarHeight = 48;
    const iconContainerHeight = isMobile ? 200 : 120; // Mobile icons take more space (2x2 grid)
    const bottomPadding = isMobile ? 100 : 100;
    const textBuffer = isMobile ? 30 : 50;
    
    // Calculate the maximum Y position for the text (icons top position - buffer)
    const iconsTopPosition = windowHeight - taskbarHeight - bottomPadding - iconContainerHeight;
    const maxTextBottom = iconsTopPosition - textBuffer;
    
    // Calculate default text position (50% for desktop, 40% for mobile)
    const defaultTopPercentage = isMobile ? 40 : 50;
    const defaultTextCenter = windowHeight * (defaultTopPercentage / 100);
    const textHeight = isMobile ? 50 : 60;
    const defaultTextBottom = defaultTextCenter + (textHeight / 2);
    
    // If text would overlap with icons, move it up
    if (defaultTextBottom > maxTextBottom) {
        const newTextCenter = maxTextBottom - (textHeight / 2);
        const newTopPercentage = (newTextCenter / windowHeight) * 100;
        const minTopPercentage = isMobile ? 10 : 15;
        typingBg.style.top = Math.max(minTopPercentage, newTopPercentage) + '%';
    } else {
        // Reset to default position when there's enough space
        typingBg.style.top = defaultTopPercentage + '%';
    }
}



// Dark Mode functions
function initializeDarkMode() {
    // Apply dark mode initially since isDarkMode is true
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
    }
    updateDarkModeIcon();
}

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    
    if (isDarkMode) {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
    
    updateDarkModeIcon();
    
    // Add transition effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateDarkModeIcon() {
    const icon = document.getElementById('darkModeIcon');
    if (icon) {
        icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    }
}

// Date and Time functions
function initializeDateTime() {
    updateDateTime();
}

function updateDateTime() {
    const now = new Date();
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    const periodElement = document.getElementById('current-period');
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    if (periodElement) {
        const hour = now.getHours();
        periodElement.textContent = hour < 12 ? 'AM' : 'PM';
    }
    
    if (dateElement) {
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        dateElement.textContent = `${year}-${month}-${day}`;
    }
}

// Start Menu functions
function toggleStartMenu() {
    const startMenu = document.getElementById('startMenu');
    if (startMenu.classList.contains('show')) {
        startMenu.classList.remove('show');
    } else {
        startMenu.classList.add('show');
    }
}

// Close start menu when clicking outside
document.addEventListener('click', function(event) {
    const startMenu = document.getElementById('startMenu');
    const startButton = document.querySelector('.start-button');
    
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        startMenu.classList.remove('show');
    }
});

// Window management functions
function initializeWindows() {
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        // Make windows draggable
        const header = window.querySelector('.window-header');
        header.addEventListener('mousedown', startDrag);
        
        // Bring window to front when clicked
        window.addEventListener('mousedown', function() {
            bringToFront(window);
        });
        
        // Set random initial position for windows (except the default one)
        if (window.id !== 'portfolio') {
            const randomX = Math.random() * (window.innerWidth - 600);
            const randomY = Math.random() * (window.innerHeight - 500);
            window.style.left = Math.max(0, randomX) + 'px';
            window.style.top = Math.max(0, randomY) + 'px';
        }
    });
}

function showWindow(windowId) {
    const window = document.getElementById(windowId);
    
    if (window) {
        // Hide start menu
        document.getElementById('startMenu').classList.remove('show');
        
        // Show window with faster animation
        window.classList.add('show');
        window.style.display = 'flex';
        
        // Update taskbar
        updateTaskbar(windowId, true);
        
        // Bring to front
        bringToFront(window);
        
        // Set as active window
        activeWindow = window;
        
        // Click sound effect removed
    }
}

function closeWindow(windowId) {
    const window = document.getElementById(windowId);
    
    if (window) {
        // Add closing animation
        window.style.animation = 'windowClose 0.2s ease-in forwards';
        
        setTimeout(() => {
            window.classList.remove('show');
            window.style.display = 'none';
            window.style.animation = '';
            
            // Update taskbar
            updateTaskbar(windowId, false);
            
            // Clear active window if this was it
            if (activeWindow === window) {
                activeWindow = null;
            }
        }, 200);
    }
}

function minimizeWindow(windowId) {
    const window = document.getElementById(windowId);
    
    if (window) {
        // Add minimize animation
        window.style.animation = 'windowMinimize 0.3s ease-in forwards';
        
        setTimeout(() => {
            window.style.display = 'none';
            window.style.animation = '';
            
            // Update taskbar to show as inactive but still open
            const taskbarApp = document.querySelector(`[onclick="showWindow('${windowId}')"]`);
            if (taskbarApp) {
                taskbarApp.classList.remove('active');
            }
        }, 300);
    }
}

function maximizeWindow(windowId) {
    const window = document.getElementById(windowId);
    
    if (window) {
        if (window.classList.contains('maximized')) {
            // Restore window with animation
            window.classList.remove('maximized');
            window.style.animation = 'windowRestore 0.2s ease-out';
        } else {
            // Maximize window with animation
            window.classList.add('maximized');
            window.style.animation = 'windowMaximize 0.2s ease-out';
        }
        
        setTimeout(() => {
            window.style.animation = '';
        }, 200);
    }
}

function updateTaskbar(windowId, isActive) {
    // Taskbar apps have been removed, so this function is no longer needed
    // Keep function for compatibility but remove functionality
}

function bringToFront(window) {
    zIndexCounter++;
    window.style.zIndex = zIndexCounter;
}

// Drag functionality
function startDrag(event) {
    const window = event.target.closest('.window');
    
    // Don't drag if window is maximized
    if (window.classList.contains('maximized')) {
        return;
    }
    
    draggedWindow = window;
    
    const rect = window.getBoundingClientRect();
    dragOffset.x = event.clientX - rect.left;
    dragOffset.y = event.clientY - rect.top;
    
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDrag);
    
    // Prevent text selection while dragging
    event.preventDefault();
}

function drag(event) {
    if (!draggedWindow) return;
    
    const x = event.clientX - dragOffset.x;
    const y = event.clientY - dragOffset.y;
    
    // Keep window within viewport bounds
    const maxX = window.innerWidth - draggedWindow.offsetWidth;
    const maxY = window.innerHeight - draggedWindow.offsetHeight - 48; // Account for taskbar
    
    draggedWindow.style.left = Math.max(0, Math.min(x, maxX)) + 'px';
    draggedWindow.style.top = Math.max(0, Math.min(y, maxY)) + 'px';
}

function stopDrag() {
    draggedWindow = null;
    document.removeEventListener('mousemove', drag);
    document.removeEventListener('mouseup', stopDrag);
}

// Desktop interactions
function initializeDesktopInteractions() {
    // Close start menu when clicking on desktop
    document.querySelector('.desktop').addEventListener('click', function(event) {
        // Only close start menu if clicking on desktop itself, not icons
        if (event.target.classList.contains('desktop')) {
            document.getElementById('startMenu').classList.remove('show');
        }
    });
    
    // Handle window clicks to bring to front
    document.addEventListener('click', function(event) {
        const window = event.target.closest('.window');
        if (window) {
            bringToFront(window);
        }
    });
    
    // Enhanced desktop icon interactions
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    desktopIcons.forEach(icon => {
        // Add enhanced hover effects
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.1)';
            this.style.transition = 'all 0.15s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click ripple effect
        icon.addEventListener('click', function(e) {
            createRippleEffect(e, this);
        });
    });
}

// Create ripple effect for clicks
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${event.clientX - rect.left - size / 2}px;
        top: ${event.clientY - rect.top - size / 2}px;
        pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Sound effects removed for silent operation

// Utility functions
function openLink(url) {
    if (url && url !== '#') {
        window.open(url, '_blank');
    }
    // Close start menu
    document.getElementById('startMenu').classList.remove('show');
}

// Handle contact form submission
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                showNotification('Message sent successfully! I will contact you soon.', 'success');
                contactForm.reset();
            });
        }
    }, 5000);
});

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#27ae60' : '#3498db'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
        max-width: 300px;
        font-size: 14px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // Don't process shortcuts during loading
    if (isLoading) return;
    
    // Alt + Tab to switch between windows
    if (event.altKey && event.key === 'Tab') {
        event.preventDefault();
        switchToNextWindow();
    }
    
    // Escape to close active window
    if (event.key === 'Escape' && activeWindow) {
        const windowId = activeWindow.id;
        closeWindow(windowId);
    }
    
    // Windows key to toggle start menu
    if (event.key === 'Meta' || event.key === 'OS') {
        event.preventDefault();
        toggleStartMenu();
    }
    
    // Ctrl + D to toggle dark mode
    if (event.ctrlKey && event.key === 'd') {
        event.preventDefault();
        toggleDarkMode();
    }
    
    // F11 to toggle fullscreen
    if (event.key === 'F11') {
        event.preventDefault();
        if (activeWindow) {
            maximizeWindow(activeWindow.id);
        }
    }
    

});

function switchToNextWindow() {
    const openWindows = Array.from(document.querySelectorAll('.window.show'));
    if (openWindows.length > 1) {
        const currentIndex = openWindows.indexOf(activeWindow);
        const nextIndex = (currentIndex + 1) % openWindows.length;
        const nextWindow = openWindows[nextIndex];
        
        bringToFront(nextWindow);
        activeWindow = nextWindow;
        
        // Update taskbar
        const windowId = nextWindow.id;
        updateTaskbar(windowId, true);
        
        // Show window switch animation
        nextWindow.style.animation = 'windowFocus 0.2s ease-out';
        setTimeout(() => {
            nextWindow.style.animation = '';
        }, 200);
    }
}

// Window resize handling with minimum height enforcement
let resizeWarningShown = false;

window.addEventListener('resize', function() {
    const minHeight = 550;
    const currentHeight = window.innerHeight;
    
    // Show warning if window height is too small
    if (currentHeight < minHeight && !resizeWarningShown) {
        showNotification(`최적의 화면 경험을 위해 브라우저 높이를 ${minHeight}px 이상으로 설정해주세요.`, 'info');
        resizeWarningShown = true;
        
        // Reset warning flag after 5 seconds
        setTimeout(() => {
            resizeWarningShown = false;
        }, 5000);
    }
    
    // Apply minimum height styles when window is too small
    if (currentHeight < minHeight) {
        document.body.style.overflow = 'auto';
        document.body.style.minHeight = minHeight + 'px';
    } else {
        document.body.style.overflow = 'hidden';
        document.body.style.minHeight = '100vh';
    }
    
    // Adjust typing text position on resize
    adjustTypingTextPosition();
    
    const windows = document.querySelectorAll('.window');
    
    windows.forEach(window => {
        if (!window.classList.contains('maximized')) {
            const rect = window.getBoundingClientRect();
            
            // Keep windows within viewport
            if (rect.right > window.innerWidth) {
                window.style.left = (window.innerWidth - window.offsetWidth) + 'px';
            }
            if (rect.bottom > window.innerHeight - 48) {
                window.style.top = (window.innerHeight - window.offsetHeight - 48) + 'px';
            }
        }
    });
});

// Add contextual menu (right-click menu)
document.addEventListener('contextmenu', function(event) {
    if (event.target.closest('.desktop')) {
        event.preventDefault();
        showContextMenu(event.clientX, event.clientY);
    }
});

function showContextMenu(x, y) {
    // Remove existing context menu
    const existingMenu = document.querySelector('.context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
    
    const contextMenu = document.createElement('div');
    contextMenu.className = 'context-menu';
    contextMenu.style.cssText = `
        position: fixed;
        top: ${y}px;
        left: ${x}px;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        padding: 8px 0;
        z-index: 10000;
        color: white;
        font-size: 14px;
        min-width: 180px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        animation: contextMenuAppear 0.15s ease-out;
    `;
    
    const menuItems = [
        { text: 'Refresh', icon: 'fas fa-sync-alt', action: () => location.reload() },
        { text: 'Organize Desktop', icon: 'fas fa-th', action: () => organizeDesktop() },
        { text: 'Toggle Dark Mode', icon: 'fas fa-moon', action: () => toggleDarkMode() },
        { text: 'About Windows', icon: 'fas fa-info-circle', action: () => showWindow('about') },
        { text: 'Settings', icon: 'fas fa-cog', action: () => showNotification('Settings not available', 'info') }
    ];
    
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.innerHTML = `<i class="${item.icon}"></i> ${item.text}`;
        menuItem.style.cssText = `
            padding: 12px 20px;
            cursor: pointer;
            transition: background-color 0.2s;
            display: flex;
            align-items: center;
            gap: 12px;
        `;
        
        menuItem.addEventListener('mouseenter', function() {
            this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        });
        
        menuItem.addEventListener('mouseleave', function() {
            this.style.backgroundColor = 'transparent';
        });
        
        menuItem.addEventListener('click', function() {
            item.action();
            contextMenu.remove();
        });
        
        contextMenu.appendChild(menuItem);
        
        if (index < menuItems.length - 1) {
            const separator = document.createElement('div');
            separator.style.cssText = `
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 4px 0;
            `;
            contextMenu.appendChild(separator);
        }
    });
    
    document.body.appendChild(contextMenu);
    
    // Remove context menu when clicking elsewhere
    setTimeout(() => {
        document.addEventListener('click', function removeMenu() {
            contextMenu.remove();
            document.removeEventListener('click', removeMenu);
        });
    }, 0);
}

function organizeDesktop() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach((icon, index) => {
        icon.style.transition = 'all 0.5s ease';
        icon.style.transform = 'translateY(-30px) scale(1.2) rotate(360deg)';
        
        setTimeout(() => {
            icon.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        }, 300 + (index * 100));
        
        setTimeout(() => {
            icon.style.transition = '';
        }, 1000);
    });
    
    showNotification('Desktop organized!', 'success');
}

// Add dynamic CSS animations
const dynamicStyle = document.createElement('style');
dynamicStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes windowClose {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(0.8);
            opacity: 0;
        }
    }
    
    @keyframes windowMinimize {
        from {
            transform: scale(1);
            opacity: 1;
        }
        to {
            transform: scale(0.1) translateY(500px);
            opacity: 0;
        }
    }
    
    @keyframes windowMaximize {
        from {
            transform: scale(0.9);
        }
        to {
            transform: scale(1);
        }
    }
    
    @keyframes windowRestore {
        from {
            transform: scale(1.1);
        }
        to {
            transform: scale(1);
        }
    }
    
    @keyframes windowFocus {
        0%, 100% {
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        50% {
            box-shadow: 0 12px 40px rgba(0, 188, 212, 0.4);
        }
    }
    
    @keyframes contextMenuAppear {
        from {
            transform: scale(0.8) translateY(-10px);
            opacity: 0;
        }
        to {
            transform: scale(1) translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(dynamicStyle);

// Performance optimization
let resizeTimeout;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Recalculate positions if needed
    }, 250);
});

// Welcome message
console.log(`
╔══════════════════════════════════════╗
║     Welcome to LogicSurgeon's        ║
║      Orthopedic Surgery Portal!     ║
║                                      ║
║  Keyboard Shortcuts:                 ║
║  • Alt + Tab: Switch windows         ║
║  • Escape: Close active window       ║
║  • Ctrl + D: Toggle dark mode        ║
║  • F11: Maximize window              ║
║  • Right-click: Context menu         ║
╚══════════════════════════════════════╝
`);

// Performance monitoring
let performanceStart = performance.now();
window.addEventListener('load', function() {
    const loadTime = performance.now() - performanceStart;
    console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
    
    // Add subtle breathing animation to desktop icons
    setTimeout(addBreathingAnimation, 6000);
});

function addBreathingAnimation() {
    const icons = document.querySelectorAll('.desktop-icon');
    icons.forEach((icon, index) => {
        setTimeout(() => {
            icon.style.animation = 'breathe 4s ease-in-out infinite';
        }, index * 200);
    });
}

// Add breathing animation keyframes
const breathingStyle = document.createElement('style');
breathingStyle.textContent = `
    @keyframes breathe {
        0%, 100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.02);
        }
    }
`;
document.head.appendChild(breathingStyle);

// System information display (Easter egg)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.shiftKey && event.key === 'I') {
        showSystemInfo();
    }
});

function showSystemInfo() {
    const info = {
        'User Agent': navigator.userAgent,
        'Screen Resolution': `${screen.width}x${screen.height}`,
        'Viewport Size': `${window.innerWidth}x${window.innerHeight}`,
        'Color Depth': `${screen.colorDepth}-bit`,
        'Language': navigator.language,
        'Platform': navigator.platform,
        'Dark Mode': isDarkMode ? 'Enabled' : 'Disabled'
    };
    
    let infoText = 'System Information:\n\n';
    for (const [key, value] of Object.entries(info)) {
        infoText += `${key}: ${value}\n`;
    }
    
    alert(infoText);
}