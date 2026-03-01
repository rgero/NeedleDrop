import { Box, Container, Grid, Pagination, Typography, useMediaQuery, useTheme } from "@mui/material"
import { useMemo, useState } from "react";

type PaginatedSectionProps = {
  data: Record<string, number>;
  descriptor: string;
}

const PaginatedSection = ({data, descriptor}: PaginatedSectionProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 5;
  const rowHeight = 48; 

  const sortedData = useMemo(() => {
    return Object.entries(data)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [data]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = sortedData.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  return (
      <Container disableGutters sx={{ width: { sm: "100%", lg: "50%" }, maxWidth: '100%' }}>
        <Grid container direction="column" sx={{ width: '100%', overflow: 'hidden' }}>
          
          {/* Header */}
          <Grid 
            container 
            size={12}
            justifyContent="space-between" 
            sx={{ 
              pb: 1, 
              mb: 1, 
              borderBottom: '2px solid rgba(255,255,255,0.1)',
              flexWrap: 'nowrap'
            }}
          >
            <Grid size={10}>
              <Typography fontWeight="bold">{descriptor}</Typography>
            </Grid>
            <Grid size={2} sx={{ textAlign: 'right' }}>
              <Typography fontWeight="bold">Count</Typography>
            </Grid>
          </Grid>

          {/* Fixed Height Content Area */}
          <Box sx={{ height: itemsPerPage * rowHeight, width: '100%' }}>
            {paginatedData.map((item) => (
              <Grid 
                container 
                key={item.name} 
                alignItems="center"
                justifyContent="space-between"
                sx={{ 
                  height: rowHeight,
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                  flexWrap: 'nowrap',
                  width: '100%'
                }}
              >
                <Grid size={10} sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontSize: '0.9rem',
                      pr: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: 'block',
                      width: '100%' 
                    }}
                    title={item.name}
                  >
                    {item.name}
                  </Typography>
                </Grid>
                <Grid size={2} sx={{ textAlign: 'right', flexShrink: 0 }}>
                  <Typography sx={{ fontSize: '0.9rem' }}>
                    {item.count}
                  </Typography>
                </Grid>
              </Grid>
            ))}
          </Box>

          {/* Pagination */}
          <Box sx={{
            display: 'flex', 
            justifyContent: 'center',
            mt: 2,
            visibility: totalPages > 1 ? 'visible' : 'hidden',
            width: '100%',
            px: 1
          }}>
            <Pagination 
              count={totalPages} 
              page={page} 
              onChange={handlePageChange} 
              color="primary" 
              size="small"
              siblingCount={isMobile ? 0 : 1}
              boundaryCount={1}
              showFirstButton={isMobile}
              showLastButton={isMobile}
            />
          </Box>
        </Grid>
      </Container>
  )
}

export default PaginatedSection
