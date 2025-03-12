import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "../src/pages/menu";
import { BrowserRouter } from "react-router-dom";

// Mock fetch response for meal data
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                data: [
                    {
                        _id: "1",
                        name: "Grilled Chicken",
                        calories: 500,
                        protein: 50,
                        fat: 10,
                        carbs: 30,
                        mealImage: "/images/chicken.jpg",
                        preference: ["gluten-free"],
                    },
                    {
                        _id: "2",
                        name: "Vegan Salad",
                        calories: 300,
                        protein: 10,
                        fat: 5,
                        carbs: 40,
                        mealImage: "/images/salad.jpg",
                        preference: ["vegan"],
                    },
                ],
            }),
    })
);

// Mock jwt-decode to always return isAdmin: true
vi.mock("jwt-decode", () => ({
    jwtDecode: () => ({ isAdmin: true, userId: "123" }),
}));

// Mock useNavigate for routing
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom");
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Set up localStorage mock before each test
beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("authToken", "mocked_token");
    localStorage.setItem(
        "macroTracker",
        JSON.stringify({ calories: 2000, protein: 150, fat: 50, carbs: 250 })
    );
});

// Menu page renders and displays meal data correctly
test("renders menu page correctly", async () => {
    render(
        <BrowserRouter>
            <Menu />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Wait until loading disappears
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Check all sections are rendered
    expect(screen.getByText("Meal Selection")).toBeInTheDocument();
    expect(screen.getByText(/Calories: 2000 kcal/)).toBeInTheDocument();
    expect(screen.getByText("Filter by Preferences")).toBeInTheDocument();

    // Verify meals are rendered
    expect(await screen.findByText("Grilled Chicken")).toBeInTheDocument();
    expect(screen.getByText("Vegan Salad")).toBeInTheDocument();
});

// Test meal filtering functionality
test("filters meals correctly when a preference is selected", async () => {
    render(
        <BrowserRouter>
            <Menu />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Select "Vegan" filter
    const veganCheckbox = screen.getByRole("checkbox", { name: /vegan/i });
    await userEvent.click(veganCheckbox);

    // Wait for meals to be filtered
    await waitFor(() =>
        expect(screen.queryByText("Grilled Chicken")).not.toBeInTheDocument()
    );

    expect(screen.getByText("Vegan Salad")).toBeInTheDocument();
});

// Clicking 'Choose' adds a meal to selected meals
test("clicking 'Choose' adds a meal to selected meals", async () => {
    render(
        <BrowserRouter>
            <Menu />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());


    localStorage.setItem("authToken", "mocked_token");

    // Wait for the "Choose" button to be enabled
    const chooseButtons = await screen.findAllByRole("button", {
        name: /choose/i,
    });

    expect(chooseButtons.length).toBeGreaterThan(0);

    await userEvent.click(chooseButtons[0]);

    // Ensure the meal is added to the selected list
    expect(screen.getByText("Grilled Chicken")).toBeInTheDocument();
});

// Test if admin can navigate to the add new meal page
test("navigates to add new meal page when admin clicks add meal button", async () => {
    render(
        <BrowserRouter>
            <Menu />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

    // Click on "Add New Meal" button
    const addMealButton = screen.getByRole("button", { name: /\+ Add New Meal/i });
    await userEvent.click(addMealButton);

    expect(mockNavigate).toHaveBeenCalledWith("/addnewmeal");
});
