import { useParams } from "react-router-dom"
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlaylogDetails = () => {
  const {id} = useParams();
  const {getPlaylogById} = usePlaylogContext();

  const isCreateMode = !id || id === 'new';


  const playlog = getPlaylogById(id);

  return (
    <div>
      
    </div>
  )
}

export default PlaylogDetails
