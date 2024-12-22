"use client";

import { motion } from "framer-motion";
import { cn } from "@nextui-org/react";
import DotPattern from "~/components/ui/dot-pattern";
import BlurIn from "~/components/ui/blur-in";
import AnimatedImage from "~/components/ui/animated-image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  return (
    <>
      <main>
        <div className="relative z-0 min-h-screen w-full overflow-hidden bg-[radial-gradient(97.14%_56.45%_at_51.63%_0%,_#7D56F4_0%,_#4517D7_30%,_#000_100%)] pb-40">
          {/* <Navigation /> */}
          <DotPattern
            className={cn(
              "[mask-image:radial-gradient(50vw_circle_at_center,white,transparent)]",
            )}
          />
          <motion.div
            className="relative z-10 flex min-h-screen flex-col items-center justify-start space-y-6 px-4 pt-32"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={itemVariants}>
              <BlurIn
                word="Chiro Houthulst: jouw jeugdbeweging!"
                className="font-display z-10 mx-auto w-full max-w-3xl text-center text-4xl font-bold text-white lg:w-auto"
                duration={1}
              />
            </motion.div>

            <motion.h2
              className="z-10 mx-auto max-w-2xl text-center text-xl tracking-normal text-white text-opacity-60"
              variants={itemVariants}
            >
              Ontdek onze werking en alle mogelijkheden voor jou.
            </motion.h2>

            <motion.div variants={itemVariants}>
              <AnimatedImage
                src="https://scontent-bru2-1.xx.fbcdn.net/v/t39.30808-6/336170969_6148429455242376_5326502316521295029_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=GnH7z3Pe0BwQ7kNvgE5LZrF&_nc_zt=23&_nc_ht=scontent-bru2-1.xx&_nc_gid=AxrP_qRiU1FSflex4qN0IKz&oh=00_AYAVBgdEcZUyfwL9KdZ50Vy3aIYIFJhrpLXzGtYb77IzyQ&oe=676E5E53"
                alt="Image"
                width={1200}
                height={900}
                className="mx-auto h-auto w-full max-w-6xl rounded-2xl shadow-lg"
              />
            </motion.div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
