import { Input, MainTable } from "@canonical/react-components";

import { scriptStatus } from "app/base/enum";
import type { NodeResult } from "app/store/noderesult/types";

type Props = { nodeResults: NodeResult[] };

const isSuppressible = (result: NodeResult) =>
  result.status === scriptStatus.FAILED ||
  result.status === scriptStatus.FAILED_INSTALLING ||
  result.status === scriptStatus.TIMEDOUT ||
  result.status === scriptStatus.FAILED_APPLYING_NETCONF;

const MachineTestsTable = ({ nodeResults }: Props): JSX.Element => {
  return (
    <>
      <MainTable
        defaultSort="name"
        defaultSortDirection="ascending"
        headers={[
          {
            content: "Suppress",
          },
          {
            content: "Name",
            sortKey: "name",
          },
          {
            content: "Tags",
          },
          {
            content: "Runtime",
          },
          {
            content: "Date",
            sortKey: "date",
          },
          {
            content: "Result",
          },
          {
            content: "Actions",
            className: "u-align--right",
          },
        ]}
        rows={nodeResults.map((result) => {
          return {
            columns: [
              {
                content: (
                  <>
                    {isSuppressible(result) ? (
                      <>
                        <Input
                          type="checkbox"
                          label=" "
                          checked={result.suppressed}
                          onChange={() => null}
                        />
                      </>
                    ) : null}
                  </>
                ),
              },
              {
                content: <span data-test="name">{result.name || "—"}</span>,
              },
              {
                content: <span data-test="tags">{result.tags}</span>,
              },
              {
                content: <span data-test="runtime">{result.runtime}</span>,
              },
              {
                content: <span data-test="date">{result.updated}</span>,
              },
              {
                content: <span data-test="status">{result.status_name}</span>,
              },
              {
                content: "",
                className: "u-align--right",
              },
            ],
            key: result.id,
            sortData: {
              name: result.name,
              date: result.updated,
            },
          };
        })}
        sortable
      />
    </>
  );
};

export default MachineTestsTable;
