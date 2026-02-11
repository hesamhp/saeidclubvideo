/**
 * FitPulse Application Logic
 * Handles Tab Switching and Custom Video Player Controls
 */

// --- Tab Switching Logic ---
function switchTab(tabName) {
    const pilatesBtn = document.getElementById('tab-pilates');
    const fatburnBtn = document.getElementById('tab-fatburning');
    const pilatesContent = document.getElementById('content-pilates');
    const fatburnContent = document.getElementById('content-fatburning');

    if (tabName === 'pilates') {
        // Activate Pilates
        pilatesBtn.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
        pilatesBtn.classList.remove('text-gray-500', 'hover:text-gray-900');
        
        fatburnBtn.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
        fatburnBtn.classList.add('text-gray-500', 'hover:text-gray-900');

        pilatesContent.classList.remove('hidden');
        setTimeout(() => { pilatesContent.classList.remove('opacity-0'); }, 50);
        
        fatburnContent.classList.add('opacity-0');
        setTimeout(() => { fatburnContent.classList.add('hidden'); }, 500);

    } else {
        // Activate Fat Burning
        fatburnBtn.classList.add('bg-white', 'text-gray-900', 'shadow-sm');
        fatburnBtn.classList.remove('text-gray-500', 'hover:text-gray-900');

        pilatesBtn.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
        pilatesBtn.classList.add('text-gray-500', 'hover:text-gray-900');

        fatburnContent.classList.remove('hidden');
        setTimeout(() => { fatburnContent.classList.remove('opacity-0'); }, 50);

        pilatesContent.classList.add('opacity-0');
        setTimeout(() => { pilatesContent.classList.add('hidden'); }, 500);
    }
}

// --- Custom Video Player Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const videoContainers = document.querySelectorAll('.custom-video-container');

    videoContainers.forEach(container => {
        const video = container.querySelector('video');
        const playBtn = container.querySelector('.play-btn');
        const bigPlayOverlay = container.querySelector('.big-play-overlay');
        const progressBar = container.querySelector('.progress-bar');
        const volumeBtn = container.querySelector('.volume-btn');
        const volumeSlider = container.querySelector('.volume-slider');
        const fullscreenBtn = container.querySelector('.fullscreen-btn');
        const timeDisplay = container.querySelector('.time-display');

        // Icons
        const playIcon = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
        const pauseIcon = '<svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
        const volHighIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"/></svg>';
        const volMuteIcon = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"/></svg>';

        // 1. Play/Pause Functionality
        function togglePlay() {
            if (video.paused || video.ended) {
                video.play();
            } else {
                video.pause();
            }
        }

        playBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent container click
            togglePlay();
        });

        bigPlayOverlay.addEventListener('click', (e) => {
             e.stopPropagation();
             togglePlay();
        });

        container.addEventListener('click', () => {
            // Click on video to toggle
            togglePlay();
        });

        // Prevent controls click from pausing video if not intended
        container.querySelector('.video-controls').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Update UI on Play/Pause
        video.addEventListener('play', () => {
            playBtn.innerHTML = pauseIcon;
            bigPlayOverlay.classList.add('hidden'); // Hide big button when playing
        });

        video.addEventListener('pause', () => {
            playBtn.innerHTML = playIcon;
            bigPlayOverlay.classList.remove('hidden'); // Show big button when paused
        });

        // 2. Progress Bar
        video.addEventListener('timeupdate', () => {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.value = progress;
            
            // Update Time Display
            const currentMins = Math.floor(video.currentTime / 60);
            const currentSecs = Math.floor(video.currentTime % 60);
            const durationMins = Math.floor(video.duration / 60);
            const durationSecs = Math.floor(video.duration % 60);
            
            if (durationMins) {
                 timeDisplay.innerText = `${currentMins}:${currentSecs < 10 ? '0' : ''}${currentSecs} / ${durationMins}:${durationSecs < 10 ? '0' : ''}${durationSecs}`;
            }
        });

        progressBar.addEventListener('input', (e) => {
            const seekTime = (progressBar.value / 100) * video.duration;
            video.currentTime = seekTime;
        });

        // 3. Volume Control
        volumeSlider.addEventListener('input', (e) => {
            video.volume = e.target.value;
            if(video.volume === 0) {
                volumeBtn.innerHTML = volMuteIcon;
            } else {
                volumeBtn.innerHTML = volHighIcon;
            }
        });

        volumeBtn.addEventListener('click', () => {
            if(video.volume > 0) {
                video.dataset.volume = video.volume; // Store current volume
                video.volume = 0;
                volumeSlider.value = 0;
                volumeBtn.innerHTML = volMuteIcon;
            } else {
                video.volume = video.dataset.volume || 1;
                volumeSlider.value = video.volume;
                volumeBtn.innerHTML = volHighIcon;
            }
        });

        // 4. Fullscreen
        fullscreenBtn.addEventListener('click', () => {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE11 */
                video.msRequestFullscreen();
            }
        });
    });
});
