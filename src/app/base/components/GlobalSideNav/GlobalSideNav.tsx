// import type { ReactNode } from "react";
import { useEffect, useContext } from "react";

// import type { NavLink } from "@canonical/react-components";
import {
  Icon,
  // Icon,
  // isNavigationButton,
  // Theme,
} from "@canonical/react-components";
import { useDispatch, useSelector } from "react-redux";
import {
  Link,
  //   useNavigate,
  useLocation,
  matchPath,
  //   useMatch,
} from "react-router-dom-v5-compat";

// import {
//   useCompletedIntro,
//   useCompletedUserIntro,
//   useGoogleAnalytics,
// } from "app/base/hooks";
import ThemePreviewContext from "app/base/theme-preview-context";
import urls from "app/base/urls";
import authSelectors from "app/store/auth/selectors";
import configSelectors from "app/store/config/selectors";
import { version as versionSelectors } from "app/store/general/selectors";
// import { actions as controllerActions } from "app/store/controller";
// import controllerSelectors from "app/store/controller/selectors";
// import type { RootState } from "app/store/root/types";
// import { actions as statusActions } from "app/store/status";

type NavItem = {
  adminOnly?: boolean;
  highlight?: string | string[];
  label: string;
  url: string;
};

type NavGroup = {
  navLinks: NavItem[];
  groupTitle?: string;
  groupIcon?: string;
};

const navGroups: NavGroup[] = [
  {
    navLinks: [
      {
        label: "Images",
        url: urls.images.index,
      },
      {
        label: "Storage",
        url: urls.settings.storage,
      },
      {
        label: "Tags",
        url: urls.tags.index,
      },
      {
        highlight: [urls.zones.index, urls.zones.details(null)],
        label: "AZs",
        url: urls.zones.index,
      },
      {
        label: "Pools",
        url: urls.pools.index,
      },
    ],
  },
  {
    groupTitle: "Hardware",
    groupIcon: "machines-light",
    navLinks: [
      {
        highlight: [urls.machines.index, urls.machines.machine.index(null)],
        label: "Machines",
        url: urls.machines.index,
      },
      {
        highlight: [urls.devices.index, urls.devices.device.index(null)],
        label: "Devices",
        url: urls.devices.index,
      },
      {
        adminOnly: true,
        highlight: [
          urls.controllers.index,
          urls.controllers.controller.index(null),
        ],
        label: "Controllers",
        url: urls.controllers.index,
      },
    ],
  },
  {
    groupTitle: "KVM",
    groupIcon: "cluster-light",
    navLinks: [
      {
        label: "LXD",
        url: urls.kvm.lxd.index,
      },
      {
        label: "Virsh",
        url: urls.kvm.virsh.index,
      },
    ],
  },
  {
    groupTitle: "Networking",
    groupIcon: "connected-light",
    navLinks: [
      {
        highlight: [
          urls.subnets.index,
          urls.subnets.subnet.index(null),
          urls.subnets.space.index(null),
          urls.subnets.fabric.index(null),
          urls.subnets.vlan.index(null),
        ],
        label: "Subnets",
        url: urls.subnets.index,
      },
      {
        highlight: [urls.domains.index, urls.domains.details(null)],
        label: "DNS",
        url: urls.domains.index,
      },
      {
        label: "Network discovery",
        url: urls.dashboard.index,
      },
    ],
  },
];

const isSelected = (path: string, link: NavItem) => {
  // Use the provided highlight(s) or just use the url.
  let highlights = link.highlight || link.url;
  // If the provided highlights aren't an array then make them one so that we
  // can loop over them.
  if (!Array.isArray(highlights)) {
    highlights = [highlights];
  }
  // Check if one of the highlight urls matches the current path.
  return highlights.some((highlight) =>
    // Check the full path, for both legacy/new clients as sometimes the lists
    // are in one client and the details in the other.
    matchPath({ path: highlight, end: false }, path)
  );
};

const GlobalSideNav = (): JSX.Element => {
  const location = useLocation();
  const maasTheme = useSelector(configSelectors.theme);
  const { theme, setTheme } = useContext(ThemePreviewContext);
  const authUser = useSelector(authSelectors.get);
  const version = useSelector(versionSelectors.get);
  const maasName = useSelector(configSelectors.maasName);

  useEffect(() => {
    setTheme(maasTheme ? maasTheme : "default");
  }, [location, maasTheme, setTheme]);

  return (
    <>
      <nav
        className={`l-navigation l-navigation--${
          theme ? theme : maasTheme ? maasTheme : "default"
        }`}
      >
        <div className="p-navigation__banner">
          <div className="p-navigation__tagged-logo">
            <div className="p-navigation__logo-tag">
              <svg
                className="p-navigation__logo-icon"
                fill="#fff"
                viewBox="0 0 165.5 174.3"
                xmlns="http://www.w3.org/2000/svg"
              >
                <ellipse cx="15.57" cy="111.46" rx="13.44" ry="13.3" />
                <path d="M156.94 101.45H31.88a18.91 18.91 0 0 1 .27 19.55c-.09.16-.2.31-.29.46h125.08a6 6 0 0 0 6.06-5.96v-8.06a6 6 0 0 0-6-6Z" />
                <ellipse cx="15.62" cy="63.98" rx="13.44" ry="13.3" />
                <path d="M156.94 53.77H31.79a18.94 18.94 0 0 1 .42 19.75l-.16.24h124.89a6 6 0 0 0 6.06-5.94v-8.06a6 6 0 0 0-6-6Z" />
                <ellipse cx="16.79" cy="16.5" rx="13.44" ry="13.3" />
                <path d="M156.94 6.5H33.1a19.15 19.15 0 0 1 2.21 5.11A18.82 18.82 0 0 1 33.42 26l-.29.46h123.81a6 6 0 0 0 6.06-5.9V12.5a6 6 0 0 0-6-6Z" />
                <ellipse cx="15.57" cy="158.94" rx="13.44" ry="13.3" />
                <path d="M156.94 149H31.88a18.88 18.88 0 0 1 .27 19.5c-.09.16-.19.31-.29.46h125.08A6 6 0 0 0 163 163v-8.06a6 6 0 0 0-6-6Z" />
              </svg>
            </div>
            <div className="p-navigation__logo-title">Canonical MAAS</div>
          </div>
        </div>

        {navGroups.map((group) => (
          <>
            <div className="p-muted-heading">
              {group.groupIcon ? <Icon light name={group.groupIcon} /> : null}
              {group.groupTitle}
            </div>
            <ul className="l-navigation__items">
              {group.navLinks.map((navLink) => (
                <li className="l-navigation__item">
                  <Link className="l-navigation__link" to={navLink.url}>
                    {navLink.label}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ))}
        <ul className="l-navigation__items">
          <hr />
          <li className="l-navigation__item is-selected">
            <Icon light name="settings" />
            <Link className="l-navigation__link" to={urls.settings.index}>
              Settings
            </Link>
          </li>
          <hr />
          <li className="l-navigation__item">
            <Icon light name="profile-light" />
            <Link className="l-navigation__link" to={urls.preferences.index}>
              {authUser?.username}
            </Link>
          </li>
          <hr />
        </ul>
        <span id="maas-info">
          {maasName} MAAS v{version}
        </span>
      </nav>
    </>
  );
};

export default GlobalSideNav;
