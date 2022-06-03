import loading from './glyphs/loading';
import cn from 'classnames';
import { createElement, MemoExoticComponent } from 'react';

interface IconProps {
  glyph: glyph;
  size?: number;
  onClick?: any;
  fill?: string;
  rotate?: number;
  height?: number;
  isAbsolute?: boolean;
  secondaryFill?: string;
  text?: string;
  containerClass?: string;
}

export enum glyph {
  loading,
}

export const GLYPH_MAPS: Record<glyph, MemoExoticComponent<any>> = {
  [glyph.loading]: loading,
};

function Icon(props: IconProps): JSX.Element {
  const { glyph, fill, rotate, size = 8, containerClass = '', ...res } = props;

  return (
    <span className={cn(`w-${size} h-${size} inline-block`, containerClass)}>
      {createElement(GLYPH_MAPS[glyph], {
        fill: fill ? fill : 'currentColor',
        ...res,
        rotate,
      })}
    </span>
  );
}

export default Icon;

Icon.glyph = glyph;
