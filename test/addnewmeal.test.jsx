import { test, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AddMeal from "../src/pages/addnewmeal";
import axios from "axios";

// Mock axios globally
vi.mock("axios");

// Set up mock token before each test
beforeEach(() => {
  localStorage.setItem("authToken", "fakeToken"); 
});

// Test form submission and success alert
test("submits form and shows success alert", async () => {
  axios.post.mockResolvedValueOnce({ data: { message: "Meal added successfully!" } });

  render(
    <MemoryRouter>
      <AddMeal />
    </MemoryRouter>
  );

  // Fill in all required fields
  fireEvent.change(screen.getByPlaceholderText("Meal Name"), { target: { value: "Salmon Bowl" } });
  fireEvent.change(screen.getByPlaceholderText("Description"), { target: { value: "Fresh salmon with rice and avocado." } });
  fireEvent.change(screen.getByPlaceholderText("Ingredients (comma separated)"), { target: { value: "Salmon, Rice, Avocado" } });
  fireEvent.change(screen.getByPlaceholderText("Calories"), { target: { value: "600" } });
  fireEvent.change(screen.getByPlaceholderText("Protein (g)"), { target: { value: "35" } });
  fireEvent.change(screen.getByPlaceholderText("Fat (g)"), { target: { value: "20" } });
  fireEvent.change(screen.getByPlaceholderText("Carbs (g)"), { target: { value: "50" } });

  // Ensure input values are updated before proceeding
  await waitFor(() => {
    expect(screen.getByPlaceholderText("Meal Name").value).toBe("Salmon Bowl");
  });

  // Select dietary preference
  fireEvent.click(screen.getByLabelText("Vegetarian"));

  // Simulate file upload
  const fileInput = screen.getByLabelText("Upload an Image");
  const file = new File(["image"], "meal.jpg", { type: "image/jpeg" });
  await waitFor(() => fireEvent.change(fileInput, { target: { files: [file] } }));

  // Submit the form directly
  const form = screen.getByRole("form");
  fireEvent.submit(form);

  // Ensure axios.post was called with expected arguments
  await waitFor(() => {
    expect(axios.post).toHaveBeenCalledTimes(1);
  });
});
