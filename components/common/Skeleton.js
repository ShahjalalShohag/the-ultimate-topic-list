import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const SkeletonLoader = ({ colorMode = "dark", ...props }) => {
  return colorMode !== "dark" ? (
    <Skeleton {...props} />
  ) : (
    <SkeletonTheme baseColor="#3e3f44" highlightColor="#4a4b54">
      <Skeleton {...props} />
    </SkeletonTheme>
  );
};

export default SkeletonLoader;
