import { errorHandler } from '@/lib/utils';
import { useSectionPositions } from '@/queries/section.queries';
import { useDeleteTask, useTaskPositions } from '@/queries/task.query';
import { SectionType, TaskType } from '@/types';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { MouseEvent, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import KanbanColumn from './KanbanColumn';
import SingleTask from './SingleTask';
import { Skeleton } from './ui/skeleton';

export const KanbanSectionsSkeleton: React.FC = ({}) => {
  return (
    <div className="mt-2">
      <div className="container">
        <Skeleton className="h-24 w-full" />
      </div>
    </div>
  );
};

interface KanbanSectionsProps {
  data: SectionType[];
  boardId: string;
}
const KanbanSections: React.FC<KanbanSectionsProps> = ({ data, boardId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  const onError = (e: any) => {
    const error = errorHandler(e);
    toast.error(error.error);
  };
  const { mutate: swapSectionsPosition } = useSectionPositions({
    onError,
  });
  const { mutate: swapTaskPositions } = useTaskPositions({
    onError,
  });
  const { mutate: deleteTask } = useDeleteTask({
    boardId,
    onSuccess: () => {
      toast.success('Task was deleted successfully');
    },
    onError,
  });
  useEffect(() => {
    setSections(structuredClone(data));
  }, [data]);
  const sectionsPositions = useMemo(() => sections.map((col) => col.id), [sections]);

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
  );
  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Section') {
      setActiveSection(event.active.data.current?.section);
      return;
    }
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current?.task);
      return;
    }
  };
  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    // Handle items sorting
    if (
      active.data.current?.type === 'Task' &&
      over?.data.current?.type === 'Task' &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeSectionId = (active.data.current?.task as TaskType).sectionId;
      const overSectionId = (over.data.current?.task as TaskType).sectionId;

      const activeSection = sections.find((el) => el.id === activeSectionId);
      const overSection = sections.find((el) => el.id === overSectionId);

      if (!activeSection || !overSection) return;

      const activeSectionIndex = sections.findIndex((item) => item.id === activeSectionId);
      const overSectionIndex = sections.findIndex((item) => item.id === overSectionId);

      const activeTaskIndex = activeSection.tasks.findIndex((item) => item.id === active.id);
      const overTaskIndex = overSection.tasks.findIndex((item) => item.id === over.id);

      // In same section
      if (activeSectionId === overSectionId) {
        setSections((prev) => {
          const newSections = [...prev];
          newSections[activeSectionIndex].tasks = arrayMove(
            newSections[activeSectionIndex].tasks,
            activeTaskIndex,
            overTaskIndex,
          ).map((el, index) => ({ ...el, position: index }));
          return newSections;
        });
        return;
      } else {
        // In different section
        setSections((prev) => {
          const newSections = [...prev];
          const [removedTask] = newSections[activeSectionIndex].tasks.splice(activeTaskIndex, 1);
          newSections[activeSectionIndex].tasks = newSections[activeSectionIndex].tasks.map((el, index) => ({
            ...el,
            position: index,
          }));

          removedTask.sectionId = overSectionId;

          newSections[overSectionIndex].tasks.splice(overTaskIndex, 0, removedTask);
          newSections[overSectionIndex].tasks = newSections[overSectionIndex].tasks.map((el, index) => ({
            ...el,
            position: index,
          }));

          return newSections;
        });
        return null;
      }
    }

    //Handling item drop into a container
    if (
      active.data.current?.type === 'Task' &&
      over?.data.current?.type === 'Section' &&
      active &&
      over &&
      active.id !== over.id
    ) {
      const activeSectionId = (active.data.current?.task as TaskType)?.sectionId;
      const overSectionId = (over.data.current?.section as SectionType)?.id;
      if (activeSectionId === overSectionId) return;

      const activeSection = sections.find((el) => el.id === activeSectionId);
      const overSection = sections.find((el) => el.id === overSectionId);

      if (!activeSection || !overSection) return;

      const activeSectionIndex = sections.findIndex((item) => item.id === activeSectionId);
      const overSectionIndex = sections.findIndex((item) => item.id === overSectionId);
      const activeTaskIndex = activeSection.tasks.findIndex((item) => item.id === active.id);

      setSections((prev) => {
        let newSections = [...prev];

        const [removedTask] = newSections[activeSectionIndex].tasks.splice(activeTaskIndex, 1);
        newSections[activeSectionIndex].tasks = newSections[activeSectionIndex].tasks.map((el, index) => ({
          ...el,
          position: index,
        }));

        removedTask.sectionId = overSectionId;

        newSections[overSectionIndex].tasks.push(removedTask);
        newSections[overSectionIndex].tasks = newSections[overSectionIndex].tasks.map((el, index) => ({
          ...el,
          position: index,
        }));

        return newSections;
      });
    }
  };
  const onDragEnd = (event: DragEndEvent) => {
    setActiveSection(null);
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.type === 'Section' && over?.data.current?.type === 'Section' && active && over) {
      if (active.id !== over.id) {
        const activeColId = active.id;
        const overColId = over.id;
        if (activeColId === overColId) return;
        const isActiveCol = active.data.current?.type === 'Section';
        if (!isActiveCol) return;
        const activeColIndex = sections.findIndex((col) => col.id === activeColId);
        const overColIndex = sections.findIndex((col) => col.id === overColId);
        const newSections = arrayMove(sections, activeColIndex, overColIndex).map((el, index) => ({
          ...el,
          position: index,
        }));
        setSections(newSections);

        swapSectionsPosition({ boardId, newData: newSections });
      }
      return;
    }

    if (
      (active.data.current?.type === 'Task' && over.data.current?.type === 'Section') ||
      (over.data.current?.type === 'Task' && active && over)
    ) {
      swapTaskPositions({ boardId, newData: sections });
      return;
    }
  };
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;
    const deleteButton = target.closest('[data-delete-task]') as HTMLElement;
    const taskElement = target.getAttribute('data-task-id');

    if (deleteButton) {
      const taskEl = target.closest('[data-task-id]') as HTMLElement;
      const taskId = taskEl?.getAttribute('data-task-id');
      if (taskId) deleteTask(taskId);
    }
    if (taskElement) {
      const currentPath = location.pathname;
      console.log(currentPath)
      navigate(`${currentPath}/${taskElement}`);
    }
  };
  return (
    <div className="mt-2">
      <div className="container" onClick={handleClick}>
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="flex flex-row gap-4 flex-wrap overflow-x-auto sm:flex-nowrap h-full">
            <SortableContext items={sectionsPositions}>
              {sections.map((section) => (
                <KanbanColumn key={section.id} section={section} tasks={section.tasks} boardId={boardId} />
              ))}
            </SortableContext>
          </div>

          {/* Overlays for draggable objets */}
          {createPortal(
            <DragOverlay adjustScale={false}>
              {activeSection && (
                <KanbanColumn
                  tasks={activeSection.tasks}
                  className="bg-transaprent backdrop-blur-lg border-2 shadow-2xl"
                  section={activeSection}
                  boardId={boardId}
                />
              )}
              {activeTask && <SingleTask task={activeTask} />}
            </DragOverlay>,
            document.body,
          )}
        </DndContext>
      </div>
    </div>
  );
};

export default React.memo(KanbanSections);
