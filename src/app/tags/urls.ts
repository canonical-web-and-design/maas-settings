import type { Tag, TagMeta } from "app/store/tag/types";
import { argPath } from "app/utils";

const urls = {
  index: "/tags",
  tag: {
    index: argPath<{ id: Tag[TagMeta.PK] }>("/tag/:id"),
    machines: argPath<{ id: Tag[TagMeta.PK] }>("/tag/:id/machines"),
    update: argPath<{ id: Tag[TagMeta.PK] }>("/tag/:id/edit"),
  },
} as const;

export default urls;
