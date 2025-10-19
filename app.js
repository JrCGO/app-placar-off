// Estado do aplicativo
let gameState = {
    team1: {
        name: 'Time 1',
        score: 0
    },
    team2: {
        name: 'Time 2',
        score: 0
    },
    lastUpdate: new Date().toISOString()
};

// Controle de orientação inteligente
let orientationState = {
    cameraSide: null // 'left' ou 'right' - qual lado da câmera o Time 1 deve ficar
};


// Elementos DOM
const team1ScoreEl = document.getElementById('team1Score');
const team2ScoreEl = document.getElementById('team2Score');
const team1NameEl = document.getElementById('team1Name');
const team2NameEl = document.getElementById('team2Name');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadGameState();
    loadOrientationState();
    updateDisplay();
    handleOrientation();
    
    // Salva estado quando os nomes dos times mudam
    team1NameEl.addEventListener('input', saveGameState);
    team2NameEl.addEventListener('input', saveGameState);
    
    // Monitora mudanças de orientação
    window.addEventListener('orientationchange', function() {
        setTimeout(handleOrientation, 200);
    });
    
    window.addEventListener('resize', function() {
        handleOrientation();
    });
    
    // Detecta mudanças de orientação em dispositivos móveis
    window.addEventListener('deviceorientation', function() {
        setTimeout(handleOrientation, 100);
    });
    
    // Força ajuste inicial
    setTimeout(handleOrientation, 500);
});

// Funções do placar
function increaseScore(teamNumber) {
    if (teamNumber === 1) {
        gameState.team1.score++;
        // Detecta preferência do usuário baseada na posição atual
        detectUserPreference(1);
    } else {
        gameState.team2.score++;
        // Detecta preferência do usuário baseada na posição atual
        detectUserPreference(2);
    }
    
    gameState.lastUpdate = new Date().toISOString();
    updateDisplay();
    saveGameState();
    playScoreSound();
}

function decreaseScore(teamNumber) {
    if (teamNumber === 1) {
        gameState.team1.score = Math.max(0, gameState.team1.score - 1);
        // Detecta preferência do usuário baseada na posição atual
        detectUserPreference(1);
    } else {
        gameState.team2.score = Math.max(0, gameState.team2.score - 1);
        // Detecta preferência do usuário baseada na posição atual
        detectUserPreference(2);
    }
    
    gameState.lastUpdate = new Date().toISOString();
    updateDisplay();
    saveGameState();
    playScoreSound();
}

function updateDisplay() {
    team1ScoreEl.textContent = gameState.team1.score;
    team2ScoreEl.textContent = gameState.team2.score;
    team1NameEl.value = gameState.team1.name;
    team2NameEl.value = gameState.team2.name;
    
    // Animação quando o placar muda
    team1ScoreEl.classList.add('score-updated');
    team2ScoreEl.classList.add('score-updated');
    
    setTimeout(() => {
        team1ScoreEl.classList.remove('score-updated');
        team2ScoreEl.classList.remove('score-updated');
    }, 300);
}




// Persistência de dados
function saveGameState() {
    try {
        localStorage.setItem('placarGameState', JSON.stringify(gameState));
        console.log('Estado salvo:', gameState);
    } catch (error) {
        console.error('Erro ao salvar estado:', error);
    }
}

function loadGameState() {
    try {
        const saved = localStorage.getItem('placarGameState');
        if (saved) {
            const parsedState = JSON.parse(saved);
            gameState = {
                team1: parsedState.team1 || { name: 'Time 1', score: 0 },
                team2: parsedState.team2 || { name: 'Time 2', score: 0 },
                lastUpdate: parsedState.lastUpdate || new Date().toISOString()
            };
            console.log('Estado carregado:', gameState);
        }
    } catch (error) {
        console.error('Erro ao carregar estado:', error);
        // Mantém o estado padrão se houver erro
    }
}

// Persistência do estado de orientação
function saveOrientationState() {
    try {
        localStorage.setItem('placarOrientationState', JSON.stringify(orientationState));
        console.log('Estado de orientação salvo:', orientationState);
    } catch (error) {
        console.error('Erro ao salvar estado de orientação:', error);
    }
}

function loadOrientationState() {
    try {
        const saved = localStorage.getItem('placarOrientationState');
        if (saved) {
            const parsedState = JSON.parse(saved);
            orientationState = {
                cameraSide: parsedState.cameraSide || null
            };
            console.log('Estado de orientação carregado:', orientationState);
        }
    } catch (error) {
        console.error('Erro ao carregar estado de orientação:', error);
    }
}


// Som de feedback (opcional)
function playScoreSound() {
    // Cria um som simples usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
        // Silencia erros de áudio (navegadores podem bloquear áudio não solicitado)
        console.log('Áudio não disponível');
    }
}


// Previne que o app seja fechado acidentalmente
window.addEventListener('beforeunload', function(e) {
    // Salva estado antes de fechar
    saveGameState();
});

