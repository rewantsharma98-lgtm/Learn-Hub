import { useSelector } from "react-redux";
import { useAuth } from "@/context/AuthContext";

export default function ProtectedAction({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { openAuthModal } = useAuth();

  const handleClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      openAuthModal();
      return;
    }

    if (children?.props?.onClick) {
      children.props.onClick(e);
    }
  };

  return (
    <div onClick={handleClick} style={{ display: "inline-block", width: "100%" }}>
      {children}
    </div>
  );
}