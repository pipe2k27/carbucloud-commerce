import { ToasterToast } from "@/hooks/use-toast";

export type ServerResponse = {
  status: number;
  message?: string;
  data?: any;
};

export const errorObject: ServerResponse = {
  status: 500,
  message: "An error occurred",
};

export const errorToast: Omit<ToasterToast, "id"> = {
  variant: "destructive",
  title: "Error!",
  description: "Ha habido un error de procesamiento, intentelo más tarde.",
};
