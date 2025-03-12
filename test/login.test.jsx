import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../src/pages/login";
import axios from "axios";
import { useUserAuthContext } from "../src/contexts/UserAuthContext";

// Mock axios to simulate API calls
vi.mock("axios");

// Mock useUserAuthContext for token handling
const mockSetToken = vi.fn();
vi.mock("../src/contexts/UserAuthContext", () => ({
    useUserAuthContext: () => ({ token: null, setToken: mockSetToken }),
}));

// Mock useNavigate for routing
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        Link: ({ to, children }) => <a href={to}>{children}</a>,
    };
});

// Mock localStorage methods before each test
beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
    vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => null);
    vi.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => null);
    vi.spyOn(global.Storage.prototype, "clear").mockImplementation(() => null);
});

// Test if Login page renders correctly
test("renders Login page correctly", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Verify key text elements are present
    expect(screen.getByText("Welcome Back")).toBeInTheDocument();
    expect(screen.getByText("Login to Your Account")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

// Test if login form fields are rendered
test("renders login form fields correctly", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument(); // Check for email field
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument(); // Check for password field
});

// Test if navigating to forgot password page works
test("navigates to forgot password page when clicked", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    const forgotPasswordLink = screen.getByText(/forgot password/i);
    expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
});

// Test if navigating to signup page works
test("navigates to signup page when clicked", () => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    const signUpLink = screen.getByText(/sign up here/i);
    expect(signUpLink).toHaveAttribute("href", "/signup");
});

// Test successful login submission and navigation to dashboard
test("submits login form successfully and navigates to dashboard", async () => {
    axios.post.mockResolvedValueOnce({
        status: 200,
        data: { token: "mockAuthToken" }, // Mocking successful login response
    });

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Simulate form filling and submission
    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
        // Verifying token handling and navigation
        expect(mockSetToken).toHaveBeenCalledWith("mockAuthToken");
        expect(global.Storage.prototype.setItem).toHaveBeenCalledWith(
            "authToken",
            "mockAuthToken"
        );
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
});

// Test error message display on failed login
test("displays error message on failed login attempt", async () => {
    axios.post.mockRejectedValueOnce(new Error("Invalid email or password"));

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
        expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument(); // Verifying error message
    });
});

// Test if user is redirected to dashboard if already logged in
test("redirects to dashboard if user is already logged in", () => {
    vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => "mockAuthToken");

    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    );

    // Verify user is redirected
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});
