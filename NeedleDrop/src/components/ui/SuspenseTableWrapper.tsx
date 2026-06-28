import { type ReactNode, Suspense } from "react";

import Loading from "./Loading";

interface SuspenseTableWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const SuspenseTableWrapper = ({ children, fallback }: SuspenseTableWrapperProps) => {
  return (
    <Suspense fallback={fallback || <Loading />}>
      {children}
    </Suspense>
  );
};

export default SuspenseTableWrapper;
