import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import TitleBar from "./components/TitleBar";
import Category from "./screens/Category";
import ChangePassword from "./screens/ChangePassword";
import Dashboard from "./screens/Dashboard";
import Install from "./screens/Install";
import Login from "./screens/Login";
import Sales from "./screens/Sales";
import AboutSettings from "./screens/about-settings";
import AllergenCreate from "./screens/add-allergen";
import AreaAdd from "./screens/add-area";
import BookingAdd from "./screens/add-booking";
import CategoryCreate from "./screens/add-category";
import CouponAdd from "./screens/add-coupon";
import CustomerAdd from "./screens/add-customer";
import CustomerTypeAdd from "./screens/add-customertype";
import DepartmentAdd from "./screens/add-department";
import DiscountAdd from "./screens/add-discount";
import ExpenseAdd from "./screens/add-expense";
import ExpenseTypeAdd from "./screens/add-expensetype";
import FaqAdd from "./screens/add-faq";
import FilterAdd from "./screens/add-filter";
import FilterAttributeAdd from "./screens/add-filterattribute";
import IngredientCreate from "./screens/add-ingredient";
import ModifierAdd from "./screens/add-modifier";
import ModifierGroupCreate from "./screens/add-modifiergroup";
import PrinterAdd from "./screens/add-printer";
import RemoveAdd from "./screens/add-remove";
import SubscriberAdd from "./screens/add-subscriber";
import TableAdd from "./screens/add-table";
import TestimonialAdd from "./screens/add-testimonial";
import Allergens from "./screens/allergens";
import AppearenceSettings from "./screens/appearence-settings";
import Area from "./screens/area";
import BannerSettings from "./screens/banner-settings";
import Booking from "./screens/booking";
import Coupon from "./screens/coupon";
import CurrencylSettings from "./screens/currency-settings";
import Customer from "./screens/customer";
import CustomerType from "./screens/customertype";
import DeliverySettings from "./screens/delivery-settings";
import Department from "./screens/department";
import Discount from "./screens/discount";
import AllergenEdit from "./screens/edit-allergen";
import AreaEdit from "./screens/edit-area";
import BookingEdit from "./screens/edit-booking";
import CategoryEdit from "./screens/edit-category";
import CouponEdit from "./screens/edit-coupon";
import CustomerEdit from "./screens/edit-customer";
import CustomerTypeEdit from "./screens/edit-customertype";
import DepartmentEdit from "./screens/edit-department";
import DiscountEdit from "./screens/edit-discount";
import ExpenseEdit from "./screens/edit-expense";
import ExpenseTypeEdit from "./screens/edit-expensetype";
import FaqEdit from "./screens/edit-faq";
import FilterEdit from "./screens/edit-filter";
import FilterAttributeEdit from "./screens/edit-filterattribute";
import IngredientEdit from "./screens/edit-ingredient";
import ModifierEdit from "./screens/edit-modifier";
import ModifierGroupUpdate from "./screens/edit-modifiergroup";
import PrinterEdit from "./screens/edit-printer";
import RemoveEdit from "./screens/edit-remove";
import SubscriberEdit from "./screens/edit-subscriber";
import TableEdit from "./screens/edit-table";
import TestimonialEdit from "./screens/edit-testimonial";
import EmailSettings from "./screens/email-settings";
import Expense from "./screens/expense";
import ExpenseType from "./screens/expense-type";
import Faq from "./screens/faq";
import Filter from "./screens/filter";
import FilterAttribute from "./screens/filter-attribute";
import GeneralSettings from "./screens/general-settings";
import Ingredients from "./screens/ingredients";
import Modifier from "./screens/modifier";
import ModifierGroup from "./screens/modifier-group";
import Printer from "./screens/printer";
import PrivacySettings from "./screens/privacy-settings";
import Remove from "./screens/remove";
import Subscriber from "./screens/subscriber";
import Table from "./screens/table";
import TaxSettings from "./screens/tax-settings";
import TermsSettings from "./screens/terms-settings";
import Testimonials from "./screens/testimonial";
import TrustSettings from "./screens/trust-settings";
import ProductAdd from "./screens/add-product";
import ProductEdit from "./screens/edit-product";
import Product from "./screens/product";
import POS from "./screens/pos";
import Terminal from "./screens/terminal";
import SetMealAdd from "./screens/add-setmeals";
import SetMealEdit from "./screens/edit-setmeals";
import SetMeal from "./screens/setmeal";
import PaymentMethodAdd from "./screens/add-paymentmethod";
import PaymentMethodEdit from "./screens/edit-paymentmethod";
import PaymentMethod from "./screens/paymenmethods";
import StripeSettings from "./screens/stripe-settings";
import DojoSettings from "./screens/dojo-settings";
import WorldpaySettings from "./screens/worldpay-settings";
import CloverSettings from "./screens/clover-settings";
import CouponSells from "./screens/couponsell";
import CouponSellAdd from "./screens/add-couponsell";
import { KITCHENDISPLAY } from "./screens/kitchen-display";
import XReport from "./screens/XReport";

