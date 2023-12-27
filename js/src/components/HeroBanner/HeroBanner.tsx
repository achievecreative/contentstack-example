import { HeroBannerProps } from "./HeroBanner.types";

const HeroBanner = (props: HeroBannerProps): JSX.Element => {
  console.log("Hero banner", props);
  return <div className="hero-banner-components"></div>;
};

export const HeroBannerName = "hero_banner";

export default HeroBanner;
