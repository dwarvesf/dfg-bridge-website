import { toast } from "@mochi-ui/core";

class BridgeToast {
  static danger(message: string): void {
    toast({
      duration: 2000,
      scheme: "danger",
      title: "Error",
      description: message,
    });
  }

  static warning(message: string): void {
    toast({
      duration: 2000,
      scheme: "warning",
      title: "Attention",
      description: message,
    });
  }

  static success(message: string): void {
    toast({
      duration: 2000,
      scheme: "success",
      title: "Success",
      description: message,
    });
  }
}

export default BridgeToast;
