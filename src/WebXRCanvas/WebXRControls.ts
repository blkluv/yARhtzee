import * as React from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export const WebXRControls = ({
  webXRSession,
  worldSize = 1,
  onPoseFound,
  onCameraFeedDisplayed,
}: {
  webXRSession: XRSession;
  worldSize?: number;

  onPoseFound?: () => void;
  onCameraFeedDisplayed?: () => void;
}) => {
  const [error, setError] = React.useState<Error>();
  if (error) throw error;

  const {
    gl: renderer,
    scene,
    camera,
    advance,
    setFrameloop,
    events,
  } = useThree();

  const viewRef = React.useRef<XRView>(undefined);

  // let webXR control the render loop
  // ie: do nothing on react-three-fiber render loop
  useFrame(() => {
    // do nothing
  }, 1);

  React.useLayoutEffect(() => {
    const gl = renderer.getContext();

    gl.makeXRCompatible()
      .then(() =>
        webXRSession.updateRenderState({
          baseLayer: new XRWebGLLayer(webXRSession, gl),
        })
      )
      .then(() => console.log("updateRenderState done"))
      .catch(setError);

    let localReference: XRReferenceSpace;

    webXRSession
      .requestReferenceSpace("local-floor")
      .then((r) => {
        localReference = r;

        localReference.addEventListener("reset", ({ transform }) => {
          if (transform)
            localReference = localReference.getOffsetReferenceSpace(transform);
        });
      })
      .catch(setError);

    let cancelAnimationFrame: number;
    let lastTimestampMs: number;
    let origin: THREE.Vector3 | undefined;
    let renderCount = 0;

    const onXRFrame: XRFrameRequestCallback = (timestampMs, frame) => {
      const pose = localReference && frame.getViewerPose(localReference);

      const view = pose?.views[0];

      if (view) {
        if (!viewRef.current) {
          const glLayer = webXRSession.renderState.baseLayer!;

          const newRenderTarget = new THREE.WebGLRenderTarget(
            glLayer.framebufferWidth,
            glLayer.framebufferHeight,
            {
              format: THREE.RGBAFormat,
              type: THREE.UnsignedByteType,
              colorSpace: renderer.outputColorSpace,
              stencilBuffer: gl.getContextAttributes()?.stencil,
            }
          );

          // @ts-ignore
          renderer.setRenderTargetFramebuffer(
            newRenderTarget,
            glLayer.framebuffer
          );
          renderer.setRenderTarget(newRenderTarget);

          const viewport = glLayer.getViewport(view)!;

          renderer.setViewport(
            viewport.x,
            viewport.y,
            viewport.width,
            viewport.height
          );

          viewRef.current = view;
        }

        camera.position.set(
          view.transform.position.x * worldSize,
          view.transform.position.y * worldSize,
          view.transform.position.z * worldSize
        );
        camera.quaternion.set(
          view.transform.orientation.x,
          view.transform.orientation.y,
          view.transform.orientation.z,
          view.transform.orientation.w
        );

        for (let i = 16; i--; )
          camera.projectionMatrix.elements[i] = view.projectionMatrix[i];
        camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();

        camera.matrixWorldNeedsUpdate = true;

        if (!origin) {
          // define origin,
          // a point on the ground
          const v = new THREE.Vector3(0, 0, -1);
          v.applyQuaternion(camera.quaternion);
          v.normalize();

          const t = -camera.position.y / v.y;

          if (t > 0) {
            origin = new THREE.Vector3()
              .copy(camera.position)
              .addScaledVector(v, t);

            onPoseFound?.();
          }
        }

        const dt = (timestampMs - (lastTimestampMs ?? timestampMs)) / 1000;
        lastTimestampMs = timestampMs;
        advance(dt);

        renderer.clearDepth();
        renderer.render(scene, camera);
      }

      // there must be a better way to know when the camera feed is drawn
      if (renderCount >= 10) {
        onCameraFeedDisplayed?.();
        renderCount++;
      } else renderCount++;

      cancelAnimationFrame = webXRSession.requestAnimationFrame(onXRFrame);
    };

    cancelAnimationFrame = webXRSession.requestAnimationFrame(onXRFrame);
    setFrameloop("never");

    // the renderer.domElement is no longer receiving events
    events.connect?.(window);

    return () => {
      // TODO: reset the framebuffer

      setFrameloop("always");
      webXRSession.cancelAnimationFrame(cancelAnimationFrame);

      webXRSession.end();
    };
  }, [webXRSession, renderer]);

  return null;
};
