import * as React from "react";
import { PageRules } from "./PageRules";

type Props = {
  loading: boolean;
  onStartFlat?: false | (() => void);
  onStartXR8?: false | (() => void);
  onStartWebXR?: false | (() => void);
};

export const LoadingScreen = ({
  loading,
  onStartFlat,
  onStartXR8,
  onStartWebXR,
}: Props) => (
  <div className="loading-screen">
    <style>{style}</style>

    <PageRules />

    <div
      style={{
        marginTop: "60px",
        gap: "10px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {onStartFlat && (
        <button disabled={loading} onClick={onStartFlat}>
          Start 3D
        </button>
      )}
      <div style={{ marginTop: "10px" }} />
      {onStartWebXR && (
        <button disabled={loading} onClick={onStartWebXR}>
          Start with WebXR
        </button>
      )}
      {onStartXR8 && (
        <button disabled={loading} onClick={onStartXR8}>
          Start with 8thWall
        </button>
      )}
    </div>
  </div>
);

const style = `
.loading-screen {
  padding: 10px;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
  pointer-events: auto;
}

.loading-screen button{
  width: 160px;
  height: 42px;
  align-self: center;
}
`;
