/* eslint-disable testing-library/no-node-access */
/* eslint-disable testing-library/no-container */

import TableHeader from "./TableHeader";

import { SortDirection } from "app/base/types";
import { render, screen } from "testing/utils";

describe("TableHeader ", () => {
  it("renders a div if no onClick prop is present", () => {
    const { container } = render(<TableHeader>Text</TableHeader>);
    expect(screen.queryByRole("button")).toBeNull();
    expect(container.querySelector("div")).toBeInTheDocument();
  });

  it("renders a Button if onClick prop is present", () => {
    const mockFn = jest.fn();
    render(<TableHeader onClick={mockFn}>Text</TableHeader>);
    expect(screen.getByRole("button")).toBeInTheDocument();

    screen.getByRole("button").click();
    expect(mockFn).toHaveBeenCalled();
  });

  it("renders a contextual icon if currentSort.key matches sortKey", () => {
    const currentSort = {
      key: "key",
      direction: SortDirection.DESCENDING,
    };
    const { container } = render(
      <TableHeader
        currentSort={currentSort}
        onClick={jest.fn()}
        sortKey={"key"}
      >
        Text
      </TableHeader>
    );
    expect(
      container.querySelector(".p-icon--chevron-down")
    ).toBeInTheDocument();
  });

  it(`renders a flipped contextual icon if currentSort.key matches sortKey
    and direction is ascending`, () => {
    const currentSort = {
      key: "key",
      direction: SortDirection.ASCENDING,
    };
    const { container } = render(
      <TableHeader
        currentSort={currentSort}
        onClick={jest.fn()}
        sortKey={"key"}
      >
        Text
      </TableHeader>
    );
    expect(container.querySelector(".p-icon--chevron-up")).toBeInTheDocument();
  });
});
