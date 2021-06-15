import { mount } from "enzyme";
import { act } from "react-dom/test-utils";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

import DiscoveriesList from "./DiscoveriesList";

import type { RootState } from "app/store/root/types";
import {
  discovery as discoveryFactory,
  discoveryState as discoveryStateFactory,
  rootState as rootStateFactory,
} from "testing/factories";

const mockStore = configureStore();

describe("ZoneDetailsForm", () => {
  let initialState: RootState;

  beforeEach(() => {
    initialState = rootStateFactory({
      discovery: discoveryStateFactory({
        errors: {},
        loading: false,
        loaded: true,
        items: [
          discoveryFactory({
            hostname: "my-discovery-test",
          }),
          discoveryFactory({
            hostname: "another-test",
          }),
        ],
      }),
    });
  });

  it("runs closeForm function when the cancel button is clicked", () => {
    const store = mockStore(initialState);
    const wrapper = mount(
      <Provider store={store}>
        <DiscoveriesList />
      </Provider>
    );

    expect(wrapper.text().includes("my-discovery-test")).toBe(true);
    expect(wrapper.text().includes("another-test")).toBe(true);
  });
});
