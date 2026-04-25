import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSnapshot } from "valtio";
import state, { resetState, addLogo } from "../store";
import {
  downloadCanvasToImage,
  reader,
  renderTextToDataURL,
  getPromptHistory,
  addPromptHistory,
  blobToDataURL,
} from "../config/helpers";
import { EditorTabs, FilterTabs, DecalTypes, AIStyles } from "../config/constants";
import { fadeAnimation, slideAnimation } from "../config/motion";
import config from "../config/config";
import {
  CustomButton,
  AIPicker,
  ColorPicker,
  FilePicker,
  TextPicker,
  ShareButton,
  DecalManager,
  Tab,
} from "../components";

const Customizer = () => {
  const snap = useSnapshot(state);
  const [file, setFile] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatingImg, setGeneratingImg] = useState(false);
  const [aiError, setAiError] = useState("");
  const [aiStyle, setAiStyle] = useState("");
  const [promptHistory, setPromptHistory] = useState(() => getPromptHistory());
  const [lastAiSubmission, setLastAiSubmission] = useState(null);
  const [textOptions, setTextOptions] = useState({
    text: "",
    font: "Arial",
    color: "#000000",
  });
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
            style={aiStyle}
            setStyle={setAiStyle}
            history={promptHistory}
          />
        );
      case "textpicker":
        return (
          <TextPicker
            options={textOptions}
            setOptions={setTextOptions}
            applyText={applyText}
          />
        );
      case "decalmanager":
        return <DecalManager />;
      default:
        return null;
    }
  };

  const applyText = (type) => {
    if (!textOptions.text.trim()) return;
    const dataURL = renderTextToDataURL(textOptions);
    handleDecals(type, dataURL);
    setActiveEditorTab("");
  };

  const handleSubmit = async (type, override) => {
    setAiError("");
    const submitPrompt = override?.prompt ?? prompt;
    const submitStyle = override?.style ?? aiStyle;

    if (!submitPrompt) {
      setAiError("Please enter a prompt");
      return;
    }

    try {
      setGeneratingImg(true);

      // Pre-load the bg-removal model in parallel with the AI fetch so the
      // model is ready (or close to it) by the time the image arrives.
      const bgRemovalPromise =
        type === "logo" ? import("@imgly/background-removal") : null;

      const modifier = AIStyles.find((s) => s.key === submitStyle)?.modifier;
      const fullPrompt = modifier ? `${submitPrompt}, ${modifier}` : submitPrompt;
      const response = await fetch(config.backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await response.json();

      if (!response.ok) {
        setAiError(data?.message || `Request failed (${response.status})`);
        return;
      }

      let dataUrl = `data:image/png;base64,${data.photo}`;
      if (bgRemovalPromise) {
        try {
          const { removeBackground } = await bgRemovalPromise;
          const blob = await removeBackground(dataUrl);
          dataUrl = await blobToDataURL(blob);
        } catch (bgErr) {
          console.warn("Background removal failed; using original image.", bgErr);
        }
      }

      handleDecals(type, dataUrl);
      setPromptHistory(addPromptHistory(submitPrompt));
      setLastAiSubmission({ prompt: submitPrompt, style: submitStyle, type });
      if (!override) setActiveEditorTab("");
    } catch (error) {
      setAiError(error?.message || "Network error — is the server running?");
    } finally {
      setGeneratingImg(false);
    }
  };

  const handleDecals = (type, result) => {
    if (type === "logo") {
      addLogo(result);
    } else {
      // Full-shirt texture is still a single slot.
      state.fullDecal = result;
    }

    const decalType = DecalTypes[type];
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
    setAiStyle("");
    setPrompt("");
    setFile("");
    setTextOptions({ text: "", font: "Arial", color: "#000000" });
    setLastAiSubmission(null);
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
                  <div key={tab.name} className="rounded-lg hover:bg-sky-200">
                    <Tab
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
            className="absolute z-10 top-5 right-5 flex flex-wrap gap-2 justify-end max-w-[calc(100vw-5rem)]"
            {...fadeAnimation}
          >
            {lastAiSubmission && (
              <CustomButton
                type="outline"
                title={generatingImg ? "Generating..." : "Try Again"}
                handleClick={() =>
                  !generatingImg &&
                  handleSubmit(lastAiSubmission.type, lastAiSubmission)
                }
                customStyles="w-fit px-4 py-2.5 font-bold text-sm"
              />
            )}
            <ShareButton />
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
