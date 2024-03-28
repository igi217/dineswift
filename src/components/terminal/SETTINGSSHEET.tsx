import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { useTerminalSettings } from "@/stores/settings";

export function SETTINGSSHEET() {
    const [setting, setSetting] = useTerminalSettings();
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button className="font-bold" variant="ghost">
            <i className="fa-solid fa-cog text-cyan-500 text-lg mr-1"></i>
            Settings
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Terminal Customization</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4 mb-3">
              <Label htmlFor="fontSize" className="text-right">
                Font Size
              </Label>
              <Input
                id="fontSize"
                value={setting.fontSize}
                onChange={(e) =>
                  setSetting({ ...setting, fontSize: +e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-3">
              <Label htmlFor="image" className="text-right">
                Show Image ?
              </Label>
              <Switch
                id="image"
                checked={setting.image}
                onCheckedChange={(checked) =>
                  setSetting({ ...setting, image: checked })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4 mb-3">
              <Label htmlFor="color" className="text-right">
                Show Colors ?
              </Label>
              <Switch
                id="color"
                checked={setting.color}
                onCheckedChange={(checked) =>
                  setSetting({ ...setting, color: checked })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4"></div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }