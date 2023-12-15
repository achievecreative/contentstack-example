import { SectionProps } from "./Section.type";

const Section = (props: SectionProps): JSX.Element => {
  return (
    <div className="max-4xl flex">
      <div>
        <h2 className="text-4xl font-bold">{props.title_h2}</h2>
        <p>{props.description}</p>
        {props.call_to_action && (
          <a
            className="text-sky-500 font-semibold dark:text-sky-400"
            href={props.call_to_action.href}
          >
            {props.call_to_action.title}
          </a>
        )}
      </div>
      <div>
        {props.image && (
          <img className="full" src={props.image.url} alt={props.image.title} />
        )}
      </div>
    </div>
  );
};

export default Section;
