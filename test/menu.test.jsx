import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Menu from "../src/pages/menu";
import { BrowserRouter } from "react-router-dom";

// Mock fetch response
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

// Mock useNavigate globally
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
  localStorage.setItem("authToken", "mocked_token"); // Ensure token is present
  localStorage.setItem(
    "macroTracker",
    JSON.stringify({ calories: 2000, protein: 150, fat: 50, carbs: 250 })
  );
});

test("renders menu page correctly", async () => {
  render(
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );

  await waitFor(() => expect(fetch).toHaveBeenCalled());

  // Wait until loading disappears
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

  // Check if page banner is rendered
  expect(screen.getByText("Meal Selection")).toBeInTheDocument();

  // Check if calorie tracker is rendered
  expect(screen.getByText(/Calories: 2000 kcal/)).toBeInTheDocument();

  // Check if filter section is rendered
  expect(screen.getByText("Filter by Preferences")).toBeInTheDocument();

  // Check if meals are rendered
  expect(await screen.findByText("Grilled Chicken")).toBeInTheDocument();
  expect(screen.getByText("Vegan Salad")).toBeInTheDocument();
});

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

test("clicking 'Choose' adds a meal to selected meals", async () => {
  render(
    <BrowserRouter>
      <Menu />
    </BrowserRouter>
  );

  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await waitFor(() => expect(screen.queryByText("Loading...")).not.toBeInTheDocument());

  // Mock user login
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