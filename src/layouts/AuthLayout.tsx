import Logo from "@/components/Logo";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
    return (
        <>
        <div className="bg-gray-800 min-h-screen">
            <div className="py-8 lg:py-14 mx-auto w-[350px]">

                <Logo/>

                <div className="mt-8"><Outlet/></div>
            </div>
        </div>
        
        <ToastContainer pauseOnHover={false} pauseOnFocusLoss={false}/>

        </>
    )
}
