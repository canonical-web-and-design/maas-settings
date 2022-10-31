import { useEffect, useState } from "react";

import { Accordion, ContextualMenu } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import MachinesFilterOptions from "./MachinesFilterOptions";

import { actions as machineActions } from "app/store/machine";
import machineSelectors from "app/store/machine/selectors";
import { FilterGroupKey } from "app/store/machine/types";

export enum Label {
  Toggle = "Filters",
  Arch = "Architecture",
  Fabrics = "Fabric",
  Owner = "Owner",
  Pod = "KVM",
  Pool = "Resource pool",
  Spaces = "Space",
  Status = "Status",
  Subnets = "Subnet",
  Tags = "Tags",
  Vlans = "VLAN",
  Workloads = "Workload",
  Zone = "Zone",
}

type Props = {
  searchText?: string;
  setSearchText: (searchText: string) => void;
};

const filterOrder = [
  FilterGroupKey.Status,
  FilterGroupKey.Owner,
  FilterGroupKey.Pool,
  FilterGroupKey.Arch,
  FilterGroupKey.Tags,
  FilterGroupKey.Workloads,
  FilterGroupKey.Pod,
  FilterGroupKey.Subnets,
  FilterGroupKey.Fabrics,
  FilterGroupKey.Zone,
  FilterGroupKey.Vlans,
  FilterGroupKey.Spaces,
];

const filterNames = new Map<FilterGroupKey, string>([
  [FilterGroupKey.Arch, Label.Arch],
  [FilterGroupKey.Fabrics, Label.Fabrics],
  [FilterGroupKey.Owner, Label.Owner],
  [FilterGroupKey.Pod, Label.Pod],
  [FilterGroupKey.Pool, Label.Pool],
  [FilterGroupKey.Spaces, Label.Spaces],
  [FilterGroupKey.Status, Label.Status],
  [FilterGroupKey.Subnets, Label.Subnets],
  [FilterGroupKey.Tags, Label.Tags],
  [FilterGroupKey.Vlans, Label.Vlans],
  [FilterGroupKey.Workloads, Label.Workloads],
  [FilterGroupKey.Zone, Label.Zone],
]);

const MachinesFilterAccordion = ({
  searchText,
  setSearchText,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const filtersLoaded = useSelector(machineSelectors.filtersLoaded);
  const [expandedSection, setExpandedSection] = useState();

  const sections = filterOrder.map((groupKey) => {
    return {
      title: filterNames.get(groupKey),
      content:
        expandedSection === groupKey ? (
          <MachinesFilterOptions
            group={groupKey}
            searchText={searchText}
            setSearchText={setSearchText}
          />
        ) : null,
      key: groupKey,
    };
  });

  useEffect(() => {
    dispatch(machineActions.filterGroups());
  }, [dispatch]);

  return (
    <ContextualMenu
      className="filter-accordion filter-accordion--expanded"
      constrainPanelWidth
      hasToggleIcon
      position="left"
      toggleClassName="filter-accordion__toggle"
      toggleDisabled={!filtersLoaded}
      toggleLabel={Label.Toggle}
    >
      <Accordion
        className="filter-accordion__dropdown"
        expanded={expandedSection}
        externallyControlled
        onExpandedChange={setExpandedSection}
        sections={sections}
      />
    </ContextualMenu>
  );
};

export default MachinesFilterAccordion;
