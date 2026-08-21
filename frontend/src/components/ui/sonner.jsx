import { Toaster as Sonner, toast } from "sonner";

const Toaster = ({ ...props }) => {
  return <Sonner theme="dark" {...props} />;
};

export { Toaster, toast };