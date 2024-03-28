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
import { Button } from "./button";
import { db } from "@/db";
import { DBCollections } from "@/db/index.type";
import toast from "react-hot-toast";
import { deleteFile, resolveRoute } from "@/lib/utils";
import CategoryEdit from "@/screens/edit-category";
import { useNavigate } from "react-router-dom";

export interface CategoryAction {
  id: string;
}
export default function CategoryAction(props: CategoryAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(CategoryEdit.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let category: any = await db.get(props.id);
    let products = await db.find({
      selector: {
        table: DBCollections.ITEM,
        category_id: props.id,
      },
    });

    let deletedProducts = products.docs.map((item: any) => ({
      ...item,
      _deleted: true,
    }));

    await db.bulkDocs(deletedProducts);
    await db.remove(category);
    if (category.image) {
      await deleteFile(category.image);
    }

    toast.success("Category Deleted!");
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
              category and remove all the products under this category.
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
