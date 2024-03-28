import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export type Option = {
  label: any;
  value: any;
};
export type Combobox = {
  options: Option[];
  value: any;
  onChange: (value: any) => void;
  buttonClassName?: string;
  popoverClassName?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  notfoundText?: string | React.ReactElement;
};
export function Combobox(props: Combobox) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = [props.value, props.onChange];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", props.buttonClassName)}
        >
          {value
            ? props.options.find((option) => option.value === value)?.label
            : props.placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-full PopoverContent", props.popoverClassName)}>
        <Command>
          <CommandInput placeholder={props.searchPlaceholder} />
          <CommandEmpty>{props.notfoundText}</CommandEmpty>
          <CommandGroup>
            {props.options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => {
                  setValue(option.value === value ? "" : option.value);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
