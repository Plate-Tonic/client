import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import MealDetail from "../src/pages/mealdetails";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Mock axios
vi.mock("axios");

// Mock jwtDecode
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ mealId: "123" }),
  };
});

// Mock localStorage
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => "mockToken");
  jwtDecode.mockReturnValue({ isAdmin: false }); // Default to non-admin
});

test("renders MealDetail page and fetches meal data", async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: {
      data: {
        name: "Grilled Chicken Salad",
        mealImage: "/uploads/grilled-chicken.jpg",
        ingredients: ["Chicken", "Lettuce", "Tomatoes", "Olive Oil"],
        description: "Step 1: Prepare ingredients\nStep 2: Grill the chicken",
        calories: 500,
        protein: 40,
        carbs: 20,
        fat: 15,
      },
    },
  });

  render(
    <MemoryRouter initialEntries={["/meal-detail/123"]}>
      <Routes>
        <Route path="/meal-detail/:mealId" element={<MealDetail />} />
      </Routes>
    </MemoryRouter>
  );

  expect(screen.getByText(/loading/i)).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /grilled chicken salad/i })).toBeInTheDocument();
  });

  expect(screen.getByText(/ingredients:/i)).toBeInTheDocument();
  expect(screen.getByText("Chicken")).toBeInTheDocument();
  expect(screen.getByText("Lettuce")).toBeInTheDocument();

  expect(screen.getByText("Step 1: Prepare ingredients")).toBeInTheDocument();
  expect(screen.getByText("Step 2: Grill the chicken")).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getByText(/calories:/i).closest("div")).toHaveTextContent(/500/);
    expect(screen.getByText(/protein:/i).closest("span")).toHaveTextContent(/40/);
    expect(screen.getByText(/carbs:/i).closest("span")).toHaveTextContent(/20/);
    expect(screen.getByText(/fats:/i).closest("span")).toHaveTextContent(/15/);
  });

  const image = screen.getByRole("img", { name: /grilled chicken salad/i });
  expect(image).toHaveAttribute(
    "src",
    `${import.meta.env.VITE_AUTH_API_URL}/uploads/grilled-chicken.jpg`
  );
});

test("navigates back to menu when 'Back to Menu' is clicked", async () => {
  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { data: { name: "Meal Test", ingredients: [], description: "", calories: 200 } },
  });

  render(
    <MemoryRouter>
      <MealDetail />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /meal test/i })).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /back to menu/i }));

  expect(mockNavigate).toHaveBeenCalledWith("/menu");
});

test("shows 'Remove Meal' button for admin users", async () => {
  jwtDecode.mockReturnValue({ isAdmin: true });

  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { data: { name: "Admin Meal", ingredients: [], description: "", calories: 300 } },
  });

  render(
    <MemoryRouter>
      <MealDetail />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /admin meal/i })).toBeInTheDocument();
  });

  expect(screen.getByRole("button", { name: /remove meal/i })).toBeInTheDocument();
});

test("handles removing a meal as an admin", async () => {
  jwtDecode.mockReturnValue({ isAdmin: true });

  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { data: { name: "Test Meal", ingredients: [], description: "", calories: 250 } },
  });

  axios.delete.mockResolvedValueOnce({ status: 200 });

  render(
    <MemoryRouter>
      <MealDetail />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /test meal/i })).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /remove meal/i }));

  await waitFor(() => {
    expect(screen.getByText(/are you sure you want to remove this meal/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /confirm remove/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/menu");
  });

  expect(axios.delete).toHaveBeenCalledWith(
    `${import.meta.env.VITE_AUTH_API_URL}/meal-plan/123`,
    { headers: { Authorization: "Bearer mockToken" } }
  );
});

test("cancels meal removal confirmation", async () => {
  jwtDecode.mockReturnValue({ isAdmin: true });

  axios.get.mockResolvedValueOnce({
    status: 200,
    data: { data: { name: "Test Meal", ingredients: [], description: "", calories: 250 } },
  });

  render(
    <MemoryRouter>
      <MealDetail />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByRole("heading", { name: /test meal/i })).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /remove meal/i }));

  await waitFor(() => {
    expect(screen.getByText(/are you sure you want to remove this meal/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /cancel/i }));

  await waitFor(() => {
    expect(screen.queryByText(/are you sure you want to remove this meal/i)).not.toBeInTheDocument();
  });
});
