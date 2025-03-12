import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Terms from "../src/pages/terms-and-conditions";

// Renders Terms and Conditions page
test("renders Terms and Conditions page", () => {
    render(
        <MemoryRouter>
            <Terms />
        </MemoryRouter>
    );

    // Check if the page title is rendered
    expect(screen.getByText(/terms & conditions/i)).toBeInTheDocument();

    // Check if the first section of the terms and conditions is rendered
    expect(screen.getByText(/1. service description/i)).toBeInTheDocument();
    expect(screen.getByText(/PlateTonic is an informational website/i)).toBeInTheDocument();

    // Check if the second section of the terms is rendered
    expect(screen.getByText(/2. user data & privacy/i)).toBeInTheDocument();
    expect(screen.getByText(/Your personal data is handled/i)).toBeInTheDocument();

    // Check if the "Contact Us" link is rendered
    expect(screen.getByText(/contact us/i)).toBeInTheDocument();
});

// "Contact Us" link navigates correctly**
test('navigates to "Contact Us" page when clicked', () => {
    render(
        <MemoryRouter>
            <Terms />
        </MemoryRouter>
    );

    // Find the "Contact Us" link and click it
    const contactLink = screen.getByText(/contact us/i);
    expect(contactLink.closest('a')).toHaveAttribute('href', '/contact');
});
