import type { DragEndEvent } from '@dnd-kit/core';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FC } from 'react';
import React from 'react';

interface Props {
  columns: AntDesign.TableColumnCheck[];
  setColumnChecks: (checks: AntDesign.TableColumnCheck[]) => void;
}

/** 单个可拖拽项组件 */
const SortableItem: FC<{
  index: number;
  item: AntDesign.TableColumnCheck;
  onCheckChange: (oldValue: boolean, index: number) => void;
}> = ({ index, item, onCheckChange }) => {
  // 使用 useSortable 获取拖拽属性
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.key // 每个可拖拽对象的唯一标识
  });

  // inline 样式，用于在拖拽时移动/过渡
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      // 把拖拽所需的属性都附加上去
      {...attributes}
      className="h-36px flex-y-center rd-4px hover:(bg-primary bg-opacity-20)"
    >
      <IconMdiDrag
        className="mr-8px h-full cursor-move text-icon"
        {...listeners}
      />
      <ACheckbox
        checked={item.checked}
        className="none_draggable flex-1"
        onClick={() => onCheckChange(item.checked, index)}
      >
        {item.title}
      </ACheckbox>
    </div>
  );
};

/** 列表容器组件 */
const DragContent: FC<Props> = ({ columns, setColumnChecks }) => {
  // 拖拽结束时的回调
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    // 如果拖拽开始和结束位置的 id 不同，则表示有重新排序
    if (active.id !== over.id) {
      const oldIndex = columns.findIndex(item => item.key === active.id);
      const newIndex = columns.findIndex(item => item.key === over.id);

      // arrayMove 是 DnD Kit 提供的辅助函数，用于在数组中移动元素
      const newColumns = arrayMove(columns, oldIndex, newIndex);
      setColumnChecks(newColumns);
    }
  };

  // 点击复选框时更改“checked”
  const handleChange = (value: boolean, index: number) => {
    columns[index].checked = !value;
    // 这里要注意保持新数组引用，确保触发 React 重新渲染
    setColumnChecks([...columns]);
  };

  return (
    // DndContext 相当于顶层的拖拽环境容器
    <DndContext onDragEnd={handleDragEnd}>
      {/*
        SortableContext 用于告诉 DnD Kit，这个区域内的一组元素可以“排序”；
        items 传入当前这批可排序对象的 key（或整个对象，但 key 必须唯一）；
        strategy 指定排序策略，如 verticalListSortingStrategy 适合竖直列表。
      */}
      <SortableContext
        items={columns.map(item => item.key)}
        strategy={verticalListSortingStrategy}
      >
        {columns.map((item, index) => (
          <SortableItem
            index={index}
            item={item}
            key={item.key}
            onCheckChange={handleChange}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
};

export default DragContent;
