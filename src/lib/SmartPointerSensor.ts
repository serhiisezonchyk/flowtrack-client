import { MouseSensor } from '@dnd-kit/core';
import { MouseEvent } from 'react';

/**
 * An extended "PointerSensor" that prevent some
 * interactive html element(button, input, textarea, select, option...) from dragging
 */
class SmartMouseSensor extends MouseSensor {
  static activators = [
    {
      eventName: 'onMouseDown' as any,
      handler: ({ nativeEvent: event }: MouseEvent) => {
        if (event.button !== 0 || isInteractiveElement(event.target as Element)) {
          return false;
        }

        return true;
      },
    },
  ];
}

function isInteractiveElement(element: Element | null) {
  const interactiveElements = ['button', 'input', 'textarea', 'svg'];
  if (element?.tagName && interactiveElements.includes(element.tagName.toLowerCase())) {
    return true;
  }

  return false;
}

export default SmartMouseSensor