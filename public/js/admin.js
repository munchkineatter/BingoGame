/**
 * Casino Bingo - Admin Control Panel Logic
 * Handles game controls and settings
 */

// Socket.io connection
const socket = io();

// DOM Elements
const connectionStatus = document.getElementById('connectionStatus');
const boardCountSelect = document.getElementById('boardCount');
const boardSizeSelect = document.getElementById('boardSize');
const newGameBtn = document.getElementById('newGameBtn');
const numberInput = document.getElementById('numberInput');
const callBtn = document.getElementById('callBtn');
const undoBtn = document.getElementById('undoBtn');
const lastCalledAdmin = document.getElementById('lastCalledAdmin');
const calledCount = document.getElementById('calledCount');
const calledHistory = document.getElementById('calledHistory');
const boardsPreview = document.getElementById('boardsPreview');
const confirmModal = document.getElementById('confirmModal');
const modalTitle = document.getElementById('modalTitle');
const modalMessage = document.getElementById('modalMessage');
const modalCancel = document.getElementById('modalCancel');
const modalConfirm = document.getElementById('modalConfirm');

// Current game state
let gameState = null;
let pendingAction = null;

// Connect to server
socket.on('connect', () => {
    console.log('Connected to server');
    connectionStatus.classList.add('connected');
    connectionStatus.querySelector('.status-text').textContent = 'Connected';
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
    connectionStatus.classList.remove('connected');
    connectionStatus.querySelector('.status-text').textContent = 'Disconnected';
});

// Receive game state
socket.on('gameState', (state) => {
    gameState = state;
    updateUI();
});

// Handle new game started
socket.on('newGameStarted', () => {
    showNotification('New game started!', 'success');
});

// Handle number called
socket.on('numberCalled', (number) => {
    showNotification(`Number ${number} called!`, 'info');
});

// Handle number undone
socket.on('numberUndone', (number) => {
    showNotification(`Number ${number} removed`, 'warning');
});

/**
 * Update all UI elements based on current game state
 */
function updateUI() {
    if (!gameState) return;
    
    // Update selects to match current state
    boardCountSelect.value = gameState.boardCount;
    boardSizeSelect.value = gameState.boardSize;
    
    // Update called numbers display
    updateCalledHistory();
    updateLastCalled();
    updateBoardsPreview();
}

/**
 * Update called numbers history
 */
function updateCalledHistory() {
    calledCount.textContent = gameState.calledNumbers.length;
    
    if (gameState.calledNumbers.length === 0) {
        calledHistory.innerHTML = '<p class="no-numbers">No numbers called yet</p>';
        return;
    }
    
    const historyDiv = document.createElement('div');
    historyDiv.className = 'history-numbers';
    
    // Show in reverse order (most recent first)
    const reversedNumbers = [...gameState.calledNumbers].reverse();
    
    reversedNumbers.forEach(number => {
        const numSpan = document.createElement('span');
        numSpan.className = 'history-number';
        numSpan.textContent = number;
        historyDiv.appendChild(numSpan);
    });
    
    calledHistory.innerHTML = '';
    calledHistory.appendChild(historyDiv);
}

/**
 * Update last called number
 */
function updateLastCalled() {
    if (gameState.calledNumbers.length > 0) {
        lastCalledAdmin.textContent = gameState.calledNumbers[gameState.calledNumbers.length - 1];
    } else {
        lastCalledAdmin.textContent = '--';
    }
}

/**
 * Update boards preview
 */
