document.addEventListener('DOMContentLoaded', function () {
    const startButton = document.getElementById('startButton');
    const gameBoard = document.getElementById('gameBoard');
    const buttons = document.querySelectorAll('.audio-button');

    let sequence = [];
    let userSequence = [];
    let gameStarted = false;

    buttons.forEach(button => {
        button.addEventListener('click', () => {
            if (gameStarted) {
                const sound = new Audio(`static/${button.dataset.sound}`);
                sound.play();
                button.classList.add('active');
                setTimeout(() => {
                    button.classList.remove('active');
                }, 500);
                userSequence.push(button.id);

                if (userSequence.length === sequence.length) {
                    checkUserInput();
                }
            }
        });
    });

    startButton.addEventListener('click', startGame);

    function startGame() {
        resetGame();
        generateSequence();
        playSequence();
    }

    function resetGame() {
        sequence = [];
        userSequence = [];
        gameStarted = true;
    }

    function generateSequence() {
        const colors = ['red', 'yellow', 'green', 'blue'];
        for (let i = 0; i < 5; i++) {  // You can adjust the length of the sequence
            const randomColor = colors[Math.floor(Math.random() * 4)];
            sequence.push(randomColor);
        }
    }

    async function playSequence() {
        gameBoard.classList.remove('hidden');
        startButton.disabled = true;

        for (const color of sequence) {
            const button = document.getElementById(`${color}Button`);
            const sound = new Audio(`static/${button.dataset.sound}`);
            
            button.classList.add('active');
            sound.play();
            await sleep(500);
            button.classList.remove('active');
            await sleep(500);
        }

        setTimeout(() => {
            startButton.disabled = false;
            userSequence = [];  // Clear user input for the new round
        }, sequence.length * 1000);
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function checkUserInput() {
        console.log('Generated Sequence:', sequence);
        console.log('User Sequence:', userSequence);

        if (JSON.stringify(sequence) === JSON.stringify(userSequence)) {
            alert('Correct sequence! Starting a new round.');
            setTimeout(() => {
                resetGame();
                generateSequence();
                playSequence();
            }, 100);
        } else {
            alert('Wrong sequence! Game over.');
            console.error('Wrong sequence! Game over.');
            gameStarted = false;
            startButton.disabled = false;
            gameBoard.classList.add('hidden');
        }
    }
});
