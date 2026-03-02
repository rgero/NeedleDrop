import { Container, Typography, lighten, useTheme } from "@mui/material";
import { DndContext, KeyboardSensor, MouseSensor, PointerSensor, closestCenter, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";

import { DefaultSettings } from "@interfaces/UserSettings";
import Loading from "@components/ui/Loading";
import LocationStats from "./sections/LocationStats";
import PlayStats from "./sections/playlogs/PlayStats";
import PlaysByAlbum from "./sections/playlogs/PlaysByAlbum";
import PlaysByDays from "./sections/playlogs/PlaysByDays";
import PlaysByTimelineChart from "./sections/playlogs/PlaysByTimelineChart";
import TopPlayDates from "./sections/playlogs/TopPlayDates";
import VinylOwnership from "./sections/vinyls/VinylOwnership";
import VinylTopArtists from "./sections/vinyls/VinylTopArtists";
import { useExpandedSections } from "./hooks/useExpandedSections";
import { useUserContext } from "@context/users/UserContext";
import { useSectionOrder } from "./hooks/useSectionOrder";
import SortableItem from "./ui/SortableItem";
import type { Stats } from "@interfaces/Stats";

interface BaseExpandedSections {
  vinyls: boolean;
  topArtists: boolean;
  locations: boolean;
  playlogs: boolean;
  topPlayDays: boolean;
  playsByDays: boolean;
  playsByTimelineChart: boolean;
  playsByAlbum: boolean;
  [key: string]: boolean;
}

type OrderKeys = 'userStatsOrder' | 'houseStatsOrder';
type ExpandedKeys = 'userStatsExpandedSections' | 'houseStatsExpandedSections';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface BaseStatsProps<T extends BaseExpandedSections> {
  title: string;
  stats: Stats;
  orderKey: OrderKeys;
  expandedKey: ExpandedKeys;
}

const BaseStats = <T extends BaseExpandedSections>({ title, stats, orderKey, expandedKey }: BaseStatsProps<T>) => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();
  const theme = useTheme();

  const settings = getCurrentUserSettings();

  // Initialize the expanded sections and order from user settings, falling back to defaults if not set
  const initialExpanded = (settings?.[expandedKey] ?? DefaultSettings[expandedKey]) as unknown as T; 
  const { expandedSections, handleToggle } = useExpandedSections<T>(
    initialExpanded,
    (updated) => updateCurrentUserSettings({ [expandedKey]: updated })
  );

  const initialOrder = (settings?.[orderKey] ?? DefaultSettings[orderKey]) as string[];
  const { order, handleReorder } = useSectionOrder(
    initialOrder,
    (updatedOrder) => updateCurrentUserSettings({ [orderKey]: updatedOrder })
  );

  // This is for DND
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      handleReorder(active.id as string, over.id as string);
    }
  };

  const sectionMap: Record<string, React.ReactNode> = {
    vinyls: (
      <VinylOwnership 
        stats={stats} 
        expanded={expandedSections.vinyls} 
        onToggle={(exp) => handleToggle("vinyls", exp)} 
      />
    ),
    topArtists: (
      <VinylTopArtists 
        stats={stats} 
        expanded={expandedSections.topArtists} 
        onToggle={(exp) => handleToggle("topArtists", exp)} 
      />
    ),
    locations: (
      <LocationStats 
        stats={stats} 
        expanded={expandedSections.locations} 
        onToggle={(exp) => handleToggle("locations", exp)} 
      />
    ),
    playlogs: (
      <PlayStats 
        stats={stats} 
        expanded={expandedSections.playlogs} 
        onToggle={(exp) => handleToggle("playlogs", exp)} 
      />
    ),
    topPlayDays: (
      <TopPlayDates 
        stats={stats} 
        expanded={expandedSections.topPlayDays} 
        onToggle={(exp) => handleToggle("topPlayDays", exp)} 
      />
    ),
    playsByDays: (
      <PlaysByDays 
        stats={stats} 
        expanded={expandedSections.playsByDays} 
        onToggle={(exp) => handleToggle("playsByDays", exp)} 
      />
    ),
    playsByAlbum: (
      <PlaysByAlbum 
        stats={stats} 
        expanded={expandedSections.playsByAlbum} 
        onToggle={(exp) => handleToggle("playsByAlbum", exp)} 
      />
    ),
    playsByTimelineChart: (
      <PlaysByTimelineChart 
        stats={stats} 
        expanded={expandedSections.playsByTimelineChart} 
        onToggle={(exp) => handleToggle("playsByTimelineChart", exp)} 
      />
    ),
  };

  if (isLoading) return <Loading />;

  return (
    <Container 
      sx={{ 
        backgroundColor: lighten(theme.palette.background.paper, 0.03), 
        paddingTop: 1, 
        minHeight: '100vh' 
      }}
    >
      <Typography variant="h5" paddingBottom={2}>{title}</Typography>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={order} strategy={verticalListSortingStrategy}>
          {order.map((id) => (
            <SortableItem key={id} id={id}>
              {sectionMap[id]}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </Container>
  );
};

export default BaseStats;