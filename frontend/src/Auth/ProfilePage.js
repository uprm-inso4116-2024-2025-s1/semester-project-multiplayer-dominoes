import React, { useEffect, useState } from 'react';
import './ProfilePage.css';

const ProfilePage = () => {
    const [user, setUser] = useState({
        username: '',
        profilePicture: '/default-profile.png',
    });

    useEffect(() => {
        const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No token found');
        return;
    }

    try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            const userData = await response.json();
            console.log('Fetched user data:', userData); // Log data
            setUser({
                username: userData.username || 'Guest',
                profilePicture: userData.profilePicture || '/default-profile.png',
            });
        } else {
            const errorText = await response.text();
            console.error('Error fetching user data:', errorText);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
};

        
        

        fetchUserData();
    }, []);

    return (
        <div className="profile-page">
            <h1>Welcome, {user.username}</h1> {/* Fallback to 'Guest' if username is undefined */}
            <div className="profile-container">
                <img
                    src={user.profilePicture}
                    alt={`${user.username}'s Profile`}
                    className="profile-image"
                />
                <h2>{user.username}</h2> {/* Display username below the profile picture */}
            </div>
        </div>
    );
};

export default ProfilePage;
