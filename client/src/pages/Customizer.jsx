import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state, { resetState } from "../store";
import { downloadCanvasToImage, reader } from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import config from "../config/config";
import {
  CustomButton,
  AIPicker,
  ColorPicker,
  FilePicker,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [aiError, setAiError] = useState("");
  const [activeEditorTab, setActiveEditorTab] = useState("");
  const [activeFilterTab, setActiveFilterTab] = useState({
    logoShirt: true,
    stylishShirt: false,
    download: false,
  });

  // show tab content depending on the activeTab
  const generateTabContent = () => {
    switch (activeEditorTab) {
      case "colorpicker":
        return <ColorPicker />;
      case "filepicker":
        return <FilePicker file={file} setFile={setFile} readFile={readFile} />;
      case "aipicker":
        return (
          <AIPicker
            prompt={prompt}
            setPrompt={setPrompt}
            generatingImg={generatingImg}
            handleSubmit={handleSubmit}
            error={aiError}
          />
        );
      default:
        return null;
    }
  };

  const handleSubmit = async (type) => {
    setAiError("");
    if (!prompt) {
      setAiError("Please enter a prompt");
      return;
    }

    try {
      setGeneratingImg(true);
      const response = await fetch(config.backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAiError(data?.message || `Request failed (${response.status})`);
        return;
      }

      handleDecals(type, `data:image/png;base64,${data.photo}`);
      setActiveEditorTab("");
    } catch (error) {
      setAiError(error?.message || "Network error — is the server running?");
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleDecals = (type, result) => {
    const decalType = DecalTypes[type];
    state[decalType.stateProperty] = result;

    if (!activeFilterTab[decalType.filterTab]) {
      handleActiveFilterTab(decalType.filterTab);
    }
  };

  const handleActiveFilterTab = (tabName) => {
    switch (tabName) {
      case "logoShirt":
        state.isLogoTexture = !activeFilterTab[tabName];
        break;
      case "stylishShirt":
        state.isFullTexture = !activeFilterTab[tabName];
        break;
      case "download":
        state.isDownload = !activeFilterTab[tabName];
        break;
      default:
        state.isLogoTexture = true;
        state.isFullTexture = false;
        state.isDownload = false;
        break;
    }

    // after setting the state, activeFilterTab is updated

    setActiveFilterTab((prevState) => {
      return {
        ...prevState,
        [tabName]: !prevState[tabName],
      };
    });
  };

  const readFile = (type) => {
    reader(file).then((result) => {
      handleDecals(type, result);
      setActiveEditorTab("");
    });
  };

  const handleReset = () => {
    resetState();
    setActiveFilterTab({
      logoShirt: true,
      stylishShirt: false,
      download: false,
    });
    setActiveEditorTab("");
    setAiError("");
    setPrompt("");
    setFile("");
  };

  return (
    <AnimatePresence>
      {!snap.intro && (
        <>
          <motion.div
            className="absolute top-0 left-0 z-10"
            key="custom"
            {...slideAnimation("left")}
          >
            <div className="flex items-center min-h-screen ms-3">
              <div className="editortabs-container tabs bg-sky-300">
                {EditorTabs.map((tab) => (
                  <div className="rounded-lg hover:bg-sky-200">
                    <Tab
                      key={tab.name}
                      tab={tab}
                      handleClick={() => {
                        if (activeEditorTab === tab.name) {
                          setActiveEditorTab("");
                        } else {
                          setActiveEditorTab(tab.name);
                        }
                      }}
                    />
                  </div>
                ))}
                {generateTabContent()}
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute z-10 top-5 right-5 flex gap-2"
            {...fadeAnimation}
          >
            <CustomButton
              type="outline"
              title="Reset"
              handleClick={handleReset}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
            <CustomButton
              type="filled"
              title="Go Back"
              handleClick={() => (state.intro = true)}
              customStyles="w-fit px-4 py-2.5 font-bold text-sm"
            />
          </motion.div>

          <motion.div
            className="filtertabs-container"
            {...slideAnimation("up")}
          >
            {FilterTabs.map((tab) => (
              <Tab
                key={tab.name}
                tab={tab}
                isFilterTab
                isActiveTab={activeFilterTab[tab.name]}
                handleClick={() => {
                  tab.name === "download"
                    ? downloadCanvasToImage()
                    : handleActiveFilterTab(tab.name);
                }}
              />
            ))}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Customizer;
