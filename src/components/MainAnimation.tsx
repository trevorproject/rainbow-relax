import HomeAnimation from "./Animation/HomeAnimation";
import WaitAnimation from "./Animation/WaitAnimation";
import ExerciseAnimation from "./Animation/4-7-8Animation";

interface MainAnimationProps {
  animationType: "main" | "wait" | "Exercise478";
  isPaused: boolean;
}

export const MainAnimation = ({isPaused, animationType}: MainAnimationProps) => { 

 return (
    <div className="absolute ">
      {animationType=== "main" && <HomeAnimation/> }
      {animationType=== "wait" && <WaitAnimation/>} 
      {animationType=== "Exercise478" && <ExerciseAnimation isPaused={isPaused}/>}
    </div>
  );
};
