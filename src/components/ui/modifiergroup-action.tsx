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
import ModifierGroupUpdate from "@/screens/edit-modifiergroup";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

export interface ModifierGroupAction {
  id: string;
}
export default function ModifierGroupAction(props: ModifierGroupAction) {
  const navigate = useNavigate();

  async function handleEdit() {
    let link = resolveRoute(ModifierGroupUpdate.route, props);

    navigate(link);
  }

  async function handleDelete() {
    let modifierGroup: any = await db.get(props.id);
    let modifiers = await db.find({
      selector: {
        modifier_group_id: props.id,
      },
    });

    let deletedModifier = modifiers.docs.map((item: any) => ({
      ...item,
      _deleted: true,
    }));

    await db.bulkDocs(deletedModifier);
    await db.remove(modifierGroup);

    toast.success("Modifier Group Deleted!");
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
              ModifierGroup and remove all the modifiers under this Modifier
              group.
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
