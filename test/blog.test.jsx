import { test, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import Blog from "../src/pages/blog";

// Mock useNavigate from react-router-dom
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        useNavigate: vi.fn(() => mockNavigate),
    };
});

// Generate a valid mock JWT token
const mockJwtToken = JSON.stringify(
    btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })) + // Header
    "." +
    btoa(JSON.stringify({ isAdmin: true, exp: Math.floor(Date.now() / 1000) + 3600 })) + // Payload
    "." +
    btoa("signature") // Fake Signature
);

// Ensure beforeEach() resets mocks correctly
beforeEach(() => {
    vi.restoreAllMocks(); // Clears any previous mocks

    // Mock localStorage for auth token
    vi.spyOn(Storage.prototype, "getItem").mockImplementation((key) => {
        if (key === "authToken") {
            return mockJwtToken;
        }
        return null;
    });

    // Mock Fetch API
    global.fetch = vi.fn(async () =>
        Promise.resolve({
            ok: true,
            json: async () =>
                Promise.resolve({
                    data: [
                        { _id: "1", title: "Healthy Eating Tips", tags: ["Nutrition"] },
                        { _id: "2", title: "Meal Prep for Beginners", tags: ["Meal Prep"] },
                    ],
                }),
        })
    );
});

// Cleanup after each test
afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

// Test if the Blog page renders the main title
test("renders blog page with title", () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    expect(screen.getByText("Blog & Articles")).toBeInTheDocument();
});

// Test if the filter section is rendered
test("renders filter section", () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    expect(screen.getByText("Filter by Tags")).toBeInTheDocument();
});

// Test if the "Latest Posts" section is rendered
test("renders latest posts section", () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    expect(screen.getByText("Latest Posts")).toBeInTheDocument();
});

// Test if clicking a filter checkbox selects and deselects it
test("allows selecting and deselecting filters", async () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    const checkbox = screen.getByLabelText("Nutrition");

    await userEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    await userEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
});

// Test if fetched blog posts are rendered
test("fetches and displays blogs", async () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText("Healthy Eating Tips")).toBeInTheDocument();
        expect(screen.getByText("Meal Prep for Beginners")).toBeInTheDocument();
    });
});

// Test API error handling
test("displays error message if blog fetch fails", async () => {
    global.fetch.mockImplementationOnce(() =>
        Promise.reject(new Error("Network error"))
    );

    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(
            screen.getByText("Failed to load blog posts. Please try again later.")
        ).toBeInTheDocument();
    });
});

// Test if "Add New Blog" button is only visible to admins
test("shows 'Add New Blog' button only for admins", async () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    await waitFor(() => {
        expect(screen.getByText("+ Add New Blog")).toBeInTheDocument();
    });

    // Simulate a non-admin user
    vi.spyOn(Storage.prototype, "getItem").mockImplementationOnce(() => null);

    cleanup();
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    expect(screen.queryByText("+ Add New Blog")).not.toBeInTheDocument();
});

// Test if clicking "Read More" navigates to the correct blog page
test("navigates to blog detail page on 'Read More' click", async () => {
    render(
        <MemoryRouter>
            <Blog />
        </MemoryRouter>
    );

    // Ensure the blogs are loaded first
    await waitFor(() => {
        expect(screen.getByText("Healthy Eating Tips")).toBeInTheDocument();
    });

    // Find the correct blog post container
    const blogPost = screen.getByText("Healthy Eating Tips").closest(".blog-item");

    // Find the "Read More" button within that blog post
    const readMoreButton = blogPost.querySelector("button");

    // Click the button
    await userEvent.click(readMoreButton);

    // Check if navigation was called with the correct blog ID
    expect(mockNavigate).toHaveBeenCalledWith("/blog/1");

});
