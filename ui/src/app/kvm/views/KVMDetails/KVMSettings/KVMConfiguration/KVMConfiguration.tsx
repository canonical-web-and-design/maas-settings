import { useCallback } from "react";

import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

import KVMConfigurationFields from "./KVMConfigurationFields";

import FormCard from "app/base/components/FormCard";
import FormikForm from "app/base/components/FormikForm";
import { actions as podActions } from "app/store/pod";
import { PodType } from "app/store/pod/constants";
import podSelectors from "app/store/pod/selectors";
import type { Pod, PodDetails, PodPowerParameters } from "app/store/pod/types";

const KVMConfigurationSchema = Yup.object().shape({
  cpu_over_commit_ratio: Yup.number().required("CPU overcommit ratio required"),
  memory_over_commit_ratio: Yup.number().required(
    "Memory overcommit ratio required"
  ),
  pool: Yup.string().required("Resource pool required"),
  power_address: Yup.string().required("Address required"),
  power_pass: Yup.string(),
  tags: Yup.array().of(Yup.string()),
  type: Yup.string().required("Type required"),
  zone: Yup.string().required("Zone required"),
});

export type KVMConfigurationValues = {
  cpu_over_commit_ratio: Pod["cpu_over_commit_ratio"];
  memory_over_commit_ratio: Pod["memory_over_commit_ratio"];
  pool: Pod["pool"];
  power_address: PodPowerParameters["power_address"];
  power_pass: PodPowerParameters["power_pass"];
  tags: Pod["tags"];
  type: Pod["type"];
  zone: Pod["zone"];
};

type Props = {
  pod: PodDetails;
};

const KVMConfiguration = ({ pod }: Props): JSX.Element => {
  const dispatch = useDispatch();
  const podErrors = useSelector(podSelectors.errors);
  const podSaved = useSelector(podSelectors.saved);
  const podSaving = useSelector(podSelectors.saving);

  const cleanup = useCallback(() => podActions.cleanup(), []);

  return (
    <FormCard sidebar={false} title="KVM configuration">
      <FormikForm<KVMConfigurationValues>
        cleanup={cleanup}
        errors={podErrors}
        initialValues={{
          cpu_over_commit_ratio: pod.cpu_over_commit_ratio,
          memory_over_commit_ratio: pod.memory_over_commit_ratio,
          pool: pod.pool,
          power_address: pod.power_parameters.power_address,
          power_pass: pod.power_parameters.power_pass || "",
          tags: pod.tags,
          type: pod.type,
          zone: pod.zone,
        }}
        onSaveAnalytics={{
          action: "Edit KVM",
          category: "KVM details settings",
          label: "KVM configuration form",
        }}
        onSubmit={(values) => {
          const params = {
            cpu_over_commit_ratio: values.cpu_over_commit_ratio,
            id: pod.id,
            memory_over_commit_ratio: values.memory_over_commit_ratio,
            pool: Number(values.pool),
            power_address: values.power_address,
            power_pass:
              (values.type === PodType.VIRSH && values.power_pass) || undefined,
            tags: values.tags.join(","), // API expects comma-separated string
            zone: Number(values.zone),
          };
          dispatch(podActions.update(params));
        }}
        saving={podSaving}
        saved={podSaved}
        submitLabel="Save changes"
        validationSchema={KVMConfigurationSchema}
      >
        <KVMConfigurationFields />
      </FormikForm>
    </FormCard>
  );
};

export default KVMConfiguration;
