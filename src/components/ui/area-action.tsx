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
import AreaEdit from "@/screens/edit-area";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface AreaAction {
  id: string;
}
export default function AreaAction(props: AreaAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(AreaEdit.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let area: any = await db.get(props.id);

    let related = await db.find({
      selector: {
        area_id: props.id,
      },
    });

    let deletedTables = related.docs.map((item: any) => ({
      ...item,
      _deleted: true,
    }));

    await db.bulkDocs(deletedTables);
    await db.remove(area);

    toast.success("Area Deleted!");
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
              area and remove all the tables related to this area.
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
