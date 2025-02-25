import type { ActionFormProps } from "./ActionForm";
import ActionForm, { Labels } from "./ActionForm";

import { TestIds } from "@/app/base/components/FormikFormButtons";
import { userEvent, screen, renderWithBrowserRouter } from "@/testing/utils";

describe("ActionForm", () => {
  it("shows a spinner if form has not fully loaded", () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        loaded={false}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={0}
        selectedCount={1}
      />
    );

    expect(
      screen.getByRole("alert", { name: Labels.LoadingForm })
    ).toBeInTheDocument();
  });

  it("can show the default submit label", () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={0}
        selectedCount={1}
      />
    );

    expect(
      screen.getByRole("button", { name: "Process machine" })
    ).toBeInTheDocument();
  });

  it("can override the submit label", () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={0}
        selectedCount={1}
        submitLabel="Special save"
      />
    );

    expect(
      screen.getByRole("button", { name: "Special save" })
    ).toBeInTheDocument();
  });

  it("can show the correct saving state", async () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={1}
        selectedCount={2}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 1 of 2 machines..."
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("disables the submit button when selectedCount equals 0", async () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        selectedCount={0}
      />
    );

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("shows correct saving label if selectedCount changes after submit", async () => {
    const Proxy = ({ selectedCount }: Partial<ActionFormProps<object>>) => (
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={2}
        selectedCount={selectedCount}
      />
    );
    const { rerender } = renderWithBrowserRouter(<Proxy selectedCount={2} />);

    // Submit the form to start processing.
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 0 of 2 machines..."
    );

    // Change the selected count prop - the label should stay the same.
    rerender(<Proxy selectedCount={1} />);

    expect(screen.getByTestId(TestIds.SavingLabel).textContent).toBe(
      "Processing 0 of 2 machines..."
    );
  });

  it("can override showing the processing count", async () => {
    renderWithBrowserRouter(
      <ActionForm
        actionName="action"
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
        processingCount={1}
        selectedCount={2}
        showProcessingCount={false}
      />
    );

    await userEvent.click(screen.getByRole("button"));

    expect(screen.queryByTestId(TestIds.SavingLabel)).not.toBeInTheDocument();
  });

  it("displays a correct action status", () => {
    const Proxy = ({
      actionStatus,
      errors,
    }: Partial<ActionFormProps<object>>) => (
      <ActionForm
        actionName="action"
        actionStatus={actionStatus}
        errors={errors}
        initialValues={{}}
        modelName="machine"
        onSubmit={vi.fn()}
      />
    );

    const { rerender } = renderWithBrowserRouter(
      <Proxy actionStatus="loading" />
    );
    expect(screen.getByTestId(TestIds.SavingLabel)).toBeInTheDocument();

    rerender(<Proxy actionStatus="success" />);
    expect(screen.queryByTestId(TestIds.SavingLabel)).not.toBeInTheDocument();

    const errors = { field: "Error message" };
    rerender(<Proxy errors={errors} />);
    expect(screen.getByText("Error message")).toBeInTheDocument();
  });

  it("sets saved status when processingCount drops to 0", () => {
    const onSubmit = vi.fn();
    const Proxy = ({ processingCount }: Partial<ActionFormProps<object>>) => (
      <ActionForm
        actionName="action"
        actionStatus="idle"
        initialValues={{}}
        modelName="machine"
        onSubmit={onSubmit}
        processingCount={processingCount}
      />
    );

    const { rerender } = renderWithBrowserRouter(<Proxy processingCount={1} />);
    expect(screen.getByTestId(TestIds.SavingLabel)).toBeInTheDocument();

    rerender(<Proxy processingCount={0} />);
    expect(screen.queryByTestId(TestIds.SavingLabel)).not.toBeInTheDocument();
  });
});
