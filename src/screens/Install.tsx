import TerminalImage from "@/assets/images/Terminal.jpg";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { API } from "@/constants";
import { LoginResponse } from "@/types/LoginResponse";
import React from "react";
import toast from "react-hot-toast";
import Login from "./Login";
export default function Install() {
  const [formData, setFormData] = React.useState({
    license: "",
  });

  const [ready, setReady] = React.useState(true);

  const handleFormDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const handleFormSubmit = async () => {
    setReady(false);

    let response = await fetch(API.LOGIN, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(formData),
    });

    let payload = await response.json();

    setReady(true);

    if (!payload.status) {
      toast.error("Error while installing");
    } else {
      toast.success("License Installed!");
      localStorage.setItem("@license", formData.license);
      localStorage.setItem(
        "@db_key",
        (payload.payload as LoginResponse).user.db_key
      );
      location.href = Login.route;
    }
  };
  return (
    <div className="h-full relative w-full">
      <img
        className="w-full filter hue-rotate-[270deg] absolute inset-0 h-full object-cover"
        src={TerminalImage}
        alt="Terminal Image"
      />
      <div className="w-full relative h-full bg-[rgba(255,255,255,0.2)] backdrop-blur-md z-[1] flex justify-center items-center">
        <Card className="min-w-[330px]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">License Installation</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="license">License Key</Label>
              <Input
                value={formData.license}
                onChange={handleFormDataChange}
                id="license"
                type="text"
                name="license"
                placeholder="XXXX-XXXX-XXX-XXXX"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFormSubmit} className="w-full">
              Install License
            </Button>
          </CardFooter>
        </Card>
      </div>
      <Loading show={!ready} />
    </div>
  );
}

Install.route = "/Install";
