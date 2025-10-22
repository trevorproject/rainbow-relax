import HomeAnimation from "./Animation/HomeAnimation";
import WaitAnimation from "./Animation/WaitAnimation";
import ExerciseAnimation from "./Animation/4-7-8Animation";

interface MainAnimationProps {
  animationType: "main" | "wait" | "4-7-8";
  isPaused: boolean;
}

export const MainAnimation = ({isPaused, animationType}: MainAnimationProps) => { 

 return (
    <div className="absolute ">
      {animationType=== "main" && <HomeAnimation/>}
      {animationType=== "wait" && <WaitAnimation/> } 
      {animationType=== "4-7-8" && <ExerciseAnimation/>}
    </div>
  );
};
