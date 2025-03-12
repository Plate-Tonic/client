import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SignUp from "../src/pages/signup";
import axios from "axios";

// Mock axios
vi.mock("axios");

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
let mockAlert;

beforeEach(() => {
  vi.clearAllMocks();
  mockAlert = vi.spyOn(window, "alert").mockImplementation(() => {});

  vi.spyOn(global.Storage.prototype, "getItem").mockImplementation((key) => {
    if (key === "macroTracker")
      return JSON.stringify({ calories: 2000, protein: 150, fat: 50, carbs: 250 });
    if (key === "userData") return JSON.stringify({});
    return null;
  });

  vi.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => {});
  vi.spyOn(global.Storage.prototype, "removeItem").mockImplementation(() => {});
});

// Mock security questions response
const mockQuestions = ["What is your pet’s name?", "What city were you born in?"];

// ✅ **TEST: Renders sign up page and fetches security questions**
test("renders sign up page and fetches security questions", async () => {
  axios.get.mockResolvedValueOnce({ data: { securityQuestions: mockQuestions } });

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  // Ensure security questions load before interaction
  await waitFor(() => {
    expect(screen.getByText(mockQuestions[0])).toBeInTheDocument();
  });
});

// ✅ **TEST: Displays validation errors when inputs are incorrect**
test("displays validation errors when inputs are incorrect", async () => {
  axios.get.mockResolvedValueOnce({ data: { securityQuestions: mockQuestions } });

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(mockQuestions[0])).toBeInTheDocument();
  });

  const form = screen.getByTestId("signup-form");
  console.log("Submitting form to trigger validation...");

  // Click Sign Up without filling anything
  fireEvent.submit(form);

  // Ensure alert for terms not agreed triggers
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalled();
    expect(mockAlert).toHaveBeenCalledWith("You must agree to the terms and conditions.");
  });

  // Accept terms & attempt again
  fireEvent.click(screen.getByLabelText(/I agree to the/i));
  fireEvent.submit(form);

  // Ensure password validation alert triggers
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith("Password must be at least 8 characters long.");
  });

  // Fill passwords incorrectly
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "validPass1" } });
  fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: "wrongPass2" } });

  fireEvent.submit(form);

  // Ensure passwords do not match alert triggers
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith("Passwords do not match.");
  });
});

// ✅ **TEST: Displays error message on failed registration**
test("displays error message on failed registration", async () => {
  axios.get.mockResolvedValueOnce({ data: { securityQuestions: mockQuestions } });
  axios.post.mockRejectedValueOnce({ response: { data: "Email already in use" } });

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(mockQuestions[0])).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "john@example.com" } });
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "validPass123" } });
  fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: "validPass123" } });
  fireEvent.change(screen.getByLabelText("Security Answer:"), { target: { value: "Fluffy" } });
  fireEvent.click(screen.getByLabelText(/I agree to the/i));

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  // Check for API failure error message
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith('Error registering user: "Email already in use"');
  });
});

// ✅ **TEST: Submits form successfully and navigates to login**
test("submits form successfully and navigates to login", async () => {
  axios.get.mockResolvedValueOnce({ data: { securityQuestions: mockQuestions } });
  axios.post.mockResolvedValueOnce({ data: { message: "User registered successfully" } });

  render(
    <MemoryRouter>
      <SignUp />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(mockQuestions[0])).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText("Name:"), { target: { value: "John Doe" } });
  fireEvent.change(screen.getByLabelText("Email:"), { target: { value: "john@example.com" } });
  fireEvent.change(screen.getByLabelText("Password:"), { target: { value: "validPass123" } });
  fireEvent.change(screen.getByLabelText("Confirm Password:"), { target: { value: "validPass123" } });
  fireEvent.change(screen.getByLabelText("Security Answer:"), { target: { value: "Fluffy" } });
  fireEvent.click(screen.getByLabelText(/I agree to the/i));

  fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

  // Check if success message is shown
  await waitFor(() => {
    expect(mockAlert).toHaveBeenCalledWith("Successfully registered user!");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
