import { ContainerTextFlip } from "../AnimatedUI/container-text-flip";

export function ContainerTextFlipDemo() {
    return (
        <ContainerTextFlip
            words={["thoughtful", "unique", "heartfelt", "delightful"]}
            className="inline-block text-4xl font-extrabold tracking-tight lg:text-5xl bg-gradient-to-r from-wrap-orange to-amber-200 text-white rounded-lg hover:from-pink-400 hover:to-amber-300"
        />
    );
}
