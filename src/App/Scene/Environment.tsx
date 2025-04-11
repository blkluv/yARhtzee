import {
  Environment as EnvironmentDrei,
  useEnvironment,
} from "@react-three/drei";
import * as React from "react";

export const preload = () =>
  useEnvironment.preload({ path: "assets/", files: "lebombo_1k.hdr" });

export const Environment = () => (
  <EnvironmentDrei path={"assets/"} files={"lebombo_1k.hdr"} />
);
