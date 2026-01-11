import { Avatar } from "@mui/material";
import HeaderMenu from "./HeaderMenu";
import { useAuthenticationContext } from '@context/authentication/AuthenticationContext';
import { useState } from "react";

const UserAvatar = () => {
  const {user} = useAuthenticationContext(); 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const userImage = user ? user.user_metadata.avatar : "/default-user.jpg";
  const userName =  user ? user.user_metadata.full_name : "Default User";

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Avatar alt={userName} src={userImage} sx={{width: 32, height: 32}} onClick={handleClick}/>
      <HeaderMenu anchorEl={anchorEl} closeFn={handleClose}/>
    </>  
  )
}

export default UserAvatar
