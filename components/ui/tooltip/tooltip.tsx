import { Tooltip as ReactTooltip } from 'react-tooltip';
import { ITooltipProps } from './tooltip-type';

export function Tooltip(props: ITooltipProps) {
  const { id, content } = props;

  return (
    <ReactTooltip
      id={id}
      place="right"
      content={content}
      className="[&&]:p-1 [&&]:text-xs [&&]:bg-popover"
    />
  );
}
