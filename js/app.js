document.addEventListener("DOMContentLoaded", () => {
    const isArScene = document.querySelector('a-scene');

    if (isArScene) {
        setupARLogic();
    }
});

function setupARLogic() {
    const target = document.getElementById('mytarget');
    const video = document.getElementById('ar-video');
    const scanGuide = document.getElementById('scanning-guide');
    const videoControls = document.getElementById('video-controls');
    const muteBtn = document.getElementById('btn-mute');
    const sfxSuccess = document.getElementById('sfx-success');
    
    let isFound = false;

    // --- TARGET FOUND EVENT ---
    target.addEventListener("targetFound", () => {
        console.log("Target Locked");
        isFound = true;

        // UI Updates
        scanGuide.style.opacity = '0'; // Fade out guide
        setTimeout(() => {
            if(isFound) scanGuide.classList.add('hidden');
        }, 500);

        videoControls.classList.remove('hidden');
        videoControls.style.opacity = '1';

        // Play Sound Effect
        if(sfxSuccess) sfxSuccess.play().catch(e => console.log("Audio prevented"));

        // Video Logic
        if (video) {
            video.play();
            // Mặc định video sẽ mute nếu trình duyệt chặn autoplay có tiếng
            // Nút bấm sẽ giúp người dùng bật tiếng
        }
    });

    // --- TARGET LOST EVENT ---
    target.addEventListener("targetLost", () => {
        console.log("Target Lost");
        isFound = false;

        // UI Updates
        scanGuide.classList.remove('hidden');
        setTimeout(() => scanGuide.style.opacity = '1', 50);
        
        videoControls.classList.add('hidden');

        // Video Logic
        if (video) {
            video.pause();
            video.currentTime = 0;
        }
    });

    // --- MUTE/UNMUTE BUTTON LOGIC ---
    muteBtn.addEventListener('click', (e) => {
        // Ngăn sự kiện click lan ra AR scene (tránh conflict)
        e.stopPropagation(); 
        
        if (video.muted) {
            video.muted = false;
            muteBtn.textContent = "MUTE AUDIO";
            muteBtn.style.borderColor = "#bc13fe"; // Đổi màu viền sang tím
        } else {
            video.muted = true;
            muteBtn.textContent = "UNMUTE";
            muteBtn.style.borderColor = "#00f3ff"; // Màu xanh gốc
        }
    });
}