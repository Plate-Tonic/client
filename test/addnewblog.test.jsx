import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddNewBlog from "../src/pages/addnewblog";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Mock axios and jwtDecode
vi.mock("axios");
vi.mock("jwt-decode", () => ({
  jwtDecode: vi.fn(),
}));

// Mock window.alert
global.alert = vi.fn();

beforeEach(() => {
  // Ensure the user is an admin for the test
  localStorage.setItem("authToken", "fakeToken");
  jwtDecode.mockReturnValue({ isAdmin: true });

  // Clear mocks before each test
  vi.clearAllMocks();
});

test("renders Add New Blog form with input fields", () => {
  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  expect(screen.getByText("Add New Blog Post")).toBeInTheDocument();
  expect(screen.getByLabelText(/title:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/author:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/content:/i)).toBeInTheDocument();
});

test("submits form and displays success message", async () => {
  // Mock successful API response
  axios.post.mockResolvedValueOnce({ data: { message: "Success" } });

  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  // Fill out form fields
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "New Blog Title" },
  });

  fireEvent.change(screen.getByLabelText(/author/i), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText(/content/i), {
    target: { value: "This is a test blog content." },
  });

  // Select a category
  fireEvent.click(screen.getByLabelText(/nutrition/i));

  // Find and click the submit button
  fireEvent.click(screen.getByRole("button", { name: /create blog post/i }));

  // Wait for the alert to be triggered
  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Blog post added successfully!");
  });

  // Verify axios was called with correct data
  expect(axios.post).toHaveBeenCalledWith(
    `${import.meta.env.VITE_AUTH_API_URL}/blog`,
    {
      title: "New Blog Title",
      author: "John Doe",
      content: "This is a test blog content.",
      tags: ["Nutrition"], // Checkbox selection
    },
    { headers: { Authorization: "Bearer fakeToken" } }
  );

  // Ensure form is reset after submission
  expect(screen.getByLabelText(/title/i)).toHaveValue("");
  expect(screen.getByLabelText(/author/i)).toHaveValue("");
  expect(screen.getByLabelText(/content/i)).toHaveValue("");
});
