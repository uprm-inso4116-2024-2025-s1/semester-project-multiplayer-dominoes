import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        profilePicture: '/default-profile.png',
    });
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found');
                return;
            }

            try {
                const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser({
                        username: userData.username || 'Guest',
                        profilePicture: userData.profilePicture || '/default-profile.png',
                    });
                }

                const achievementResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/achievements`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (achievementResponse.ok) {
                    const achievementsData = await achievementResponse.json();
                    setAchievements(achievementsData);
                } else {
                    console.error('Failed to fetch achievements');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchUserData();
    }, []);

    return (
        <div className="profile-page">
            <h1>Welcome, {user.username}</h1>
            <div className="profile-container">
                <img
                    src={user.profilePicture}
                    alt={`${user.username}'s Profile`}
                    className="profile-image"
                />
                <h2>{user.username}</h2>
            </div>
            <div className="achievements-section">
                <h3>Your Achievements</h3>
                <ul>
                    {achievements.length > 0 ? (
                        achievements.map((achievement, index) => (
                            <li key={index}>
                                <span>{achievement.status}: </span>
                                <strong>{achievement.username}</strong>
                            </li>
                        ))
                    ) : (
                        <p>No achievements found.</p>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default ProfilePage;
