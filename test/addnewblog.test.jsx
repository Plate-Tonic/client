import { test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddNewBlog from "../src/pages/addnewblog";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Mock axios & jwtDecode
vi.mock("axios");
vi.mock("jwt-decode");

beforeEach(() => {
  localStorage.setItem("authToken", "fakeToken");
  jwtDecode.mockReturnValue({ isAdmin: true });
});

test("renders Add New Blog form with input fields", () => {
  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  screen.debug(); // Check rendered output

  expect(screen.getByText("Add New Blog Post")).toBeInTheDocument();
  expect(screen.getByLabelText("Title:")).toBeInTheDocument();
  expect(screen.getByLabelText("Author:")).toBeInTheDocument();
  expect(screen.getByLabelText("Content:")).toBeInTheDocument();
});

test("submits form and displays success message", async () => {
  axios.post.mockResolvedValueOnce({ data: { message: "Success" } });

  render(
    <MemoryRouter>
      <AddNewBlog />
    </MemoryRouter>
  );

  fireEvent.change(screen.getByRole("textbox", { name: /title/i }), {
    target: { value: "New Blog Title" },
  });

  fireEvent.change(screen.getByRole("textbox", { name: /author/i }), {
    target: { value: "John Doe" },
  });

  fireEvent.change(screen.getByRole("textbox", { name: /content/i }), {
    target: { value: "This is a test blog content." },
  });

  fireEvent.click(screen.getByText("Add Blog"));

  await screen.findByText(/blog post added successfully!/i);

  await waitFor(() => {
    expect(screen.getByText("Blog post added successfully!")).toBeInTheDocument();
  });
});
