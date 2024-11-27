import { useState, useEffect } from 'react';

const useUserData = () => {
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
                const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResponse.ok) {
                    const userData = await userResponse.json();
                    setUser({
                        username: userData.username || 'Guest',
                        profilePicture: userData.profilePicture || '/default-profile.png',
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchUserData();
    }, []);

    return user;
};

export default useUserData;
