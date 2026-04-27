import { motion, AnimatePresence } from "framer-motion";
import { useSnapshot } from "valtio";
import { state, enterCustomizer } from "../store";
import { CustomButton } from "../components";
import {
  headContainerAnimation,
  headTextAnimation,
  slideAnimation,
} from "../config/motion";

export const Home = () => {
  const snap = useSnapshot(state);

  return (
    <AnimatePresence>
      {snap.intro && (
        <motion.section className="home" {...slideAnimation("left")}>
          <motion.header {...slideAnimation("down")}>
            <img
              src="./lion.png"
              alt="Shirt Design site logo"
              width={32}
              height={32}
              className="w-8 h-8 object-contain"
            />
          </motion.header>
          <motion.div className="home-content" {...headContainerAnimation}>
            <motion.div {...headTextAnimation}>
              <h1 className="head-text">
                LET&apos;S <br className="xl:block hidden" /> DO IT.
              </h1>
            </motion.div>
            <motion.div
              className="flex flex-col gap-5"
              {...headContainerAnimation}
            >
              <p className="max-w-md font-normal text-gray-600 dark:text-neutral-300 text-base">
                Create your unique and exclusive shirt with our brand new 3D
                customazition tool. <strong>Unleash your imagination.</strong>
                {""} and define your own style.
              </p>
              <CustomButton
                type="filled"
                title="Customize it"
                handleClick={enterCustomizer}
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            </motion.div>
          </motion.div>
        </motion.section>
      )}
    </AnimatePresence>
  );
};

