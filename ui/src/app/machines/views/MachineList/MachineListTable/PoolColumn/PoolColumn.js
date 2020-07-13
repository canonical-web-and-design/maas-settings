import { Spinner } from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { machine as machineActions } from "app/base/actions";
import {
  machine as machineSelectors,
  resourcepool as resourcePoolSelectors,
} from "app/base/selectors";
import { useToggleMenu } from "app/machines/hooks";
import DoubleRow from "app/base/components/DoubleRow";

export const PoolColumn = ({ onToggleMenu, systemId }) => {
  const dispatch = useDispatch();
  const [updating, setUpdating] = useState(null);
  const machine = useSelector((state) =>
    machineSelectors.getBySystemId(state, systemId)
  );
  const resourcePools = useSelector(resourcePoolSelectors.all);
  const toggleMenu = useToggleMenu(onToggleMenu, systemId);

  let poolLinks = resourcePools.filter((pool) => pool.id !== machine.pool.id);
  if (machine.actions.includes("set-pool")) {
    if (poolLinks.length !== 0) {
      poolLinks = poolLinks.map((pool) => ({
        children: pool.name,
        onClick: () => {
          dispatch(machineActions.setPool(systemId, pool.id));
          setUpdating(pool.id);
        },
      }));
    } else {
      poolLinks = [{ children: "No other pools available", disabled: true }];
    }
  } else {
    poolLinks = [
      { children: "Cannot change pool of this machine", disabled: true },
    ];
  }

  useEffect(() => {
    if (updating !== null && machine.pool.id === updating) {
      setUpdating(null);
    }
  }, [updating, machine.pool.id]);

  return (
    <DoubleRow
      menuLinks={onToggleMenu && poolLinks}
      menuTitle="Change pool:"
      onToggleMenu={toggleMenu}
      primary={
        <span data-test="pool">
          {updating !== null ? (
            <Spinner className="u-no-margin u-no-padding--left" inline />
          ) : null}
          <Link className="p-link--soft" to="/pools">
            {machine.pool.name}
          </Link>
        </span>
      }
      primaryAriaLabel="Pool"
      primaryTitle={machine.pool.name}
      secondary={
        <span title={machine.description} data-test="note">
          {machine.description}
        </span>
      }
      secondaryAriaLabel="Note"
      secondaryTitle={machine.description}
    />
  );
};

PoolColumn.propTypes = {
  onToggleMenu: PropTypes.func,
  systemId: PropTypes.string.isRequired,
};

export default React.memo(PoolColumn);
