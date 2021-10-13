import type { ReactNode } from "react";
import { useEffect } from "react";

import { Icon, Spinner } from "@canonical/react-components";
import pluralize from "pluralize";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import KVMDetailsHeader from "app/kvm/components/KVMDetailsHeader";
import type { KVMHeaderContent, KVMSetHeaderContent } from "app/kvm/types";
import kvmURLs from "app/kvm/urls";
import { getFormTitle } from "app/kvm/utils";
import { actions as podActions } from "app/store/pod";
import podSelectors from "app/store/pod/selectors";
import type { RootState } from "app/store/root/types";
import vmClusterSelectors from "app/store/vmcluster/selectors";
import type { VMCluster } from "app/store/vmcluster/types";
import { actions as zoneActions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";

type Props = {
  clusterId: VMCluster["id"];
  headerContent: KVMHeaderContent | null;
  setHeaderContent: KVMSetHeaderContent;
};

const LXDClusterDetailsHeader = ({
  clusterId,
  headerContent,
  setHeaderContent,
}: Props): JSX.Element => {
  const dispatch = useDispatch();
  const cluster = useSelector((state: RootState) =>
    vmClusterSelectors.getById(state, clusterId)
  );
  const lxdPods = useSelector(podSelectors.lxd);
  // TODO: Replace with selector that gets the pod associated with a cluster.
  const clusterPod =
    (cluster &&
      lxdPods.find(
        (pod) =>
          pod.name === cluster.name &&
          pod.power_parameters.project === cluster.project
      )) ||
    null;
  const zone = useSelector((state: RootState) =>
    zoneSelectors.getById(state, clusterPod?.zone)
  );
  const location = useLocation();

  useEffect(() => {
    dispatch(podActions.fetch());
    dispatch(zoneActions.fetch());
  }, [dispatch]);

  let title: ReactNode = <Spinner text="Loading..." />;
  if (cluster) {
    if (headerContent) {
      title = getFormTitle(headerContent);
    } else {
      title = cluster.name;
    }
  }

  return (
    <KVMDetailsHeader
      headerContent={headerContent}
      tabLinks={[
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.hosts({ clusterId })
          ),
          component: Link,
          label: "VM hosts",
          to: kvmURLs.lxd.cluster.hosts({ clusterId }),
        },
        {
          active: location.pathname.includes(
            kvmURLs.lxd.cluster.vms.index({ clusterId })
          ),
          component: Link,
          label: "Virtual machines",
          to: kvmURLs.lxd.cluster.vms.index({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.resources({ clusterId })
          ),
          component: Link,
          label: "Resources",
          to: kvmURLs.lxd.cluster.resources({ clusterId }),
        },
        {
          active: location.pathname.endsWith(
            kvmURLs.lxd.cluster.edit({ clusterId })
          ),
          component: Link,
          label: "Settings",
          to: kvmURLs.lxd.cluster.edit({ clusterId }),
        },
      ]}
      setHeaderContent={setHeaderContent}
      title={title}
      titleBlocks={
        cluster
          ? [
              {
                title: (
                  <>
                    <Icon name="cluster" />
                    <span className="u-nudge-right--small">Cluster:</span>
                  </>
                ),
                subtitle: (
                  <span className="u-nudge-right--large" data-test="members">
                    {pluralize("member", cluster.hosts.length, true)}
                  </span>
                ),
              },
              {
                title: "VMs:",
                subtitle: `${cluster.virtual_machines.length} available`,
              },
              {
                title: "AZ:",
                subtitle: zone?.name || <Spinner />,
              },
              {
                title: "LXD project:",
                subtitle: cluster.project,
              },
            ]
          : []
      }
    />
  );
};

export default LXDClusterDetailsHeader;
