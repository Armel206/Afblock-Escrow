import CreateOrder from "@/components/CreateOrder";
import AcceptOrder from "@/components/AcceptOrder";
import ConfirmReception from "@/components/ConfirmReception";
import CancelOrder from "@/components/CancelOrder";
import AutoCancelExpired from "@/components/AutoCancelExpired";
import OpenDispute from "@/components/OpenDispute";
import ViewOrder from "@/components/ViewOrder";
import AllOrders from "@/components/AllOrders";

export default function Home() {
  return (
    <div className="space-y-6">
      <CreateOrder />
      <AcceptOrder />
      <ConfirmReception />
      <CancelOrder />
      <AutoCancelExpired />
      <OpenDispute />
      <ViewOrder />
      <AllOrders />
    </div>
  );
}
