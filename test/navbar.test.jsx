import { test } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../src/components/navbar";
import { FaBars, FaTimes } from "react-icons/fa";

// Navbar renders correctly
test("renders Navbar component", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument(); // Check if navigation element is rendered
});

// Navbar contains expected navigation links
test("navbar contains expected links", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    // Check if navigation links are rendered with correct href attributes
    expect(screen.getByRole("link", { name: /get started/i })).toHaveAttribute("href", "/getstarted");
    expect(screen.getByRole("link", { name: /menu/i })).toHaveAttribute("href", "/menu");
    expect(screen.getByRole("link", { name: /about/i })).toHaveAttribute("href", "/about");
    expect(screen.getByRole("link", { name: /blog/i })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: /contact/i })).toHaveAttribute("href", "/contact");
});

// Clicking the menu button toggles the menu
test("clicking the menu button toggles the menu", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    const menuButton = screen.getByRole("button", { name: /toggle navigation menu/i });

    // Menu should be closed by default
    const initialIcon = menuButton.querySelector("svg");
    expect(initialIcon).toBeInTheDocument();
    expect(initialIcon.tagName).toBe("svg"); // Corrected to lowercase "svg" tag name

    // Click the menu button to open
    fireEvent.click(menuButton);
    const afterClickIcon = menuButton.querySelector("svg");
    expect(afterClickIcon).toBeInTheDocument();
    expect(afterClickIcon).not.toEqual(initialIcon); // FaBars and FaTimes are different elements

    // Click again to close
    fireEvent.click(menuButton);
    const afterSecondClickIcon = menuButton.querySelector("svg");
    expect(afterSecondClickIcon).toBeInTheDocument();
    expect(afterSecondClickIcon).toEqual(initialIcon); // FaBars should be visible again
});

// Clicking logo navigates to home page
test("clicking the logo navigates to home page", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    const logoLink = screen.getByRole("link", { name: /plate tonic logo/i });

    expect(logoLink).toHaveAttribute("href", "/"); // Check if logo link navigates to home page
});

// User login icon navigates to login page
test("user login icon navigates to login page", () => {
    render(
        <MemoryRouter>
            <Navbar />
        </MemoryRouter>
    );

    const loginLink = screen.getByRole("link", { name: /user login/i });

    expect(loginLink).toHaveAttribute("href", "/login"); // Check if login link navigates to login page
});
