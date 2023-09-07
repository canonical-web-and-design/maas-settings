import { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import ConfigureDHCP from "./ConfigureDHCP";
import DHCPStatus from "./DHCPStatus";
import VLANDeleteForm from "./VLANDeleteForm";
import VLANDetailsHeader from "./VLANDetailsHeader";
import VLANSubnets from "./VLANSubnets";
import VLANSummary from "./VLANSummary";
import { VLANDetailsSidePanelViews } from "./constants";

import ModelNotFound from "app/base/components/ModelNotFound";
import PageContent from "app/base/components/PageContent";
import SectionHeader from "app/base/components/SectionHeader";
import { useGetURLId, useWindowTitle } from "app/base/hooks";
import { useSidePanel } from "app/base/side-panel-context";
import type { RootState } from "app/store/root/types";
import subnetSelectors from "app/store/subnet/selectors";
import { actions as vlanActions } from "app/store/vlan";
import vlanSelectors from "app/store/vlan/selectors";
import { VLANMeta } from "app/store/vlan/types";
import DHCPSnippets from "app/subnets/components/DHCPSnippets";
import ReservedRanges from "app/subnets/components/ReservedRanges";
import subnetURLs from "app/subnets/urls";
import { isId } from "app/utils";

const VLANDetails = (): JSX.Element => {
  const { sidePanelContent, setSidePanelContent } = useSidePanel();
  const dispatch = useDispatch();
  const id = useGetURLId(VLANMeta.PK);
  const vlan = useSelector((state: RootState) =>
    vlanSelectors.getById(state, id)
  );
  const vlansLoading = useSelector(vlanSelectors.loading);
  const subnets = useSelector((state: RootState) =>
    subnetSelectors.getByIds(state, vlan ? vlan.subnet_ids : [])
  );
  const [showDHCPForm, setShowDHCPForm] = useState(false);
  useWindowTitle(`${vlan?.name || "VLAN"} details`);

  useEffect(() => {
    if (isId(id)) {
      dispatch(vlanActions.get(id));
      dispatch(vlanActions.setActive(id));
    }

    const unsetActiveVLANAndCleanup = () => {
      dispatch(vlanActions.setActive(null));
      dispatch(vlanActions.cleanup());
    };
    return unsetActiveVLANAndCleanup;
  }, [dispatch, id]);

  if (!vlan) {
    const vlanNotFound = !isId(id) || !vlansLoading;

    if (vlanNotFound) {
      return (
        <ModelNotFound
          id={id}
          linkURL={subnetURLs.indexWithParams({ by: "fabric" })}
          modelName="VLAN"
        />
      );
    }
    return (
      <PageContent
        header={<SectionHeader loading />}
        sidePanelContent={null}
        sidePanelTitle={null}
      />
    );
  }

  return (
    <PageContent
      header={<VLANDetailsHeader id={id} />}
      sidePanelContent={
        sidePanelContent &&
        sidePanelContent.view === VLANDetailsSidePanelViews.DELETE_VLAN ? (
          <VLANDeleteForm closeForm={() => setSidePanelContent(null)} id={id} />
        ) : null
      }
      sidePanelTitle="Delete VLAN"
    >
      {showDHCPForm ? (
        <ConfigureDHCP closeForm={() => setShowDHCPForm(false)} id={id} />
      ) : (
        <>
          <VLANSummary id={id} />
          <DHCPStatus id={id} openForm={() => setShowDHCPForm(true)} />
          <ReservedRanges hasVLANSubnets={subnets.length > 0} vlanId={id} />
          <VLANSubnets subnets={subnets} />
        </>
      )}
      <DHCPSnippets modelName={VLANMeta.MODEL} subnetIds={vlan.subnet_ids} />
    </PageContent>
  );
};

export default VLANDetails;
