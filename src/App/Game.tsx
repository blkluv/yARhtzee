import * as React from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Header } from "./Ui/Header";
import { Dice } from "./Scene/Dice";
import { ThrowHint } from "./Ui/Hints/ThrowHint";
import { PickHint } from "./Ui/Hints/PickHint";
import { PullHint } from "./Ui/Hints/PullHint";
import {
  type Category,
  categories,
  isDiceValue,
  isScoreSheetEmpty,
  isScoreSheetFinished,
} from "../gameRules/types";
import { ScaleOnPulse } from "./Scene/ScaleOnPulse";
import { SelectedDiceHint } from "./Scene/SelectedDiceHint";
import { useDelay } from "./Ui/useDelay";
import { Target } from "./Scene/Target";
import { createGameWorld } from "../gameWorld/state";
import { type Game as IGame, isBlank, nReroll } from "../gameRules/game";
import { createSceneScreenshot } from "./createSceneScreenshot";
import { ScoreSheetContent } from "./Ui/ScoreSheet/ScoreSheetContent";
import { LeaderboardSubmission } from "./Ui/ScoreSheet/LeaderboardSubmission";
import { DialogModal } from "./Ui/DialogModal-fallback";

export const Game_ = ({
  UiPortal,
}: {
  UiPortal: (props: { children: any }) => null;
}) => {
  const world = React.useMemo(createGameWorld, []);

  const [screenshots, saveScreenshot] = React.useReducer(
    (s, { category, blob }: { category: Category; blob: Blob }) => ({
      ...s,
      [category]: blob,
    }),
    {} as Record<Category, Blob>
  );
  const { scene } = useThree();
  const { getImage } = React.useMemo(createSceneScreenshot, []);

  const [dragging, setDragging] = React.useState(false);
  const [scoresheetOpen, setScoresheetOpen] = React.useState(false);

  useEventListeners({
    onRelease() {
      setDragging(false);
      if (world.state.game.roll.some(isBlank)) world.releaseRollPush();
      else world.releasePickingPull();
    },
    onDragHorizontally(v) {
      setDragging(true);
      if (world.state.game.roll.some(isBlank)) world.setRollPush(v);
      else world.setPickingPull(v);
    },
  });

  const refGroupDice = React.useRef<THREE.Group>(null);
  const refGroupHint = React.useRef<THREE.Group>(null);
  const [, rerenderOnChange] = React.useState(world.state.game);

  useFrame(({ camera }, dt) => {
    world.setCamera(camera.position, camera.quaternion);

    const clampedDt = Math.min(dt, (3 * 1) / 60);
    world.step(clampedDt);

    rerenderOnChange(world.state.game); // to trigger a re-render when game change

    refGroupDice.current?.children.forEach((c, i) => {
      world.getPosition(i, c);
      refGroupHint.current?.children[i].position.copy(c.position);
    });
  });

  return (
    <>
      <group ref={refGroupDice}>
        {world.state.game.roll.map((_, i) => (
          <ScaleOnPulse
            key={i}
            pulse={
              (world.state.game.pickedDice[i] &&
                world.state.game.roll[i] !== "blank" &&
                "selected") ||
              (world.state.game.roll.every(isDiceValue) && "rolled")
            }
          >
            <Dice
              onClick={(e: Event) => {
                e.stopPropagation();
                world.toggleDicePicked(i);
              }}
              userData={{ diceIndex: i }}
            />
          </ScaleOnPulse>
        ))}
      </group>

      <group ref={refGroupHint}>
        {world.state.game.roll.map((_, i) => (
          <SelectedDiceHint
            key={i}
            selected={
              !dragging &&
              world.state.game.pickedDice[i] &&
              !world.state.game.roll.some(isBlank)
            }
          />
        ))}
      </group>

      <Target />

      <UiPortal>
        <Header
          key="header"
          remainingRerolls={world.state.game.remainingReRoll}
          diceRoll={world.state.game.roll}
          onToggleDicePicked={world.toggleDicePicked}
        />

        {!dragging && !scoresheetOpen && <Hint game={world.state.game} />}

        <DialogModal
          open={scoresheetOpen}
          onClose={() => setScoresheetOpen(false)}
          style={{ width: "min(100%,600px)" }}
        >
          <h3 style={{ paddingLeft: "10px" }}>Score Sheet</h3>

          <ScoreSheetContent
            scoreSheet={world.state.game.scoreSheet}
            rollCandidate={
              (world.state.game.roll.every(isDiceValue) &&
                world.state.game.roll) ||
              null
            }
            onSelectCategory={
              world.state.game.roll.every(isDiceValue)
                ? (category) => {
                    const roll = world.state.game.roll;
                    if (!roll.every(isDiceValue)) return;

                    getImage(scene, roll, category).then((blob) =>
                      saveScreenshot({ blob, category })
                    );

                    world.selectCategoryForDiceRoll(category);
                    if (!isScoreSheetFinished(world.state.game.scoreSheet))
                      setScoresheetOpen(false);
                  }
                : undefined
            }
          />

          {isScoreSheetFinished(world.state.game.scoreSheet) && (
            <div style={{ marginTop: "16px", minHeight: "30px" }}>
              <LeaderboardSubmission
                scoreSheet={world.state.game.scoreSheet}
                screenshots={screenshots}
              />
            </div>
          )}
        </DialogModal>

        <button
          style={{
            position: "absolute",
            width: "160px",
            height: "40px",
            bottom: "10px",
            right: "60px",
            zIndex: 1,
            pointerEvents: "auto",
          }}
          onClick={() => setScoresheetOpen(true)}
        >
          score sheet
        </button>
      </UiPortal>
    </>
  );
};

const Hint = ({ game }: { game: IGame }) => {
  const hint = useDelay(getHint(game), 2500);
  if (hint === "pick") return <PickHint />;
  if (hint === "throw") return <ThrowHint />;
  if (hint === "pull") return <PullHint />;
  return null;
};
const getHint = (game: IGame) => {
  if (game.remainingReRoll < nReroll || !isScoreSheetEmpty(game.scoreSheet))
    return null;
  if (game.roll.some(isBlank)) return "throw";
  if (game.roll.every(isDiceValue)) {
    if (Object.values(game.pickedDice).some(Boolean)) return "pull";
    else return "pick";
  }
  return null;
};

const useEventListeners = ({
  onDragHorizontally,
  onRelease,
}: {
  onDragHorizontally: (y: number) => void;
  onRelease: () => void;
}) => {
  const { events } = useThree();

  React.useEffect(() => {
    const domElement = document.getElementById("overlay")!;
    const originalDomElement = events.connected;
    events.connect?.(domElement);

    let anchor: { y: number } | null = null;
    const onDown = ({ y }: PointerEvent) => {
      anchor = { y };
    };
    const onMove = ({ y }: PointerEvent) => {
      if (!anchor) return;
      const delta = y - anchor.y;
      if (Math.abs(delta) > 20)
        onDragHorizontally(delta / domElement.clientHeight);
    };
    const onUp = () => {
      anchor = null;
      onRelease();
    };

    domElement.addEventListener("pointerdown", onDown);
    domElement.addEventListener("pointermove", onMove);
    domElement.addEventListener("pointerup", onUp);
    document.addEventListener("mouseleave", onUp);
    document.addEventListener("blur", onUp);

    return () => {
      events.connect?.(originalDomElement);
      domElement.removeEventListener("pointerdown", onDown);
      domElement.removeEventListener("pointermove", onMove);
      domElement.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseleave", onUp);
      document.removeEventListener("blur", onUp);
    };
  }, []);
};

export const Game = React.memo(Game_);
