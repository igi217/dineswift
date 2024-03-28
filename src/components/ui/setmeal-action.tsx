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
import SetMealEdit from "@/screens/edit-setmeals";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface SetMealAction {
  id: string;
}
export default function SetMealAction(props: SetMealAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(SetMealEdit.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let product: any = await db.get(props.id);

    await db.remove(product);

    toast.success("Product Deleted!");
  }
  return (
    <div>
      <AlertDialog>
        <AlertDialogTrigger>
          <i className="fa-solid fa-trash-alt text-red-500"></i>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              product.
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
      <Button onClick={handleEdit} variant={"ghost"} size={"sm"}>
        <i className="fa-solid fa-pencil text-cyan-500"></i>
      </Button>
    </div>
  );
}
