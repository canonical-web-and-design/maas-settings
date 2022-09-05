import { Spinner, Strip } from "@canonical/react-components";
import { useSelector } from "react-redux";
import { useStorageState } from "react-storage-hooks";

import LXDHostToolbar from "../LXDHostToolbar";

import NumaResources from "./NumaResources";

import type { SetSearchFilter } from "app/base/types";
import LXDVMsSummaryCard from "app/kvm/components/LXDVMsSummaryCard";
import LXDVMsTable from "app/kvm/components/LXDVMsTable";
import { KVMHeaderViews } from "app/kvm/constants";
import type { KVMSetHeaderContent } from "app/kvm/types";
import podSelectors from "app/store/pod/selectors";
import type { Pod } from "app/store/pod/types";
import type { RootState } from "app/store/root/types";
import type { VMCluster } from "app/store/vmcluster/types";

type Props = {
  clusterId?: VMCluster["id"];
  hostId: Pod["id"];
  searchFilter: string;
  setSearchFilter: SetSearchFilter;
  setHeaderContent: KVMSetHeaderContent;
};

const LXDHostVMs = ({
  clusterId,
  hostId,
  searchFilter,
  setSearchFilter,
  setHeaderContent,
  ...wrapperProps
}: Props): JSX.Element => {
  const pod = useSelector((state: RootState) =>
    podSelectors.getById(state, hostId)
  );
  const [viewByNuma, setViewByNuma] = useStorageState(
    localStorage,
    `viewPod${hostId}ByNuma`,
    false
  );
  const isInCluster = !!clusterId || clusterId === 0;

  if (pod) {
    return (
      <div {...wrapperProps}>
        <LXDHostToolbar
          clusterId={clusterId}
          hostId={hostId}
          setHeaderContent={setHeaderContent}
          setViewByNuma={setViewByNuma}
          title={isInCluster ? `VMs on ${pod.name}` : "VMs on this host"}
          viewByNuma={viewByNuma}
        />
        {viewByNuma ? (
          <NumaResources id={hostId} />
        ) : (
          <LXDVMsSummaryCard id={hostId} />
        )}
        <Strip shallow>
          <LXDVMsTable
            getResources={(vm) => {
              const resources =
                pod.resources.vms.find(
                  ({ system_id }) => system_id === vm.system_id
                ) || null;
              return {
                hugepagesBacked: resources?.hugepages_backed || false,
                pinnedCores: resources?.pinned_cores || [],
                unpinnedCores: resources?.unpinned_cores || 0,
              };
            }}
            onAddVMClick={() =>
              setHeaderContent({
                view: KVMHeaderViews.COMPOSE_VM,
                extras: { hostId },
              })
            }
            pods={[pod.name]}
            searchFilter={searchFilter}
            setHeaderContent={setHeaderContent}
            setSearchFilter={setSearchFilter}
          />
        </Strip>
      </div>
    );
  }
  return <Spinner text="Loading..." />;
};

export default LXDHostVMs;
