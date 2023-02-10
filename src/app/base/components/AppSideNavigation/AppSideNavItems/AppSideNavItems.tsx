import { Button, Icon } from "@canonical/react-components";
import classNames from "classnames";

import AppSideNavItem from "../AppSideNavItem";
import type { NavGroup } from "../types";
import { isSelected } from "../utils";

import { useId } from "app/base/hooks/base";
import urls from "app/base/urls";
import type { User } from "app/store/user/types";

type Props = {
  authUser: User | null;
  groups: NavGroup[];
  isAdmin: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  path: string;
  showLinks: boolean;
  vaultIncomplete: boolean;
};

export const AppSideNavItems = ({
  authUser,
  groups,
  isAdmin,
  isAuthenticated,
  logout,
  path,
  showLinks,
  vaultIncomplete,
}: Props): JSX.Element => {
  const id = useId();
  const getHasActiveChild = (group: NavGroup) => {
    for (const navLink of group.navLinks) {
      if (isSelected(path, navLink)) {
        return true;
      }
    }
    return false;
  };
  return (
    <>
      {showLinks ? (
        <ul className="p-side-navigation__list">
          {groups.map((group) => (
            <>
              <li
                className={classNames("p-side-navigation__item", {
                  "has-active-child": getHasActiveChild(group),
                })}
              >
                <span
                  className="p-side-navigation__text"
                  key={`${group.groupTitle}-${id}`}
                >
                  {group.groupIcon ? (
                    <Icon
                      className="p-side-navigation__icon"
                      light
                      name={group.groupIcon}
                    />
                  ) : null}
                  <div
                    className="p-side-navigation__label p-heading--small"
                    id={`${group.groupTitle}-${id}`}
                  >
                    {group.groupTitle}
                  </div>
                </span>
              </li>
              <ul
                aria-labelledby={`${group.groupTitle}-${id}`}
                className="p-side-navigation__list"
              >
                {group.navLinks.map((navLink) => {
                  if (!navLink.adminOnly || isAdmin) {
                    return (
                      <AppSideNavItem
                        icon={
                          navLink.label === "Controllers" && vaultIncomplete ? (
                            <Icon
                              aria-label="warning"
                              data-testid="warning-icon"
                              name="security-warning-grey"
                            />
                          ) : undefined
                        }
                        key={navLink.label}
                        navLink={navLink}
                        path={path}
                      />
                    );
                  } else return null;
                })}
              </ul>
            </>
          ))}
        </ul>
      ) : null}
      {isAuthenticated ? (
        <>
          <ul className="p-side-navigation__list">
            {isAdmin && showLinks ? (
              <>
                <AppSideNavItem
                  icon="settings"
                  navLink={{ label: "Settings", url: urls.settings.index }}
                  path={path}
                />
              </>
            ) : null}
          </ul>
          <ul className="p-side-navigation__list">
            <AppSideNavItem
              icon="profile-light"
              navLink={{
                label: `${authUser?.username}`,
                url: urls.preferences.index,
              }}
              path={path}
            />
            <li className="p-side-navigation__item">
              <Button
                appearance="link"
                className="p-side-navigation__button p-side-navigation__link"
                onClick={() => logout()}
              >
                <span className="p-side-navigation__label">Log out</span>
              </Button>
            </li>
          </ul>
        </>
      ) : null}
    </>
  );
};

export default AppSideNavItems;