function updateBoardsPreview() {
    boardsPreview.innerHTML = '';
    
    gameState.boards.forEach((board, boardIndex) => {
        const previewDiv = document.createElement('div');
        previewDiv.className = 'preview-board';
        
        if (gameState.winners.includes(boardIndex)) {
            previewDiv.classList.add('winner');
        }
        
        const title = document.createElement('div');
        title.className = 'preview-title';
        title.textContent = `Card ${boardIndex + 1}`;
        previewDiv.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'preview-grid';
        grid.style.gridTemplateColumns = `repeat(${board.length}, 20px)`;
        
        board.forEach(row => {
            row.forEach(cell => {
                const cellDiv = document.createElement('div');
                cellDiv.className = 'preview-cell';
                
                if (cell.number === 'FREE') {
                    cellDiv.classList.add('free-space');
                } else if (cell.stamped) {
                    cellDiv.classList.add('stamped');
                }
                
                grid.appendChild(cellDiv);
            });
        });
        
        previewDiv.appendChild(grid);
        boardsPreview.appendChild(previewDiv);
    });
}

/**
 * Call a number
 */
function callNumber() {
    const number = parseInt(numberInput.value);
    
    if (isNaN(number) || number < 1) {
        showNotification('Please enter a valid number', 'error');
        return;
    }
    
    if (gameState.calledNumbers.includes(number)) {
        showNotification(`Number ${number} has already been called`, 'warning');
        return;
    }
    
    socket.emit('callNumber', number);
    numberInput.value = '';
    numberInput.focus();
}

/**
 * Undo last called number
 */
function undoLastNumber() {
    if (gameState.calledNumbers.length === 0) {
        showNotification('No numbers to undo', 'warning');
        return;
    }
    
    const lastNumber = gameState.calledNumbers[gameState.calledNumbers.length - 1];
    showConfirmModal(
        'Undo Last Number',
        `Remove number ${lastNumber} from called numbers?`,
        () => {
            socket.emit('undoNumber');
        }
    );
}

/**
 * Start a new game
 */
function startNewGame() {
    const boardCount = parseInt(boardCountSelect.value);
    const boardSize = parseInt(boardSizeSelect.value);
    
    showConfirmModal(
        'Start New Game',
        `Start a new game with ${boardCount} board(s) of size ${boardSize}x${boardSize}? This will clear all current progress.`,
        () => {
            socket.emit('newGame', {
                boardCount: boardCount,
                boardSize: boardSize
            });
        }
    );
}

/**
 * Show confirmation modal
 */
function showConfirmModal(title, message, onConfirm) {
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    pendingAction = onConfirm;
    confirmModal.classList.add('active');
}

/**
 * Hide confirmation modal
 */
function hideConfirmModal() {
    confirmModal.classList.remove('active');
    pendingAction = null;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style it
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        fontFamily: 'var(--font-body)',
        fontSize: '1rem',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease',
        boxShadow: '0 5px 20px rgba(0,0,0,0.3)'
    });
    
    // Set colors based on type
    const colors = {
        success: { bg: '#2d5a2d', border: '#44ff44' },
        error: { bg: '#5a2d2d', border: '#ff4444' },
        warning: { bg: '#5a4a2d', border: '#ffaa44' },
        info: { bg: '#2d4a5a', border: '#007dba' }
    };
    
    const color = colors[type] || colors.info;
    notification.style.background = color.bg;
    notification.style.border = `2px solid ${color.border}`;
    notification.style.color = '#fff';
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Event Listeners
callBtn.addEventListener('click', callNumber);

numberInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        callNumber();
    }
});

undoBtn.addEventListener('click', undoLastNumber);

newGameBtn.addEventListener('click', startNewGame);

modalCancel.addEventListener('click', hideConfirmModal);

modalConfirm.addEventListener('click', () => {
    if (pendingAction) {
        pendingAction();
    }
    hideConfirmModal();
});

// Close modal on outside click
confirmModal.addEventListener('click', (e) => {
    if (e.target === confirmModal) {
        hideConfirmModal();
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape closes modal
    if (e.key === 'Escape') {
        hideConfirmModal();
    }
    
    // Ctrl+Z for undo
    if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        undoLastNumber();
    }
});

// Focus number input on load
window.addEventListener('load', () => {
    numberInput.focus();
});

console.log('Admin panel ready');

