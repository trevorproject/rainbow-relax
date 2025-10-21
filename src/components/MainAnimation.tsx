
import HomeAnimation from "./Animation/HomeAnimation";
import WaitAnimation from "./Animation/WaitAnimation";
import ExerciseAnimation from "./Animation/4-7-8Animation";

interface MainAnimationProps {
  animationType: "main" | "wait" | "4-7-8";
  isPaused: boolean;
}

export const MainAnimation = (args: MainAnimationProps) => { 

 return (
    <div className="absolute ">
      {args.animationType=== "main" && <HomeAnimation/>}
      {args.animationType=== "wait" && <WaitAnimation/> } 
      {args.animationType=== "4-7-8" && <ExerciseAnimation/>}
    </div>
  );
};
