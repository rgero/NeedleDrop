import MenuOption from '@interfaces/MenuOption';
import { Person } from "@mui/icons-material";
import { useAuthenticationContext } from '@context/authentication/AuthenticationContext';

const UserOption = () => {
  const {user} = useAuthenticationContext();
  const userName =  user ? user.user_metadata.full_name : "Default User";

  return (
    <MenuOption icon={<Person/>} text={userName} />
  )
}

export default UserOption
