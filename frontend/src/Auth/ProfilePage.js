import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        profilePicture: '/default-profile.png',
    });
    const [achievements, setAchievements] = useState([]);
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const profileOptions = [
        '/default-profile.png',
        '/BlueProfile.png',
        '/OrangeProfile.png',
        '/BlueAvatar.png',
        '/YellowAvatar.png',
        '/RedAvatar.png',
        '/GreenAvatar.png',

    ];

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
                    console.log('Fetched user data after update:', userData); // Debug log
                    setUser({
                        username: userData.username || 'Guest',
                        profilePicture: userData.profilePicture || '/default-profile.png',
                    });
                } else {
                    console.error('Failed to fetch user data after update');
                }
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };
        

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        setIsEditingProfile(!isEditingProfile);
    };

    const handleProfilePictureChange = async (newProfilePicture) => {
        setIsSaving(true);
        setUser((prev) => ({ ...prev, profilePicture: newProfilePicture }));
        setIsEditingProfile(false);
    
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/update-profile-picture`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ profilePicture: newProfilePicture }),
                });
    
                if (response.ok) {
                    console.log('Profile picture updated successfully.');
                } else {
                    console.error('Failed to update profile picture.');
                }
            } catch (error) {
                console.error('Error updating profile picture:', error);
            }
        }
        setIsSaving(false);
    };
    


    return (
        <div className="profile-page">
            <h1>Welcome, {user.username}</h1>
            <div className="profile-container">
                <img
                    src={user.profilePicture}
                    alt={`${user.username}'s Profile`}
                    className="profile-image"
                />
                <button onClick={handleEditClick} className="edit-profile-button">
                    <img src="/editIcon.png" alt="Edit Profile" className="edit-icon" />
                </button>
                {isEditingProfile && (
                    <div className="profile-options">
                        {profileOptions.map((option, index) => (
                            <img
                                key={index}
                                src={option}
                                alt={`Option ${index + 1}`}
                                className="profile-option"
                                onClick={() => handleProfilePictureChange(option)}
                            />
                        ))}
                    </div>
                )}
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
