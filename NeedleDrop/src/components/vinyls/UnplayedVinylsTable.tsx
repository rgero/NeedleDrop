import Empty from "@components/ui/Empty";
import VinylTableWrapper from "./ui/VinylTableWrapper";
import { useVinylContext } from "@context/vinyl/VinylContext";

const UnplayedVinylsTable = () => {
  const { unplayedVinyls } = useVinylContext();

  if (unplayedVinyls.length === 0) {
    return <Empty title="You're caught up! No unplayed vinyls — nice work! 🎉" />;
  }

  return <VinylTableWrapper vinyls={unplayedVinyls} />;
};

export default UnplayedVinylsTable;