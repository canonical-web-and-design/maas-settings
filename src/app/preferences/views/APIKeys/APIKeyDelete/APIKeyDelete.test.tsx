import APIKeyDelete from "./APIKeyDelete";

import type { RootState } from "@/app/store/root/types";
import * as factory from "@/testing/factories";
import { renderWithBrowserRouter, screen } from "@/testing/utils";

let state: RootState;
state = factory.rootState({
  token: factory.tokenState({
    items: [
      factory.token({
        id: 1,
        key: "ssh-rsa aabb",
        consumer: { key: "abc", name: "Name" },
      }),
      factory.token({
        id: 2,
        key: "ssh-rsa ccdd",
        consumer: { key: "abc", name: "Name" },
      }),
    ],
  }),
});

it("renders", () => {
  renderWithBrowserRouter(<APIKeyDelete />, {
    state,
    route: "/account/prefs/api-keys/1/delete",
    routePattern: "/account/prefs/api-keys/:id/delete",
  });
  expect(
    screen.getByRole("form", { name: "Delete API Key" })
  ).toBeInTheDocument();
});
