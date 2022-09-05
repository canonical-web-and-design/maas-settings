import { createSelector } from "@reduxjs/toolkit";

import { generateBaseSelectors } from "../utils";

import { VMClusterMeta } from "./types";
import type { VMClusterState, VMCluster, VMClusterStatuses } from "./types";

import machineSelectors from "app/store/machine/selectors";
import type { RootState } from "app/store/root/types";

const defaultSelectors = generateBaseSelectors<
  VMClusterState,
  VMCluster,
  VMClusterMeta.PK
>(VMClusterMeta.MODEL, VMClusterMeta.PK);

/**
 * Get the vmcluster state object.
 * @param state - The redux state.
 * @returns The vmcluster state.
 */
const vmclusterState = (state: RootState): VMClusterState =>
  state[VMClusterMeta.MODEL];

/**
 * Get the vmclusters statuses.
 * @param state - The redux state.
 * @returns The vmcluster statuses.
 */
const statuses = createSelector(
  [vmclusterState],
  (vmclusterState) => vmclusterState.statuses
);

/**
 * Get the vmclusters event errors that match an event.
 * @param state - The redux state.
 * @returns The vmcluster event errors for the given event.
 */
const status = createSelector(
  [
    statuses,
    (_state: RootState, statusName: keyof VMClusterStatuses) => statusName,
  ],
  (statuses, statusName) => statuses[statusName]
);

/**
 * Get the vmclusters event errors.
 * @param state - The redux state.
 * @returns The vmcluster event errors.
 */
const eventErrors = createSelector(
  [vmclusterState],
  (vmclusterState) => vmclusterState.eventErrors
);

/**
 * Get the vmclusters event errors that match an event.
 * @param state - The redux state.
 * @returns The vmcluster event errors for the given event.
 */
const eventError = createSelector(
  [eventErrors, (_state: RootState, eventName: string) => eventName],
  (eventErrors, eventName) =>
    eventErrors.filter((eventError) => eventError.event === eventName)
);

/**
 * Get the machines in state for a given cluster.
 * @param state - The redux state.
 * @param clusterId - The id of the cluster.
 * @returns The machines in state for a given cluster.
 */
const getVMs = createSelector(
  (state: RootState, clusterId: VMCluster[VMClusterMeta.PK]) => ({
    cluster: defaultSelectors.getById(state, clusterId),
    machines: machineSelectors.all(state),
  }),
  ({ cluster, machines }) => {
    if (!cluster) {
      return [];
    }
    return machines.filter((machine) =>
      cluster.virtual_machines.some((vm) => vm.system_id === machine.system_id)
    );
  }
);

const selectors = {
  ...defaultSelectors,
  eventError,
  eventErrors,
  getVMs,
  status,
  statuses,
};

export default selectors;
