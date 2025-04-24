import clsx from 'clsx';
import KeepAlive, { useKeepAliveRef } from 'keepalive-for-react';
import { useLocation, useOutlet } from 'react-router-dom';

import { usePreviousRoute } from '@/features/router';
import { selectCacheRoutes, selectRemoveCacheKey, setRemoveCacheKey } from '@/features/router/routeStore';
import { useThemeSettings } from '@/features/theme';
import { useAppDispatch, useAppSelector } from '@/hooks/business/useStore';
import { getReloadFlag } from '@/layouts/appStore';
import './transition.css';

interface Props {
  /** Show padding for content */
  closePadding?: boolean;
}

const GlobalContent = ({ closePadding }: Props) => {
  const previousRoute = usePreviousRoute();

  const currentOutlet = useOutlet(previousRoute);

  const { pathname } = useLocation();

  const aliveRef = useKeepAliveRef();

  const removeCacheKey = useAppSelector(selectRemoveCacheKey);

  const cacheKeys = useAppSelector(selectCacheRoutes);

  const reload = useAppSelector(getReloadFlag);

  const themeSetting = useThemeSettings();

  const dispatch = useAppDispatch();

  const transitionName = themeSetting.page.animate ? themeSetting.page.animateMode : '';

  useUpdateEffect(() => {
    if (!aliveRef.current || !removeCacheKey) return;

    aliveRef.current.destroy(removeCacheKey).then(() => {
      dispatch(setRemoveCacheKey(null));
    });
  }, [removeCacheKey]);

  useUpdateEffect(() => {
    aliveRef.current?.refresh();
  }, [reload, transitionName]);

  return (
    <div className={clsx('h-full flex-grow bg-layout', { 'p-16px': !closePadding })}>
      <KeepAlive
        activeCacheKey={pathname}
        aliveRef={aliveRef}
        cacheNodeClassName={reload ? '' : transitionName}
        include={cacheKeys}
      >
        {!reload && currentOutlet}
      </KeepAlive>
    </div>
  );
};

export default GlobalContent;
