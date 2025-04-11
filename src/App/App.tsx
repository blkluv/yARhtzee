import * as React from "react";
import * as THREE from "three";
import { GithubLogo } from "./Ui/GithubLogo";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { XR8Controls } from "../XR8Canvas/XR8Controls";
import { useXR8 } from "../XR8Canvas/useXR8";
import { getXR8, loadXR8, xr8Hosted } from "../XR8Canvas/getXR8";
import { Game } from "./Game";
import { Dice } from "./Scene/Dice";
// @ts-ignore
import { Visualizer } from "react-touch-visualizer";
import tunnel from "tunnel-rat";
import { Ground } from "./Scene/Ground";
import { WebXRControls } from "../WebXRCanvas/WebXRControls";
import { createPortal } from "react-dom";
import { XR8 } from "../XR8Canvas/XR8";
import { Environment } from "./Scene/Environment";
import { TrackingHint } from "./Ui/Hints/TrackingHint";
import { useProgress } from "@react-three/drei";
import { useIsWebXRSupported } from "../WebXRCanvas/useWebXRSession";
import { useDelay } from "./Ui/useDelay";
import { PageRules } from "./Ui/PageRules";
import { LoadingScreen } from "./Ui/LoadingScreen";

// @ts-ignore
const xr8ApiKey: string | undefined = import.meta.env.VITE_XR8_API_KEY;
const touchSupported = "ontouchend" in document;

export const App = () => {
  const [state, setState] = React.useState<
    | { type: "loading" }
    | { type: "waiting-user-input" }
    | {
        type: "webXR";
        poseFound?: boolean;
        cameraFeedDisplayed?: boolean;
        webXRSession?: XRSession;
      }
    | {
        type: "xr8";
        poseFound?: boolean;
        cameraFeedDisplayed?: boolean;
        xr8?: XR8;
      }
    | { type: "flat" }
  >({ type: "waiting-user-input" });

  const uiTunnel = React.useMemo(tunnel, []);

  const [error, setError] = React.useState<Error>();
  if (error) throw error;

  const startWebXR = () => {
    setState({ type: "webXR" });

    // this call must be made after a user input
    return navigator.xr
      ?.requestSession("immersive-ar", {
        optionalFeatures: ["dom-overlay", "local-floor"],
        domOverlay: { root: document.getElementById("overlay")! },
      })
      .then((webXRSession) =>
        setState({
          type: "webXR",
          webXRSession,
        })
      )
      .catch(setError);
  };

  const startXR8 = () => {
    setState({ type: "xr8" });
    loadXR8(xr8ApiKey)
      .then((xr8) => setState({ type: "xr8", xr8 }))
      .catch(setError);
  };

  const startFlat = () => setState({ type: "flat" });

  const webXRSupported = useIsWebXRSupported();

  const xr8Supported = (!!xr8ApiKey || xr8Hosted) && touchSupported;

  const sceneAssetLoaded = useProgress(({ active }) => !active);

  const readyForRender =
    sceneAssetLoaded &&
    (state.type === "flat" ||
      (state.type === "webXR" && state.cameraFeedDisplayed) ||
      (state.type === "xr8" && state.cameraFeedDisplayed));

  const readyForGame =
    readyForRender &&
    !(state.type === "webXR" && !state.poseFound) &&
    !(state.type === "xr8" && !state.cameraFeedDisplayed);

  const hint = useDelay(readyForRender && !readyForGame && "tracking", 2500);

  if (webXRSupported === "loading") return null;

  if (state.type === "loading") return null;

  return (
    <>
      <Canvas
        camera={{ position: new THREE.Vector3(0, 6, 6), near: 0.1, far: 1000 }}
        shadows
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          touchAction: "none",
          opacity: readyForRender ? 1 : 0,
        }}
      >
        {state.type === "xr8" && state.xr8 && (
          <XR8Controls
            xr8={state.xr8}
            onPoseFound={() => setState((s) => ({ ...s, poseFound: true }))}
            onCameraFeedDisplayed={() =>
              setState((s) => ({ ...s, cameraFeedDisplayed: true }))
            }
          />
        )}

        {state.type === "webXR" && state.webXRSession && (
          <WebXRControls
            worldSize={8}
            webXRSession={state.webXRSession}
            onPoseFound={() => setState((s) => ({ ...s, poseFound: true }))}
            onCameraFeedDisplayed={() =>
              setState((s) => ({ ...s, cameraFeedDisplayed: true }))
            }
          />
        )}

        <React.Suspense fallback={null}>
          <Environment />

          {
            /* preload the dice model */
            !readyForGame && (
              <Dice
                position={[999, 999, 9999]}
                scale={[0.0001, 0.0001, 0.0001]}
              />
            )
          }

          {readyForGame && <Game UiPortal={uiTunnel.In} />}
        </React.Suspense>

        <directionalLight position={[10, 8, 6]} intensity={0} castShadow />

        <Ground />
      </Canvas>

      <OverlayPortal>
        {false && <Visualizer />}

        <a href="https://github.com/platane/yAR-htzee" title="github">
          <button
            style={{
              position: "absolute",
              width: "40px",
              height: "40px",
              bottom: "10px",
              right: "10px",
              pointerEvents: "auto",
              zIndex: 1,
            }}
          >
            <GithubLogo />
          </button>
        </a>

        {React.createElement(uiTunnel.Out)}

        {hint === "tracking" && <TrackingHint />}

        {!readyForRender && (
          <Over>
            <LoadingScreen
              loading={state.type !== "waiting-user-input"}
              onStartFlat={startFlat}
              onStartWebXR={webXRSupported && startWebXR}
              onStartXR8={xr8Supported && startXR8}
            />
          </Over>
        )}
      </OverlayPortal>
    </>
  );
};

const OverlayPortal = ({ children }: { children?: any }) =>
  createPortal(children, document.getElementById("overlay")!);

const Over = ({ children }: { children?: any }) => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "white",
    }}
  >
    {children}
  </div>
);
