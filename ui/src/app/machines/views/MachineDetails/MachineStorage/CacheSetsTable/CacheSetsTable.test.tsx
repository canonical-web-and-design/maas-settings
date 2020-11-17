import { mount } from "enzyme";
import React from "react";

import { machineDisk as diskFactory } from "testing/factories";
import { separateStorageData } from "../utils";
import CacheSetsTable from "./CacheSetsTable";

describe("CacheSetsTable", () => {
  it("can show what the cache set is being used for", () => {
    const disks = [
      diskFactory({
        type: "cache-set",
        used_for: "nefarious purposes",
      }),
    ];
    const { cacheSets } = separateStorageData(disks);
    const wrapper = mount(<CacheSetsTable cacheSets={cacheSets} />);

    expect(wrapper.find("[data-test='used-for']").text()).toBe(
      "nefarious purposes"
    );
  });
});
