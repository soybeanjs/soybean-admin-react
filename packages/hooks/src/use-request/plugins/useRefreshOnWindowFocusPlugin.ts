import { useUnmount } from 'ahooks';
import { useEffect, useRef } from 'react';

import type { Plugin } from '../type';
import limit from '../utils/limit';
import subscribeFocus from '../utils/subscribeFocus';

const useRefreshOnWindowFocusPlugin: Plugin<any, any[]> = (
  fetchInstance,
  { focusTimespan = 5000, refreshOnWindowFocus }
) => {
  const unsubscribeRef = useRef<(() => void) | undefined>(undefined);

  const stopSubscribe = () => {
    unsubscribeRef.current?.();
  };

  useEffect(() => {
    if (refreshOnWindowFocus) {
      const limitRefresh = limit(fetchInstance.refresh.bind(fetchInstance), focusTimespan);
      unsubscribeRef.current = subscribeFocus(() => {
        limitRefresh();
      });
    }
    return () => {
      stopSubscribe();
    };
  }, [refreshOnWindowFocus, focusTimespan]);

  useUnmount(() => {
    stopSubscribe();
  });

  return {};
};

export default useRefreshOnWindowFocusPlugin;
