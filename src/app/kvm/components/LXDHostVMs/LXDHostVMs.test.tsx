import configureStore from "redux-mock-store";

import LXDHostVMs from "./LXDHostVMs";

import { KVMSidePanelViews } from "@/app/kvm/constants";
import { machineActions } from "@/app/store/machine";
import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen, userEvent } from "@/testing/utils";

const mockStore = configureStore<RootState>();

describe("LXDHostVMs", () => {
  it("shows a spinner if pod has not loaded yet", () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [],
        loaded: false,
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/kvm/1/project", store }
    );

    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  it("can view resources by NUMA node", async () => {
    const state = factory.rootState({
      pod: factory.podState({
        items: [
          factory.pod({
            id: 1,
            resources: factory.podResources({ numa: [factory.podNuma()] }),
          }),
        ],
      }),
    });

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/kvm/1", state }
    );

    expect(screen.queryByTestId("numa-resources")).not.toBeInTheDocument();

    await userEvent.click(screen.getByTestId("numa-switch"));

    expect(screen.getByTestId("numa-resources")).toBeInTheDocument();
  });

  it("displays the host name when in a cluster", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    renderWithBrowserRouter(
      <LXDHostVMs
        clusterId={2}
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on ${pod.name}`
    );
  });

  it("does not display the host name when in a single host", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { route: "/kvm/1", state }
    );
    expect(screen.getByTestId("toolbar-title")).toHaveTextContent(
      `VMs on this host`
    );
  });

  it("can open the compose VM form", async () => {
    const pod = factory.pod({ id: 1 });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    const setSidePanelContent = vi.fn();
    const store = mockStore(state);
    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={setSidePanelContent}
      />,
      { route: "/kvm/1", store }
    );

    await userEvent.click(screen.getByTestId("add-vm"));

    expect(setSidePanelContent).toHaveBeenCalledWith({
      view: KVMSidePanelViews.COMPOSE_VM,
      extras: {
        hostId: 1,
      },
    });
  });

  it("fetches VMs for the host", async () => {
    const pod = factory.pod({ id: 1, name: "cluster host" });
    const state = factory.rootState({
      pod: factory.podState({
        items: [pod],
      }),
    });
    const store = mockStore(state);

    renderWithBrowserRouter(
      <LXDHostVMs
        hostId={1}
        searchFilter=""
        setSearchFilter={vi.fn()}
        setSidePanelContent={vi.fn()}
      />,
      { store }
    );
    const expected = machineActions.fetch("123456", {
      filter: { pod: [pod.name] },
    });

    const fetches = store
      .getActions()
      .filter((action) => action.type === expected.type);
    expect(fetches[fetches.length - 1].payload.params.filter).toStrictEqual({
      pod: [pod.name],
    });
  });
});
