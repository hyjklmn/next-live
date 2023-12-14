import React, { useRef, useLayoutEffect, RefObject } from 'react';

function useScrollToBottom(): RefObject<HTMLDivElement> {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  });

  return scrollRef;
}

export default useScrollToBottom