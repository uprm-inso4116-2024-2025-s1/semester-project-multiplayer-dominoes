import { Router } from 'express';
import authenticateJWT from '../middleware/authenticateJWT.js'

export default (container) => {
    const router = Router();
    const usersController = container.UsersController;

    router.post('/register', async (req, res) => usersController.createUser(req, res));
    router.post('/login', async (req, res) => usersController.loginUser(req, res));
    router.post('/logout', authenticateJWT, async (req, res) => usersController.logoutUser(req, res));
    router.post('/forgot-password', async (req, res) => usersController.requestPasswordReset(req, res));
    router.post('/reset-password', async (req, res) => usersController.resetPassword(req, res));
    router.get('/profile', authenticateJWT, (req, res) => {
        const { username, profilePicture } = req.user;
    
        res.json({
            username,
            profilePicture: profilePicture || '/public/default-profile.png', // Default picture if none is set
        });
    });
    router.get('/achievements', authenticateJWT, async (req, res) => {
        const username = req.user.username; // Assuming `username` is part of `req.user`
        try {
            const achievements = await container.AchievementRepository.getAllAchievements();
            const userAchievements = achievements.filter(a => a.username === username);
            res.json(userAchievements);
        } catch (error) {
            console.error('Error fetching achievements:', error.message);
            res.status(500).json({ message: 'Unable to fetch achievements' });
        }
    });

    router.post('/update-profile-picture', authenticateJWT, async (req, res) => {
        const { profilePicture } = req.body;
        const username = req.user.username;
    
        try {
            const updatedUser = await container.UserRepository.updateUserProfilePicture(username, { profilePicture });
            res.json({ success: true, updatedUser });
        } catch (error) {
            console.error('Error updating profile picture:', error);
            res.status(500).json({ success: false, message: 'Unable to update profile picture' });
        }
    });
    
    
    

    return router;
};