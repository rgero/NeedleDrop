import { Suspense, type ReactNode } from "react";
import { Paper, Container, Box, Skeleton } from "@mui/material";

interface SuspenseStatsWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SuspenseStatsWrapper = ({ children, fallback }: SuspenseStatsWrapperProps) => {
  return (
    <Suspense
      fallback={
        fallback || (
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden", p: 2, mb: 2 }}>
            <Container disableGutters maxWidth="lg">
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                <Skeleton height={40} />
                <Skeleton height={200} />
              </Box>
            </Container>
          </Paper>
        )
      }
    >
      {children}
    </Suspense>
  );
};

export default SuspenseStatsWrapper;
