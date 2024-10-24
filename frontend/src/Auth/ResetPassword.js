import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Obtener el token de la URL
    const token = searchParams.get('token');
    console.log("Token received from URL:", token); // Muestra el token en la consola del navegador

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
    
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword: password }),
            });
    
            const responseData = await response.json(); // Parsear la respuesta para ver los detalles
    
            if (!response.ok) {
                setMessage(`Failed to reset password: ${responseData.error} - ${responseData.details || ''}`);
                return;
            }
    
            setMessage("Password reset successfully. You can now login with your new password.");
            setTimeout(() => navigate('/'), 3000);
        } catch (error) {
            console.error('Error resetting password:', error);
            setMessage("Error resetting password. Please try again.");
        }
    };
    

    return (
        <div className="reset-password-container">
            <h2>Reset Your Password</h2>
            <form onSubmit={handleResetPassword}>
                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}

            {/* Mostrar el token directamente en la página para depuración */}
            <div style={{ marginTop: '20px', color: 'red' }}>
                <p><strong>Token from URL:</strong> {token}</p>
            </div>
        </div>
    );
}

export default ResetPassword;
