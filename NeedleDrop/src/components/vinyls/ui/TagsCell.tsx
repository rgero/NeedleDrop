import { Box, Chip } from '@mui/material';
import { gridFilterModelSelector, useGridApiContext, useGridSelector } from '@mui/x-data-grid';

const TagsCell = ({ value }: { value: string[] }) => {
  const apiRef = useGridApiContext();
  const filterModel = useGridSelector(apiRef, gridFilterModelSelector);
  
  const tagFilter = filterModel.items.find(item => item.field === 'tags');
  const filterValue = tagFilter?.value?.toLowerCase() || '';

  const sortedTags = [...(value || [])].sort((a, b) => {
    if (!filterValue) return 0;
    const aMatch = a.toLowerCase().includes(filterValue);
    const bMatch = b.toLowerCase().includes(filterValue);
    return aMatch === bMatch ? 0 : aMatch ? -1 : 1;
  });

  const hasManyTags = value.length > 2;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'relative', // Necessary to pin the ellipsis chip
        overflow: 'hidden',
        // Matches your screenshot's right-alignment
        justifyContent: 'flex-end' 
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 0.5, 
          flexWrap: 'nowrap', 
          alignItems: 'center',
          overflow: 'hidden',
          pr: hasManyTags ? '35px' : 0, 
        }}
      >
        {sortedTags.map((tag, index) => {
          const isMatch = filterValue && tag.toLowerCase().includes(filterValue);
          return (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              color={isMatch ? "primary" : "default"}
              variant={isMatch ? "filled" : "outlined"} 
              sx={{ fontSize: '0.75rem', flexShrink: 0 }}
            />
          );
        })}
      </Box>

      {hasManyTags && (
        <Box
          sx={{
            position: 'absolute',
            right: 0,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            pl: 1,
            background: 'linear-gradient(to right, transparent, #121212 20%)',
          }}
        >
          <Chip 
            label="..." 
            size="small" 
            variant="outlined" 
            sx={{ 
              fontSize: '0.75rem', 
              height: '20px', 
              minWidth: '28px',
              '& .MuiChip-label': { px: 1 } 
            }} 
          />
        </Box>
      )}
    </Box>
  );
};

export default TagsCell;
