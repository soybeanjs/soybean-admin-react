import { useRequest } from '@sa/hooks';
import type { DescriptionsProps } from 'antd';

import { fetchGetUserList } from '@/service/api';

const { Title } = ATypography;

type Item<T> = T extends any[] ? T[number] : T;

type ValuesOf<T> = T[keyof T];

type Values = ValuesOf<Api.SystemManage.User>;

function transformDataToItem<T extends string, U extends Values>(
  tuple: [T, U]
): NonNullable<Item<DescriptionsProps['items']>> {
  return {
    children: tuple[1],
    key: tuple[0],
    label: tuple[0]
  };
}

const Component = () => {
  const [current, setCurrent] = useState(1);

  const { data, loading } = useRequest(fetchGetUserList, {
    params: {
      current,
      size: 10
    }
  });

  const items = data ? Object.entries(data.records[0]).map(transformDataToItem) : [];

  function handleChange() {
    setCurrent(current + 1);
  }

  return (
    <ACard
      className="h-full card-wrapper"
      size="small"
      variant="borderless"
    >
      <Title
        className="mb-8 text-center"
        level={2}
      >
        useRequest 示例
      </Title>

      <div className="flex flex-col items-center gap-6">
        <AButton
          className="transition-transform hover:scale-105"
          loading={loading}
          type="primary"
          onClick={handleChange}
        >
          下一页数据
        </AButton>

        <div className="mx-auto max-w-2xl rounded-lg p-4 shadow-sm backdrop-blur-sm">
          <p className="text-center leading-relaxed">
            项目的useRequest相较于阿里的ahooks的useRequest，依赖刷新进行了重写，多加了一个params参数，自动推导类型并且当其中一个参数发生变化时，会自动刷新请求，使用最新的参数。
          </p>
        </div>

        <div className="mt-4 w-full">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <ASpin size="large" />
            </div>
          )}

          {!loading && items.length > 0 && (
            <ADescriptions
              bordered
              className="overflow-hidden rounded-lg shadow-sm backdrop-blur-sm"
              column={2}
              items={items}
              size="small"
            />
          )}

          {!loading && items.length === 0 && <AEmpty />}
        </div>
      </div>
    </ACard>
  );
};

export default Component;
