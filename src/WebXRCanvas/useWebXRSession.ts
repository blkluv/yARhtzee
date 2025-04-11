import * as React from "react";

/**
 * true if webXR is supported
 */
export const useIsWebXRSupported = () => {
  const [isSupported, setIsSupported] = React.useState<boolean | "loading">(
    "loading"
  );
  React.useLayoutEffect(() => {
    if (!navigator.xr) setIsSupported(false);
    else navigator.xr.isSessionSupported("immersive-ar").then(setIsSupported);
  }, []);
  return isSupported;
};

/**
 *
 */
export const useWebXRSession = (options?: XRSessionInit) => {
  const [session, setSession] = React.useState<XRSession>();

  const [error, setError] = React.useState<Error>();
  if (error) throw error;

  const init = React.useCallback(async () => {
    const navigatorXR = navigator.xr;

    if (
      !navigatorXR ||
      (await navigatorXR.isSessionSupported("immersive-ar")) !== true
    ) {
      setError(new Error("webxr unsupported"));
      return;
    }

    return navigatorXR
      .requestSession("immersive-ar", options)
      .then(setSession)
      .catch(setError);
  }, []);

  return { init, session };
};
