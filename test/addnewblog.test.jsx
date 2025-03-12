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

// Mock window.alert to control and verify the alert behavior
global.alert = vi.fn();

// Setting up mock data and cleaning up before each test
beforeEach(() => {
  localStorage.setItem("authToken", "fakeToken");
  jwtDecode.mockReturnValue({ isAdmin: true });
  vi.clearAllMocks();
});

// Test to ensure the Add New Blog form renders with the correct fields
test("renders Add New Blog form with input fields", () => {
  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  // Verifying the presence of the Add New Blog heading and form fields
  expect(screen.getByText("Add New Blog Post")).toBeInTheDocument();
  expect(screen.getByLabelText(/title:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/author:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/content:/i)).toBeInTheDocument();
});

// Test to check form submission, including success message and API interaction
test("submits form and displays success message", async () => {
  // Mocking a successful response from the API
  axios.post.mockResolvedValueOnce({ data: { message: "Success" } });

  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  // Simulating form field changes
  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: "New Blog Title" },
  });

  fireEvent.change(screen.getByLabelText(/author/i), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByLabelText(/content/i), {
    target: { value: "This is a test blog content." },
  });

  // Simulating category selection
  fireEvent.click(screen.getByLabelText(/nutrition/i));

  // Finding and clicking the submit button
  fireEvent.click(screen.getByRole("button", { name: /create blog post/i }));

  // Waiting for the alert to be triggered
  await waitFor(() => {
    expect(global.alert).toHaveBeenCalledWith("Blog post added successfully!");
  });

  // Verifying the API call was made with the correct data
  expect(axios.post).toHaveBeenCalledWith(
    `${import.meta.env.VITE_AUTH_API_URL}/blog`,
    {
      title: "New Blog Title",
      author: "John Doe",
      content: "This is a test blog content.",
      tags: ["Nutrition"], // The selected checkbox tag
    },
    { headers: { Authorization: "Bearer fakeToken" } }
  );

  // Ensuring that the form is reset after submission
  expect(screen.getByLabelText(/title/i)).toHaveValue("");
  expect(screen.getByLabelText(/author/i)).toHaveValue("");
  expect(screen.getByLabelText(/content/i)).toHaveValue("");
});
