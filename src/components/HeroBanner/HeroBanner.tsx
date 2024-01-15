import { HeroBannerProps } from "./HeroBanner.types";

const HeroBanner = (props: HeroBannerProps): JSX.Element => {
  console.log("Hero banner", props);
  return (
    <div className="hero-banner-components flex flex-col gap-3 relative">
      {props.banner_image && (
        <img src={props.banner_image.url} className="w-max-full w-1/3" />
      )}
      <h2 className="text-2xl font-bold">{props.banner_title}</h2>
      <p className="leading-6">{props.banner_description}</p>
    </div>
  );
};

export const HeroBannerName = "hero_banner";

export default HeroBanner;