// Suporte a gestos touch (para dispositivos móveis)
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!touchStartX || !touchStartY) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;
    
    // Swipe horizontal (mais de 100px)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 100) {
        if (diffX > 0) {
            // Swipe para esquerda - aumenta time 2
            increaseScore(2);
        } else {
            // Swipe para direita - aumenta time 1
            increaseScore(1);
        }
    }
    
    // Reset das variáveis
    touchStartX = 0;
    touchStartY = 0;
});

// Atalhos de teclado
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case '1':
            increaseScore(1);
            break;
        case '2':
            increaseScore(2);
            break;
        case 'q':
        case 'Q':
            decreaseScore(1);
            break;
        case 'w':
        case 'W':
            decreaseScore(2);
            break;
        case 'r':
        case 'R':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                resetScores();
            }
            break;
        case 'n':
        case 'N':
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                resetGame();
            }
            break;
    }
});

// Instalação do PWA
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Previne o prompt automático
    e.preventDefault();
    // Salva o evento para usar depois
    deferredPrompt = e;
    
    // Mostra um botão de instalação personalizado se necessário
    showInstallButton();
});

function showInstallButton() {
    // Pode adicionar um botão de instalação na UI se desejar
    console.log('PWA pode ser instalado');
}

// Quando o PWA é instalado
window.addEventListener('appinstalled', () => {
    console.log('PWA foi instalado');
    deferredPrompt = null;
});

// Função para detectar preferência do usuário
function detectUserPreference(teamNumber) {
    const currentOrientation = window.orientation || screen.orientation?.angle || 0;
    const isLandscape = Math.abs(currentOrientation) === 90;
    
    if (isLandscape && !orientationState.cameraSide) {
        // Detecta qual lado da câmera o Time 1 deve ficar
        // Em landscape, determina baseado na orientação atual
        if (teamNumber === 1) {
            // Time 1 foi marcado - define que Time 1 fica do lado da câmera
            orientationState.cameraSide = currentOrientation === 90 ? 'left' : 'right';
        } else {
            // Time 2 foi marcado - Time 1 fica do lado oposto da câmera
            orientationState.cameraSide = currentOrientation === 90 ? 'right' : 'left';
        }
        
        console.log('Lado da câmera detectado:', orientationState.cameraSide);
        saveOrientationState();
    }
}

// Função para lidar com orientação e centralização inteligente
function handleOrientation() {
    // Remove qualquer faixa verde
    document.documentElement.style.height = '100vh';
    document.body.style.height = '100vh';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    // Força o redimensionamento da viewport
    const viewport = document.querySelector('meta[name=viewport]');
    if (viewport) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
    
    // Ajusta altura para a viewport atual
    const vh = window.innerHeight;
    const vw = window.innerWidth;
    
    document.body.style.height = vh + 'px';
    document.documentElement.style.height = vh + 'px';
    
    // Aplica layout inteligente
    applyIntelligentLayout();
    
    // Centraliza o conteúdo
    setTimeout(() => {
        const scoreboard = document.querySelector('.scoreboard');
        if (scoreboard) {
            scoreboard.style.width = vw + 'px';
            scoreboard.style.height = vh + 'px';
        }
        
        const scoreboardContent = document.querySelector('.scoreboard-content');
        if (scoreboardContent) {
            scoreboardContent.style.height = vh + 'px';
            scoreboardContent.style.width = vw + 'px';
        }
        
        const container = document.querySelector('.container');
        if (container) {
            container.style.width = vw + 'px';
            container.style.height = vh + 'px';
        }
    }, 100);
}

// Função para aplicar layout inteligente
function applyIntelligentLayout() {
    const scoreboardContent = document.querySelector('.scoreboard-content');
    if (!scoreboardContent) return;
    
    const currentOrientation = window.orientation || screen.orientation?.angle || 0;
    const isLandscape = Math.abs(currentOrientation) === 90;
    
    if (isLandscape) {
        // Se tem preferência salva, aplica ela
        if (orientationState.cameraSide) {
            // Time 1 deve ficar sempre do lado da câmera
            if (orientationState.cameraSide === 'left') {
                // Time 1 à esquerda da câmera
                scoreboardContent.style.flexDirection = currentOrientation === 90 ? 'row' : 'row-reverse';
            } else {
                // Time 1 à direita da câmera
                scoreboardContent.style.flexDirection = currentOrientation === 90 ? 'row-reverse' : 'row';
            }
        } else {
            // Sem preferência, usa layout padrão
            scoreboardContent.style.flexDirection = 'row';
        }
    } else {
        // Em portrait, sempre vertical
        scoreboardContent.style.flexDirection = 'column';
    }
}

// Função para resetar e centralizar (chamada pelo botão resetar)
function resetScores() {
    if (confirm('Tem certeza que deseja resetar os placares?')) {
        gameState.team1.score = 0;
        gameState.team2.score = 0;
        gameState.lastUpdate = new Date().toISOString();
        updateDisplay();
        saveGameState();
        
        // Centraliza após reset
        setTimeout(handleOrientation, 100);
    }
}

