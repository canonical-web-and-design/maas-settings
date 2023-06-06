import { useEffect } from "react";

import type { ValueOf } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";

import ZonesListForm from "./ZonesListForm";
import ZonesListHeader from "./ZonesListHeader";
import ZonesListTable from "./ZonesListTable";

import PageContent from "app/base/components/PageContent/PageContent";
import { useWindowTitle } from "app/base/hooks";
import type { SidePanelContextType } from "app/base/side-panel-context";
import { useSidePanel } from "app/base/side-panel-context";
import type { SidePanelContent } from "app/base/types";
import { actions } from "app/store/zone";
import zoneSelectors from "app/store/zone/selectors";
import { ZoneActionSidePanelViews } from "app/zones/constants";

const ZonesList = (): JSX.Element => {
  const dispatch = useDispatch();
  const zonesCount = useSelector(zoneSelectors.count);
  const { sidePanelContent, setSidePanelContent } =
    useSidePanel() as SidePanelContextType<
      SidePanelContent<ValueOf<typeof ZoneActionSidePanelViews>>
    >;

  useWindowTitle("Zones");

  useEffect(() => {
    dispatch(actions.fetch());
  }, [dispatch]);

  let content = null;

  if (
    sidePanelContent &&
    sidePanelContent.view === ZoneActionSidePanelViews.CREATE_ZONE
  ) {
    content = (
      <ZonesListForm
        closeForm={() => {
          setSidePanelContent(null);
        }}
        key="add-zone-form"
      />
    );
  }

  return (
    <PageContent
      header={<ZonesListHeader setSidePanelContent={setSidePanelContent} />}
      sidePanelContent={content}
      sidePanelTitle="Add AZ"
    >
      {zonesCount > 0 && <ZonesListTable />}
    </PageContent>
  );
};

export default ZonesList;
