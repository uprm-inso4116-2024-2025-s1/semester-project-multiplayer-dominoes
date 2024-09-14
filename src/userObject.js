class User {
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.scores = [];
        this.match_history = [];
        this.achievements = [];
    }

    updateScore(newScore) {
        if (typeof newScore === 'number' && newScore >= 0) {
            this.scores.push(newScore);
        } else {
            console.error('Invalid score. Score must be a non-negative number.');
        }
    }

    addMatch(matchDetails) {
        if (typeof matchDetails === 'string') {
            this.match_history.push(matchDetails);
        } else {
            console.error('Invalid match details. Match details should be a string.');
        }
    }

    getMatchHistory() {
        return this.match_history;
    }

    updateEmail(newEmail) {
        if (typeof newEmail === 'string' && newEmail.includes('@')) {
            this.email = newEmail;
        } else {
            console.error('Invalid email format.');
        }
    }

    //Password requirements to be determined
    updatePassword(newPassword) {
        if (typeof newPassword === 'string' && newPassword.length >= 6) {
            this.password = newPassword;
        } else {
            console.error('Invalid password. Password must be at least 6 characters long.');
        }
    }

    addAchievement(achievement) {
        if (typeof achievement === 'string') {
            this.achievements.push(achievement);
        } else {
            console.error('Invalid achievement. Achievement should be a non-empty string.');
        }
    }

    getAchievements() {
        return this.achievements;
    }
}