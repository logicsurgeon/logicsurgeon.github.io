// Global variables
let draggedWindow = null;
let dragOffset = { x: 0, y: 0 };
let activeWindow = null;
let zIndexCounter = 100;
let isDarkMode = false;
let isLoading = true;
let isMusicPlayerOpen = false;
let isPlaying = false;
let currentTrackIndex = 0;
let currentTime = 0;
let totalDuration = 218; // 3:38 in seconds

// Music tracks data
const musicTracks = [
    {
        title: "Sunflower",
        artist: "Post Malone, Swae Lee",
        duration: 218 // 3:38
    },
    {
        title: "Circles",
        artist: "Post Malone",
        duration: 215 // 3:35
    },
    {
        title: "Blinding Lights", 
        artist: "The Weeknd",
        duration: 200 // 3:20
    },
    {
        title: "Levitating",
        artist: "Dua Lipa",
        duration: 203 // 3:23
    }
];

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
    initializeMusicPlayer();
    
    // Show portfolio window by default with faster animation
    setTimeout(() => {
        showWindow('portfolio');
    }, 200);
    
    // Update time every second
    setInterval(updateDateTime, 1000);
    setInterval(updateMusicProgress, 1000);
}

// Music Player functions
function initializeMusicPlayer() {
    updateMusicInfo();
    
    // Volume slider functionality
    const volumeSlider = document.getElementById('volumeSlider');
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function() {
            // Volume control would be implemented here with actual audio
            console.log('Volume:', this.value + '%');
        });
    }
    
    // Progress bar click functionality
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        progressBar.addEventListener('click', function(e) {
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            currentTime = Math.floor(percent * totalDuration);
            updateProgressBar();
        });
    }
}

function toggleMusicPlayer() {
    const musicPanel = document.getElementById('musicPanel');
    isMusicPlayerOpen = !isMusicPlayerOpen;
    
    if (isMusicPlayerOpen) {
        musicPanel.classList.add('show');
    } else {
        musicPanel.classList.remove('show');
    }
}

function togglePlay() {
    const playBtn = document.getElementById('playBtn');
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        // Start music playback simulation
        console.log('Playing:', musicTracks[currentTrackIndex].title);
    } else {
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        // Pause music playback
        console.log('Paused');
    }
}

function previousTrack() {
    currentTrackIndex = (currentTrackIndex - 1 + musicTracks.length) % musicTracks.length;
    currentTime = 0;
    updateMusicInfo();
    updateProgressBar();
    console.log('Previous track:', musicTracks[currentTrackIndex].title);
}

function nextTrack() {
    currentTrackIndex = (currentTrackIndex + 1) % musicTracks.length;
    currentTime = 0;
    updateMusicInfo();
    updateProgressBar();
    console.log('Next track:', musicTracks[currentTrackIndex].title);
}

function updateMusicInfo() {
    const songTitle = document.getElementById('songTitle');
    const songArtist = document.getElementById('songArtist');
    const totalTime = document.getElementById('totalTime');
    
    if (songTitle && songArtist && totalTime) {
        const track = musicTracks[currentTrackIndex];
        songTitle.textContent = track.title;
        songArtist.textContent = track.artist;
        totalTime.textContent = formatTime(track.duration);
        totalDuration = track.duration;
    }
}

function updateMusicProgress() {
    if (isPlaying && currentTime < totalDuration) {
        currentTime++;
        updateProgressBar();
    } else if (currentTime >= totalDuration && isPlaying) {
        // Auto play next track
        nextTrack();
        if (isPlaying) {
            setTimeout(togglePlay, 100); // Resume playing
        }
    }
}

function updateProgressBar() {
    const progress = document.getElementById('progress');
    const currentTimeElement = document.getElementById('currentTime');
    
    if (progress && currentTimeElement) {
        const progressPercent = (currentTime / totalDuration) * 100;
        progress.style.width = progressPercent + '%';
        currentTimeElement.textContent = formatTime(currentTime);
    }
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Dark Mode functions
function initializeDarkMode() {
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
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    }
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
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
    const musicPlayer = document.querySelector('.music-player');
    
    if (!startMenu.contains(event.target) && !startButton.contains(event.target)) {
        startMenu.classList.remove('show');
    }
    
    // Close music player when clicking outside
    if (!musicPlayer.contains(event.target) && isMusicPlayerOpen) {
        const musicPanel = document.getElementById('musicPanel');
        musicPanel.classList.remove('show');
        isMusicPlayerOpen = false;
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
        
        // Add click sound effect (optional)
        playClickSound();
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
    // Remove active class from all taskbar apps
    document.querySelectorAll('.taskbar-app').forEach(app => {
        app.classList.remove('active');
    });
    
    // Add active class to current app if it's active
    if (isActive) {
        const taskbarApp = document.querySelector(`[onclick="showWindow('${windowId}')"]`);
        if (taskbarApp) {
            taskbarApp.classList.add('active');
        }
    }
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

// Sound effects (optional)
function playClickSound() {
    // Create audio context for click sound
    if (typeof(AudioContext) !== "undefined" || typeof(webkitAudioContext) !== "undefined") {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } catch (e) {
            // Audio not supported, continue silently
        }
    }
}

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
    
    // Music player shortcuts
    if (event.code === 'Space' && isMusicPlayerOpen) {
        event.preventDefault();
        togglePlay();
    }
    
    if (event.key === 'ArrowLeft' && isMusicPlayerOpen) {
        event.preventDefault();
        previousTrack();
    }
    
    if (event.key === 'ArrowRight' && isMusicPlayerOpen) {
        event.preventDefault();
        nextTrack();
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

// Window resize handling
window.addEventListener('resize', function() {
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
        { text: 'Music Player', icon: 'fas fa-music', action: () => toggleMusicPlayer() },
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
║  • Space: Play/Pause music           ║
║  • ← →: Previous/Next track          ║
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
        'Dark Mode': isDarkMode ? 'Enabled' : 'Disabled',
        'Music Player': isMusicPlayerOpen ? 'Open' : 'Closed',
        'Current Track': isPlaying ? musicTracks[currentTrackIndex].title : 'Not Playing'
    };
    
    let infoText = 'System Information:\n\n';
    for (const [key, value] of Object.entries(info)) {
        infoText += `${key}: ${value}\n`;
    }
    
    alert(infoText);
}