import * as React from 'react';
import { getTypeEmoji } from '../../getTypeEmoji';
import { columnGridMargin } from './constants';

export function Column({ label, type, x, height, cellWidth }) {
  return (
    <g className="column" transform={'translate(' + x + ')rotate(-90)'}>
      <line x1={-height} />
      <text
        x={columnGridMargin}
        y={cellWidth / 2}
        dy=".32em"
        textAnchor="start"
        className="code"
      >
        {label}
      </text>
      <text
        x={7.5}
        y={-cellWidth / 2}
        dy=".32em"
        textAnchor="start"
        transform="rotate(90)"
      >
        {getTypeEmoji(type)}
      </text>
    </g>
  );
}
