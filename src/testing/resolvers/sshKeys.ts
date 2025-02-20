import { http, HttpResponse } from "msw";

import { BASE_URL } from "../utils";

import { type ListUserSshkeysResponse } from "@/app/apiclient";
import { sshKeyV3 as sshKeyFactory } from "@/testing/factories";

const initialMockSshKeys: ListUserSshkeysResponse = {
  items: [
    sshKeyFactory({
      id: 1,
      protocol: "lp",
      auth_id: "test auth id",
      kind: "sshkey",
      key: "test key",
    }),
    sshKeyFactory({
      id: 2,
      protocol: undefined,
      auth_id: undefined,
      kind: "sshkey",
      key: "test key 2",
    }),
    sshKeyFactory({
      id: 3,
      protocol: "gh",
      auth_id: "another test auth id",
      kind: "sshkey",
      key: "test key 3",
    }),
  ],
  total: 3,
};

let mockSshKeys = structuredClone(initialMockSshKeys);

const sshKeyResolvers = {
  listSshKeys: {
    resolved: false,
    handler: (data: ListUserSshkeysResponse = mockSshKeys) =>
      http.get(`${BASE_URL}MAAS/a/v3/users/me/sshkeys`, () => {
        sshKeyResolvers.listSshKeys.resolved = true;
        return HttpResponse.json(data);
      }),
  },
};

export { sshKeyResolvers, mockSshKeys };
