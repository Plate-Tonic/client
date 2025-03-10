import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ForgetPassword from "../src/pages/forgetpassword";
import axios from "axios";

// Mock axios
vi.mock("axios");

beforeEach(() => {
  vi.clearAllMocks();
});

test("renders forget password page", () => {
  render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );

  // Check page title
  expect(screen.getByText("Reset Your Password")).toBeInTheDocument();

  // Check email input field and button
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /next/i })).toBeInTheDocument();
});

test("submits email and proceeds to security question step", async () => {
  axios.post.mockResolvedValueOnce({
    status: 200,
    data: { securityQuestion: "What is your pet's name?" },
  });

  render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );

  // Enter email
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });

  // Click Next
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Wait for Security Question step
  await waitFor(() => {
    expect(screen.getByText(/security question/i)).toBeInTheDocument();
  });

  expect(screen.getByText("What is your pet's name?")).toBeInTheDocument();
});

test("submits security answer and proceeds to password reset step", async () => {
  axios.post
    .mockResolvedValueOnce({ status: 200, data: { securityQuestion: "What is your pet's name?" } })
    .mockResolvedValueOnce({ status: 200 });

  render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );

  // Enter email
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Wait for Security Question step
  await waitFor(() => {
    expect(screen.getByText(/security question/i)).toBeInTheDocument();
  });

  // Enter security answer
  fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: "Fluffy" } });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Wait for Password Reset step
  await waitFor(() => {
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });
});

test("validates password reset and submits successfully", async () => {
  axios.post
    .mockResolvedValueOnce({ status: 200, data: { securityQuestion: "What is your pet's name?" } }) // Mock email step
    .mockResolvedValueOnce({ status: 200 }) // Mock security answer step
    .mockResolvedValueOnce({ status: 200 }); // Mock password reset step

  render(
    <MemoryRouter>
      <ForgetPassword />
    </MemoryRouter>
  );

  // Enter email
  fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "user@example.com" } });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Wait for Security Question step
  await waitFor(() => {
    expect(screen.getByText(/security question/i)).toBeInTheDocument();
  });

  // Enter security answer
  fireEvent.change(screen.getByLabelText(/answer/i), { target: { value: "Fluffy" } });
  fireEvent.click(screen.getByRole("button", { name: /next/i }));

  // Wait for Password Reset step
  await waitFor(() => {
    expect(screen.getByText(/reset your password/i)).toBeInTheDocument();
  });

  // ✅ Get inputs using exact IDs instead of generic label text
  const newPasswordInput = screen.getByLabelText("New Password:");
  const confirmPasswordInput = screen.getByLabelText("Confirm New Password:");

  // Enter new passwords
  fireEvent.change(newPasswordInput, { target: { value: "newpassword123" } });
  fireEvent.change(confirmPasswordInput, { target: { value: "newpassword123" } });

  // Click Reset Password
  fireEvent.click(screen.getByRole("button", { name: /reset password/i }));

  // Ensure axios was called with correct data
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledWith("http://localhost:8008/reset-password", {
      email: "user@example.com",
      newPassword: "newpassword123",
    });
  });
});
