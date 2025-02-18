import { useCallback } from "react";

import DeleteImageConfirm from "../ImagesTable/DeleteImageConfirm";

import type { SidePanelContentTypes } from "@/app/base/side-panel-context";
import DeleteImages from "@/app/images/components/SMImagesTable/DeleteImages";
import DownloadImages from "@/app/images/components/SMImagesTable/DownloadImages";
import { ImageSidePanelViews } from "@/app/images/constants";

type Props = SidePanelContentTypes & {};

const ImagesForms = ({ sidePanelContent, setSidePanelContent }: Props) => {
  const clearSidePanelContent = useCallback(
    () => setSidePanelContent(null),
    [setSidePanelContent]
  );

  if (!sidePanelContent) {
    return null;
  }

  switch (sidePanelContent.view) {
    case ImageSidePanelViews.DELETE_IMAGE: {
      const bootResource =
        sidePanelContent.extras && "bootResource" in sidePanelContent.extras
          ? sidePanelContent.extras.bootResource
          : null;
      if (!bootResource) return null;
      return (
        <DeleteImageConfirm
          closeForm={clearSidePanelContent}
          resource={bootResource}
        />
      );
    }
    case ImageSidePanelViews.DELETE_MULTIPLE_IMAGES: {
      const rowSelection =
        sidePanelContent.extras && "rowSelection" in sidePanelContent.extras
          ? sidePanelContent.extras.rowSelection
          : null;
      const setRowSelection =
        sidePanelContent.extras && "setRowSelection" in sidePanelContent.extras
          ? sidePanelContent.extras.setRowSelection
          : null;
      if (!rowSelection) return null;
      return (
        <DeleteImages
          closeForm={clearSidePanelContent}
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
        />
      );
    }
    case ImageSidePanelViews.DOWNLOAD_IMAGE: {
      return <DownloadImages />;
    }
    default:
      return null;
  }
};

export default ImagesForms;
