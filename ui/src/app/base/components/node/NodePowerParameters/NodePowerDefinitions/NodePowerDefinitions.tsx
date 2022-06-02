import { useSelector } from "react-redux";

import CertificateDetails from "app/base/components/CertificateDetails";
import Definition from "app/base/components/Definition";
import PowerParameterDefinition from "app/base/components/node/NodePowerParameters/NodePowerDefinitions/PowerParameterDefinition";
import type { ControllerDetails } from "app/store/controller/types";
import { powerTypes as powerTypesSelectors } from "app/store/general/selectors";
import type { PowerField } from "app/store/general/types";
import { PowerFieldScope } from "app/store/general/types";
import {
  getFieldsInScope,
  getPowerTypeFromName,
} from "app/store/general/utils";
import type { MachineDetails } from "app/store/machine/types";
import { getMachineFieldScopes } from "app/store/machine/utils";
import { nodeIsMachine } from "app/store/utils";

const generateBasePowerParameters = (
  node: MachineDetails | ControllerDetails,
  fields: PowerField[]
) => {
  const { power_parameters } = node;
  const baseParameters = fields.reduce<React.ReactNode[]>(
    (parameters, field) => {
      if (field.name in power_parameters) {
        const powerParameter = power_parameters[field.name];
        parameters.push(
          <PowerParameterDefinition
            field={field}
            key={field.name}
            powerParameter={powerParameter}
          />
        );
      }
      return parameters;
    },
    []
  );
  return <>{baseParameters}</>;
};

const generateAllPowerParameters = (
  machine: MachineDetails,
  fields: PowerField[]
) => {
  const { certificate, power_parameters } = machine;
  return (
    <>
      {generateBasePowerParameters(machine, fields)}
      {certificate ? (
        <CertificateDetails
          certificate={power_parameters.certificate as string}
          eventCategory="Machine configuration"
          metadata={certificate}
        />
      ) : null}
    </>
  );
};

const NodePowerDefinitions = ({
  node,
}: {
  node: MachineDetails | ControllerDetails;
}): JSX.Element => {
  const powerTypes = useSelector(powerTypesSelectors.get);
  const powerType = getPowerTypeFromName(powerTypes, node.power_type);
  const fieldScopes = nodeIsMachine(node)
    ? getMachineFieldScopes(node)
    : [PowerFieldScope.BMC, PowerFieldScope.NODE];
  const fieldsInScope = getFieldsInScope(powerType, fieldScopes);
  return (
    <>
      <Definition label="Power type">
        {powerType?.description || "None"}
      </Definition>
      {nodeIsMachine(node)
        ? generateAllPowerParameters(node, fieldsInScope)
        : generateBasePowerParameters(node, fieldsInScope)}
    </>
  );
};

export default NodePowerDefinitions;
