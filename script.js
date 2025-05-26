

        const words = [
            "scuola", "computer", "mouse", "tastiera", "monitor", "router", "programma", "input", "output",
            "microfono", "cavo", "controller", "arduino", "caricatore", "usb", "processore", "alimentatore",
            "hacker", "processo", "sicurezza", "crittografia", "applicazione", "malware", "google", "java",
            "italia", "spagna", "barcellona", "videogiochi"
        ];



        let countdown = 5;

        let isRunning = false;

        let currentWord = "";

        let typedWord = "";

        let timerInterval;

        let score = 0;

        let end = false;
		
		let lastWord = "";
		
		let counterWords = 0;
		
		let countdownNew = countdown;



        const wordElement = document.getElementById('word');

        //const timerElement = document.getElementById('timer');

        const restartButton = document.getElementById('restartButton');

        const scoreElement = document.getElementById('score');

        const restartPauseButtonElement = document.getElementById('restartPauseButton');

        const bodyElement = document.body;



        function showRandomWord() {


            restartAnimation(wordElement);

            const randomIndex = Math.floor(Math.random() * words.length);

			currentWord = words[randomIndex];
			
			if (lastWord == currentWord && randomIndex != words.length){	
				currentWord = words[randomIndex+1];
			}else if (lastWord == currentWord && randomIndex == words.length) {
				currentWord = words[randomIndex-1];
			}
			lastWord = currentWord;
            typedWord = "";



            const randomLeftPosition = Math.random() * 40 + 30;  // Limiting the left position between 30% and 70%

            wordElement.style.left = `${randomLeftPosition}%`;



            wordElement.innerHTML = highlightTypedLetters(currentWord, typedWord);

            resetBackground();

            startTimer();
			
			if (counterWords >= 10){
				counterWords = 0;
				countdownNew -= 0.05;
				
				console.log("Timer diminuito");
				document.body.style.setProperty('--drop-animation', `${countdown}s`);
			}else if (score == 0){
				document.body.style.setProperty('--drop-animation', `${countdown}s`);
			}

        }



        function startTimer() {

            if (!isRunning) {

                isRunning = true;



                timerInterval = setInterval(() => {

                    if (countdown > 0) {

                        countdown--;

                        //timerElement.innerHTML = countdown;

                    } else if (countdown === 0) {

                        console.log("Timer scaduto!");

                        stopTimer();

                    }

                }, 1000);

            }

        }



        function stopTimer() {

            clearInterval(timerInterval);

            isRunning = false;

            end = true;



            if (typedWord !== currentWord) {

                console.log("Hai perso! Il tempo è scaduto.");

                bodyElement.style.backgroundColor = 'red';

                wordElement.innerHTML = "";

                //timerElement.innerHTML = ""; 

                restartPauseButtonElement.remove();
                wordElement.remove();

                heart.remove();

                scoreElement.style.top = '45%';
                scoreElement.style.left = '41%';
                scoreElement.style.position = '';

                restartButton.style.display = 'block';

                return;

            }



            const previousScore = score;



            setTimeout(() => {

                score++;
				counterWords++;

                animateScore(previousScore);

                showRandomWord();

                resetBackground();

                typedWord = "";

                countdown = countdownNew;

                //timerElement.innerHTML = countdown; 



                startTimer();

                isRunning = true;

                restartButton.style.display = 'none';

            });

        }



        function animateScore(previousScore) {

            scoreElement.innerHTML = `Parole Corrette: ${score}`;

            scoreElement.style.transform = 'scale(1.5)';



            setTimeout(() => {

                scoreElement.style.transform = 'scale(1)';

            }, 300);

        }



        function resetBackground() {

            bodyElement.style.backgroundColor = 'white';

            bodyElement.classList.remove('blurred');

        }



        function highlightTypedLetters(currentWord, typedWord) {
            let displayText = "";
            const boxColor = 'rgba(0, 0, 0, 0)'; // Colore della box
            const neonYellow = '#ffff00'; // Colore giallo fluo per le lettere non digitate

            let firstTyped = false; // Flag per il primo carattere scritto

            for (let i = 0; i < currentWord.length; i++) {
                const c = currentWord.charAt(i);

                if (i < typedWord.length) {
                    // La lettera corretta assume lo stesso colore della box
                    if (typedWord.charAt(i) === c) {
                        displayText += `<span style='color: ${boxColor};'>${c}</span>`;
                        firstTyped = true; // La prima lettera è stata scritta
                    }
                } else {
                    // Le lettere non scritte diventano giallo fluo solo dopo la prima lettera
                    if (firstTyped) {
                        displayText += `<span style='color: yellow;' class="glow">${c}</span>`;
                    } else {
                        displayText += `<span style='color: white;'>${c}</span>`; // La parola è bianca finché non viene premuta la prima lettera
                    }
                }
            }

            return displayText;
        }




        document.addEventListener('keydown', (event) => {
            if (isRunning) {
                const typedChar = event.key;

                // Blocca la cancellazione
                if (typedChar === 'Backspace') {
                    event.preventDefault(); // Impedisce il comportamento predefinito di "Backspace"
                    return;
                }

                // Verifica se il carattere è una lettera valida
                if (/^[a-zA-ZàèéìòùÀÈÉÌÒÙ]$/.test(typedChar)) {
                    // Se il carattere digitato è corretto
                    if (typedChar === currentWord.charAt(typedWord.length)) {
                        typedWord += typedChar; // Aggiungi il carattere corretto alla parola scritta

                        // Crea un rettangolo per la lettera giusta
                        createRectangle();
                    }

                    // Aggiorna la visualizzazione della parola
                    wordElement.innerHTML = highlightTypedLetters(currentWord, typedWord);

                    // Se la parola è corretta, fermiamo il timer
                    if (typedWord === currentWord) {
                        console.log("Parola corretta!");
                        stopTimer(); // Se la parola è corretta, fermiamo il timer
                    }
                }
            }
        });

function createRectangle() {
    const bullet = document.createElement('img');
    bullet.src = 'src/arrow.png';
    bullet.style.position = 'absolute';
    bullet.style.width = '100px';
    bullet.style.height = '100px';
    bullet.style.zIndex = '1';
    
    document.body.appendChild(bullet);

    const heartElement = document.getElementById('heart');
    const heartRect = heartElement.getBoundingClientRect();
    const wordRect = wordElement.getBoundingClientRect();

    const startX = (heartRect.left + heartRect.width / 2) - 60;
    const startY = heartRect.top - 40;
    const endX = (wordRect.left + wordRect.width / 2) - 50;
    const endY = wordRect.top;
	
	const angle = (Math.atan2(endY - startY, endX - startX) * (180 / Math.PI))+90;

    document.body.style.setProperty('--start-x', `${startX}px`);
    document.body.style.setProperty('--start-y', `${startY}px`);
    document.body.style.setProperty('--end-x', `${endX}px`);
    document.body.style.setProperty('--end-y', `${endY}px`);
	
	document.body.style.setProperty('--transform-origin', 	'center center');
    document.body.style.setProperty('--transform', `rotate(${angle}deg)`);

    bullet.style.animation = `moveBulletToWord 0.2s linear forwards`;

    bullet.addEventListener('animationend', () => {
        bullet.remove();
    });
}








        function restartAnimation(element) {

            element.style.animation = 'none'; // Rimuovi l'animazione

            element.offsetHeight; // Triggera un reflow

            element.style.animation = ''; // Riapplica l'animazione

        }



        function restartGame() {

            location.reload();

        }



        showRandomWord();
