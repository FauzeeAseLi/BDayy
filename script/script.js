// --- DATA TEKS CURHAT ---
const messages = [
    { text: "ITU TADI FOTO PERTAMA KITA YANG BERDUAANN", style: "font-weight: bold; color: #333; font-size: 1.1em;" },
    { text: "the day when we're holding hands and feel so lovely to me, my first holding hands with a woman.", style: "" },
    { text: "jantungku berdebar-debar, sangat kencang~~. pas pulang hujan' itu aku sebenernya dah ada niatan kasih hoodie aku, tapi takut bauk dan aku malu ngasihnya, jadi, egk kasih hehe.", style: "" },
    { text: "pas dapa nyeletuk nyuruh kasih barulah aku bergrak, tp, km mnolak, okelah, bauk jok motor jg.", style: "" }
];

// --- TYPEWRITER FUNCTION ---
async function startTypewriter() {
    const container = document.getElementById('typewriter-container');
    container.innerHTML = ""; 

    for (const line of messages) {
        const p = document.createElement('p');
        if(line.style) p.style = line.style;
        container.appendChild(p);

        const chars = line.text.split('');
        for (const char of chars) {
            p.innerHTML += char;
            container.scrollTop = container.scrollHeight;
            await new Promise(resolve => setTimeout(resolve, 40)); 
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
    }
}

// --- 1. LOGIN LOGIC ---
function checkToken() {
    const token = document.getElementById('tokenInput').value;
    if(token.toUpperCase() === "PUB_BDAY") {
        document.getElementById('bgMusic').play().catch(e => console.log("Audio error:", e));
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('cake-page').style.display = 'flex';
    } else {
        document.getElementById('errorMsg').style.display = 'block';
    }
}

// --- 2. CAKE LOGIC ---
const litButton = document.getElementById('litButton');
litButton.addEventListener('click', function() {
    document.getElementById('mainFlame').classList.add('lit');
    litButton.style.display = 'none';
    document.getElementById('cakeInstruction').style.display = 'none';
    document.getElementById('countdownArea').style.display = 'block';

    let timeLeft = 20;
    const timerNum = document.getElementById('timerNum');
    const interval = setInterval(() => {
        timeLeft--;
        timerNum.innerText = timeLeft;
        if(timeLeft <= 0) {
            clearInterval(interval);
            document.getElementById('mainFlame').classList.remove('lit');
            document.getElementById('countdownArea').innerHTML = "<h3 style='color:#ff1493'>HBD SAYANG! 🎉</h3>";
            setTimeout(() => {
                document.getElementById('nextToTriviaBtn').style.display = 'inline-block';
            }, 1000);
        }
    }, 1000);
});

function goToTrivia() {
    document.getElementById('cake-page').style.display = 'none';
    document.getElementById('final-page').style.display = 'flex';
}

// --- 3. TRIVIA LOGIC (TOMBOL KABUR) ---
function moveButton() {
    const btn = document.getElementById('wrongBtn');
    const container = document.getElementById('optionsContainer');
    
    // Ubah posisi menjadi absolute agar bisa lari
    btn.style.position = 'absolute';

    const maxX = container.offsetWidth - btn.offsetWidth;
    const maxY = container.offsetHeight - btn.offsetHeight;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    btn.style.left = randomX + 'px';
    btn.style.top = randomY + 'px';
    btn.style.transform = 'none';
}

function correctAnswer() {
    document.getElementById('trivia-content').style.display = 'none';
    document.getElementById('success-content').style.display = 'block';
    setTimeout(() => {
        initPuzzle(); 
    }, 100);
}

// --- 4. PUZZLE LOGIC ---
const COLS = 4;
const ROWS = 7; 
const TOTAL_TILES = COLS * ROWS; 
const puzzleBoard = document.getElementById('puzzle-board'); // Cache element

let selectedTile = null;

function initPuzzle() {
    document.getElementById('puzzle-game-area').style.display = 'block';
    puzzleBoard.innerHTML = '';
    puzzleBoard.classList.remove('solved');

    let pieces = [];
    for(let i=0; i<TOTAL_TILES; i++) {
        pieces.push(i);
    }

    pieces.sort(() => Math.random() - 0.5);

    pieces.forEach((pieceValue, slotIndex) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';

        const correctRow = Math.floor(pieceValue / COLS);
        const correctCol = pieceValue % COLS;

        const xPos = (correctCol / (COLS - 1)) * 100;
        const yPos = (correctRow / (ROWS - 1)) * 100;

        tile.style.backgroundPosition = `${xPos}% ${yPos}%`;
        tile.style.backgroundSize = `${COLS * 100}% ${ROWS * 100}%`;
        tile.dataset.value = pieceValue;

        tile.onclick = () => handleTileClick(tile);
        puzzleBoard.appendChild(tile);
    });
}

function handleTileClick(tile) {
    if (puzzleBoard.classList.contains('solved')) return;

    if (!selectedTile) {
        selectedTile = tile;
        tile.classList.add('selected');
    } else {
        if (selectedTile === tile) {
            selectedTile.classList.remove('selected');
            selectedTile = null;
            return;
        }

        const tempBg = selectedTile.style.backgroundPosition;
        const tempVal = selectedTile.dataset.value;

        selectedTile.style.backgroundPosition = tile.style.backgroundPosition;
        selectedTile.dataset.value = tile.dataset.value;

        tile.style.backgroundPosition = tempBg;
        tile.dataset.value = tempVal;

        selectedTile.classList.remove('selected');
        selectedTile = null;

        checkWin();
    }
}

function checkWin() {
    const tiles = document.querySelectorAll('.puzzle-tile');
    let isWin = true;

    tiles.forEach((tile, index) => {
        if (parseInt(tile.dataset.value) !== index) {
            isWin = false;
        }
    });

    if (isWin) {
        puzzleBoard.classList.add('solved');
        
        setTimeout(() => {
            document.getElementById('winnerOverlay').style.display = 'flex';
            startTypewriter();
        }, 800);
    }
}