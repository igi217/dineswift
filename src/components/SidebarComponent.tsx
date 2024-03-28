import NavBackImage from "@/assets/images/NavBack.jpg";
import LogoImageCollapse from "@/assets/images/logo-transpng.png";
import LogoImage from "@/assets/images/logofull.png";
import { resolveRoute } from "@/lib/utils";
import Category from "@/screens/Category";
import Dashboard from "@/screens/Dashboard";
import Sales from "@/screens/Sales";
import XReport from "@/screens/XReport";
import AboutSettings from "@/screens/about-settings";
import CouponSellAdd from "@/screens/add-couponsell";
import Allergens from "@/screens/allergens";
import AppearenceSettings from "@/screens/appearence-settings";
import Area from "@/screens/area";
import BannerSettings from "@/screens/banner-settings";
import Booking from "@/screens/booking";
import CloverSettings from "@/screens/clover-settings";
import Coupon from "@/screens/coupon";
import CouponSells from "@/screens/couponsell";
import CurrencylSettings from "@/screens/currency-settings";
import Customer from "@/screens/customer";
import CustomerType from "@/screens/customertype";
import DeliverySettings from "@/screens/delivery-settings";
import Department from "@/screens/department";
import Discount from "@/screens/discount";
import DojoSettings from "@/screens/dojo-settings";
import EmailSettings from "@/screens/email-settings";
import Expense from "@/screens/expense";
import ExpenseType from "@/screens/expense-type";
import Faq from "@/screens/faq";
import Filter from "@/screens/filter";
import FilterAttribute from "@/screens/filter-attribute";
import GeneralSettings from "@/screens/general-settings";
import Ingredients from "@/screens/ingredients";
import { KITCHENDISPLAY } from "@/screens/kitchen-display";
import Modifier from "@/screens/modifier";
import ModifierGroup from "@/screens/modifier-group";
import PaymentMethod from "@/screens/paymenmethods";
import POS from "@/screens/pos";
import Printer from "@/screens/printer";
import PrivacySettings from "@/screens/privacy-settings";
import Product from "@/screens/product";
import Remove from "@/screens/remove";
import SetMeal from "@/screens/setmeal";
import StripeSettings from "@/screens/stripe-settings";
import Subscriber from "@/screens/subscriber";
import Table from "@/screens/table";
import TaxSettings from "@/screens/tax-settings";
import TermsSettings from "@/screens/terms-settings";
import Testimonials from "@/screens/testimonial";
import TrustSettings from "@/screens/trust-settings";
import WorldpaySettings from "@/screens/worldpay-settings";
import { useCollapseStore } from "@/stores/menu";
import React from "react";
import {
  Menu,
  MenuItem,
  MenuItemStyles,
  Sidebar,
  SubMenu,
  menuClasses,
} from "react-pro-sidebar";
import { NavLink } from "react-router-dom";
type Theme = "light" | "dark";

const themes = {
  light: {
    sidebar: {
      backgroundColor: "#ffffff",
      color: "#607489",
    },
    menu: {
      menuContent: "#fbfcfd",
      icon: "#0098e5",
      hover: {
        backgroundColor: "#c5e4ff",
        color: "#44596e",
      },
      disabled: {
        color: "#9fb6cf",
      },
    },
  },
  dark: {
    sidebar: {
      backgroundColor: "#0b2948",
      color: "rgba(255,255,255,0.8)",
    },
    menu: {
      menuContent: "#082440",
      icon: "rgba(255, 255, 255, 0.8)",
      hover: {
        backgroundColor: "#00458b",
        color: "#fff",
      },
      disabled: {
        color: "rgba(255,255,255,0.5)",
      },
    },
  },
};

