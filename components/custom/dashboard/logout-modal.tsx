"use client";

import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Button } from "@/components/ui";
import { Modal } from "@/components/shared";

interface ILogoutModal {
  handleClose: () => void;
  isOpen: boolean;
}
export const LogoutModal = ({ handleClose, isOpen }: ILogoutModal) => {
  const router = useRouter();

  const handleLogout = () => {
    // Clear localStorage
    localStorage.clear();

    // Clear auth cookie - multiple methods to ensure it's cleared
    document.cookie =
      "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    Cookies.remove("authToken", { path: "/" });

    console.log("Logout: Cookies cleared");
    console.log("Cookies after logout:", document.cookie);

    // Redirect to sign-in
    router.push("/sign-in");
  };

  return (
    <Modal
      isOpen={isOpen}
      handleClose={handleClose}
      showCloseButton={false}
      className="w-full md:w-100 grid gap-y-2"
    >
      <h2 className="font-bold text-lg md:text-2xl">Log out?</h2>

      <div className="grid gap-y-6">
        <p className="text-text-1 text-sm">
          This action would log you out. you would need to login again to access
          this MSMT
        </p>

        <div className="grid grid-cols-2 gap-x-4">
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>

          <Button onClick={handleLogout}>Log out</Button>
        </div>
      </div>
    </Modal>
  );
};
