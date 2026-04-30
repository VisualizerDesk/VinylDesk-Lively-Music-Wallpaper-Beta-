let lastTitle = "";
let fakeInterval = null;

function smoothChange() {
    const card = document.querySelector(".music-card");

    card.style.opacity = "0.6";
    card.style.transform = "scale(0.97)";

    setTimeout(() => {
        card.style.opacity = "1";
        card.style.transform = "scale(1)";
    }, 180);
}

function fitTitle(text, element) {
    if (!text) {
        element.textContent = "";
        return;
    }

    element.textContent = text;

    let maxSize = 60;
    let minSize = 28;

    element.style.fontSize = maxSize + "px";

    while (element.scrollWidth > element.clientWidth && maxSize > minSize) {
        maxSize--;
        element.style.fontSize = maxSize + "px";
    }

    if (element.scrollWidth > element.clientWidth) {
        let trimmed = text;

        while (element.scrollWidth > element.clientWidth && trimmed.length > 0) {
            trimmed = trimmed.slice(0, -1);
            element.textContent = trimmed + "...";
        }
    }
}

function startFakeVisualizer() {
    if (fakeInterval) return;

    const bars = document.querySelectorAll("#visualizer span");

    fakeInterval = setInterval(() => {
        bars.forEach(bar => {
            let val = Math.random();
            let height = 6 + val * 25;
            bar.style.height = `${height}px`;
        });
    }, 120);
}

function stopVisualizer() {
    clearInterval(fakeInterval);
    fakeInterval = null;

    const bars = document.querySelectorAll("#visualizer span");
    bars.forEach(bar => bar.style.height = "6px");
}

function clearMedia(albumArt, albumBg) {
    if (albumArt) {
        albumArt.style.opacity = "0";
        setTimeout(() => {
            albumArt.src = "";
        }, 200);
    }

    if (albumBg) {
        albumBg.style.opacity = "0.5";
        albumBg.style.backgroundImage = "none";
    }
}

window.livelyCurrentTrack = (data) => {
    if (!data) return;

    let obj = typeof data === 'string' ? JSON.parse(data) : data;

    const trackTitle = document.getElementById('trackTitle');
    const artistName = document.getElementById('artistName');
    const albumArt = document.getElementById('albumArt');
    const albumBg = document.getElementById('albumBg');

    if (!obj || !obj.Title || obj.Title.trim() === "") {
        trackTitle.textContent = "Nothing playing";
        artistName.textContent = "";

        stopVisualizer();
        clearMedia(albumArt, albumBg);

        return;
    }

    if (lastTitle !== obj.Title) {
        smoothChange();
        lastTitle = obj.Title;
    }

    fitTitle(obj.Title, trackTitle);

    artistName.textContent = obj.Artist || "";

    startFakeVisualizer();

    if (obj.Thumbnail) {
        const img = "data:image/png;base64," + obj.Thumbnail;

        albumArt.style.opacity = "0";
        albumBg.style.opacity = "0.8";

        setTimeout(() => {
            albumArt.src = img;
            albumBg.style.backgroundImage = `url(${img})`;

            albumArt.style.opacity = "1";
            albumBg.style.opacity = "0.95";
        }, 150);
    }
};
