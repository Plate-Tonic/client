import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Contact from "../src/pages/contact";

// Mock window.alert to prevent actual alert pop-ups during testing
beforeEach(() => {
    vi.spyOn(window, "alert").mockImplementation(() => { });
});

test("renders Contact Us page with form fields", () => {
    render(
        <MemoryRouter>
            <Contact />
        </MemoryRouter>
    );

    // Check page heading
    expect(screen.getByText("Contact Us")).toBeInTheDocument();

    // Check form fields
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();

    // Check submit button
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
});

test("submits form and triggers alert", async () => {
    render(
        <MemoryRouter>
            <Contact />
        </MemoryRouter>
    );

    // Fill out form fields
    fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: "John Doe" },
    });

    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: "john@example.com" },
    });

    fireEvent.change(screen.getByLabelText(/message/i), {
        target: { value: "This is a test message." },
    });

    // Click submit button
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    // Ensure alert was called
    expect(window.alert).toHaveBeenCalledWith(
        "Thank you for your message! We will get back to you soon."
    );
});

test("renders contact information", () => {
    render(
        <MemoryRouter>
            <Contact />
        </MemoryRouter>
    );

    // Check for address and email display
    expect(screen.getByText(/123 example street, sydney, australia/i)).toBeInTheDocument();
    expect(screen.getByText(/support@platetonic.com/i)).toBeInTheDocument();
});
