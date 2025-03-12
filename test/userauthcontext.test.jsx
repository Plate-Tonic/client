import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserAuthContextProvider, useUserAuthContext } from "../src/contexts/UserAuthContext";

// A simple component to consume the context and test it
const TestComponent = () => {
  const { token, setToken, logout } = useUserAuthContext();

  return (
    <div>
      <div data-testid="token-display">{token}</div>
      <button onClick={() => setToken("testToken")}>Set Token</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

// ✅ **TEST: UserAuthContext initializes with token from localStorage**
test("initializes with token from localStorage", () => {
  // Mock localStorage to simulate a token being stored
  localStorage.setItem("authToken", "storedToken");

  render(
    <MemoryRouter>
      <UserAuthContextProvider>
        <TestComponent />
      </UserAuthContextProvider>
    </MemoryRouter>
  );

  // Check if the token from localStorage is displayed
  expect(screen.getByTestId("token-display")).toHaveTextContent("storedToken");

  // Cleanup localStorage
  localStorage.removeItem("authToken");
});

// ✅ **TEST: UserAuthContext updates token and stores it in localStorage**
test("updates token and stores it in localStorage", () => {
  render(
    <MemoryRouter>
      <UserAuthContextProvider>
        <TestComponent />
      </UserAuthContextProvider>
    </MemoryRouter>
  );

  const setTokenButton = screen.getByText("Set Token");

  // Click to set a new token
  fireEvent.click(setTokenButton);

  // Check if the token is updated in the context and displayed
  expect(screen.getByTestId("token-display")).toHaveTextContent("testToken");

  // Check if the token is stored in localStorage
  expect(localStorage.getItem("authToken")).toBe("testToken");
});

// ✅ **TEST: UserAuthContext logout clears token and localStorage**
test("logout clears token and localStorage", () => {
  // Mock localStorage with a token
  localStorage.setItem("authToken", "storedToken");

  render(
    <MemoryRouter>
      <UserAuthContextProvider>
        <TestComponent />
      </UserAuthContextProvider>
    </MemoryRouter>
  );

  const logoutButton = screen.getByText("Logout");

  // Click to log out and clear the token
  fireEvent.click(logoutButton);

  // Check if the token is cleared in the context and localStorage
  expect(screen.getByTestId("token-display")).toHaveTextContent("");
  expect(localStorage.getItem("authToken")).toBeNull();
});
