import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Login from './Login';

const MockGame = () => <div>Game</div>;

describe('Login Component', () => {
    test('renders login form', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('toggles between login and signup', () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const toggleButton = screen.getByText(/sign up/i);
        fireEvent.click(toggleButton);
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    test('submits login form', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'mockToken' }),
            })
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), expect.any(Object));
    });

    test('handles login error', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: false,
            })
        );

        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), expect.any(Object));
    });

    test('navigates to game on successful login', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'mockToken' }),
            })
        );

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/game" element={<MockGame />} />
                </Routes>
            </MemoryRouter>
        );

        await act(async () => {
            fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password' } });

            const loginButton = screen.getByRole('button', { name: /login/i });
            fireEvent.click(loginButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/login'), expect.any(Object));
        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(screen.getByText('Game')).toBeInTheDocument();
    });

    test('allows user to enter username during signup', async () => {
        render(
            <MemoryRouter>
                <Login />
            </MemoryRouter>
        );

        const toggleButton = screen.getByText(/sign up/i);
        fireEvent.click(toggleButton);

        const usernameInput = screen.getByPlaceholderText(/username/i);
        
        await act(async () => {
            fireEvent.change(usernameInput, { target: { value: 'testUser' } });
        });

        expect(usernameInput.value).toBe('testUser');
    });

    test('navigates to game on successful signup', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: 'mockToken' }),
            })
        );

        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/game" element={<MockGame />} />
                </Routes>
            </MemoryRouter>
        );

        const toggleButton = screen.getByText(/sign up/i);
        fireEvent.click(toggleButton);

        const usernameInput = screen.getByPlaceholderText(/username/i);
        const emailInput = screen.getByPlaceholderText(/email/i);
        const passwordInput = screen.getByPlaceholderText(/password/i);

        await act(async () => {
            fireEvent.change(usernameInput, { target: { value: 'testUser' } });
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password' } });
        });

        const signupButton = screen.getByRole('button', { name: /sign up/i });
        await act(async () => {
            fireEvent.click(signupButton);
        });

        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/register'), expect.any(Object));
        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(screen.getByText('Game')).toBeInTheDocument(); 
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });
});