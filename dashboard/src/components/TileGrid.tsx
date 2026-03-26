"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AppTile } from "./AppTile";

interface TileData {
  name: string;
  description: string;
  url: string;
  icon: string;
  color: string;
  status: "up" | "down";
  latency: number;
  logoUrl?: string;
}

const STORAGE_KEY = "kecktech-tile-order";

function SortableTile(props: TileData) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: props.name });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: isDragging ? "grabbing" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <AppTile {...props} />
    </div>
  );
}

export function TileGrid({ tiles }: { tiles: TileData[] }) {
  const [order, setOrder] = useState<string[]>(() => tiles.map((t) => t.name));

  // Load saved order from localStorage after mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: string[] = JSON.parse(saved);
        // Only use saved order if it contains all current services
        const allPresent = tiles.every((t) => parsed.includes(t.name));
        if (allPresent) {
          setOrder(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, [tiles]);

  const sensors = useSensors(useSensor(PointerSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setOrder((prev) => {
      const oldIdx = prev.indexOf(String(active.id));
      const newIdx = prev.indexOf(String(over.id));
      const next = arrayMove(prev, oldIdx, newIdx);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  const sorted = order
    .map((name) => tiles.find((t) => t.name === name))
    .filter(Boolean) as TileData[];

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={sorted.map((t) => t.name)} strategy={rectSortingStrategy}>
        {sorted.map((tile) => (
          <SortableTile key={tile.name} {...tile} />
        ))}
      </SortableContext>
    </DndContext>
  );
}
