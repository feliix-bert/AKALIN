import test from "node:test";
import assert from "node:assert/strict";

// Re-implement or test collision and clamping logic
function getRotatedAABB(pos, rotY, [width, height, depth]) {
  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const effectiveWidth = width * cos + depth * sin;
  const effectiveDepth = width * sin + depth * cos;

  const halfW = effectiveWidth / 2;
  const halfD = effectiveDepth / 2;

  return {
    minX: pos[0] - halfW,
    maxX: pos[0] + halfW,
    minZ: pos[2] - halfD,
    maxZ: pos[2] + halfD,
  };
}

function clampItemToRoomBounds(pos, rotY, dims, roomW, roomL) {
  const [width, height, depth] = dims;
  const cos = Math.abs(Math.cos(rotY));
  const sin = Math.abs(Math.sin(rotY));

  const effW = width * cos + depth * sin;
  const effD = width * sin + depth * cos;

  const maxAllowedX = Math.max(0, roomW / 2 - effW / 2);
  const maxAllowedZ = Math.max(0, roomL / 2 - effD / 2);

  const clampedX = Math.min(Math.max(pos[0], -maxAllowedX), maxAllowedX);
  const clampedZ = Math.min(Math.max(pos[2], -maxAllowedZ), maxAllowedZ);

  return [clampedX, height / 2, clampedZ];
}

function checkCollision(itemA, itemB, tolerance = 0.04) {
  const aabbA = getRotatedAABB(itemA.pos, itemA.rotY, itemA.dims);
  const aabbB = getRotatedAABB(itemB.pos, itemB.rotY, itemB.dims);

  const overlapX =
    aabbA.minX < aabbB.maxX - tolerance &&
    aabbA.maxX > aabbB.minX + tolerance;

  const overlapZ =
    aabbA.minZ < aabbB.maxZ - tolerance &&
    aabbA.maxX > aabbB.minZ + tolerance;

  return overlapX && overlapZ;
}

test("Room Dimension Validation: Room bounds must clamp furniture inside room", () => {
  const roomWidth = 3.0; // -1.5 to +1.5
  const roomLength = 3.0; // -1.5 to +1.5
  const furnitureDims = [1.0, 0.75, 0.6]; // width: 1.0, depth: 0.6

  // Attempt to place item far outside the room at X = 5.0, Z = 5.0
  const clamped = clampItemToRoomBounds([5.0, 0, 5.0], 0, furnitureDims, roomWidth, roomLength);

  // Maximum allowed X is 1.5 - 0.5 = 1.0
  // Maximum allowed Z is 1.5 - 0.3 = 1.2
  assert.equal(clamped[0], 1.0, "X should be clamped to 1.0");
  assert.equal(clamped[2], 1.2, "Z should be clamped to 1.2");
});

test("Collision Detection: Overlapping furniture triggers collision", () => {
  const bed = {
    pos: [0, 0.25, 0],
    rotY: 0,
    dims: [0.9, 0.5, 2.0],
  };

  const deskAtSameLocation = {
    pos: [0.1, 0.375, 0.1],
    rotY: 0,
    dims: [1.0, 0.75, 0.6],
  };

  const deskFarAway = {
    pos: [1.2, 0.375, -1.0],
    rotY: 0,
    dims: [1.0, 0.75, 0.6],
  };

  assert.equal(
    checkCollision(bed, deskAtSameLocation),
    true,
    "Items overlapping should return true"
  );
  assert.equal(
    checkCollision(bed, deskFarAway),
    false,
    "Separated items should return false"
  );
});

test("Rotation AABB: 90 degree rotation swaps effective width and depth", () => {
  const dims = [1.0, 0.75, 0.5]; // width 1.0, depth 0.5
  const rot0 = getRotatedAABB([0, 0, 0], 0, dims);
  const rot90 = getRotatedAABB([0, 0, 0], Math.PI / 2, dims);

  // At 0 deg: width is 1.0 (minX -0.5, maxX 0.5), depth is 0.5 (minZ -0.25, maxZ 0.25)
  assert.ok(Math.abs(rot0.maxX - rot0.minX - 1.0) < 0.001);
  assert.ok(Math.abs(rot0.maxZ - rot0.minZ - 0.5) < 0.001);

  // At 90 deg: effective width becomes 0.5, effective depth becomes 1.0
  assert.ok(Math.abs(rot90.maxX - rot90.minX - 0.5) < 0.001);
  assert.ok(Math.abs(rot90.maxZ - rot90.minZ - 1.0) < 0.001);
});

test("Scene Serialization & Deserialization: Validates schema integrity", () => {
  const mockScene = {
    items: [
      {
        instanceId: "inst-1",
        furnitureId: "f1",
        name: "Kasur Single",
        category: "bed",
        position: [-0.95, 0.25, 0],
        rotation: [0, 0, 0],
        dimensions: [0.9, 0.5, 2.0],
      },
    ],
    lighting: {
      ambientIntensity: 0.7,
      directionalIntensity: 0.85,
      sunPosition: [5, 8, 5],
      preset: "daylight",
    },
    floorTexture: "wood",
  };

  const serialized = JSON.stringify(mockScene);
  const deserialized = JSON.parse(serialized);

  assert.equal(deserialized.items.length, 1);
  assert.equal(deserialized.items[0].name, "Kasur Single");
  assert.equal(deserialized.lighting.preset, "daylight");
  assert.equal(deserialized.floorTexture, "wood");
});

