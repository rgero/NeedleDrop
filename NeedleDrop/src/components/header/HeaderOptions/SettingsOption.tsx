import MenuOption from '@interfaces/MenuOption';
import { Settings } from '@mui/icons-material';
import { useDialogProvider } from '@context/dialog/DialogContext';

const SettingsOption = () => {
  const { toggleSettingsDialog } = useDialogProvider();
  return (
    <MenuOption icon={<Settings/> } text="Settings" onClick={toggleSettingsDialog}/>
  )
}

export default SettingsOption
