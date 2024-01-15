import { SectionProps } from "./Section.type";

const Section = (props: SectionProps): JSX.Element => {

  const product = props.product?.length > 0 ? props.product[0] : null;

  const callToActionHref = product?.url || props.call_to_action.href;
  const callToActionTitle = product?.title || props.call_to_action.title;

  return (
    <div className="max-w-7xl flex flex-auto gap-5 py-10">
      <div className="basis-1/2">
        <h2 className="text-4xl font-bold">{props.title_h2}</h2>
        <p>{props.description}</p>
        {props.call_to_action && (
          <a
            className="text-sky-500 font-semibold dark:text-sky-400"
            href={callToActionHref}
          >
            {callToActionTitle}
          </a>
        )}
      </div>
      <div className="basis-1/2">
        {props.image && (
          <img
            className="full max-w-full"
            src={props.image.url}
            alt={props.image.title}
          />
        )}
      </div>
    </div>
  );
};

export default Section;
