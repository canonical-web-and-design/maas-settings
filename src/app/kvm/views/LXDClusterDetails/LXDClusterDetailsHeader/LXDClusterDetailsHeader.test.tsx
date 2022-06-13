import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { CompatRouter } from "react-router-dom-v5-compat";
import configureStore from "redux-mock-store";

import LXDClusterDetailsHeader from "./LXDClusterDetailsHeader";

import { KVMHeaderViews } from "app/kvm/constants";
import kvmURLs from "app/kvm/urls";
import type { RootState } from "app/store/root/types";
import {
  rootState as rootStateFactory,
  vmCluster as vmClusterFactory,
  vmHost as vmHostFactory,
  vmClusterState as vmClusterStateFactory,
  virtualMachine as virtualMachineFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("LXDClusterDetailsHeader", () => {
  let state: RootState;

  beforeEach(() => {
    const zone = zoneFactory({ id: 111, name: "danger" });
    const cluster = vmClusterFactory({
      availability_zone: zone.id,
      id: 1,
      name: "vm-cluster",
      project: "cluster-project",
    });
    state = rootStateFactory({
      vmcluster: vmClusterStateFactory({
        items: [cluster],
      }),
      zone: zoneStateFactory({
        items: [zone],
      }),
    });
  });

  it("displays a spinner if cluster hasn't loaded", () => {
    state.vmcluster.items = [];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("displays the cluster member count", () => {
    state.vmcluster.items[0].hosts = [vmHostFactory(), vmHostFactory()];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[0]).toHaveTextContent(
      "2 members"
    );
  });

  it("displays the tracked VMs count", () => {
    state.vmcluster.items[0].virtual_machines = [
      virtualMachineFactory(),
      virtualMachineFactory(),
      virtualMachineFactory(),
    ];
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[1]).toHaveTextContent(
      "3 available"
    );
  });

  it("displays the cluster's zone's name", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[2]).toHaveTextContent(
      "danger"
    );
  });

  it("displays the cluster's project", () => {
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={jest.fn()}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getAllByTestId("block-subtitle")[3]).toHaveTextContent(
      "cluster-project"
    );
  });

  it("can open the refresh cluster form if it has hosts", async () => {
    const hosts = [vmHostFactory(), vmHostFactory()];
    state.vmcluster.items[0].hosts = hosts;
    const setHeaderContent = jest.fn();
    const store = mockStore(state);
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: kvmURLs.lxd.cluster.index({ clusterId: 1 }),
              key: "testKey",
            },
          ]}
        >
          <CompatRouter>
            <LXDClusterDetailsHeader
              clusterId={1}
              headerContent={null}
              setHeaderContent={setHeaderContent}
              setSearchFilter={jest.fn()}
            />
          </CompatRouter>
        </MemoryRouter>
      </Provider>
    );

    await userEvent.click(
      screen.getByRole("button", { name: "Refresh cluster" })
    );

    expect(setHeaderContent).toHaveBeenCalledWith({
      view: KVMHeaderViews.REFRESH_KVM,
      extras: { hostIds: hosts.map((host) => host.id) },
    });
  });
});
