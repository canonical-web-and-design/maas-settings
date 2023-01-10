import type { ChangeEvent } from "react";

import { Select } from "@canonical/react-components";
import { useFormikContext } from "formik";
import { useSelector } from "react-redux";

import type { CommissioningFormValues } from "../CommissioningForm";

import FormikField from "app/base/components/FormikField";
import configSelectors from "app/store/config/selectors";
import { osInfo as osInfoSelectors } from "app/store/general/selectors";
import type { RootState } from "app/store/root/types";

const CommissioningFormFields = (): JSX.Element => {
  const formikProps = useFormikContext<CommissioningFormValues>();
  const distroSeriesOptions = useSelector(configSelectors.distroSeriesOptions);

  const ubuntuKernelOptions = useSelector((state: RootState) =>
    osInfoSelectors.getUbuntuKernelOptions(
      state,
      formikProps.values.commissioning_distro_series
    )
  );

  const allUbuntuKernelOptions = useSelector(
    osInfoSelectors.getAllUbuntuKernelOptions
  );

  return (
    <>
      <h5 className="u-sv1">Machine settings</h5>
      <FormikField
        component={Select}
        label="Default Ubuntu release used for commissioning"
        name="commissioning_distro_series"
        onChange={(e: ChangeEvent<HTMLSelectElement>) => {
          const kernelValue =
            allUbuntuKernelOptions[e.target.value] &&
            allUbuntuKernelOptions[e.target.value][0].value;

          formikProps.handleChange(e);
          formikProps.setFieldTouched(
            "commissioning_distro_series",
            true,
            true
          );
          formikProps.setFieldValue("default_min_hwe_kernel", kernelValue);
          formikProps.setFieldTouched("default_min_hwe_kernel", true, true);
        }}
        options={distroSeriesOptions}
      />
      <FormikField
        component={Select}
        help="The default minimum kernel version used on all new and commissioned nodes"
        label="Default minimum kernel version"
        name="default_min_hwe_kernel"
        options={ubuntuKernelOptions}
      />
    </>
  );
};

export default CommissioningFormFields;
