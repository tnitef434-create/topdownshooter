export const LEGACY_WORLD_GENERATOR_VERSION = 1;
export const WORLD_GENERATOR_VERSION = 3;

export function isSupportedWorldGeneratorVersion(value) {
  return Number.isInteger(value)
    && value >= LEGACY_WORLD_GENERATOR_VERSION
    && value <= WORLD_GENERATOR_VERSION;
}
