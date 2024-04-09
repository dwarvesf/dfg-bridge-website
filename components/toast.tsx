import { toast } from "@mochi-ui/core";

class BridgeToast {
  public danger(message: string): void {
    toast({
      duration: 2000,
      scheme: "danger",
      title: "Error !",
      description: message,
    });
  }

  public warning(message: string): void {
    toast({
      duration: 2000,
      scheme: "warning",
      title: "Attention !",
      description: message,
    });
  }

  public success(message: string): void {
    toast({
      duration: 2000,
      scheme: "success",
      title: "Success !",
      description: message,
    });
  }
}

export default BridgeToast;
