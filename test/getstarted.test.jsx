import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GetStarted from "../src/pages/getstarted";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage properly
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => null);
  vi.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => null);
  vi.spyOn(global.Storage.prototype, "clear").mockImplementation(() => null);
});

test("renders GetStarted page correctly", () => {
  render(
    <MemoryRouter>
      <GetStarted />
    </MemoryRouter>
  );

  expect(screen.getByText("Get Started")).toBeInTheDocument();
  expect(screen.getByText("Find Your Daily Calorie & Macro Needs")).toBeInTheDocument();
  expect(screen.getByText("Use our TDEE calculator to determine your daily intake.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /calculate tdee & macros/i })).toBeInTheDocument();
});

test("fills out form and submits successfully", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      data: {
        calories: 2000,
        protein: 150,
        fat: 50,
        carbs: 250,
      },
    },
  });

  render(
    <MemoryRouter>
      <GetStarted />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
  fireEvent.change(screen.getByLabelText(/weight \(kg\)/i), { target: { value: "70" } });
  fireEvent.change(screen.getByLabelText(/height \(cm\)/i), { target: { value: "175" } });
  fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: "male" } });
  fireEvent.change(screen.getByLabelText(/activity level/i), { target: { value: "1.55" } });
  fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: "maintenance" } });

  fireEvent.click(screen.getByRole("button", { name: /calculate tdee & macros/i }));

  await waitFor(() => {
    expect(screen.getByText(/your calories & macros intake/i)).toBeInTheDocument();
  });

  // ✅ Fix: Use a function matcher for correctly formatted text
  expect(
    screen.getByText((content, element) => 
      element.textContent.trim() === "Calories: 2000 kcal/day"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText((content, element) => 
      element.textContent.trim() === "Protein: 150g"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText((content, element) => 
      element.textContent.trim() === "Fats: 50g"
    )
  ).toBeInTheDocument();

  expect(
    screen.getByText((content, element) => 
      element.textContent.trim() === "Carbs: 250g"
    )
  ).toBeInTheDocument();
});

test("navigates to menu page after calculation", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      data: {
        calories: 1800,
        protein: 120,
        fat: 60,
        carbs: 200,
      },
    },
  });

  render(
    <MemoryRouter>
      <GetStarted />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "30" } });
  fireEvent.change(screen.getByLabelText(/weight \(kg\)/i), { target: { value: "75" } });
  fireEvent.change(screen.getByLabelText(/height \(cm\)/i), { target: { value: "180" } });
  fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: "female" } });
  fireEvent.change(screen.getByLabelText(/activity level/i), { target: { value: "1.725" } });
  fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: "weight-loss" } });

  fireEvent.click(screen.getByRole("button", { name: /calculate tdee & macros/i }));

  await waitFor(() => {
    expect(screen.getByText(/your calories & macros intake/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /choose your meals/i }));

  await waitFor(() => {
    expect(mockNavigate).toHaveBeenCalledWith("/menu");
  });
});

test("closes modal when clicking close button", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: {
      data: {
        calories: 2200,
        protein: 140,
        fat: 70,
        carbs: 260,
      },
    },
  });

  render(
    <MemoryRouter>
      <GetStarted />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "40" } });
  fireEvent.change(screen.getByLabelText(/weight \(kg\)/i), { target: { value: "80" } });
  fireEvent.change(screen.getByLabelText(/height \(cm\)/i), { target: { value: "170" } });
  fireEvent.change(screen.getByLabelText(/gender/i), { target: { value: "male" } });
  fireEvent.change(screen.getByLabelText(/activity level/i), { target: { value: "1.2" } });
  fireEvent.change(screen.getByLabelText(/goal/i), { target: { value: "muscle-gain" } });

  fireEvent.click(screen.getByRole("button", { name: /calculate tdee & macros/i }));

  await waitFor(() => {
    expect(screen.getByText(/your calories & macros intake/i)).toBeInTheDocument();
  });

  fireEvent.click(screen.getByRole("button", { name: /close/i }));

  await waitFor(() => {
    expect(screen.queryByText(/your calories & macros intake/i)).not.toBeInTheDocument();
  });
});
