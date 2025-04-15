import * as React from "react";

export const DialogModal = ({
  open,
  children,
  ...props
}: React.ComponentProps<"dialog">) => {
  const ref = React.useRef<HTMLDialogElement | null>(null);
  React.useLayoutEffect(() => {
    if (open) ref.current?.showModal();
    else ref.current?.close();
  }, [open]);

  return (
    <>
      <style>{style}</style>
      <dialog
        ref={ref}
        {...props}
        onClick={onClickOutSideClose}
        style={{
          // @ts-ignore
          "--min-margin": "16px",
          ...props.style,
        }}
      >
        {children}
        <button
          className="dialog-close-button"
          onClick={closeDialog}
          title="close"
        >
          ×
        </button>
      </dialog>
    </>
  );
};

const style = `
  dialog {
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
    max-height: min(800px, 100vh - var(--min-margin) * 2);
    position: relative;
  }
  dialog::backdrop {
    background-color: rgba(0, 0, 0, 0.25);
    background-image: radial-gradient(
      ellipse at center,
      transparent 0,
      transparent 70%,
      rgba(0, 0, 0, 0.05) 100%
    );
  }
  dialog .dialog-close-button {
    position: absolute;
    top: 12px;
    right: 12px;
    height: 24px;
    width: 24px;
  }
`;

const onClickOutSideClose = (e: React.MouseEvent) => {
  const target = e.target;

  if (!isHTMLDialogElement(target)) return;

  const rect = target.getBoundingClientRect();

  const clickedInDialog =
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width;

  if (clickedInDialog === false) target.close();
};

const isHTMLDialogElement = (e: any): e is HTMLDialogElement =>
  e?.tagName === "DIALOG";

const isHTMLElement = (e: any): e is HTMLElement => !!e?.tagName;

/**
 * attach that to a onClick to close the parent dialog
 */
export const closeDialog = (e: React.MouseEvent) => {
  let target: HTMLElement | null = e.target as HTMLElement;
  while (isHTMLElement(target)) {
    if (isHTMLDialogElement(target)) {
      target.close();
      return;
    }
    target = target.parentElement;
  }
};
