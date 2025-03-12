import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";
import { UserAuthContextProvider } from "../src/contexts/UserAuthContext";

// If Navbar & Footer are rendered
test("renders App component with Navbar and Footer", () => {
    render(
        <UserAuthContextProvider>
            <App />
        </UserAuthContextProvider>
    );

    expect(screen.getByRole("navigation")).toBeInTheDocument();

    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

// Routing works correctly for different pages
test("renders correct page on navigation", () => {
    render(
        <UserAuthContextProvider>
            <App />
        </UserAuthContextProvider>
    );

    // Get the "Menu" link by its text and click on it
    const menuLink = screen.getByText(/menu/i);
    fireEvent.click(menuLink);

    // Check if the "Menu" page is rendered by looking for text specific to that page
    expect(screen.getByText(/choose your meal/i)).toBeInTheDocument();
});

// Test if UserAuthContextProvider is working
test("UserAuthContextProvider is working", () => {
    render(
        <UserAuthContextProvider>
            <App />
        </UserAuthContextProvider>
    );

    // Check if context-based components work
    expect(screen.getByText(/menu/i)).toBeInTheDocument();
});

// Rendering with the login page
test("login page renders correctly", () => {
    render(
        <UserAuthContextProvider>
            <App />
        </UserAuthContextProvider>
    );

    // Use getByRole for button with login text
    const loginButton = screen.getByRole("link", { name: /login/i });

    // Check if the login button is present
    expect(loginButton).toBeInTheDocument();
});