// hex to rgba converter
const hexToRgba = (hex: string, alpha: number) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const SidebarComponent: React.FC = () => {
  const [collapsed, setCollapsed] = useCollapseStore();
  const [theme] = React.useState<Theme>("dark");
  const [broken, setBroken] = React.useState(false);
  // handle on RTL change event

  const menuItemStyles: MenuItemStyles = {
    root: {
      fontSize: "var(--font-base)",
      fontWeight: 400,
    },
    icon: {
      color: themes[theme].menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#b6b7b9",
    },
    subMenuContent: ({ level }) => ({
      backgroundColor:
        level === 0
          ? hexToRgba(themes[theme].menu.menuContent, !collapsed ? 0.4 : 1)
          : "transparent",
    }),
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes[theme].menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          0.8
        ),
        color: themes[theme].menu.hover.color,
      },
      "&.active": {
        backgroundColor: hexToRgba(
          themes[theme].menu.hover.backgroundColor,
          0.8
        ),
        color: themes[theme].menu.hover.color,
      },
    },
    label: ({ open }) => ({
      fontWeight: open ? 600 : undefined,
    }),
  };

  return (
    <Sidebar
      className="h-full no-scrollbar shadow-md flex-shrink-0"
      collapsed={collapsed && !broken}
      toggled={broken && collapsed}
      image={NavBackImage}
      breakPoint="md"
      onBreakPoint={(val) => {
        setBroken(val);
      }}
      onBackdropClick={() => setCollapsed(broken && !collapsed)}
      backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 0.9)}
      rootStyles={{
        color: themes[theme].sidebar.color,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
        {" "}
        <div style={{ flex: 1, marginBottom: "32px" }}>
          {collapsed && !broken ? (
            <img src={LogoImageCollapse} className="w-full p-1 filter invert" />
          ) : (
            <img src={LogoImage} className="w-full p-3 filter invert" />
          )}
          {/* <div style={{ padding: '0 24px', marginBottom: '8px' }}>
            <p


              style={{ opacity: collapsed ? 0 : 0.7, letterSpacing: '0.5px' }}
            >
              General
            </p>
          </div> */}
          <Menu menuItemStyles={menuItemStyles}>
            <MenuItem
              component={<NavLink to={Dashboard.route} />}
              icon={<i className="fa-duotone fa-home"></i>}
            >
              Dashboard
            </MenuItem>
            <MenuItem
              component={<NavLink to={Sales.route} />}
              icon={<i className="fa-duotone fa-cash-register"></i>}
            >
              Sales
            </MenuItem>
            <SubMenu
              label="Foods"
              icon={<i className="fa-duotone fa-pot-food"></i>}
            >
              <MenuItem component={<NavLink to={Category.route} />}>
                Food Category
              </MenuItem>
              <MenuItem component={<NavLink to={Ingredients.route} />}>
                Ingredients
              </MenuItem>
              <MenuItem component={<NavLink to={Allergens.route} />}>
                Allergens
              </MenuItem>
              <MenuItem component={<NavLink to={Remove.route} />}>
                Remove Instruction
              </MenuItem>
              <MenuItem component={<NavLink to={ModifierGroup.route} />}>
                Modifier Groups
              </MenuItem>
              <MenuItem component={<NavLink to={Modifier.route} />}>
                Modifiers
              </MenuItem>
              <MenuItem component={<NavLink to={Product.route} />}>
                Products
              </MenuItem>
              <MenuItem component={<NavLink to={SetMeal.route} />}>
                Set Meals
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Portals"
              icon={<i className="fa-duotone fa-cloud"></i>}
            >
              <MenuItem component={<NavLink to={POS.route} />}>
                Point of Sale
              </MenuItem>
              <MenuItem
                component={
                  <NavLink
                    to={resolveRoute(KITCHENDISPLAY.route, {
                      order_type: "dine_in",
                    })}
                  />
                }
              >
                Kitchen Display System
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Filters and Sorting"
              icon={<i className="fa-duotone fa-filter-list"></i>}
            >
              <MenuItem component={<NavLink to={FilterAttribute.route} />}>
                Filter Attributes
              </MenuItem>

              <MenuItem component={<NavLink to={Filter.route} />}>
                Filters
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Printing Devices"
              icon={<i className="fa-duotone fa-print"></i>}
            >
              <MenuItem component={<NavLink to={Printer.route} />}>
                Printer
              </MenuItem>
            </SubMenu>
            <MenuItem
              component={<NavLink to={Department.route} />}
              icon={<i className="fa-duotone fa-house-building"></i>}
            >
              Departments
            </MenuItem>
            <SubMenu
              label="Expense"
              icon={<i className="fa-duotone fa-cart-flatbed-boxes"></i>}
            >
              <MenuItem component={<NavLink to={ExpenseType.route} />}>
                Expense Type
              </MenuItem>
              <MenuItem component={<NavLink to={Expense.route} />}>
                Expense
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Discounts and Coupons"
              icon={<i className="fa-duotone fa-tags"></i>}
            >
              <MenuItem component={<NavLink to={Discount.route} />}>
                Discount
              </MenuItem>
              <MenuItem component={<NavLink to={Coupon.route} />}>
                Coupons
              </MenuItem>
              <MenuItem component={<NavLink to={CouponSells.route} />}>
                Coupon Sells
              </MenuItem>
              <MenuItem component={<NavLink to={CouponSellAdd.route} />}>
                Add Coupon Sell
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Table Management"
              icon={<i className="fa-duotone fa-table-picnic"></i>}
            >
              <MenuItem component={<NavLink to={Area.route} />}>Area</MenuItem>
              <MenuItem component={<NavLink to={Table.route} />}>
                Tables
              </MenuItem>
              <MenuItem component={<NavLink to={Booking.route} />}>
                Reservations
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Customer"
              icon={<i className="fa-duotone fa-user-group"></i>}
            >
              <MenuItem component={<NavLink to={CustomerType.route} />}>
                Customer Type
              </MenuItem>
              <MenuItem component={<NavLink to={Customer.route} />}>
                Customers
              </MenuItem>
            </SubMenu>
            <MenuItem
              component={<NavLink to={Subscriber.route} />}
              icon={<i className="fa-duotone fa-mailbox"></i>}
            >
              Subscribers
            </MenuItem>
            <SubMenu
              label="Settings"
              icon={<i className="fa-duotone fa-cog"></i>}
            >
              <MenuItem component={<NavLink to={GeneralSettings.route} />}>
                General Settings
              </MenuItem>
              <MenuItem component={<NavLink to={EmailSettings.route} />}>
                Email Settings
              </MenuItem>
              <MenuItem component={<NavLink to={AppearenceSettings.route} />}>
                Appearence Settings
              </MenuItem>
              <MenuItem component={<NavLink to={CurrencylSettings.route} />}>
                Currency Settings
              </MenuItem>
              <MenuItem component={<NavLink to={TaxSettings.route} />}>
                Tax Settings
              </MenuItem>
              <MenuItem component={<NavLink to={DeliverySettings.route} />}>
                Delivery Settings
              </MenuItem>
              <MenuItem component={<NavLink to={PaymentMethod.route} />}>
                Payment Methods
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Content Management"
              icon={<i className="fa-duotone fa-folder-grid"></i>}
            >
              <MenuItem component={<NavLink to={BannerSettings.route} />}>
                Banner
              </MenuItem>
              <MenuItem component={<NavLink to={AboutSettings.route} />}>
                About Page
              </MenuItem>
              <MenuItem component={<NavLink to={Testimonials.route} />}>
                Testimonials
              </MenuItem>
              <MenuItem component={<NavLink to={Faq.route} />}>FAQs</MenuItem>
              <MenuItem component={<NavLink to={TrustSettings.route} />}>
                Trust and Safety
              </MenuItem>
              <MenuItem component={<NavLink to={PrivacySettings.route} />}>
                Privacy Policy
              </MenuItem>
              <MenuItem component={<NavLink to={TermsSettings.route} />}>
                Terms and Condition
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Reports"
              icon={<i className="fa-duotone fa-cash-register"></i>}
            >
              <MenuItem component={<NavLink to={XReport.route} />}>
                X Report
              </MenuItem>
            </SubMenu>
            <SubMenu
              label="Payment Methods"
              icon={<i className="fa-duotone fa-cash-register"></i>}
            >
              <MenuItem component={<NavLink to={StripeSettings.route} />}>
                Stripe Configuration
              </MenuItem>
              <MenuItem component={<NavLink to={DojoSettings.route} />}>
                Dojo Configuration
              </MenuItem>
              <MenuItem component={<NavLink to={WorldpaySettings.route} />}>
                Worldpay Configuration
              </MenuItem>
              <MenuItem component={<NavLink to={CloverSettings.route} />}>
                Clover Configuration
              </MenuItem>
            </SubMenu>
          </Menu>
        </div>
      </div>
    </Sidebar>
  );
};
