export class UserService {
    static async fetchUserData(token) {
      if (!token) {
        throw new Error('No token found');
      }
  
      try {
        const userResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (userResponse.ok) {
          const userData = await userResponse.json();
          return userData;
        } else {
          throw new Error('Failed to fetch user data');
        }
      } catch (error) {
        throw new Error('Fetch error:', error);
      }
    }
  
    static async updateProfilePicture(token, newProfilePicture) {
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
          return 'Profile picture updated successfully.';
        } else {
          throw new Error('Failed to update profile picture');
        }
      } catch (error) {
        throw new Error('Error updating profile picture:', error);
      }
    }
  }
  