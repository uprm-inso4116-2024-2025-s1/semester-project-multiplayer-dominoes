import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken'; // Asegúrate de importar jsonwebtoken
import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_key'; // Define un valor predeterminado si está ausente


export default class UsersController {
    constructor(userHandler) {
        this.userHandler = userHandler;
    }

    async getAllUsers(req, res) {
        try {
            const users = await this.userHandler.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }


    async createUser(req, res) {
        try {
            const { email, username } = req.body;

            const existingUserByEmail = await this.userHandler.findUserByEmail(email);
            if (existingUserByEmail) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            const existingUserByUsername = await this.userHandler.findUserByUsername(username);
            if (existingUserByUsername) {
                return res.status(400).json({ error: 'Username already taken' });
            }

            const savedData = await this.userHandler.createUser(req.body);
            res.status(201).json(savedData);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;

            const user = await this.userHandler.findUserByEmail(email);
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }

            const isPasswordValid = await this.userHandler.validatePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ error: 'Invalid credentials' });  // Clear message for password mismatch
            }

            const token = this.userHandler.generateToken(user);
            res.status(200).json({ token });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async requestPasswordReset(req, res) {
        try {
            const { email } = req.body;
            console.log('Password reset requested for email:', email);
    
            const user = await this.userHandler.findUserByEmail(email);
            if (!user) {
                console.log('User not found:', email);
                return res.status(404).json({ error: 'User not found' });
            }
    
            const resetToken = this.userHandler.generateResetToken(user);
            const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
            
            console.log('Generated reset link:', resetLink);
    
            // Configurar transporte de email (usando nodemailer)
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });
    
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                text: `Click the following link to reset your password: ${resetLink}`,
            };
    
            await transporter.sendMail(mailOptions);
            console.log('Password reset email sent to:', email);
    
            res.status(200).json({ message: 'Password reset link sent to your email.' });
        } catch (error) {
            console.error('Error during password reset request:', error); // Verifica si hay errores aquí
            res.status(500).json({ error: error.message });
        }
    }
    

    async resetPassword(req, res) {
        try {
            const { token, newPassword } = req.body;
            // Responder con el token recibido para confirmar si es el mismo
            if (!token) {
                return res.status(400).json({ error: 'No token provided.' });
            }
    
            // Verificar el token y decodificarlo
            let decoded;
            try {
                decoded = jwt.verify(token, JWT_SECRET);
            } catch (err) {
                return res.status(400).json({ error: 'Token verification failed.', details: err.message });
            }
    
            // Confirmar que el token es válido y que el usuario existe
            const user = await this.userHandler.findUserById(decoded.id);
        
            if (!user) {
                return res.status(404).json({ error: 'User not found.' });
            }
        
            // Generar un hash de la nueva contraseña y guardarlo
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            await user.save();
        
            res.status(200).json({ message: 'Password has been reset successfully.' });
        } catch (error) {
            res.status(500).json({ error: 'Unexpected error occurred.', details: error.message });
        }
    }
    
    
    
}

