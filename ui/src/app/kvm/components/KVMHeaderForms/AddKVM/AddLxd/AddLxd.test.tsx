import { mount } from "enzyme";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import configureStore from "redux-mock-store";

import AddLxd from "./AddLxd";

import { PodType } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import {
  configState as configStateFactory,
  generalState as generalStateFactory,
  podProject as podProjectFactory,
  podState as podStateFactory,
  powerField as powerFieldFactory,
  powerType as powerTypeFactory,
  powerTypesState as powerTypesStateFactory,
  resourcePool as resourcePoolFactory,
  resourcePoolState as resourcePoolStateFactory,
  rootState as rootStateFactory,
  zone as zoneFactory,
  zoneState as zoneStateFactory,
} from "testing/factories";
import { submitFormikForm } from "testing/utils";

const mockStore = configureStore();

describe("AddLxd", () => {
  let state: RootState;

  beforeEach(() => {
    state = rootStateFactory({
      config: configStateFactory({
        items: [{ name: "maas_name", value: "MAAS" }],
      }),
      general: generalStateFactory({
        powerTypes: powerTypesStateFactory({
          data: [
            powerTypeFactory({
              name: PodType.LXD,
              fields: [
                powerFieldFactory({ name: "power_address" }),
                powerFieldFactory({ name: "password" }),
              ],
            }),
          ],
          loaded: true,
        }),
      }),
      pod: podStateFactory({
        loaded: true,
      }),
      resourcepool: resourcePoolStateFactory({
        items: [resourcePoolFactory()],
        loaded: true,
      }),
      zone: zoneStateFactory({
        items: [zoneFactory()],
        loaded: true,
      }),
    });
  });

  it("shows the credentials form by default", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddLxd clearHeaderContent={jest.fn()} setKvmType={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    expect(wrapper.find("CredentialsForm").exists()).toBe(true);
    expect(wrapper.find("AuthenticationForm").exists()).toBe(false);
    expect(wrapper.find("SelectProjectForm").exists()).toBe(false);
  });

  it("shows the authentication form if choosing to generate certificate and key", () => {
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddLxd clearHeaderContent={jest.fn()} setKvmType={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    // Submit credentials form
    submitFormikForm(wrapper, {
      name: "my-favourite-kvm",
      pool: 0,
      power_address: "192.168.1.1",
      zone: 0,
    });
    wrapper.update();

    expect(wrapper.find("CredentialsForm").exists()).toBe(false);
    expect(wrapper.find("AuthenticationForm").exists()).toBe(true);
    expect(wrapper.find("SelectProjectForm").exists()).toBe(false);
  });

  it("shows the project select form once authenticated", () => {
    state.pod.projects = {
      "192.168.1.1": [podProjectFactory()],
    };
    const store = mockStore(state);
    const wrapper = mount(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[{ pathname: "/kvm/add", key: "testKey" }]}
        >
          <AddLxd clearHeaderContent={jest.fn()} setKvmType={jest.fn()} />
        </MemoryRouter>
      </Provider>
    );

    // Submit credentials form
    submitFormikForm(wrapper, {
      name: "my-favourite-kvm",
      pool: 0,
      power_address: "192.168.1.1",
      zone: 0,
    });
    wrapper.update();

    expect(wrapper.find("CredentialsForm").exists()).toBe(false);
    expect(wrapper.find("AuthenticationForm").exists()).toBe(false);
    expect(wrapper.find("SelectProjectForm").exists()).toBe(true);
  });
});