function App() {
  return (
    <BrowserRouter>
      <TitleBar />
      <Toaster position="bottom-right" reverseOrder={false} />
      <div className="h-[calc(100%-35px)] w-full">
        <Routes>
          <Route path={Login.route} element={<Login />} />
          <Route path={Install.route} element={<Install />} />
          <Route path={Dashboard.route} element={<Dashboard />} />
          <Route path={Sales.route} element={<Sales />} />
          <Route path={ChangePassword.route} element={<ChangePassword />} />
          <Route path={Category.route} element={<Category />} />
          <Route path={CategoryEdit.route} element={<CategoryEdit />} />
          <Route path={CategoryCreate.route} element={<CategoryCreate />} />
          <Route path={Ingredients.route} element={<Ingredients />} />
          <Route path={IngredientCreate.route} element={<IngredientCreate />} />
          <Route path={IngredientEdit.route} element={<IngredientEdit />} />
          <Route path={Allergens.route} element={<Allergens />} />
          <Route path={AllergenCreate.route} element={<AllergenCreate />} />
          <Route path={AllergenEdit.route} element={<AllergenEdit />} />
          <Route path={Remove.route} element={<Remove />} />
          <Route path={RemoveAdd.route} element={<RemoveAdd />} />
          <Route path={RemoveEdit.route} element={<RemoveEdit />} />
          <Route path={ModifierGroup.route} element={<ModifierGroup />} />
          <Route
            path={ModifierGroupCreate.route}
            element={<ModifierGroupCreate />}
          />
          <Route
            path={ModifierGroupUpdate.route}
            element={<ModifierGroupUpdate />}
          />
          <Route path={Modifier.route} element={<Modifier />} />
          <Route path={ModifierAdd.route} element={<ModifierAdd />} />
          <Route path={ModifierEdit.route} element={<ModifierEdit />} />

          <Route path={FilterAttribute.route} element={<FilterAttribute />} />
          <Route
            path={FilterAttributeAdd.route}
            element={<FilterAttributeAdd />}
          />
          <Route
            path={FilterAttributeEdit.route}
            element={<FilterAttributeEdit />}
          />

          <Route path={Filter.route} element={<Filter />} />
          <Route path={FilterAdd.route} element={<FilterAdd />} />
          <Route path={FilterEdit.route} element={<FilterEdit />} />

          <Route path={Printer.route} element={<Printer />} />
          <Route path={PrinterAdd.route} element={<PrinterAdd />} />
          <Route path={PrinterEdit.route} element={<PrinterEdit />} />

          <Route path={Department.route} element={<Department />} />
          <Route path={DepartmentAdd.route} element={<DepartmentAdd />} />
          <Route path={DepartmentEdit.route} element={<DepartmentEdit />} />

          <Route path={ExpenseType.route} element={<ExpenseType />} />
          <Route path={ExpenseTypeAdd.route} element={<ExpenseTypeAdd />} />
          <Route path={ExpenseTypeEdit.route} element={<ExpenseTypeEdit />} />

          <Route path={Expense.route} element={<Expense />} />
          <Route path={ExpenseAdd.route} element={<ExpenseAdd />} />
          <Route path={ExpenseEdit.route} element={<ExpenseEdit />} />

          <Route path={Area.route} element={<Area />} />
          <Route path={AreaAdd.route} element={<AreaAdd />} />
          <Route path={AreaEdit.route} element={<AreaEdit />} />

          <Route path={Table.route} element={<Table />} />
          <Route path={TableAdd.route} element={<TableAdd />} />
          <Route path={TableEdit.route} element={<TableEdit />} />

          <Route path={Booking.route} element={<Booking />} />
          <Route path={BookingAdd.route} element={<BookingAdd />} />
          <Route path={BookingEdit.route} element={<BookingEdit />} />

          <Route path={CustomerType.route} element={<CustomerType />} />
          <Route path={CustomerTypeAdd.route} element={<CustomerTypeAdd />} />
          <Route path={CustomerTypeEdit.route} element={<CustomerTypeEdit />} />

          <Route path={Customer.route} element={<Customer />} />
          <Route path={CustomerAdd.route} element={<CustomerAdd />} />
          <Route path={CustomerEdit.route} element={<CustomerEdit />} />

          <Route path={GeneralSettings.route} element={<GeneralSettings />} />
          <Route path={EmailSettings.route} element={<EmailSettings />} />
          <Route
            path={AppearenceSettings.route}
            element={<AppearenceSettings />}
          />
          <Route
            path={CurrencylSettings.route}
            element={<CurrencylSettings />}
          />
          <Route path={TaxSettings.route} element={<TaxSettings />} />
          <Route path={BannerSettings.route} element={<BannerSettings />} />
          <Route path={AboutSettings.route} element={<AboutSettings />} />

          <Route path={Testimonials.route} element={<Testimonials />} />
          <Route path={TestimonialAdd.route} element={<TestimonialAdd />} />
          <Route path={TestimonialEdit.route} element={<TestimonialEdit />} />

          <Route path={Faq.route} element={<Faq />} />
          <Route path={FaqAdd.route} element={<FaqAdd />} />
          <Route path={FaqEdit.route} element={<FaqEdit />} />

          <Route path={Subscriber.route} element={<Subscriber />} />
          <Route path={SubscriberAdd.route} element={<SubscriberAdd />} />
          <Route path={SubscriberEdit.route} element={<SubscriberEdit />} />

          <Route path={TrustSettings.route} element={<TrustSettings />} />
          <Route path={PrivacySettings.route} element={<PrivacySettings />} />
          <Route path={TermsSettings.route} element={<TermsSettings />} />
          <Route path={DeliverySettings.route} element={<DeliverySettings />} />

          <Route path={Discount.route} element={<Discount />} />
          <Route path={DiscountAdd.route} element={<DiscountAdd />} />
          <Route path={DiscountEdit.route} element={<DiscountEdit />} />

          <Route path={Coupon.route} element={<Coupon />} />
          <Route path={CouponAdd.route} element={<CouponAdd />} />
          <Route path={CouponEdit.route} element={<CouponEdit />} />
          <Route path={ProductAdd.route} element={<ProductAdd />} />
          <Route path={ProductEdit.route} element={<ProductEdit />} />
          <Route path={Product.route} element={<Product />} />

          <Route path={SetMealAdd.route} element={<SetMealAdd />} />
          <Route path={SetMealEdit.route} element={<SetMealEdit />} />
          <Route path={SetMeal.route} element={<SetMeal />} />

          <Route path={PaymentMethodAdd.route} element={<PaymentMethodAdd />} />
          <Route
            path={PaymentMethodEdit.route}
            element={<PaymentMethodEdit />}
          />
          <Route path={PaymentMethod.route} element={<PaymentMethod />} />

          <Route path={POS.route} element={<POS />} />
          <Route path={Terminal.route} element={<Terminal />} />
          <Route path={StripeSettings.route} element={<StripeSettings />} />
          <Route path={DojoSettings.route} element={<DojoSettings />} />
          <Route path={WorldpaySettings.route} element={<WorldpaySettings />} />
          <Route path={CloverSettings.route} element={<CloverSettings />} />
          <Route path={CouponSells.route} element={<CouponSells />} />
          <Route path={CouponSellAdd.route} element={<CouponSellAdd />} />
          <Route path={KITCHENDISPLAY.route} element={<KITCHENDISPLAY />} />
          <Route path={XReport.route} element={<XReport />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
