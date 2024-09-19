import { toast } from 'react-toastify';

class AchievementManager {
    constructor() {
        this.achievements = {
            "startWithDoubleSix": false,
            "winGame": false,
            "winWithoutDrawing": false,
            "allDoublesHand": false
        };
        this.drewDomino = false;  // Track if player drew any domino
    }

    // Show toast notification for unlocked achievement
    showAchievementToast(message) {
        toast.success(`Achievement Unlocked: ${message}`, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    }

    // Check if the player starts with 6:6
    checkStartWithDoubleSix(initialHand) {
        if (initialHand.some(domino => domino[0] === 6 && domino[1] === 6)) {
            this.achievements.startWithDoubleSix = true;
            this.showAchievementToast("Started with Double Six!");
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

    // Get all achievements
    getAchievements() {
        return this.achievements;
    }
}

export default AchievementManager;
