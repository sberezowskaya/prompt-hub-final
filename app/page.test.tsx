import { render, screen } from "@testing-library/react";
import Home from "./page";

// Мокаем fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([]),
  })
) as jest.Mock;

describe("Home Page", () => {
  it("renders the main heading", () => {
    render(<Home />);
    expect(screen.getByText(/Prompt Hub/i)).toBeInTheDocument();
  });
});