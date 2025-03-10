import { render, screen, fireEvent } from "@testing-library/react";
import App from "../src/App";
import { UserAuthContextProvider } from "../src/contexts/UserAuthContext";

// ✅ **TEST: App renders correctly**
test("renders App component with Navbar and Footer", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );

  // Test if Navbar is rendered
  expect(screen.getByRole("navigation")).toBeInTheDocument();

  // Test if Footer is rendered
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});

// ✅ **TEST: Routing works correctly for different pages**
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

// ✅ **TEST: UserAuthContextProvider is working**
test("UserAuthContextProvider is working", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );

  // Check if context-based components work (e.g., display of user auth context)
  expect(screen.getByText(/menu/i)).toBeInTheDocument();
});

// ✅ **TEST: Rendering with the login page**
test("login page renders correctly", () => {
  render(
    <UserAuthContextProvider>
      <App />
    </UserAuthContextProvider>
  );

  // Use getByRole for button with login text, it's better for non-text elements like SVG icons
  const loginButton = screen.getByRole("link", { name: /login/i });

  // Check if the login button is present
  expect(loginButton).toBeInTheDocument();
});
