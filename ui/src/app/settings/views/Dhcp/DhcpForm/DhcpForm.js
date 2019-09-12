import { Formik } from "formik";
import { Redirect } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";

import {
  controller as controllerActions,
  device as deviceActions,
  machine as machineActions
} from "app/base/actions";
import { DhcpSnippetShape } from "app/settings/proptypes";
import { messages } from "app/base/actions";
import { useDhcpTarget } from "app/settings/hooks";
import actions from "app/settings/actions";
import DhcpFormFields from "../DhcpFormFields";
import FormCard from "app/base/components/FormCard";
import Loader from "app/base/components/Loader";
import selectors from "app/settings/selectors";

const DhcpSchema = Yup.object().shape({
  description: Yup.string(),
  enabled: Yup.boolean(),
  entity: Yup.string().when("type", {
    is: val => val && val.length > 0,
    then: Yup.string().required(
      "You must choose an entity for this snippet type"
    )
  }),
  name: Yup.string().required("Snippet name is required"),
  value: Yup.string().required("DHCP snippet is required"),
  type: Yup.string()
});

export const DhcpForm = ({ dhcpSnippet }) => {
  const [savingDhcp, setSaving] = useState();
  const [name, setName] = useState();
  const saved = useSelector(selectors.dhcpsnippet.saved);
  const dispatch = useDispatch();
  const editing = !!dhcpSnippet;
  const { loading, loaded, type } = useDhcpTarget(
    editing ? dhcpSnippet.node : null,
    editing ? dhcpSnippet.subnet : null
  );

  useEffect(() => {
    dispatch(actions.subnet.fetch());
    dispatch(controllerActions.fetch());
    dispatch(deviceActions.fetch());
    dispatch(machineActions.fetch());
    return () => {
      // Clean up saved and error states on unmount.
      dispatch(actions.dhcpsnippet.cleanup());
    };
  }, [dispatch]);

  useEffect(() => {
    if (saved) {
      const action = editing ? "updated" : "added";
      dispatch(actions.dhcpsnippet.cleanup());
      dispatch(
        messages.add(`${savingDhcp} ${action} successfully.`, "information")
      );
      setSaving();
    }
  }, [dispatch, editing, saved, savingDhcp]);

  if (saved) {
    // The snippet was successfully created/updated so redirect to the dhcp list.
    return <Redirect to="/dhcp" />;
  }

  if (
    editing &&
    ((dhcpSnippet.node || dhcpSnippet.subnet) && (loading || !loaded))
  ) {
    return <Loader text="Loading..." />;
  }

  let title = editing ? <>Editing `{name}`</> : "Add DHCP snippet";

  return (
    <FormCard title={title}>
      <Formik
        initialValues={{
          description: dhcpSnippet ? dhcpSnippet.description : "",
          enabled: dhcpSnippet ? dhcpSnippet.enabled : false,
          entity: dhcpSnippet
            ? dhcpSnippet.node || dhcpSnippet.subnet || ""
            : "",
          name: dhcpSnippet ? dhcpSnippet.name : "",
          type: dhcpSnippet ? type : "",
          value: dhcpSnippet ? dhcpSnippet.value : ""
        }}
        validationSchema={DhcpSchema}
        onSubmit={values => {
          const params = {
            description: values.description,
            enabled: values.enabled,
            name: values.name,
            value: values.value
          };
          if (values.type === "subnet") {
            params.subnet = values.entity;
          } else if (values.type) {
            params.node = values.entity;
          }
          if (editing) {
            params.id = dhcpSnippet.id;
            dispatch(actions.dhcpsnippet.update(params));
          } else {
            dispatch(actions.dhcpsnippet.create(params));
          }
          setSaving(params.name);
        }}
        render={formikProps => {
          setName(formikProps.values.name);
          return <DhcpFormFields editing={editing} formikProps={formikProps} />;
        }}
      ></Formik>
    </FormCard>
  );
};

DhcpForm.propTypes = {
  dhcpSnippet: DhcpSnippetShape
};

export default DhcpForm;
