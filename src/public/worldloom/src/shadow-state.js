// Water/reflection captures reuse the main view's shadows. On the first frame
// (and after a quality change) those depth textures do not exist yet. A PCF
// sampler cannot use Three's ordinary empty-color texture in their place.
export function needsShadowMapInitialization(scene, camera) {
  let pending = false;
  scene.traverseVisible(object => {
    if (object.isLight && object.castShadow && object.shadow && !object.shadow.map
      && object.layers.test(camera.layers)) pending = true;
  });
  return pending;
}
