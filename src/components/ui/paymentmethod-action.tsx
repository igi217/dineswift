import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/db";
import { resolveRoute } from "@/lib/utils";
import PaymentMethodEdit from "@/screens/edit-paymentmethod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface PaymentMethodAction {
  id: string;
  delete: boolean;
}
export default function PaymentMethodAction(props: PaymentMethodAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(PaymentMethodEdit.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let paymentmethod: any = await db.get(props.id);

    await db.remove(paymentmethod);

    toast.success("Payment Method Deleted!");
  }
  console.log(props)
  return (
    <div>
      {props.delete ? (
        <AlertDialog>
          <AlertDialogTrigger>
            <i className="fa-solid fa-trash-alt text-red-500"></i>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                allergen and remove all the products using this Payment Method.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-700"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      <Button onClick={handleEdit} variant={"ghost"} size={"sm"}>
        <i className="fa-solid fa-pencil text-cyan-500"></i>
      </Button>
    </div>
  );
}
