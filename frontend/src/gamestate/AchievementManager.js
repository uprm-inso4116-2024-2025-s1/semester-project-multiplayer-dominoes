import { toast } from 'react-toastify';

class AchievementManager {
    constructor() {
        this.achievements = {
            "startWithDoubleSix": false,
            "winGame": false,
            "winWithoutDrawing": false,
            "allDoublesHand": false,
            "score15": false,
            "hitExact10": false,
            "winWith5Points": false
        };
        this.drewDomino = false;  // Track if player drew any domino
        this.achievementQueue = [];
        this.isShowingAchievement = false;
        this.shownAchievements = new Set(); // To track already shown achievements
    }

    // Show toast notification for unlocked achievement
    showAchievementToast(message) {
        console.log(`Attempting to show achievement: ${message}`); // Logging
        if (!this.shownAchievements.has(message)) {
            this.shownAchievements.add(message);
            this.achievementQueue.push(message);
            console.log(`Added to queue: ${message}`); // Logging
            if (!this.isShowingAchievement) {
                this.showNextAchievement();
            }
        } else {
            console.log(`Achievement already shown: ${message}`); // Logging
        }
    }

    showNextAchievement() {
        if (this.achievementQueue.length === 0) {
            this.isShowingAchievement = false;
            return;
        }

        this.isShowingAchievement = true;
        const message = this.achievementQueue.shift();
        let imgSrc = '';

        if (message === "Won Without Drawing!") {
            imgSrc = 'Cleansweep.png';
        } else if (message === "Won the Game!") {
            imgSrc = 'FirstWinAchievement.png';
        } else if (message === "Started with Double Six!") {
            imgSrc = 'DoubleSix.png';
        } else if (message === "All Doubles Hand!") {
            imgSrc = 'AllDoubles.png';
        } else if (message === "Has Any Doubles!") {
            imgSrc = 'Dominodouble_achievement.png';
        }

        if (imgSrc) {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.style.position = 'fixed';
            img.style.top = '10px';
            img.style.right = '-310px'; // Start off-screen
            img.style.width = '300px';
            img.style.zIndex = '9999';
            img.style.transition = 'right 0.5s ease-in-out'; // Add transition
            document.body.appendChild(img);

            // Slide in after a short delay
            setTimeout(() => {
                img.style.right = '10px';
            }, 50);

            // Slide out after 3 seconds
            setTimeout(() => {
                img.style.right = '-310px';
                
                // Remove the image and show next achievement after the slide-out animation completes
                setTimeout(() => {
                    if (img.parentNode) {
                        document.body.removeChild(img);
                    }
                    this.showNextAchievement();
                }, 500); // Wait for slide out animation to complete
            }, 3000);
        } else {
            // If there's no image for this achievement, move to the next one immediately
            this.showNextAchievement();
        }
    }

    // Check if the player starts with 6:6
    checkStartWithDoubleSix(initialHand) {
        if (initialHand.some(domino => domino[0] === 6 && domino[1] === 6)) {
            this.achievements.startWithDoubleSix = true;
            this.showAchievementToast("Started with Double Six!");
        }
    }

    checkHasAnyDoubles(initialHand){
        if(initialHand.some(domino => domino[0] === domino[1])){
            this.achievements.hasAnyDoubles = true;
            this.showAchievementToast("Has Any Doubles!");
        }
    }

    // Check if the player has won the game
    checkWin(playerHand) {
        if (playerHand.length === 0) {
            this.achievements.winGame = true;
            this.showAchievementToast("Won the Game!");
            if (!this.drewDomino) {
                this.achievements.winWithoutDrawing = true;
                this.showAchievementToast("Won Without Drawing!");
            }
        }
    }

    // Check if the player started with all doubles
    checkAllDoublesHand(initialHand) {
        if (initialHand.every(domino => domino[0] === domino[1])) {
            this.achievements.allDoublesHand = true;
            this.showAchievementToast("All Doubles Hand!");
        }
    }

    // Track if the player draws a domino
    trackDrawing() {
        this.drewDomino = true;
    }

    check15Points(score) {
        if (score >= 15 && !this.achievements.score15) {
            this.achievements.score15 = true;
            this.showAchievementToast("You made it to 15 points");
        }
    }
    
    check10Exact(score) {
        if (score === 10 && !this.achievements.hitExact10) {
            this.achievements.hitExact10 = true;
            this.showAchievementToast("You hit exactly 10 points");
        }
    }

    checkWinWith5Points(score) {
        if (score === 5 && !this.achievements.winWith5Points) {
            this.achievements.winWith5Points = true;
            this.showAchievementToast("You won with 5 points");
        }
    }



    // Get all achievements
    getAchievements() {
        return this.achievements;
    }
}

export default AchievementManager;
