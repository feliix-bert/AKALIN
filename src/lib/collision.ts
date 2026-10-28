import { PlacedFurniture } from "@/types";

export interface BoundingBox2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

/**
 * Calculates effective 2D bounding box considering rotation around Y axis.
 */
export function getRotatedAABB(
  item: PlacedFurniture | { position: [number, number, number]; rotation: [number, number, number]; dimensions: [number, number, number] }
): BoundingBox2D {
  const [posX, , posZ] = item.position;
  const [width, , depth] = item.dimensions;
  const rotY = item.rotation[1];

  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const effectiveWidth = width * cos + depth * sin;
  const effectiveDepth = width * sin + depth * cos;

  const halfW = effectiveWidth / 2;
  const halfD = effectiveDepth / 2;

  return {
    minX: posX - halfW,
    maxX: posX + halfW,
    minZ: posZ - halfD,
    maxZ: posZ + halfD,
  };
}

/**
 * Checks if an item is completely inside room boundary.
 * Room width is along X axis (-roomWidth/2 to roomWidth/2).
 * Room length is along Z axis (-roomLength/2 to roomLength/2).
 */
export function isInsideRoomBounds(
  item: PlacedFurniture | { position: [number, number, number]; rotation: [number, number, number]; dimensions: [number, number, number] },
  roomWidth: number,
  roomLength: number,
  tolerance = 0.02
): boolean {
  const aabb = getRotatedAABB(item);
  const halfRoomW = roomWidth / 2 + tolerance;
  const halfRoomL = roomLength / 2 + tolerance;

  return (
    aabb.minX >= -halfRoomW &&
    aabb.maxX <= halfRoomW &&
    aabb.minZ >= -halfRoomL &&
    aabb.maxZ <= halfRoomL
  );
}

/**
 * Clamps item position so that its bounding box stays inside the room walls.
 */
export function clampItemToRoomBounds(
  position: [number, number, number],
  rotation: [number, number, number],
  dimensions: [number, number, number],
  roomWidth: number,
  roomLength: number
): [number, number, number] {
  const [width, height, depth] = dimensions;
  const rotY = rotation[1];

  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const effectiveWidth = width * cos + depth * sin;
  const effectiveDepth = width * sin + depth * cos;

  const halfW = effectiveWidth / 2;
  const halfD = effectiveDepth / 2;

  const maxAllowedX = Math.max(0, roomWidth / 2 - halfW);
  const maxAllowedZ = Math.max(0, roomLength / 2 - halfD);

  const clampedX = Math.min(Math.max(position[0], -maxAllowedX), maxAllowedX);
  const clampedZ = Math.min(Math.max(position[2], -maxAllowedZ), maxAllowedZ);

  // Y is seated on the floor: height / 2
  const clampedY = height / 2;

  return [clampedX, clampedY, clampedZ];
}

/**
 * Checks collision between a target item and a list of existing placed items.
 * Uses 2D AABB with configurable tolerance in meters (default 4cm).
 */
export function checkItemCollisions(
  targetItem: PlacedFurniture | { instanceId?: string; position: [number, number, number]; rotation: [number, number, number]; dimensions: [number, number, number] },
  allItems: PlacedFurniture[],
  tolerance = 0.04
): string[] {
  const targetAABB = getRotatedAABB(targetItem);
  const collidingInstanceIds: string[] = [];

  for (const other of allItems) {
    if ("instanceId" in targetItem && targetItem.instanceId === other.instanceId) {
      continue;
    }

    const otherAABB = getRotatedAABB(other);

    const overlapX =
      targetAABB.minX < otherAABB.maxX - tolerance &&
      targetAABB.maxX > otherAABB.minX + tolerance;

    const overlapZ =
      targetAABB.minZ < otherAABB.maxZ - tolerance &&
      targetAABB.maxZ > otherAABB.minZ + tolerance;

    if (overlapX && overlapZ) {
      collidingInstanceIds.push(other.instanceId);
    }
  }

  return collidingInstanceIds;
}
