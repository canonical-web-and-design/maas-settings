import { mount } from "enzyme";
import React from "react";

import ContextualMenu, { getDropdownPosition } from "./ContextualMenu";

describe("ContextualMenu ", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it("renders", () => {
    const wrapper = mount(<ContextualMenu links={[]} />);
    expect(wrapper.find("ContextualMenu")).toMatchSnapshot();
  });

  it("can be aligned to the right", () => {
    const wrapper = mount(<ContextualMenu links={[]} position="right" />);
    expect(wrapper.find(".p-contextual-menu").exists()).toBe(true);
  });

  it("can be aligned to the left", () => {
    const wrapper = mount(<ContextualMenu links={[]} position="left" />);
    expect(wrapper.find(".p-contextual-menu--left").exists()).toBe(true);
  });

  it("can be aligned to the center", () => {
    const wrapper = mount(<ContextualMenu links={[]} position="center" />);
    expect(wrapper.find(".p-contextual-menu--center").exists()).toBe(true);
  });

  it("can have a toggle button", () => {
    const wrapper = mount(<ContextualMenu links={[]} toggleLabel="Toggle" />);
    expect(wrapper.find("button.p-contextual-menu__toggle").exists()).toBe(
      true
    );
  });

  it("can be disabled", () => {
    const wrapper = mount(
      <ContextualMenu links={[]} toggleDisabled toggleLabel="Toggle" />
    );
    expect(
      wrapper.find("button.p-contextual-menu__toggle").props().disabled
    ).toBe(true);
  });

  it("can have a toggle button with an icon", () => {
    const wrapper = mount(<ContextualMenu hasToggleIcon links={[]} />);
    expect(
      wrapper
        .find("button.p-contextual-menu__toggle .p-contextual-menu__indicator")
        .exists()
    ).toBe(true);
  });

  it("makes the icon light if the toggle is positive or negative", () => {
    const positive = mount(
      <ContextualMenu hasToggleIcon links={[]} toggleAppearance="positive" />
    );
    expect(
      positive
        .find("button.p-contextual-menu__toggle .p-contextual-menu__indicator")
        .hasClass("is-light")
    ).toBe(true);
  });

  it("can have a toggle button with an icon and text on the left", () => {
    const wrapper = mount(
      <ContextualMenu
        hasToggleIcon
        links={[]}
        toggleLabel="Toggle"
        toggleLabelFirst
      />
    );
    expect(
      wrapper.find("button.p-contextual-menu__toggle").children().at(0).text()
    ).toBe("Toggle");
  });

  it("can have a toggle button with an icon and text on the right", () => {
    const wrapper = mount(
      <ContextualMenu
        hasToggleIcon
        links={[]}
        toggleLabel="Toggle"
        toggleLabelFirst={false}
      />
    );
    expect(
      wrapper.find("button.p-contextual-menu__toggle").children().at(1).text()
    ).toBe("Toggle");
  });

  it("can have a toggle button with just text", () => {
    const wrapper = mount(<ContextualMenu links={[]} toggleLabel="Toggle" />);
    expect(
      wrapper
        .find("button.p-contextual-menu__toggle .p-contextual-menu__indicator")
        .exists()
    ).toBe(false);
    expect(
      wrapper.find("button.p-contextual-menu__toggle").children().text()
    ).toBe("Toggle");
  });

  it("can not have a toggle button", () => {
    const wrapper = mount(<ContextualMenu links={[]} />);
    expect(wrapper.find("button.p-contextual-menu__toggle").exists()).toBe(
      false
    );
  });

  it("can use the toggle button to display the menu", () => {
    const wrapper = mount(<ContextualMenu links={[]} toggleLabel="Toggle" />);
    expect(
      wrapper.find("button.p-contextual-menu__toggle").prop("aria-expanded")
    ).toBe("false");
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper.find("button.p-contextual-menu__toggle").prop("aria-expanded")
    ).toBe("true");
    expect(
      wrapper.find(".p-contextual-menu__dropdown").prop("aria-hidden")
    ).toBe("false");
  });

  it("be visible without a toggle button", () => {
    const wrapper = mount(<ContextualMenu links={[]} />);
    expect(
      wrapper.find(".p-contextual-menu__dropdown").prop("aria-hidden")
    ).toBe("false");
  });

  it("can display links", () => {
    const wrapper = mount(<ContextualMenu links={[{ children: "Link1" }]} />);
    expect(
      wrapper.find("button.p-contextual-menu__link").children().text()
    ).toBe("Link1");
  });

  it("can display links in groups", () => {
    const wrapper = mount(<ContextualMenu links={[[{ children: "Link1" }]]} />);
    expect(
      wrapper
        .find(".p-contextual-menu__group button.p-contextual-menu__link")
        .children()
        .text()
    ).toBe("Link1");
  });

  it("can display a mix of links and groups", () => {
    const wrapper = mount(
      <ContextualMenu
        links={[[{ children: "Link1" }], { children: "Link2" }]}
      />
    );
    expect(
      wrapper
        .find(".p-contextual-menu__group button.p-contextual-menu__link")
        .children()
        .text()
    ).toBe("Link1");
    expect(
      wrapper.find("button.p-contextual-menu__link").at(1).children().text()
    ).toBe("Link2");
  });

  it("can supply content instead of links", () => {
    const wrapper = mount(
      <ContextualMenu
        dropdownContent={<span className="content">content</span>}
      />
    );
    expect(wrapper.find(".content").exists()).toBe(true);
    expect(wrapper.find("button.p-contextual-menu__link").exists()).toBe(false);
  });

  it("closes the menu when clicking on an item", () => {
    const wrapper = mount(
      <ContextualMenu links={[{ onClick: jest.fn() }]} toggleLabel="Toggle" />
    );
    // Open the menu:
    wrapper.find("Button.p-contextual-menu__toggle").simulate("click");
    expect(
      wrapper.find("button.p-contextual-menu__toggle").prop("aria-expanded")
    ).toBe("true");
    // Click on an item:
    wrapper.find("Button.p-contextual-menu__link").simulate("click");
    expect(
      wrapper.find("button.p-contextual-menu__toggle").prop("aria-expanded")
    ).toBe("false");
  });

  it("can dynamically calculate position, defaulting to right", () => {
    expect(getDropdownPosition()).toBe("right");

    global.innerWidth = 1000;
    const leftWrapper = {
      current: {
        // Middle of toggle is to the left of the viewport center
        // 300 + 200 / 2 = 400, less than 500
        getBoundingClientRect: () => ({ left: 300, width: 200 }),
      },
    };
    expect(getDropdownPosition(leftWrapper)).toBe("left");

    const rightWrapper = {
      current: {
        // Middle of toggle is to the right of the viewport center
        // 200 + 800 / 2 = 600, more than 500
        getBoundingClientRect: () => ({ left: 200, width: 800 }),
      },
    };
    expect(getDropdownPosition(rightWrapper)).toBe("right");
  });
});
