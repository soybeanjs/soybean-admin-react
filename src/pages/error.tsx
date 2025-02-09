import { Button, Typography } from 'antd';
import type { FallbackProps } from 'react-error-boundary';
import { useNavigate, useRouteError } from 'react-router-dom';

import { $t } from '@/locales';
import { localStg } from '@/utils/storage';

type Props = Partial<FallbackProps>;

const isDev = import.meta.env.DEV;

function HookSupportChecker() {
  try {
    // 尝试使用一个简单的 Hook

    const error = useRouteError() as Error;

    const nav = useNavigate();

    const update = () => {
      nav(0);
    };

    return { error, update }; // 如果没有抛出异常，则支持 Hook
  } catch {
    return false; // 如果抛出异常，则不支持 Hook
  }
}

const theme = localStg.get('themeColor') || '#646cff';

const ErrorPage = ({ error, resetErrorBoundary }: Props) => {
  // 可以在这里根据不同的业务逻辑处理错误或者上报给日志服务
  const hook = HookSupportChecker();

  console.error(error);

  return (
    <div className="size-full min-h-520px flex-col-center gap-16px overflow-hidden">
      <div className="flex text-400px text-primary">
        <SvgIcon localIcon="error" />
      </div>
      {isDev ? (
        <Typography.Text code>{hook ? hook.error.message : error.message}</Typography.Text>
      ) : (
        <Typography.Title level={3}>{$t('common.errorHint')}</Typography.Title>
      )}
      <Button
        style={{ backgroundColor: theme }}
        type="primary"
        onClick={hook ? hook.update : resetErrorBoundary}
      >
        {$t('common.tryAlign')}
      </Button>
    </div>
  );
};

export default ErrorPage;
