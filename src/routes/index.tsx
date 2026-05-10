import { createFileRoute } from "@tanstack/react-router";
import { useGame } from "@/game/store";
import { MainMenu } from "@/components/MainMenu";
import { SetupScreen } from "@/components/SetupScreen";
import { GameScreen } from "@/components/GameScreen";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hearts of Pigeons — Turn-Based Grand Strategy" },
      {
        name: "description",
        content:
          "Rule a canton of modern-day Bosnia, command your flock and outwit rival pigeon warlords in this turn-based grand strategy game.",
      },
      { property: "og:title", content: "Hearts of Pigeons" },
      { property: "og:description", content: "A turn-based grand strategy of feathers, fervor, and steel." },
    ],
  }),
  component: Index,
});

function Index() {
  const screen = useGame((s) => s.screen);
  if (screen === "menu") return <MainMenu />;
  if (screen === "setup") return <SetupScreen />;
  return <GameScreen />;
}
