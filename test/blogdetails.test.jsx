import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BlogDetail from "../src/pages/blogdetails";
import { BrowserRouter } from "react-router-dom";

// Mock fetch response
global.fetch = vi.fn(() =>
    Promise.resolve({
        json: () =>
            Promise.resolve({
                data: {
                    title: "Test Blog",
                    author: "John Doe",
                    tags: ["React", "Testing"],
                    content: "This is a test blog content.",
                },
            }),
    })
);

// Mock jwt-decode to always return isAdmin: true
vi.mock("jwt-decode", () => ({
    jwtDecode: () => ({ isAdmin: true }),
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
});

// Test if blog details are rendered correctly
test("renders blog details correctly", async () => {
    render(
        <BrowserRouter>
            <BlogDetail />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Check if blog details are displayed correctly
    expect(screen.getByText("Blog Detail")).toBeInTheDocument();
    expect(await screen.findByText("Test Blog")).toBeInTheDocument();
    expect(screen.getByText("Author: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Tags: React, Testing")).toBeInTheDocument();
    expect(screen.getByText("This is a test blog content.")).toBeInTheDocument();
});

// Test if clicking remove button shows confirmation popup
test("shows confirmation popup when clicking remove button", async () => {
    render(
        <BrowserRouter>
            <BlogDetail />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    // Ensure the "Remove Blog Post" button is present
    const removeButton = await screen.findByRole("button", {
        name: /remove blog post/i,
    });

    await userEvent.click(removeButton);

    // Check if the confirmation popup appears
    expect(
        await screen.findByText("Are you sure you want to remove this blog post?")
    ).toBeInTheDocument();
});

// Test if clicking back button navigates to blogs page
test("navigates back to blogs when clicking back button", async () => {
    render(
        <BrowserRouter>
            <BlogDetail />
        </BrowserRouter>
    );

    await waitFor(() => expect(fetch).toHaveBeenCalled());

    const backButton = screen.getByText("Back to Blogs");
    await userEvent.click(backButton);

    // Check if navigation happens to /blog
    expect(mockNavigate).toHaveBeenCalledWith("/blog");
});
