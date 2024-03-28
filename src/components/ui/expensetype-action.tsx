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
import { DBCollections } from "@/db/index.type";
import { resolveRoute } from "@/lib/utils";
import ExpenseTypeEdit from "@/screens/edit-expensetype";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface ExpenseTypeAction {
  id: string;
}
export default function ExpenseTypeAction(props: ExpenseTypeAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(ExpenseTypeEdit.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let expensetype: any = await db.get(props.id);

    let expenses = await db.find({
      selector: {
        table: DBCollections.EXPENSE,
        filter_attribute_id: props.id,
      },
    });

    let deletedExpense = expenses.docs.map((item: any) => ({
      ...item,
      _deleted: true,
    }));

    await db.bulkDocs(deletedExpense);

    await db.remove(expensetype);

    toast.success("Expense Type Deleted!");
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
              Expense Type and Related Data.
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
