import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Login from "../src/pages/login";
import axios from "axios";
import { useUserAuthContext } from "../src/contexts/UserAuthContext";

// Mock axios
vi.mock("axios");

// Mock useUserAuthContext
const mockSetToken = vi.fn();
vi.mock("../src/contexts/UserAuthContext", () => ({
  useUserAuthContext: () => ({ token: null, setToken: mockSetToken }),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ to, children }) => <a href={to}>{children}</a>, // Mock Link component
  };
});

// Mock localStorage
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => null);
  vi.spyOn(global.Storage.prototype, "setItem").mockImplementation(() => null);
  vi.spyOn(global.Storage.prototype, "clear").mockImplementation(() => null);
});

test("renders Login page correctly", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByText("Welcome Back")).toBeInTheDocument();
  expect(screen.getByText("Login to Your Account")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
});

test("renders login form fields correctly", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

test("navigates to forgot password page when clicked", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const forgotPasswordLink = screen.getByText(/forgot password/i);
  expect(forgotPasswordLink).toHaveAttribute("href", "/forgot-password");
});

test("navigates to signup page when clicked", () => {
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const signUpLink = screen.getByText(/sign up here/i);
  expect(signUpLink).toHaveAttribute("href", "/signup");
});

test("submits login form successfully and navigates to dashboard", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: { token: "mockAuthToken" },
  });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByLabelText(/email/i), {
    target: { value: "user@example.com" },
  });
  fireEvent.change(screen.getByLabelText(/password/i), {
    target: { value: "password123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /login/i }));

  await waitFor(() => {
    expect(mockSetToken).toHaveBeenCalledWith("mockAuthToken");
    expect(global.Storage.prototype.setItem).toHaveBeenCalledWith(
      "authToken",
      "mockAuthToken"
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
  });
});

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
    expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
  });
});

test("redirects to dashboard if user is already logged in", () => {
  vi.spyOn(global.Storage.prototype, "getItem").mockImplementation(() => "mockAuthToken");

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
});
