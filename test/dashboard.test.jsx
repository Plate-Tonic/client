import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Dashboard from "../src/pages/dashboard";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Define mockNavigate before mocking react-router-dom
const mockNavigate = vi.fn();

// Preserve MemoryRouter while mocking useNavigate
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: () => mockNavigate, // Correct mock
    };
});

// Mock dependencies
vi.mock("axios");
vi.mock("jwt-decode", () => ({
    jwtDecode: vi.fn(),
}));

beforeEach(() => {
    // Mock authentication token
    localStorage.setItem("authToken", "fakeToken");

    // Mock jwtDecode response
    jwtDecode.mockReturnValue({ userId: "12345" });

    // Mock axios GET request for fetching user data
    axios.get.mockResolvedValueOnce({
        data: {
            data: {
                name: "John Doe",
                email: "john@example.com",
                macroTracker: {
                    age: 30,
                    gender: "Male",
                    activity: "Active",
                    goal: "Weight Loss",
                    calories: 2000,
                    protein: 150,
                    carbs: 250,
                    fat: 70,
                },
                selectedMealPlan: [
                    { _id: "meal1", name: "Grilled Chicken", calories: 500 },
                ],
            },
        },
    });

    vi.clearAllMocks();
    mockNavigate.mockClear(); // Clear navigation mock before each test
});

test("renders dashboard with user details", async () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

    // Wait for user data to load
    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /^personal details$/i })).toBeInTheDocument();
    });

    // Check user details
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
    expect(screen.getByText(/age:/i).closest("p")).toHaveTextContent("30");
    expect(screen.getByText(/gender:/i).closest("p")).toHaveTextContent("Male");
    expect(screen.getByText(/activity level:/i).closest("p")).toHaveTextContent("Active");
    expect(screen.getByText(/goal:/i).closest("p")).toHaveTextContent("Weight Loss");
});

test("navigates between dashboard sections", async () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

    // Find and click the correct button for Calorie Tracker
    fireEvent.click(screen.getByRole("button", { name: /^calorie tracker$/i }));

    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /calorie tracker/i })).toBeInTheDocument();
    });

    // Find and click the correct button for Current Meals
    fireEvent.click(screen.getByRole("button", { name: /^current meals$/i }));

    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /current meals/i })).toBeInTheDocument();
        expect(screen.getByText("Grilled Chicken - 500 kcal")).toBeInTheDocument();
    });

    // Find and click the correct button for Change Password
    fireEvent.click(screen.getByRole("button", { name: /^change password$/i }));

    await waitFor(() => {
        expect(screen.getByRole("heading", { name: /change password/i })).toBeInTheDocument();
    });
});

test("removes a meal from the selected meal plan", async () => {
    axios.delete.mockResolvedValueOnce({});

    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

    // Navigate to Current Meals
    fireEvent.click(screen.getByRole("button", { name: /^current meals$/i }));

    await waitFor(() => {
        expect(screen.getByText("Grilled Chicken - 500 kcal")).toBeInTheDocument();
    });

    // Click Remove button
    fireEvent.click(screen.getByRole("button", { name: /remove/i }));

    await waitFor(() => {
        expect(screen.queryByText("Grilled Chicken - 500 kcal")).not.toBeInTheDocument();
    });
});

test("logs out user and redirects to login", () => {
    render(
        <MemoryRouter>
            <Dashboard />
        </MemoryRouter>
    );

    // Click Logout button
    fireEvent.click(screen.getByRole("button", { name: /logout/i }));

    // Ensure localStorage token is removed
    expect(localStorage.getItem("authToken")).toBeNull();

    // Check if navigate was called with "/login"
    expect(mockNavigate).toHaveBeenCalledWith("/login");
});
