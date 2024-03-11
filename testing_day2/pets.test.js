import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";
import catsMock from "../../../mocks/cats.json";
import Pets from "../Pets";

//mocking->faking

const server = setupServer(
  rest.get("http://localhost:4000/cats", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(catsMock));
  })
);

describe("Test Pets Component", () => {
  beforeEach(() => {
    render(<Pets />);
  });

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

  afterAll(() => server.close());

  test("Test it should render only favorite cats", async () => {
    const cards = await screen.findAllByRole("article");
    userEvent.selectOptions(screen.getByLabelText(/Favourite/i), "favoured");
    expect(screen.getAllByRole("article").length).toBe(2);
    expect(screen.getAllByRole("article")).toStrictEqual([cards[0], cards[1]]);
  });
});
