import { useLocation } from "react-router-dom"

export default function Logo() {

    const location = useLocation()

    return (
        <img src={location.pathname.includes('/auth') ? '../logo.svg' : './logo.svg'} alt="Logo UpTask" />
    )
}
