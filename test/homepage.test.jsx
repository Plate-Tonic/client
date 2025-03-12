import { test, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Homepage from "../src/pages/homepage";

// Mock images to prevent errors during testing
vi.mock("../src/assets/istockphoto-636082286-612x612.jpg");
vi.mock("../src/assets/before-after-inline-2-cz-240705-4ec0d5.jpg");
vi.mock("../src/assets/katie-bolden-weight-loss-success-story-d90c538dd489423d94c6455dafd0db05.jpg");
vi.mock("../src/assets/1257296_444960205450_Banner-1.1copy.jpg");
vi.mock("../src/assets/marry-me-chicken2-65b3f9451efb6.avif");
vi.mock("../src/assets/lemon-shrimp-and-shaved-asparagus-66a174bf43c51.avif");
vi.mock("../src/assets/creole-shrimp-caesar-salad-with-cheesy-croutons-1677186680.avif");

beforeEach(() => {
    vi.clearAllMocks(); // Reset mocks before each test
});

// Test if the homepage renders correctly
test("renders Homepage correctly", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    // Verify key text elements are present
    expect(screen.getByText("Welcome to Plate Tonic")).toBeInTheDocument();
    expect(screen.getByText("Delicious, nutritious meals tailored for you.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /get started/i })).toBeInTheDocument();
});

// Test if the market statistics image is rendered
test("renders market statistics image", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    expect(screen.getByAltText("Market statistics graph")).toBeInTheDocument();
});

// Test if market statistics section is rendered with correct text
test("renders market statistics section with correct text", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    // Verify presence of key text and numbers in the statistics section
    expect(screen.getByText("Updating Recipes")).toBeInTheDocument();
    expect(screen.getByText("Frequently")).toBeInTheDocument();
    expect(screen.getByText("100K+")).toBeInTheDocument();
    expect(screen.getByText("Satisfied Users")).toBeInTheDocument();
    expect(screen.getByText("Deliveries")).toBeInTheDocument();
    expect(screen.getByText("COMING SOON")).toBeInTheDocument();
});

// Test if meal recommendations section is rendered
test("renders meal recommendations section", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    // Verify presence of meal recommendations and images
    expect(screen.getByText("Meal Recommendations")).toBeInTheDocument();
    expect(screen.getByAltText("Meal Option 1")).toBeInTheDocument();
    expect(screen.getByText("Grilled Chicken with Brown Rice")).toBeInTheDocument();
    expect(screen.getByText("500 Calories")).toBeInTheDocument();

    expect(screen.getByAltText("Meal Option 2")).toBeInTheDocument();
    expect(screen.getByText("Salmon & Roasted Vegetables")).toBeInTheDocument();
    expect(screen.getByText("450 Calories")).toBeInTheDocument();

    expect(screen.getByAltText("Meal Option 3")).toBeInTheDocument();
    expect(screen.getByText("Quinoa & Chickpea Bowl")).toBeInTheDocument();
    expect(screen.getByText("400 Calories")).toBeInTheDocument();
});

// Test if 'Choose your Meal' button is rendered
test("renders 'Choose your Meal' button", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    expect(screen.getByRole("button", { name: /choose your meal/i })).toBeInTheDocument();
});

// Test if testimonials section is rendered correctly
test("renders testimonials section correctly", () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    // Verify customer testimonials and images are displayed
    expect(screen.getByText("What Our Customers Say")).toBeInTheDocument();
    expect(screen.getByAltText("Happy customer 1")).toBeInTheDocument();
    expect(screen.getByText('"Plate Tonic has changed my meal planning forever!"')).toBeInTheDocument();
    expect(screen.getByText("- Alexa R.")).toBeInTheDocument();

    expect(screen.getByAltText("Happy customer 2")).toBeInTheDocument();
    expect(screen.getByText('"Great taste and amazing variety!"')).toBeInTheDocument();
    expect(screen.getByText("- Michael D.")).toBeInTheDocument();

    expect(screen.getByAltText("Happy customer 3")).toBeInTheDocument();
    expect(screen.getByText('"Exactly what I needed!"')).toBeInTheDocument();
    expect(screen.getByText("- Sarah.W.")).toBeInTheDocument();
});

// Test navigation to the 'Get Started' page when the button is clicked
test("navigates to get started page when 'Get Started' button is clicked", async () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    const getStartedButton = screen.getByRole("button", { name: /get started/i });

    // Verify the button navigates to the correct URL
    expect(getStartedButton.closest("a")).toHaveAttribute("href", "/getstarted");
});

// Test navigation to the 'Menu' page when 'Choose your Meal' button is clicked
test("navigates to menu page when 'Choose your Meal' button is clicked", async () => {
    render(
        <MemoryRouter>
            <Homepage />
        </MemoryRouter>
    );

    const chooseMealButton = screen.getByRole("button", { name: /choose your meal/i });

    // Verify the button navigates to the correct URL
    expect(chooseMealButton.closest("a")).toHaveAttribute("href", "/menu");
});
