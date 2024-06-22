import { SectionType, TaskType } from '@/types';
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
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
}
const KanbanSections: React.FC<KanbanSectionsProps> = ({ data }) => {
  const [activeSection, setActiveSection] = useState<SectionType | null>(null);
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [sections, setSections] = useState<SectionType[]>([]);
  useEffect(() => {
    setSections(data);
  }, [data]);
  const sectionsPositions = useMemo(() => sections.map((col) => col.id), [sections]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
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

        console.log(newSections);
      }
      return;
    }

    if (
      (active.data.current?.type === 'Task' && over.data.current?.type === 'Section') ||
      (over.data.current?.type === 'Task' && active && over)
    ) {
      console.log(sections);
      return;
    }
  };

  return (
    <div className="mt-2">
      <div className="container">
        <DndContext sensors={sensors} onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver}>
          <div className="flex flex-row gap-4 overflow-x-auto w-full flex-wrap sm:flex-nowrap sm:max-w-full h-full">
            <SortableContext items={sectionsPositions}>
              {sections.map((section) => (
                <KanbanColumn key={section.id} section={section} tasks={section.tasks} />
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
