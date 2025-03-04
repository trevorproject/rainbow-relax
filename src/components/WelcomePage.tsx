import MainAnimation from "./MainAnimation";

const WelcomePage = () => {
  return (
    <>
      <div className="relative w-screen flex flex-col justify-center items-center">
        <MainAnimation />
        <div className="relative z-50 grid grid-flow-col grid-row-5 gap-40 max-w-[75rem] w-full p-4">
          <div className="row-span-3 p-6 flex justify-center items-center text-white flex">
            <h2 className="font-bold text-[#4E4E4E] font-(family-name:--font-global) text-[70px]">
              Visual Breathing Exercise for Stress & Anxiety
            </h2>
          </div>
          <div className="col-span-2 p-6 flex flex-col justify-end items-end w-[50rem] h-[50rem]">
            <div>
              <p className="text-[#4E4E4E] font-(family-name:--font-global) text-[30px] text-center">
                It’s not easy to say how you’re feeling. To clear your mind, try
                this breathing exercise for focus and relaxation. You may also
                find this online breathing exercise useful for stress and
                anxiety.
              </p>
            </div>
            <div className="pt-[15rem]">03</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default WelcomePage;
