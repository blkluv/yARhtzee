import * as React from "react";

/**
 * implementation of a dialog modal
 * without relying on html dialog
 * because the dialog does not work in fullscreen mode (or webXR AR mode)
 */
export const DialogModal = ({
  open,
  children,
  onClose,
  ...props
}: React.ComponentProps<"div"> & { onClose: () => void; open: boolean }) => {
  return (
    <>
      <style>{style}</style>
      <div
        data-backdrop
        style={{ visibility: open ? "visible" : "hidden" }}
        onClick={(e) => {
          let el = e.target as HTMLElement | null;
          while (!!el?.tagName) {
            if (el.hasAttribute("data-dialog")) return;
            el = el.parentElement;
          }
          onClose();
        }}
      >
        <div
          data-dialog
          {...props}
          style={{
            // @ts-ignore
            "--min-margin": "16px",
            visibility: open ? "visible" : "hidden",
            ...props.style,
          }}
        >
          {children}
          <button
            className="dialog-close-button"
            onClick={onClose}
            title="close"
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
};

const style = `
  [data-dialog] {
    box-sizing: border-box;
    border-radius: 2px;
    box-shadow: 5px 8px 16px 0 rgba(0,0,0,0.2);
    border: solid #aaa 1px;
    background-color: #fff;
    padding:16px;

    min-width: min( 100vw, 200px );
    max-width: calc( min( 1200px, 100vw ) - var(--min-margin) * 2 );
    width: fit-content;
    min-height: min(500px, 60vh);
    max-height: min(860px, 100vh - var(--min-margin) * 2);
    position: relative;

  }
  [data-backdrop] {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: radial-gradient(
      ellipse at center,
      transparent 0,
      transparent 70%,
      rgba(0, 0, 0, 0.05) 100%
    );
    position:fixed;
    top:0;
    left:0;
    width:100vw;
    height:100vh;
    z-index:999;
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
  }

  [data-dialog] .dialog-close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    height: 24px;
    width: 24px;
  }
`;
